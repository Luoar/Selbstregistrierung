import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ZDPFormService } from './zdp-form.service';
import { ZDPService } from '../service/zdp.service';
import { IZDP } from '../zdp.model';
import { IStammdaten } from 'app/entities/stammdaten/stammdaten.model';
import { StammdatenService } from 'app/entities/stammdaten/service/stammdaten.service';

import { ZDPUpdateComponent } from './zdp-update.component';

describe('ZDP Management Update Component', () => {
  let comp: ZDPUpdateComponent;
  let fixture: ComponentFixture<ZDPUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let zDPFormService: ZDPFormService;
  let zDPService: ZDPService;
  let stammdatenService: StammdatenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ZDPUpdateComponent],
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
      .overrideTemplate(ZDPUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ZDPUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    zDPFormService = TestBed.inject(ZDPFormService);
    zDPService = TestBed.inject(ZDPService);
    stammdatenService = TestBed.inject(StammdatenService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call stammdaten query and add missing value', () => {
      const zDP: IZDP = { id: 456 };
      const stammdaten: IStammdaten = { id: 39785 };
      zDP.stammdaten = stammdaten;

      const stammdatenCollection: IStammdaten[] = [{ id: 27927 }];
      jest.spyOn(stammdatenService, 'query').mockReturnValue(of(new HttpResponse({ body: stammdatenCollection })));
      const expectedCollection: IStammdaten[] = [stammdaten, ...stammdatenCollection];
      jest.spyOn(stammdatenService, 'addStammdatenToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ zDP });
      comp.ngOnInit();

      expect(stammdatenService.query).toHaveBeenCalled();
      expect(stammdatenService.addStammdatenToCollectionIfMissing).toHaveBeenCalledWith(stammdatenCollection, stammdaten);
      expect(comp.stammdatensCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const zDP: IZDP = { id: 456 };
      const stammdaten: IStammdaten = { id: 55363 };
      zDP.stammdaten = stammdaten;

      activatedRoute.data = of({ zDP });
      comp.ngOnInit();

      expect(comp.stammdatensCollection).toContain(stammdaten);
      expect(comp.zDP).toEqual(zDP);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IZDP>>();
      const zDP = { id: 123 };
      jest.spyOn(zDPFormService, 'getZDP').mockReturnValue(zDP);
      jest.spyOn(zDPService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ zDP });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: zDP }));
      saveSubject.complete();

      // THEN
      expect(zDPFormService.getZDP).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(zDPService.update).toHaveBeenCalledWith(expect.objectContaining(zDP));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IZDP>>();
      const zDP = { id: 123 };
      jest.spyOn(zDPFormService, 'getZDP').mockReturnValue({ id: null });
      jest.spyOn(zDPService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ zDP: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: zDP }));
      saveSubject.complete();

      // THEN
      expect(zDPFormService.getZDP).toHaveBeenCalled();
      expect(zDPService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IZDP>>();
      const zDP = { id: 123 };
      jest.spyOn(zDPService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ zDP });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(zDPService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareStammdaten', () => {
      it('Should forward to stammdatenService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(stammdatenService, 'compareStammdaten');
        comp.compareStammdaten(entity, entity2);
        expect(stammdatenService.compareStammdaten).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
