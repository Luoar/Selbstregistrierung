import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../zdp.test-samples';

import { ZDPFormService } from './zdp-form.service';

describe('ZDP Form Service', () => {
  let service: ZDPFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ZDPFormService);
  });

  describe('Service methods', () => {
    describe('createZDPFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createZDPFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            zdpNummer: expect.any(Object),
            stammdaten: expect.any(Object),
          })
        );
      });

      it('passing IZDP should create a new form with FormGroup', () => {
        const formGroup = service.createZDPFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            zdpNummer: expect.any(Object),
            stammdaten: expect.any(Object),
          })
        );
      });
    });

    describe('getZDP', () => {
      it('should return NewZDP for default ZDP initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createZDPFormGroup(sampleWithNewData);

        const zDP = service.getZDP(formGroup) as any;

        expect(zDP).toMatchObject(sampleWithNewData);
      });

      it('should return NewZDP for empty ZDP initial value', () => {
        const formGroup = service.createZDPFormGroup();

        const zDP = service.getZDP(formGroup) as any;

        expect(zDP).toMatchObject({});
      });

      it('should return IZDP', () => {
        const formGroup = service.createZDPFormGroup(sampleWithRequiredData);

        const zDP = service.getZDP(formGroup) as any;

        expect(zDP).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IZDP should not enable id FormControl', () => {
        const formGroup = service.createZDPFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewZDP should disable id FormControl', () => {
        const formGroup = service.createZDPFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
