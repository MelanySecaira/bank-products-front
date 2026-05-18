import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';

import { ProductCreate } from './product-create';
import { ProductService } from '../../../../core/services/product';

describe('ProductCreate', () => {
  let component: ProductCreate;
  let fixture: ComponentFixture<ProductCreate>;
  let navigateSpy: any;

  const payload = {
    id: 'dos',
    name: 'Nombre producto',
    description: 'Descripción producto',
    logo: 'assets-1.png',
    date_release: '2026-01-01',
    date_revision: '2027-01-01'
  };

  const mockProductService = {
    createProduct: vi.fn().mockReturnValue(of(payload))
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCreate],
      providers: [
        provideRouter([]),
        { provide: ProductService, useValue: mockProductService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductCreate);
    component = fixture.componentInstance;
    navigateSpy = vi.spyOn((component as any).router, 'navigate');
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call ProductService.createProduct and navigate on success', () => {
    component.createProduct(payload);

    expect(mockProductService.createProduct).toHaveBeenCalledWith(payload);
    expect(component.successMessage()).toBe('Producto creado correctamente');
    expect(navigateSpy).toHaveBeenCalledWith(['/products']);
  });

  it('should set errorMessage when createProduct fails', () => {
    const apiError = {
      error: {
        name: 'BadRequestError',
        message: "Invalid body, check 'errors' property for more info."
      }
    };

    mockProductService.createProduct = vi.fn().mockReturnValue(throwError(() => apiError));
    (component as any).productService = mockProductService;

    component.createProduct(payload);

    expect(component.errorMessage()).toBe("Invalid body, check 'errors' property for more info.");
  });
});
