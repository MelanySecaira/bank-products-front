import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'products',
    pathMatch: 'full'
  },

  {
    path: 'products',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/products/pages/product-list/product-list')
        .then(m => m.ProductList)
  },

  {
    path: 'products/create',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/products/pages/product-create/product-create')
        .then(m => m.ProductCreate)
  },

  {
    path: 'products/edit/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/products/pages/product-edit/product-edit')
        .then(m => m.ProductEdit)
  }
];