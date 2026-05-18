import {
  Component,
  inject,
  signal
} from '@angular/core';

import { CommonModule }
from '@angular/common';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import {
  HttpErrorResponse
} from '@angular/common/http';

import { ProductService }
from '../../../../core/services/product';

import { Product }
from '../../models/product.model';

import { ApiError }
from '../../../../core/models/api-error.model';

import { ProductForm }
from '../../components/product-form/product-form';

@Component({
  standalone: true,
  selector: 'app-product-edit',
  imports: [CommonModule, ProductForm],
  templateUrl: './product-edit.html',
  styleUrl: './product-edit.css',
})
export class ProductEdit {
  private readonly route =
    inject(ActivatedRoute);

  private readonly router =
    inject(Router);

  private readonly productService =
    inject(ProductService);

  product =
    signal<Product | null>(null);

  loading =
    signal<boolean>(false);

  errorMessage =
    signal<string>('');

  constructor() {

    this.loadProduct();
  }

  private loadProduct(): void {

    const id =
      this.route.snapshot.paramMap.get('id');

    if (!id) return;

    this.loading.set(true);

    this.productService
      .getProducts()
      .subscribe({

        next: (products) => {

          const foundProduct =
            products.find(p => p.id === id);

          if (!foundProduct) {
            this.errorMessage.set('Product not found');
            return;
          } else {
            this.product.set(foundProduct);
          }
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

  updateProduct(
    product: Product
  ): void {

    this.loading.set(true);

    this.productService
      .updateProduct(
        product.id,
        {
          name: product.name,
          description: product.description,
          logo: product.logo,
          date_release: product.date_release,
          date_revision: product.date_revision
        }
      )
      .subscribe({

        next: () => {

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
}
