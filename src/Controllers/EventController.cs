using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Authentication;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using MongoDB.Bson;
using MongoDB.Driver;

namespace Microsoft.WWV.Controllers
{
    [Route("api/[controller]")]
    public class EventController : Controller
    {
        private readonly IConfiguration _config;

        private readonly string _host;
        private readonly string _userName;
        // Todo: should go to KeyVault: https://azure.microsoft.com/en-us/resources/samples/key-vault-dotnet-core-quickstart/
        private readonly string _password;
        private readonly string _dbName;

        public EventController(IConfiguration config)
        {
            _config = config;

            _host = _config["EventDB:ServerName"];
            _userName = _config["EventDB:UserName"];
            _password = _config["EventDB:Password"];
            _dbName = _config["EventDB:DbName"];
        }

        [HttpGet]
        public IEnumerable<Event> GetEvents()
        {
            MongoClient _client = new MongoClient(getDbConnectionString());
            var _db = _client.GetDatabase(this._dbName);
            return _db.GetCollection<Event>("events").Find(new BsonDocument()).ToList();
        }

        [HttpGet("{id}")]
        public ActionResult<Event> GetEvent(Guid id)
        {
            if (id == Guid.Empty)
            {
                return NotFound();
            }

            MongoClient _client = new MongoClient(getDbConnectionString());
            var _db = _client.GetDatabase(this._dbName);

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

            _data.CreatedTS = DateTime.Now.ToUniversalTime();

            MongoClient _client = new MongoClient(getDbConnectionString());
            var _db = _client.GetDatabase(this._dbName);
            await _db.GetCollection<Event>("events").InsertOneAsync(_data);
            return Ok(_data.Id);
        }

        [HttpGet("[action]")]
        public async Task GenerateSampleData()
        {
            var data = TestEventGenerator.GetSampleEvents();

            MongoClient _client = new MongoClient(getDbConnectionString());
            var _db = _client.GetDatabase(this._dbName);
            await _db.GetCollection<Event>("events").InsertManyAsync(data);
        }

        private MongoClientSettings getDbConnectionString()
        {
            MongoClientSettings settings = new MongoClientSettings();
            settings.Server = new MongoServerAddress(_host, 10255);
            settings.UseSsl = true;
            settings.SslSettings = new SslSettings();
            settings.SslSettings.EnabledSslProtocols = SslProtocols.Tls12;

            MongoIdentity identity = new MongoInternalIdentity(_dbName, _userName);
            MongoIdentityEvidence evidence = new PasswordEvidence(_password);

            settings.Credential = new MongoCredential("SCRAM-SHA-1", identity, evidence);

            return settings;
        }
    }

    internal static class TestEventGenerator
    {
        static IEnumerable<Event> _events;

        internal static IEnumerable<Event> GetSampleEvents()
        {
            return _events;
        }

        static TestEventGenerator()
        {
            var events = new List<Event>();
            _events = events;
            events.Add(
                new Event()
                {
                    Id = new Guid(),
                    Name = "Cleaning Up mountain trails",
                    Description = "As volunteering project we suggest to clean-up mountain trails for recreation.",
                    Country = "Switzerland",
                    OwnerName1 = "Thomas",
                    OwnerName2 = "Geske",
                    OwnerEmail = "thomasge@microsoft.com",
                    Company = "Binntal Tourism",
                    EventType = "Sports/Outdoor Activities/Coaching",
                    Department = "STU",
                    Eventdate = new DateTime(2019, 10, 21).ToUniversalTime(),
                    EventEndDate = new DateTime(2019, 10, 23).ToUniversalTime(),
                    StartEventTime = "10:00am",
                    EventLocation = "Binntal, Wallis",
                    Url = "https://www.parks.swiss/en/the_swiss_parks/parkportraits/binntal_nature_park.php",
                    CreatedTS = DateTime.Now.ToUniversalTime()
                }
            );
        }
    }
}