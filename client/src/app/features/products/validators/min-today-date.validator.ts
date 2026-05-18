import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn
} from '@angular/forms';

export function minTodayDateValidator(): ValidatorFn {
  
  return (control: AbstractControl): ValidationErrors | null => {
    
    if (!control.value) {
      return null;
    }

    const selectedDate = new Date(control.value);
    const today = new Date();

    // Resetear la hora para comparar solo las fechas
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    return selectedDate < today
      ? { minTodayDate: true }
      : null;
  };
}
