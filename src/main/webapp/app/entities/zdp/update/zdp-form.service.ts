import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IZDP, NewZDP } from '../zdp.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IZDP for edit and NewZDPFormGroupInput for create.
 */
type ZDPFormGroupInput = IZDP | PartialWithRequiredKeyOf<NewZDP>;

type ZDPFormDefaults = Pick<NewZDP, 'id'>;

type ZDPFormGroupContent = {
  id: FormControl<IZDP['id'] | NewZDP['id']>;
  zdpNummer: FormControl<IZDP['zdpNummer']>;
  stammdaten: FormControl<IZDP['stammdaten']>;
};

export type ZDPFormGroup = FormGroup<ZDPFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ZDPFormService {
  createZDPFormGroup(zDP: ZDPFormGroupInput = { id: null }): ZDPFormGroup {
    const zDPRawValue = {
      ...this.getFormDefaults(),
      ...zDP,
    };
    return new FormGroup<ZDPFormGroupContent>({
      id: new FormControl(
        { value: zDPRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      zdpNummer: new FormControl(zDPRawValue.zdpNummer),
      stammdaten: new FormControl(zDPRawValue.stammdaten),
    });
  }

  getZDP(form: ZDPFormGroup): IZDP | NewZDP {
    return form.getRawValue() as IZDP | NewZDP;
  }

  resetForm(form: ZDPFormGroup, zDP: ZDPFormGroupInput): void {
    const zDPRawValue = { ...this.getFormDefaults(), ...zDP };
    form.reset(
      {
        ...zDPRawValue,
        id: { value: zDPRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ZDPFormDefaults {
    return {
      id: null,
    };
  }
}
