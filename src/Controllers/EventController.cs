using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.WWV.Models;
using MongoDB.Driver;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Net.Http;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Microsoft.WWV.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    public class EventController : Controller
    {
        private const string defaultCountry = "Switzerland";
        private readonly IConfiguration _config;

        private readonly string _dbName;
        private readonly string _bingApiKey;

        private readonly HttpClient _client;
        private readonly IMongoDatabase _db;

        public EventController(IConfiguration config, IMongoClient mongoClient, HttpClient restClient)
        {
            _config = config;
            _dbName = _config["EventDB:DbName"];
            _bingApiKey = _config["BingApiKey"];

            _client = restClient;
            _db = mongoClient.GetDatabase(_dbName);
        }

        private Event GetEventById(Guid id)
        {
            var filter = Builders<Event>.Filter.Eq(c => c.Country, defaultCountry) & Builders<Event>.Filter.Eq(e => e.Id, id);
            var item = _db.GetCollection<Event>("events").Find(filter).FirstOrDefault();
            item.Filter = filter;
            return item;
        }

        [HttpGet]
        public IEnumerable<Event> GetEvents()
        {
            var now = DateTime.UtcNow.Date;
            return _db.GetCollection<Event>("events").Find(c => c.Country == defaultCountry && (c.Eventdate >= now || c.EventEndDate >= now)).ToList();
        }

        [HttpGet("[action]")]
        public IEnumerable<Event> GetUserRegisteredEvents()
        {
            var events = _db.GetCollection<Event>("events").Find(c => c.Country == defaultCountry).ToList();
            var registeredEvents = new List<Event>();

            foreach (var e in events)
            {
                var registedEvent = e.Registrations?.FirstOrDefault(r => r.UserId == User.Identity.Name);
                if (registedEvent != null)
                {
                    registeredEvents.Add(e);
                }
            }
            return registeredEvents;
        }

        [HttpGet("[action]")]
        public IEnumerable<Event> GetUserOwnedEvents()
        {
            var eventFilter = Builders<Event>.Filter.Eq(e => e.OwnerEmail, User.Identity.Name);
            return _db.GetCollection<Event>("events").Find(eventFilter).ToList();
        }

        [HttpGet("{id}")]
        public ActionResult<Event> GetEvent(Guid id)
        {
            if (id == Guid.Empty)
            {
                return NotFound();
            }

            var item = GetEventById(id);

            if (item == null)
            {
                return NotFound();
            }
            return item;
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> AddEvent([FromBody] Event _data)
        {
            if (string.IsNullOrEmpty(_data.Country))
            {
                return BadRequest("Event.Country is mandatory");
            }

            if (_data.Id == null || _data.Id == Guid.Empty)
            {
                _data.Id = Guid.NewGuid();
            }
            if (_data.Country != null && _data.EventLocation != null)
            {
                _data = await ResolveEventLocationAsync(_data);
            }

            // some meta data
            _data.CreatedTS = DateTime.Now.ToUniversalTime();
            _data.OwnerEmail = User.Identity.Name;
            _data.OwnerName1 = User.Claims.First(c => c.Type == ClaimTypes.GivenName).Value;
            _data.OwnerName2 = User.Claims.First(c => c.Type == ClaimTypes.Surname).Value;

            await _db.GetCollection<Event>("events").InsertOneAsync(_data);
            return Ok(_data.Id);
        }

        [HttpPut("[action]")]
        public async Task<IActionResult> UpdateEvent([FromBody] Event _data)
        {
            if (string.IsNullOrEmpty(_data.Country))
            {
                return BadRequest("Event.Country is mandatory");
            }

            if (_data.Id == null || _data.Id == Guid.Empty)
            {
                return BadRequest("Event.Id is mandatory for an update");
            }

            if (_data.Country != null && _data.EventLocation != null)
            {
                _data = await ResolveEventLocationAsync(_data);
            }

            // some meta data
            _data.UpdatedTS = DateTime.Now.ToUniversalTime();

            _data.OwnerEmail = User.Identity.Name;
            _data.OwnerName1 = User.Claims.First(c => c.Type == ClaimTypes.GivenName).Value;
            _data.OwnerName2 = User.Claims.First(c => c.Type == ClaimTypes.Surname).Value;

            var updateEvent = GetEventById(_data.Id);

            if (updateEvent == null)
            {
                return NotFound();
            }

            var a = await _db.GetCollection<Event>("events").ReplaceOneAsync(updateEvent.Filter, _data);

            return Ok(a.ModifiedCount);
        }

        [HttpGet("[action]/{eventId}")]
        public async Task<IActionResult> AddRegistration(Guid eventId)
        {
            if (eventId == Guid.Empty)
            {
                return NotFound();
            }

            var item = GetEventById(eventId);

            if (item == null)
            {
                return NotFound();
            }

            if (item.Registrations == null)
            {
                item.Registrations = new List<Registration>();
            }

            var modifications = 0L;

            if (item.Registrations.FirstOrDefault(r => r.UserId == User.Identity.Name) == null)
            {
                item.Registrations.Add(new Registration()
                {
                    UserId = User.Identity.Name,
                    Name1 = User.Claims.First(c => c.Type == ClaimTypes.GivenName).Value,
                    Name2 = User.Claims.First(c => c.Type == ClaimTypes.Surname).Value,
                    CreatedTS = DateTime.UtcNow
                });
                var a = await _db.GetCollection<Event>("events").ReplaceOneAsync(item.Filter, item);
                modifications = a.ModifiedCount;
            }

            return Ok(modifications);
        }

        [HttpGet("[action]/{eventId}")]
        public async Task<IActionResult> WithdrawalEvent(Guid eventId)
        {
            if (eventId == Guid.Empty)
            {
                return NotFound();
            }

            var item = GetEventById(eventId);

            if (item == null)
            {
                return NotFound();
            }

            if (item.Registrations == null)
            {
                return NotFound();
            }

            var registration = item.Registrations.FirstOrDefault(r => r.UserId == User.Identity.Name);
            if (registration == null)
            {
                return NotFound();
            }

            item.Registrations.Remove(registration);
            var res = await _db.GetCollection<Event>("events").ReplaceOneAsync(item.Filter, item);
            return Ok(res.ModifiedCount);
        }

        private async Task<Event> ResolveEventLocationAsync(Event aEvent)
        {
            var url = String.Format(CultureInfo.InvariantCulture, "http://dev.virtualearth.net/REST/v1/Locations/{0}?includeNeighborhood=false&key={1}", aEvent.EventLocation, _bingApiKey);
            var jsonString = await _client.GetStringAsync(url);
            var json = JObject.Parse(jsonString);
            var latlong = json["resourceSets"].First["resources"].First["point"]["coordinates"];

            aEvent.Coordinates = new Coordinates()
            {
                Latitude = latlong.First.Value<double>(),
                Longitude = latlong.Last.Value<double>()
            };

            return aEvent;
        }
    }
}