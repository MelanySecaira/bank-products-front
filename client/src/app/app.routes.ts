import { Routes } from '@angular/router';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'products',
    pathMatch: 'full'
  },

  {
    path: 'products',
    loadComponent: () =>
      import('./features/products/pages/product-list/product-list')
        .then(m => m.ProductList)
  },

  {
    path: 'products/create',
    loadComponent: () =>
      import('./features/products/pages/product-create/product-create')
        .then(m => m.ProductCreate)
  },

  {
    path: 'products/edit/:id',
    loadComponent: () =>
      import('./features/products/pages/product-edit/product-edit')
        .then(m => m.ProductEdit)
  }
];