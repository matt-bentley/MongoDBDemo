using AngularWebpackVisualStudio.Models;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AngularWebpackVisualStudio
{
    public class RealEstateContext
    {
        public RealEstateContext()
        {
            var client = new MongoClient("mongodb://localhost");
            Database = (MongoDatabaseBase)client.GetDatabase("realestate");
        }

        public MongoDatabaseBase Database;
        public IMongoCollection<Rental> Rentals
        {
            get
            {
                return Database.GetCollection<Rental>("rentals");
            }      
        }
    }
}
