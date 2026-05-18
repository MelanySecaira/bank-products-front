import { ProductTable } from '../../components/product-table/product-table';
import {
  Component,
  computed,
  inject,
  output,
  signal
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ApiError } from '../../../../core/models/api-error.model';

import {
  debounceTime,
  distinctUntilChanged
} from 'rxjs';

import { ProductService } from '../../../../core/services/product';

import { Product } from '../../models/product.model';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ConfirmModal } from "../../../../shared/components/confirm-modal/confirm-modal";

@Component({
  standalone: true,
  selector: 'app-product-list',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ProductTable,
    RouterLink,
    ConfirmModal
],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList {
  private  readonly productService = inject(ProductService);
  private readonly router = inject(Router);

  products = signal<Product[]>([]);

  errorMessage = signal<string>('');

  loading = signal<boolean>(false);

  pageSize = signal<number>(5);

  searchControl = new FormControl('');

  searchTerm = signal<string>('');

  showDeleteModal =  signal<boolean>(false);

  selectedProduct =  signal<Product | null>(null);

  filteredProducts = computed(() => {
    const term = this.searchTerm().toLowerCase();
    return this.products().filter(product =>
      product.name.toLowerCase().includes(term) ||
      product.description.toLowerCase().includes(term)
    ).slice(0, this.pageSize());
  });

  constructor() {
    this.loadProducts();
    this.listenSearch();
  }

  private loadProducts(): void {

    this.loading.set(true);

    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products.set(products);
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

  private listenSearch(): void {

    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(value => {
        this.searchTerm.set(value ?? '');
      });
  }

  changePageSize(size: number): void {
    this.pageSize.set(size);
  }

  goToEdit(id: string): void {
    this.router.navigateByUrl(
      `/products/edit/${id}`
    );
}

openDeleteModal(id: string): void {

  const product =
    this.products()
      .find(
        product => product.id === id
      );

  if (!product) return;

  this.selectedProduct.set(product);

  this.showDeleteModal.set(true);
}

closeDeleteModal(): void {

  this.showDeleteModal.set(false);

  this.selectedProduct.set(null);
}

deleteProduct(): void {

  const product =
    this.selectedProduct();

  if (!product) return;

  this.productService
    .deleteProduct(product.id)
    .subscribe({

      next: () => {

        this.products.update(products =>
          products.filter(
            p => p.id !== product.id
          )
        );

        this.closeDeleteModal();
      }
    });
}

}
