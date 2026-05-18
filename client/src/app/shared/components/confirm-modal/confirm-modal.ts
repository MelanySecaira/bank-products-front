import { Component, input, output } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-confirm-modal',
  imports: [],
  templateUrl: './confirm-modal.html',
  styleUrl: './confirm-modal.css',
})
export class ConfirmModal {
  title = input.required<string>();

message = input.required<string>();

confirmText = input<string>('Confirmar');

cancelText = input<string>('Cancelar');

confirm = output<void>();

cancel = output<void>();

 onConfirm(): void {

    this.confirm.emit();
  }

  onCancel(): void {

    this.cancel.emit();
  }
}
