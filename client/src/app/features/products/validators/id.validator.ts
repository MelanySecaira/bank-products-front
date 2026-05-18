import {
  AbstractControl,
  AsyncValidatorFn
} from '@angular/forms';

import {
  map,
  catchError,
  of
} from 'rxjs';

export function idExistsValidator(
  productService: any
): AsyncValidatorFn {

  return (
    control: AbstractControl
  ) => {

    if (!control.value) {

      return of(null);
    }

    return productService
      .verifyId(control.value)
      .pipe(

        map((exists: boolean) =>

          exists
            ? { idExists: true }
            : null
        ),

        catchError(() => of(null))
      );
  };
}