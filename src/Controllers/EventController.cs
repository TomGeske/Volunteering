using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.WWV.Models;
using MongoDB.Bson;
using MongoDB.Driver;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Net.Http;
using System.Security.Authentication;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Microsoft.WWV.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    public class EventController : Controller
    {
        private readonly IConfiguration _config;

        private readonly string _host;
        private readonly string _userName;
        // Todo: should go to KeyVault: https://azure.microsoft.com/en-us/resources/samples/key-vault-dotnet-core-quickstart/
        private readonly string _password;
        private readonly string _dbName;

        private readonly string _bingApiKey;

        private  readonly HttpClient _client = new HttpClient();

        private readonly IMongoDatabase _db;

        public EventController(IConfiguration config)
        {
            _config = config;

            _host = _config["EventDB:ServerName"];
            _userName = _config["EventDB:UserName"];
            _password = _config["EventDB:Password"];
            _dbName = _config["EventDB:DbName"];
            _bingApiKey = _config["BingApiKey"];

            _db = new MongoClient(GetDbConnectionString()).GetDatabase(_dbName);
        }

        [HttpGet]
        public IEnumerable<Event> GetEvents()
        {
           return _db.GetCollection<Event>("events").Find(new BsonDocument()).ToList();
        }

        [HttpGet("[action]")]
        public IEnumerable<Event> GetUserRegisteredEvents()
        {
            var events = _db.GetCollection<Event>("events").Find(new BsonDocument()).ToList();
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

            var item = _db.GetCollection<Event>("events").Find(c => c.Id == id).FirstOrDefault();

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

            var eventFilter = Builders<Event>.Filter.Eq(e => e.Id, _data.Id) &
            Builders<Event>.Filter.Eq(c => c.Country, "Switzerland");

            var updateEvent = _db.GetCollection<Event>("events").Find(eventFilter).FirstOrDefault();

            if (updateEvent == null)
            {
                return NotFound();
            }

            var a = await _db.GetCollection<Event>("events").ReplaceOneAsync(eventFilter, _data);

            return Ok(a.ModifiedCount);
        }

        [HttpGet("[action]/{eventId}")]
        public async Task<IActionResult> AddRegistration(Guid eventId)
        {
            if (eventId == Guid.Empty)
            {
                return NotFound();
            }

            var filter = Builders<Event>.Filter.Eq(c => c.Id, eventId) & Builders<Event>.Filter.Eq(c => c.Country, "Switzerland");
            var item = _db.GetCollection<Event>("events").Find(filter).FirstOrDefault();

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
                var a = await _db.GetCollection<Event>("events").ReplaceOneAsync(filter, item);
                modifications = a.ModifiedCount;
            }

            return Ok(modifications);
        }

        private MongoClientSettings GetDbConnectionString()
        {
            var settings = new MongoClientSettings
            {
                Server = new MongoServerAddress(_host, 10255),
                UseSsl = true,
                SslSettings = new SslSettings
                {
                    EnabledSslProtocols = SslProtocols.Tls12
                }
            };

            MongoIdentity identity = new MongoInternalIdentity(_dbName, _userName);
            MongoIdentityEvidence evidence = new PasswordEvidence(_password);

            settings.Credential = new MongoCredential("SCRAM-SHA-1", identity, evidence);

            return settings;
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