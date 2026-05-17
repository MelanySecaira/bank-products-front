
import {
  Component,
  input,
  output
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { RouterLink } from '@angular/router';

import { Product }
from '../../models/product.model';
@Component({
  selector: 'app-product-table',
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './product-table.html',
  styleUrl: './product-table.css',
})
export class ProductTable {

  products = input.required<Product[]>();

  edit = output<string>();

  delete = output<string>();

  onEdit(id: string): void {

    this.edit.emit(id);
  }

  onDelete(id: string): void {

    this.delete.emit(id);
  }
}
