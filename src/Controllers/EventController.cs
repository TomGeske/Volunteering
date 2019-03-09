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

        public EventController(IConfiguration config)
        {
            _config = config;
        }

        [HttpGet("[action]")]
        public IEnumerable<Event> GetEvents()
        {
            return TestEventGenerator.GetSampleEvents();
        }

        [HttpGet("[action]")]
        public IEnumerable<Event> GetAllEvents()
        {
            MongoClient _client = new MongoClient(getDbConnectionString());
            var _db = _client.GetDatabase("voluntdb");
            return _db.GetCollection<Event>("events").Find(new BsonDocument()).ToList();
        }

        private MongoClientSettings getDbConnectionString()
        {
            string host = _config["EventDB:ServerName"];
            string userName = _config["EventDB:UserName"];
            // Todo: should go to KeyVault: https://azure.microsoft.com/en-us/resources/samples/key-vault-dotnet-core-quickstart/
            string password = _config["EventDB:Password"];
            string dbName = _config["EventDB:DbName"];
            
            MongoClientSettings settings = new MongoClientSettings();
            settings.Server = new MongoServerAddress(host, 10255);
            settings.UseSsl = true;
            settings.SslSettings = new SslSettings();
            settings.SslSettings.EnabledSslProtocols = SslProtocols.Tls12;

            MongoIdentity identity = new MongoInternalIdentity(dbName, userName);
            MongoIdentityEvidence evidence = new PasswordEvidence(password);

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
                new Event(){
                    Name = "Cleaning Up mountain trails",
                    Description = "As volunteering project we suggest to clean-up mountain trails for recreation.",
                    Company = "Binntal Tourism",
                    Url= "https://www.parks.swiss/en/the_swiss_parks/parkportraits/binntal_nature_park.php",
                    OwnerName1 = "Darth Vader",
                    Country = "Switzerland",
                    EventLocation = "Binntal, Wallis"
                }
            );
        } 
    }
}