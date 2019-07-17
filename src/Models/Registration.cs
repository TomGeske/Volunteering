using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Microsoft.WWV.Models
{
    public class Registration
    {
        public string UserId { get; set; }
        public string Name1 { get; set; }
        public string Name2 { get; set; }
        public DateTime CreatedTS { get; set; }
    }
}
