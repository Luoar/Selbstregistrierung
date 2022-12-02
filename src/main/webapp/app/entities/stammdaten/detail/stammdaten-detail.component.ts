import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IStammdaten } from '../stammdaten.model';

@Component({
  selector: 'jhi-stammdaten-detail',
  templateUrl: './stammdaten-detail.component.html',
})
export class StammdatenDetailComponent implements OnInit {
  stammdaten: IStammdaten | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ stammdaten }) => {
      this.stammdaten = stammdaten;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
