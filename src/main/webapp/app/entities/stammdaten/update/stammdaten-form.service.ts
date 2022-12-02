import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IStammdaten, NewStammdaten } from '../stammdaten.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IStammdaten for edit and NewStammdatenFormGroupInput for create.
 */
type StammdatenFormGroupInput = IStammdaten | PartialWithRequiredKeyOf<NewStammdaten>;

type StammdatenFormDefaults = Pick<NewStammdaten, 'id'>;

type StammdatenFormGroupContent = {
  id: FormControl<IStammdaten['id'] | NewStammdaten['id']>;
  anrede: FormControl<IStammdaten['anrede']>;
  nachname: FormControl<IStammdaten['nachname']>;
  vorname: FormControl<IStammdaten['vorname']>;
  eMail: FormControl<IStammdaten['eMail']>;
  telefonMobile: FormControl<IStammdaten['telefonMobile']>;
};

export type StammdatenFormGroup = FormGroup<StammdatenFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class StammdatenFormService {
  createStammdatenFormGroup(stammdaten: StammdatenFormGroupInput = { id: null }): StammdatenFormGroup {
    const stammdatenRawValue = {
      ...this.getFormDefaults(),
      ...stammdaten,
    };
    return new FormGroup<StammdatenFormGroupContent>({
      id: new FormControl(
        { value: stammdatenRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      anrede: new FormControl(stammdatenRawValue.anrede),
      nachname: new FormControl(stammdatenRawValue.nachname),
      vorname: new FormControl(stammdatenRawValue.vorname),
      eMail: new FormControl(stammdatenRawValue.eMail),
      telefonMobile: new FormControl(stammdatenRawValue.telefonMobile),
    });
  }

  getStammdaten(form: StammdatenFormGroup): IStammdaten | NewStammdaten {
    return form.getRawValue() as IStammdaten | NewStammdaten;
  }

  resetForm(form: StammdatenFormGroup, stammdaten: StammdatenFormGroupInput): void {
    const stammdatenRawValue = { ...this.getFormDefaults(), ...stammdaten };
    form.reset(
      {
        ...stammdatenRawValue,
        id: { value: stammdatenRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): StammdatenFormDefaults {
    return {
      id: null,
    };
  }
}
