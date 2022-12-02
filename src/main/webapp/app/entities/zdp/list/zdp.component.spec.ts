import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ZDPService } from '../service/zdp.service';

import { ZDPComponent } from './zdp.component';

describe('ZDP Management Component', () => {
  let comp: ZDPComponent;
  let fixture: ComponentFixture<ZDPComponent>;
  let service: ZDPService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'zdp', component: ZDPComponent }]), HttpClientTestingModule],
      declarations: [ZDPComponent],
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
      .overrideTemplate(ZDPComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ZDPComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ZDPService);

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
    expect(comp.zDPS?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to zDPService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getZDPIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getZDPIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
