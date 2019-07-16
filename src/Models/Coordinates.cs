using Microsoft.WWV.Models;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson.Serialization.IdGenerators;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Microsoft.WWV
{
    public class Coordinates
    {
        public double Latitude {get; set;}
        public double Longitude {get; set;}
    }
}