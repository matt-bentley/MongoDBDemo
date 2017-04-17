using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AngularWebpackVisualStudio.Models
{
    public class Rental
    {
        public Rental(PostRental postRental)
        {
            Description = postRental.Description;
            NumberOfRooms = postRental.NumberOfRooms;
            Price = postRental.Price;
            Address = (postRental.Address ?? String.Empty).Split('\n').ToList();
        }

        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        public string Description { get; set; }
        public int NumberOfRooms { get; set; }
        public List<string> Address { get; set; }
        [BsonRepresentation(BsonType.Double)]
        public decimal Price { get; set; }
        public List<PriceAdjustment> Adjustments = new List<PriceAdjustment>();
        public string ImageId { get; set; }

        public void AdjustPrice(AdjustPrice adjustPrice)
        {
            var adjustment = new PriceAdjustment(adjustPrice, Price);
            Adjustments = Adjustments ?? new List<PriceAdjustment>();
            Adjustments.Add(adjustment);
            Price = adjustPrice.NewPrice;
        }
    }
}
