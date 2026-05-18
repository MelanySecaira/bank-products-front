import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';

import { ProductEdit } from './product-edit';
import { ProductService } from '../../../../core/services/product';
import { ActivatedRoute } from '@angular/router';

describe('ProductEdit', () => {
  let component: ProductEdit;
  let fixture: ComponentFixture<ProductEdit>;

  const product = {
    id: 'test-id',
    name: 'Producto existente',
    description: 'Descripción existente',
    logo: 'assets.png',
    date_release: '2025-01-01',
    date_revision: '2026-01-01'
  };

  const mockProductService = {
    getProducts: vi.fn().mockReturnValue(of([product])),
    updateProduct: vi.fn().mockReturnValue(of({})),
    verifyId: vi.fn().mockReturnValue(of(false))
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductEdit],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => 'test-id' } } } },
        { provide: ProductService, useValue: mockProductService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductEdit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load the product when it exists', () => {
    expect(mockProductService.getProducts).toHaveBeenCalled();
    expect(component.product()?.id).toBe('test-id');
    expect(component.errorMessage()).toBe('');
  });

  it('should navigate after successful update', () => {
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate');

    component.updateProduct(product);

    expect(mockProductService.updateProduct).toHaveBeenCalledWith('test-id', {
      name: 'Producto existente',
      description: 'Descripción existente',
      logo: 'assets.png',
      date_release: '2025-01-01',
      date_revision: '2026-01-01'
    });
    expect(navigateSpy).toHaveBeenCalledWith(['/products']);
  });

  it('should set errorMessage when updateProduct fails', () => {
    const apiError = {
      error: {
        name: 'NotFoundError',
        message: 'Not product found with that identifier'
      }
    };

    mockProductService.updateProduct = vi.fn().mockReturnValue(throwError(() => apiError));
    (component as any).productService = mockProductService;

    component.updateProduct(product);

    expect(component.errorMessage()).toBe('Not product found with that identifier');
  });

  it('should set errorMessage when product is not found in load', async () => {
    const mockNoProductsService = {
      getProducts: vi.fn().mockReturnValue(of([])),
      updateProduct: vi.fn().mockReturnValue(of({})),
      verifyId: vi.fn().mockReturnValue(of(false))
    };

    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [ProductEdit],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => 'test-id' } } } },
        { provide: ProductService, useValue: mockNoProductsService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductEdit);
    component = fixture.componentInstance;
    await fixture.whenStable();

    expect(component.errorMessage()).toBe('Product not found');
    expect(component.product()).toBeNull();
  });
});
