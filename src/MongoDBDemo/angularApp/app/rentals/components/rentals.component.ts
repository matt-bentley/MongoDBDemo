import { Component, OnInit } from '@angular/core';

import { RentalService } from './../../core/services/rental.service';

import { Rental } from './../../models/rental';
import { PostRental } from './../../models/post-rental';
import { RentalsFilter } from './../../models/rentals-filter';

@Component({
    selector: 'rentals-component',
    templateUrl: 'rentals.component.html'
})

export class RentalsComponent implements OnInit {

    rentals: Array<Rental>;
    postRental: PostRental;
    filters: RentalsFilter;

    constructor(private rentalService: RentalService) {    
        this.postRental = new PostRental();
        this.filters = new RentalsFilter();
    }
    
    post(): void {
        this.rentalService.insert(this.postRental)
            .subscribe((rental) => {
                console.log(rental);
                this.getRentals();
                this.postRental = new PostRental();
            }, (error) => {
                console.log(error);
            });
    }

    filterResults(): void {
        this.rentalService.getFiltered(this.filters)
            .subscribe((rentals) => {
                this.rentals = rentals;
            }, (error) => {
                console.log(error);
            });
    }

    clearFilters(): void {
        this.filters = new RentalsFilter();
        this.getRentals();
    }

    deleteRental(id: string): void {
        this.rentalService.deleteRental(id)
            .subscribe((rental) => {
                console.log(rental);
                this.getRentals();
            }, (error) => {
                console.log(error);
            });
    }

    private getRentals(): void {
        this.rentalService.getAll()
            .subscribe((rentals) => {
                this.rentals = rentals;
            }, (error) => {
                console.log(error);
            });
    }

    ngOnInit() {
        this.getRentals();
    }
}
