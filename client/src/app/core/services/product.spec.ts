import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ProductService } from './product';

describe('ProductService', () => {
  let service: ProductService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService]
    });
    service = TestBed.inject(ProductService);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send GET request when getProducts is called', () => {
    const response = {
      message: 'Products fetched successfully',
      data: [
        {
          id: 'uno',
          name: 'Producto uno',
          description: 'Descripción uno',
          logo: 'assets-uno.png',
          date_release: '2025-01-01',
          date_revision: '2026-01-01'
        }
      ]
    };

    let result: any;
    service.getProducts().subscribe(value => {
      result = value;
    });

    const req = httpController.expectOne((req) => req.method === 'GET' && req.url === service['apiUrl']);
    expect(req.request.body).toBeNull();
    req.flush(response);

    expect(result).toEqual(response.data);
  });

  it('should send POST request when createProduct is called', () => {
    const payload = {
      id: 'dos',
      name: 'Nombre producto',
      description: 'Descripción producto',
      logo: 'assets-1.png',
      date_release: '2026-01-01',
      date_revision: '2027-01-01'
    };

    const response = {
      message: 'Product added successfully',
      data: { ...payload }
    };

    let result: any;
    service.createProduct(payload).subscribe(value => {
      result = value;
    });

    const req = httpController.expectOne((req) => req.method === 'POST' && req.url === service['apiUrl']);
    expect(req.request.body).toEqual(payload);
    req.flush(response);

    expect(result).toEqual(payload);
  });

  it('should send PUT request when updateProduct is called', () => {
    const updatePayload = {
      name: 'Nombre actualizado',
      description: 'Descripción producto',
      logo: 'assets-1.png',
      date_release: '2025-01-01',
      date_revision: '2025-01-01'
    };

    const response = {
      message: 'Product updated successfully',
      data: { ...updatePayload }
    };

    let result: any;
    service.updateProduct('uno', updatePayload).subscribe(value => {
      result = value;
    });

    const req = httpController.expectOne((req) => req.method === 'PUT' && req.url === `${service['apiUrl']}/uno`);
    expect(req.request.body).toEqual(updatePayload);
    req.flush(response);

    expect(result).toEqual(updatePayload);
  });

  it('should send GET request when verifyId is called', () => {
    let result: boolean | undefined;
    service.verifyId('uno').subscribe(value => {
      result = value;
    });

    const req = httpController.expectOne((req) => req.method === 'GET' && req.url === `${service['apiUrl']}/verification/uno`);
    req.flush(true);

    expect(result).toBe(true);
  });

  it('should send DELETE request when deleteProduct is called', () => {
    const response = {
      message: 'Product removed successfully'
    };

    let result: any;
    service.deleteProduct('dos').subscribe(value => {
      result = value;
    });

    const req = httpController.expectOne((req) => req.method === 'DELETE' && req.url === `${service['apiUrl']}/dos`);
    req.flush(response);

    expect(result).toEqual(response);
  });
});
