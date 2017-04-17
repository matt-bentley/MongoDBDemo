using AngularWebpackVisualStudio.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Net.Http.Headers;
using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Driver.GridFS;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;

namespace AngularWebpackVisualStudio.Controllers
{
    [Route("api/[controller]")]
    public class RentalsController: Controller
    {
        private readonly RealEstateContext Context = new RealEstateContext();

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var rentals = await GetRentals();

            return Ok(rentals);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(string id)
        {
            var rental = await GetRentalById(id);

            return Ok(rental);
        }

        [HttpPost("GetFiltered")]
        public async Task<IActionResult> GetFiltered([FromBody] RentalsFilter filters)
        {
            var rentals = await FilterRentals(filters);

            return Ok(rentals);
        }

        [HttpPost]
        public async Task<IActionResult> Insert([FromBody] PostRental postRental)
        {
            if (postRental == null)
            {
                return BadRequest();
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var rental = new Rental(postRental);
            await Context.Rentals.InsertOneAsync(rental);

            return Ok(postRental);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            await Context.Rentals.DeleteOneAsync(rental => rental.Id == id);

            return Ok(true);
        }

        [HttpPost("AdjustPrice/{id}")]
        public async Task<IActionResult> AdjustPrice(string id, [FromBody] AdjustPrice adjustPrice)
        {
            if (adjustPrice == null)
            {
                return BadRequest();
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var rental = await GetRentalById(id);
            rental.AdjustPrice(adjustPrice);
            await Context.Rentals.ReplaceOneAsync(new BsonDocument("_id", new ObjectId(id)), rental, new UpdateOptions { IsUpsert = true });

            return Ok(adjustPrice);
        }

        [HttpPost("AddImage/{id}")]
        public async Task<IActionResult> AddImage(string id, IFormFile file)
        {
            if (file == null)
            {
                return BadRequest();
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var rental = await GetRentalById(id);

            using (Stream stream = file.OpenReadStream())
            {
                var bucket = new GridFSBucket(Context.Database);
                GridFSUploadOptions options = new GridFSUploadOptions()
                {
                    ContentType = file.ContentType
                };

                var fileInfo = await bucket.UploadFromStreamAsync(file.FileName, stream, options);
                rental.ImageId = fileInfo.ToString();
            }

            await Context.Rentals.ReplaceOneAsync(new BsonDocument("_id", new ObjectId(id)), rental, new UpdateOptions { IsUpsert = true });

            return Ok(true);
        }

        [HttpGet("GetImage/{id}")]
        public async Task<IActionResult> GetImage(string id)
        {
            var bucket = new GridFSBucket(Context.Database);
            var image = await bucket.DownloadAsBytesAsync(new ObjectId(id));
            var base64 = Convert.ToBase64String(image);
            var imgSrc = String.Format("data:image/jpeg;base64,{0}", base64);
            Image i = new Image() { ImageHash = imgSrc };
            return Ok(i);
        }

        private async Task<List<Rental>> FilterRentals(RentalsFilter filters)
        {
            if (!filters.PriceLimit.HasValue)
            {
                return await GetRentals();
            }
            else
            {
                return await (await Context.Rentals.FindAsync(r => r.Price <= filters.PriceLimit)).ToListAsync();
            }
        }

        private async Task<List<Rental>> GetRentals()
        {
            return await (await Context.Rentals.FindAsync(_ => true)).ToListAsync();
        }

        private async Task<Rental> GetRentalById(string id)
        {
            return await (await Context.Rentals.FindAsync(document => document.Id == id)).FirstOrDefaultAsync();
        }
    }
}
