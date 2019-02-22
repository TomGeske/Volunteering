using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;

namespace Microsoft.WWV.Controllers
{
    [Route("api/[controller]")]
    public class EventController : Controller
    {
        
        [HttpGet("[action]")]
        public IEnumerable<Event> GetEvents()
        {
            return TestEventGenerator.GetSampleEvents();
        }

        [HttpGet("[action]")]
        public IEnumerable<Event> GetAllEvents()
        {
            MongoClient _client = new MongoClient("mongodb://wwv-dev:ifFiwhFGGlIExJp7KDbxjjHmTnW2zumcfDsqxbC23PfAZePpgos7AHR93lpihgTt7bMR8XlJp1X4yFtpqc780g==@wwv-dev.documents.azure.com:10255/?ssl=true&replicaSet=globaldb");
            MongoServer _server = _client.GetServer();
            MongoDatabase _db = _server.GetDatabase("voluntdb");   
            return _db.GetCollection<Event>("events").FindAll();
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
                    Name = "aa",
                    Description = "bb"
                }
            );
        } 
    }
}