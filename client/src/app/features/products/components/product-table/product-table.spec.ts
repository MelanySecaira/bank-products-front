import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductTable } from './product-table';

describe('ProductTable', () => {
  let component: ProductTable;
  let fixture: ComponentFixture<ProductTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductTable],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductTable);
    fixture.componentRef.setInput('products', []);
    fixture.detectChanges();
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit edit and delete events when buttons are clicked', async () => {
    const product = {
      id: '1',
      name: 'Producto 1',
      description: 'Descripción 1',
      logo: 'https://example.com/logo.png',
      date_release: '2025-01-01',
      date_revision: '2026-01-01'
    };

    fixture.componentRef.setInput('products', [product]);
    fixture.detectChanges();
    await fixture.whenStable();

    let editId: string | null = null;
    let deleteId: string | null = null;

    component.edit.subscribe(id => editId = id);
    component.delete.subscribe(id => deleteId = id);

    const buttons = fixture.nativeElement.querySelectorAll('.dropdown-menu button');
    buttons[0].click();
    buttons[1].click();

    expect(editId).toBe('1');
    expect(deleteId).toBe('1');
  });
});
