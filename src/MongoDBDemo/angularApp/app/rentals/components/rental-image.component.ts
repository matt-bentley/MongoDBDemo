import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { RentalService } from './../../core/services/rental.service';

import { Rental } from './../../models/rental';
import { Image } from './../../models/image';

@Component({
    selector: 'rental-image-component',
    templateUrl: 'rental-image.component.html'
})

export class RentalImageComponent implements OnInit {

    @ViewChild("fileInput") fileInput: any;
    rental: Rental;
    image: Image;

    constructor(private _route: ActivatedRoute,
                private _router: Router,
                private _rentalService: RentalService) {
        this.image = { imageHash: "" };
    }

    private getRental(id: string): void {
        this._rentalService.getRental(id)
            .subscribe((rental) => {
                this.rental = rental;
                if (rental.imageId && rental.imageId != '') {
                    this.getImage();
                }
            }, (error) => {
                console.log(error);
            });
    }

    post(): void {
        let fi = this.fileInput.nativeElement;
        if (fi.files && fi.files[0]) {
            let fileToUpload = fi.files[0];
            this._rentalService
                .uploadImage(this.rental.id, fileToUpload)
                .subscribe(res => {
                    console.log(res);
                    this.onBack();
                });
        }
    }

    getImage(): void {
        this._rentalService.getImage(this.rental.imageId)
            .subscribe((image) => {
                this.image = image;
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
