import { Routes, RouterModule } from '@angular/router';

import { RentalsComponent } from './components/rentals.component';
import { RentalAdjustComponent } from './components/rental-adjust.component';
import { RentalImageComponent } from './components/rental-image.component';

const routes: Routes = [
    { path: 'rentals', component: RentalsComponent },
    {
        path: 'rentals/:id',
        component: RentalAdjustComponent
    },
    {
        path: 'rentals/image/:id',
        component: RentalImageComponent
    }
];

export const RentalsRoutes = RouterModule.forChild(routes);