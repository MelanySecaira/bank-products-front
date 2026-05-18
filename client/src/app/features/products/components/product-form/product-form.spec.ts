import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { ProductForm } from './product-form';
import { ProductService } from '../../../../core/services/product';

describe('ProductForm', () => {
  let component: ProductForm;
  let fixture: ComponentFixture<ProductForm>;

  const mockProductService = {
    verifyId: (_id: string) => of(false)
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductForm],
      providers: [
        { provide: ProductService, useValue: mockProductService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should auto-fill date_revision one year after date_release', async () => {
    fixture.detectChanges();

    component.form.get('date_release')?.setValue('2027-05-18');
    await fixture.whenStable();

    expect(component.form.get('date_revision')?.value).toBe('2028-05-18');
  });

  it('should emit submitForm when form is valid', async () => {
    fixture.detectChanges();

    component.form.setValue({
      id: 'ABC123',
      name: 'Nombre de prueba',
      description: 'Descripción de prueba válida',
      logo: 'https://example.com/logo.png',
      date_release: '2027-05-18',
      date_revision: '2028-05-18'
    });

    fixture.detectChanges();
    await fixture.whenStable();

    const emitSpy = vi.spyOn(component.submitForm, 'emit');

    component.onSubmit();
    await fixture.whenStable();

    expect(emitSpy).toHaveBeenCalledWith({
      id: 'ABC123',
      name: 'Nombre de prueba',
      description: 'Descripción de prueba válida',
      logo: 'https://example.com/logo.png',
      date_release: '2027-05-18',
      date_revision: '2028-05-18'
    });
  });

  it('should not emit submitForm when form is invalid', async () => {
    fixture.detectChanges();

    const emitSpy = vi.spyOn(component.submitForm, 'emit');

    component.form.get('name')?.setValue('abc');
    component.onSubmit();
    await fixture.whenStable();

    expect(emitSpy).not.toHaveBeenCalled();
    expect(component.form.invalid).toBe(true);
  });

  it('should reset the form and emit resetForm', async () => {
    fixture.detectChanges();

    const resetSpy = vi.spyOn(component.resetForm, 'emit');

    component.form.setValue({
      id: 'ABC123',
      name: 'Nombre de prueba',
      description: 'Descripción de prueba válida',
      logo: 'https://example.com/logo.png',
      date_release: '2027-05-18',
      date_revision: '2028-05-18'
    });

    component.onReset();
    await fixture.whenStable();

    expect(resetSpy).toHaveBeenCalled();
    expect(component.form.pristine).toBe(true);
  });

  it('should disable id field in edit mode and patch product values', async () => {
    fixture.componentRef.setInput('mode', 'edit');
    fixture.componentRef.setInput('product', {
      id: 'ABC123',
      name: 'Producto editado',
      description: 'Descripción existente',
      logo: 'https://example.com/logo.png',
      date_release: '2027-05-18',
      date_revision: '2028-05-18'
    });
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.form.get('id')?.disabled).toBe(true);
    expect(component.form.get('name')?.value).toBe('Producto editado');
    expect(component.form.get('description')?.value).toBe('Descripción existente');
  });
});
