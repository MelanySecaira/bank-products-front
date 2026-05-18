import {
  AbstractControl,
  ValidationErrors
} from '@angular/forms';

export function revisionDateValidator(
  control: AbstractControl
): ValidationErrors | null {

  const release =
    control.get('date_release')?.value;

  const revision =
    control.get('date_revision')?.value;

  if (!release || !revision) {
    return null;
  }

  const releaseDate =
    new Date(release);

  const revisionDate =
    new Date(revision);

  // La fecha de revisión debe ser mayor a la de liberación
  if (revisionDate <= releaseDate) {
    return { invalidRevisionDate: true };
  }

  return null;
}