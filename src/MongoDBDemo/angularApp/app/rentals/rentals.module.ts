import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

import { RentalsRoutes } from './rentals.routes';
import { RentalsComponent } from './components/rentals.component';
import { RentalImageComponent } from './components/rental-image.component';
import { RentalAdjustComponent } from './components/rental-adjust.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpModule,
        RentalsRoutes
    ],
    schemas: [
        //NO_ERRORS_SCHEMA
    ],
    declarations: [
        RentalsComponent,
        RentalImageComponent,
        RentalAdjustComponent
    ],

    exports: [
        RentalsComponent
    ]
})

export class RentalsModule { }