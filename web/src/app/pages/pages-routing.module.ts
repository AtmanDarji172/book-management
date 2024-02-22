import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'app/core/guards/auth.guard';

const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    {
        path: 'home',
        loadChildren: () => import('./home/home.module').then(m => m.HomeModule)
    },
    {
        path: 'book',
        canActivate: [AuthGuard],
        loadChildren: () => import('./book/book.module').then(m => m.BookModule)
    },
    {
        path: 'my-profile',
        canActivate: [AuthGuard],
        loadChildren: () => import('./my-profile/my-profile.module').then(m => m.MyProfileModule)
    },
]
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PagesRoutingModule { }