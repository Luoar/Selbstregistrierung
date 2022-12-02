import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { AdresseFormService } from './adresse-form.service';
import { AdresseService } from '../service/adresse.service';
import { IAdresse } from '../adresse.model';
import { IZDP } from 'app/entities/zdp/zdp.model';
import { ZDPService } from 'app/entities/zdp/service/zdp.service';

import { AdresseUpdateComponent } from './adresse-update.component';

describe('Adresse Management Update Component', () => {
  let comp: AdresseUpdateComponent;
  let fixture: ComponentFixture<AdresseUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let adresseFormService: AdresseFormService;
  let adresseService: AdresseService;
  let zDPService: ZDPService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [AdresseUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(AdresseUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AdresseUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    adresseFormService = TestBed.inject(AdresseFormService);
    adresseService = TestBed.inject(AdresseService);
    zDPService = TestBed.inject(ZDPService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call ZDP query and add missing value', () => {
      const adresse: IAdresse = { id: 456 };
      const zdp: IZDP = { id: 44557 };
      adresse.zdp = zdp;

      const zDPCollection: IZDP[] = [{ id: 17070 }];
      jest.spyOn(zDPService, 'query').mockReturnValue(of(new HttpResponse({ body: zDPCollection })));
      const additionalZDPS = [zdp];
      const expectedCollection: IZDP[] = [...additionalZDPS, ...zDPCollection];
      jest.spyOn(zDPService, 'addZDPToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ adresse });
      comp.ngOnInit();

      expect(zDPService.query).toHaveBeenCalled();
      expect(zDPService.addZDPToCollectionIfMissing).toHaveBeenCalledWith(zDPCollection, ...additionalZDPS.map(expect.objectContaining));
      expect(comp.zDPSSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const adresse: IAdresse = { id: 456 };
      const zdp: IZDP = { id: 55933 };
      adresse.zdp = zdp;

      activatedRoute.data = of({ adresse });
      comp.ngOnInit();

      expect(comp.zDPSSharedCollection).toContain(zdp);
      expect(comp.adresse).toEqual(adresse);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAdresse>>();
      const adresse = { id: 123 };
      jest.spyOn(adresseFormService, 'getAdresse').mockReturnValue(adresse);
      jest.spyOn(adresseService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ adresse });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: adresse }));
      saveSubject.complete();

      // THEN
      expect(adresseFormService.getAdresse).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(adresseService.update).toHaveBeenCalledWith(expect.objectContaining(adresse));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAdresse>>();
      const adresse = { id: 123 };
      jest.spyOn(adresseFormService, 'getAdresse').mockReturnValue({ id: null });
      jest.spyOn(adresseService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ adresse: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: adresse }));
      saveSubject.complete();

      // THEN
      expect(adresseFormService.getAdresse).toHaveBeenCalled();
      expect(adresseService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAdresse>>();
      const adresse = { id: 123 };
      jest.spyOn(adresseService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ adresse });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(adresseService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareZDP', () => {
      it('Should forward to zDPService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(zDPService, 'compareZDP');
        comp.compareZDP(entity, entity2);
        expect(zDPService.compareZDP).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
