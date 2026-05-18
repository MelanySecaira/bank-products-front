import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { Product } from '../../features/products/models/product.model';
import { ApiResponse } from '../models/api-response.model';
import { ProductUpdateRequest } from '../../features/products/models/product-update-request.model';
import { ProductCreateRequest } from '../../features/products/models/product-create-request.model';

@Injectable({
  providedIn: 'root',
})

export class ProductService {

  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/bp/products`;

  getProducts(): Observable<Product[]> {

    return this.http
      .get<ApiResponse<Product[]>>(this.apiUrl)
      .pipe(
        map(response => response.data)
      );
  }

  createProduct(
    product: ProductCreateRequest
  ): Observable<Product> {

    return this.http
      .post<ApiResponse<Product>>(
        this.apiUrl,
        product
      )
      .pipe(
        map(response => response.data)
      );
  }

  updateProduct(
    id: string,
    product: ProductUpdateRequest
  ): Observable<Product> {

    return this.http
      .put<ApiResponse<Product>>(
        `${this.apiUrl}/${id}`,
        product
      )
      .pipe(
        map(response => response.data)
      );
  }

  
  verifyId(id: string): Observable<boolean> {

    return this.http.get<boolean>(
      `${this.apiUrl}/verification/${id}`
    );
  }

  deleteProduct(id: string) {

    return this.http.delete<ApiResponse<void>>(
      `${this.apiUrl}/${id}`
    );
  }


}
