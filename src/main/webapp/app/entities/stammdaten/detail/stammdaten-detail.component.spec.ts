import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { StammdatenDetailComponent } from './stammdaten-detail.component';

describe('Stammdaten Management Detail Component', () => {
  let comp: StammdatenDetailComponent;
  let fixture: ComponentFixture<StammdatenDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StammdatenDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ stammdaten: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(StammdatenDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(StammdatenDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load stammdaten on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.stammdaten).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
