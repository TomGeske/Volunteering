using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson.Serialization.IdGenerators;
using System;

namespace Microsoft.WWV
{
    public class Event
    {
        [BsonId(IdGenerator = typeof(CombGuidGenerator))]
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Country { get; set; }
        public string OwnerName1 {get;set;}
        public string OwnerName2 {get;set;}
        public string OwnerEmail {get;set;}
        public string Company {get;set;}
        public string EventType {get;set;}
        public DateTime Eventdate {get;set;}
        public string EventLocation {get;set;}
        public string Url {get;set;}
        public DateTime CreatedTS { get; set; }
    }

    public class Registration
    {
        /*
        



         */
    }
}