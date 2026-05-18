import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmModal } from './confirm-modal';

describe('ConfirmModal', () => {
  let component: ConfirmModal;
  let fixture: ComponentFixture<ConfirmModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmModal],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmModal);
    fixture.componentRef.setInput('title', 'Confirmar acción');
    fixture.componentRef.setInput('message', '¿Estás seguro?');
    fixture.detectChanges();
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit cancel and confirm events when buttons are clicked', () => {
    let cancelCalled = false;
    let confirmCalled = false;

    component.cancel.subscribe(() => cancelCalled = true);
    component.confirm.subscribe(() => confirmCalled = true);

    const buttons = fixture.nativeElement.querySelectorAll('button');
    buttons[0].click();
    buttons[1].click();

    expect(cancelCalled).toBe(true);
    expect(confirmCalled).toBe(true);
  });
});
