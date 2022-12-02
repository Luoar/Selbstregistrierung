import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../adresse.test-samples';

import { AdresseFormService } from './adresse-form.service';

describe('Adresse Form Service', () => {
  let service: AdresseFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdresseFormService);
  });

  describe('Service methods', () => {
    describe('createAdresseFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createAdresseFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            strasseUndNummer: expect.any(Object),
            adresszusatz: expect.any(Object),
            postfach: expect.any(Object),
            telefonFix: expect.any(Object),
            telefonGeschaeft: expect.any(Object),
            fax: expect.any(Object),
            adresstyp: expect.any(Object),
            zdp: expect.any(Object),
          })
        );
      });

      it('passing IAdresse should create a new form with FormGroup', () => {
        const formGroup = service.createAdresseFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            strasseUndNummer: expect.any(Object),
            adresszusatz: expect.any(Object),
            postfach: expect.any(Object),
            telefonFix: expect.any(Object),
            telefonGeschaeft: expect.any(Object),
            fax: expect.any(Object),
            adresstyp: expect.any(Object),
            zdp: expect.any(Object),
          })
        );
      });
    });

    describe('getAdresse', () => {
      it('should return NewAdresse for default Adresse initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createAdresseFormGroup(sampleWithNewData);

        const adresse = service.getAdresse(formGroup) as any;

        expect(adresse).toMatchObject(sampleWithNewData);
      });

      it('should return NewAdresse for empty Adresse initial value', () => {
        const formGroup = service.createAdresseFormGroup();

        const adresse = service.getAdresse(formGroup) as any;

        expect(adresse).toMatchObject({});
      });

      it('should return IAdresse', () => {
        const formGroup = service.createAdresseFormGroup(sampleWithRequiredData);

        const adresse = service.getAdresse(formGroup) as any;

        expect(adresse).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IAdresse should not enable id FormControl', () => {
        const formGroup = service.createAdresseFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewAdresse should disable id FormControl', () => {
        const formGroup = service.createAdresseFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
