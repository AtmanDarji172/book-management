import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailsComponent } from './details/details.component';
import { AddEditComponent } from './add-edit/add-edit.component';
import { AuthGuard } from 'app/core/guards/auth.guard';

const routes: Routes = [
    {
        path: ':id/details',
        canActivate: [AuthGuard],
        component: DetailsComponent
    },
    {
        path: ':id/add-edit',
        canActivate: [AuthGuard],
        component: AddEditComponent
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BookRoutingModule {}
