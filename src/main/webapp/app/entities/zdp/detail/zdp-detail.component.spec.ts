import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ZDPDetailComponent } from './zdp-detail.component';

describe('ZDP Management Detail Component', () => {
  let comp: ZDPDetailComponent;
  let fixture: ComponentFixture<ZDPDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ZDPDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ zDP: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ZDPDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ZDPDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load zDP on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.zDP).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
