import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { StammdatenFormService } from './stammdaten-form.service';
import { StammdatenService } from '../service/stammdaten.service';
import { IStammdaten } from '../stammdaten.model';

import { StammdatenUpdateComponent } from './stammdaten-update.component';

describe('Stammdaten Management Update Component', () => {
  let comp: StammdatenUpdateComponent;
  let fixture: ComponentFixture<StammdatenUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let stammdatenFormService: StammdatenFormService;
  let stammdatenService: StammdatenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [StammdatenUpdateComponent],
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
      .overrideTemplate(StammdatenUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(StammdatenUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    stammdatenFormService = TestBed.inject(StammdatenFormService);
    stammdatenService = TestBed.inject(StammdatenService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const stammdaten: IStammdaten = { id: 456 };

      activatedRoute.data = of({ stammdaten });
      comp.ngOnInit();

      expect(comp.stammdaten).toEqual(stammdaten);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IStammdaten>>();
      const stammdaten = { id: 123 };
      jest.spyOn(stammdatenFormService, 'getStammdaten').mockReturnValue(stammdaten);
      jest.spyOn(stammdatenService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ stammdaten });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: stammdaten }));
      saveSubject.complete();

      // THEN
      expect(stammdatenFormService.getStammdaten).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(stammdatenService.update).toHaveBeenCalledWith(expect.objectContaining(stammdaten));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IStammdaten>>();
      const stammdaten = { id: 123 };
      jest.spyOn(stammdatenFormService, 'getStammdaten').mockReturnValue({ id: null });
      jest.spyOn(stammdatenService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ stammdaten: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: stammdaten }));
      saveSubject.complete();

      // THEN
      expect(stammdatenFormService.getStammdaten).toHaveBeenCalled();
      expect(stammdatenService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IStammdaten>>();
      const stammdaten = { id: 123 };
      jest.spyOn(stammdatenService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ stammdaten });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(stammdatenService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
