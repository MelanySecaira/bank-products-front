import {
  Component,
  effect,
  inject,
  input,
  output
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { Product }
from '../../models/product.model';

import { ProductService }
from '../../../../core/services/product';

import { idExistsValidator }
from '../../validators/id.validator';

import { revisionDateValidator }
from '../../validators/date.validator';

import { minTodayDateValidator }
from '../../validators/min-today-date.validator';

@Component({
  standalone: true,
  selector: 'app-product-form',
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './product-form.html',
  styleUrl: './product-form.css',
})
export class ProductForm {
   private readonly fb =
    inject(FormBuilder);

  private readonly productService =
    inject(ProductService);

  mode = input<'create' | 'edit'>(
    'create'
  );

  product = input<Product | null>(
    null
  );

  submitForm =
    output<Product>();

  resetForm =
    output<void>();

  form = this.fb.group({

    id: [
      '',
      {
        validators: [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(10)
        ],

        asyncValidators:
        this.mode() === 'create'
          ? [
              idExistsValidator(
                this.productService
              )
            ]
          : []
        }
    ],

    name: [
      '',
      [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(100)
      ]
    ],

    description: [
      '',
      [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(200)
      ]
    ],

    logo: [
      '',
      [
        Validators.required
      ]
    ],

    date_release: [
      '',
      [
        Validators.required,
        minTodayDateValidator()
      ]
    ],

    date_revision: [
      '',
      [
        Validators.required
      ]
    ]
  },
  {
    validators: [
      revisionDateValidator
    ]
  });

  constructor() {
    if (this.mode() === 'create') {

        this.form.get('id')
          ?.addAsyncValidators(
            idExistsValidator(
              this.productService
            )
          );
      }

    effect(() => {

      const product =
        this.product();

      const mode =
        this.mode();

      if (!product) return;

      this.form.patchValue(product);

      if (mode === 'edit') {

        this.form
          .get('id')
          ?.disable();
      }
    });
  }

  ngOnInit(): void {
    
    this.form.get('date_release')?.valueChanges.subscribe(date => {

      if (!date) return;

      const releaseDate = new Date(date);

      const revisionDate = new Date(releaseDate);

      revisionDate.setFullYear(releaseDate.getFullYear() + 1);

      const formatted = revisionDate.toISOString().split('T')[0];

      this.form.get('date_revision')?.setValue(formatted, {
        emitEvent: false
      });

    });
  }
  onSubmit(): void {

    // Permitir submit si es válido O si está pendiente (validadores async)
    if (this.form.invalid && !this.form.pending) {

      this.form.markAllAsTouched();

      return;
    }

    console.log('Emitiendo producto:', this.form.getRawValue());
    
    this.submitForm.emit(
      this.form.getRawValue() as Product
    );
  }

  onReset(): void {

    this.form.reset();

    this.resetForm.emit();
  }
}
