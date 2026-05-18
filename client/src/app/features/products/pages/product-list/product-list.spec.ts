import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { ProductList } from './product-list';
import { ProductService } from '../../../../core/services/product';

describe('ProductList', () => {
  let component: ProductList;
  let fixture: ComponentFixture<ProductList>;

  const products = [
    {
      id: 'uno',
      name: 'Nombre producto',
      description: 'Descripción producto',
      logo: 'assets-1.png',
      date_release: '2025-01-01',
      date_revision: '2025-01-01'
    },
    {
      id: 'dos',
      name: 'Otro producto',
      description: 'Descripción adicional',
      logo: 'assets-2.png',
      date_release: '2025-02-01',
      date_revision: '2025-02-01'
    }
  ];

  const mockProductService = {
    getProducts: vi.fn().mockReturnValue(of(products)),
    deleteProduct: vi.fn().mockReturnValue(of({}))
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductList],
      providers: [
        provideRouter([]),
        { provide: ProductService, useValue: mockProductService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load products from service response', async () => {
    expect(mockProductService.getProducts).toHaveBeenCalled();
    expect(component.products()).toEqual(products);
    expect(component.filteredProducts()).toEqual(products.slice(0, component.pageSize()));
  });

  it('should filter products by search term', () => {
    component.searchTerm.set('Nombre');
    fixture.detectChanges();

    expect(component.filteredProducts().length).toBe(1);
    expect(component.filteredProducts()[0].id).toBe('uno');
  });

  it('should update pageSize when changePageSize is called', () => {
    component.changePageSize(1);

    expect(component.pageSize()).toBe(1);
    expect(component.filteredProducts().length).toBe(1);
  });

  it('should navigate to edit page when goToEdit is called', () => {
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigateByUrl');

    component.goToEdit('uno');

    expect(navigateSpy).toHaveBeenCalledWith('/products/edit/uno');
  });

  it('should open delete modal and select the product', () => {
    component.openDeleteModal('uno');

    expect(component.showDeleteModal()).toBe(true);
    expect(component.selectedProduct()?.id).toBe('uno');
  });

  it('should close delete modal and clear selection', () => {
    component.openDeleteModal('uno');
    component.closeDeleteModal();

    expect(component.showDeleteModal()).toBe(false);
    expect(component.selectedProduct()).toBeNull();
  });

  it('should delete selected product', () => {
    component.openDeleteModal('uno');

    component.deleteProduct();

    expect(mockProductService.deleteProduct).toHaveBeenCalledWith('uno');
    expect(component.products().length).toBe(1);
    expect(component.selectedProduct()).toBeNull();
    expect(component.showDeleteModal()).toBe(false);
  });
});
