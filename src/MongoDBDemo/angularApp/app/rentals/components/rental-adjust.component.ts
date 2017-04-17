import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { RentalService } from './../../core/services/rental.service';

import { Rental } from './../../models/rental';
import { AdjustPrice } from './../../models/adjust-price';

@Component({
    selector: 'rental-adjust-component',
    templateUrl: 'rental-adjust.component.html'
})

export class RentalAdjustComponent implements OnInit {

    rental: Rental;
    adjustPrice: AdjustPrice;

    constructor(private _route: ActivatedRoute,
                private _router: Router,
                private _rentalService: RentalService) {
        this.adjustPrice = new AdjustPrice();
    }

    private getRental(id: string): void {
        this._rentalService.getRental(id)
            .subscribe((rental) => {
                this.rental = rental;
            }, (error) => {
                console.log(error);
            });
    }

    post(): void {
        this._rentalService.adjustPrice(this.rental.id, this.adjustPrice)
            .subscribe((adjustPrice) => {
                console.log(adjustPrice);
                this.onBack();
            }, (error) => {
                console.log(error);
            });
    }

    ngOnInit(): void {
        let id = this._route.snapshot.params['id'];
        this.getRental(id.toString());
    }

    onBack(): void {
        this._router.navigate(['/rentals']);
    }
}
