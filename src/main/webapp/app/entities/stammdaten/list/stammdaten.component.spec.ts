import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { StammdatenService } from '../service/stammdaten.service';

import { StammdatenComponent } from './stammdaten.component';

describe('Stammdaten Management Component', () => {
  let comp: StammdatenComponent;
  let fixture: ComponentFixture<StammdatenComponent>;
  let service: StammdatenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'stammdaten', component: StammdatenComponent }]), HttpClientTestingModule],
      declarations: [StammdatenComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(StammdatenComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(StammdatenComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(StammdatenService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.stammdatens?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to stammdatenService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getStammdatenIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getStammdatenIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
