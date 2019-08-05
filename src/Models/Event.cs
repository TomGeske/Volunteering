using Microsoft.WWV.Models;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson.Serialization.IdGenerators;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Microsoft.WWV
{
    public class Event
    {
        [BsonId(IdGenerator = typeof(CombGuidGenerator))]
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        [Required]
        public string Country { get; set; }
        public string OwnerName1 { get; set; }
        public string OwnerName2 { get; set; }
        public string OwnerEmail { get; set; }
        public string Company { get; set; }
        public string EventType { get; set; }
        public string Department { get; set; }
        public DateTime Eventdate { get; set; }
        public DateTime EventEndDate { get; set; }
        public string StartEventTime { get; set; }
        public string EndEventTime { get; set; }
        public string EventLocation { get; set; }
        public string Url { get; set; }
        public string MediaLink { get; set; }
        public DateTime CreatedTS { get; set; }
        public DateTime UpdatedTS { get; set; }
        public IList<Registration> Registrations { get; set; }

        public Coordinates Coordinates { get; set;}
    }
}