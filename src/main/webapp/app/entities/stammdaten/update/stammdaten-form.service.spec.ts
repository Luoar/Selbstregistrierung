import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../stammdaten.test-samples';

import { StammdatenFormService } from './stammdaten-form.service';

describe('Stammdaten Form Service', () => {
  let service: StammdatenFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StammdatenFormService);
  });

  describe('Service methods', () => {
    describe('createStammdatenFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createStammdatenFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            anrede: expect.any(Object),
            nachname: expect.any(Object),
            vorname: expect.any(Object),
            eMail: expect.any(Object),
            telefonMobile: expect.any(Object),
          })
        );
      });

      it('passing IStammdaten should create a new form with FormGroup', () => {
        const formGroup = service.createStammdatenFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            anrede: expect.any(Object),
            nachname: expect.any(Object),
            vorname: expect.any(Object),
            eMail: expect.any(Object),
            telefonMobile: expect.any(Object),
          })
        );
      });
    });

    describe('getStammdaten', () => {
      it('should return NewStammdaten for default Stammdaten initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createStammdatenFormGroup(sampleWithNewData);

        const stammdaten = service.getStammdaten(formGroup) as any;

        expect(stammdaten).toMatchObject(sampleWithNewData);
      });

      it('should return NewStammdaten for empty Stammdaten initial value', () => {
        const formGroup = service.createStammdatenFormGroup();

        const stammdaten = service.getStammdaten(formGroup) as any;

        expect(stammdaten).toMatchObject({});
      });

      it('should return IStammdaten', () => {
        const formGroup = service.createStammdatenFormGroup(sampleWithRequiredData);

        const stammdaten = service.getStammdaten(formGroup) as any;

        expect(stammdaten).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IStammdaten should not enable id FormControl', () => {
        const formGroup = service.createStammdatenFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewStammdaten should disable id FormControl', () => {
        const formGroup = service.createStammdatenFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
