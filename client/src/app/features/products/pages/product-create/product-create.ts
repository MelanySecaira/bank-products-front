import {
  Component,
  inject,
  signal
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { Router } from '@angular/router';

import { HttpErrorResponse} from '@angular/common/http';

import { ProductForm } from '../../components/product-form/product-form';

import { ProductService } from '../../../../core/services/product';

import { Product }
from '../../models/product.model';

import { ApiError }
from '../../../../core/models/api-error.model';

@Component({
  selector: 'app-product-create',
  imports: [
    CommonModule,
    ProductForm
  ],
  templateUrl: './product-create.html',
  styleUrl: './product-create.css',
})
export class ProductCreate {
  private readonly productService =
    inject(ProductService);

  private readonly router =
    inject(Router);

    loading =
    signal<boolean>(false);

  errorMessage =
    signal<string>('');

  successMessage =
    signal<string>('');

  createProduct(
    product: Product
  ): void {
    
    console.log('Producto a crear:', product);
    this.loading.set(true);

    this.productService
      .createProduct(product)
      .subscribe({

        next: () => {

          this.successMessage.set(
            'Producto creado correctamente'
          );

          this.router.navigate([
            '/products'
          ]);
        },

        error: (
          error: HttpErrorResponse
        ) => {

          const apiError =
            error.error as ApiError;

          this.errorMessage.set(
            apiError.message
          );
        },

        complete: () => {

          this.loading.set(false);
        }
      });
  }

  resetForm(): void {

    console.log('Formulario reiniciado');
  }
}
