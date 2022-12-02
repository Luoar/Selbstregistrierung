import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IZDP } from '../zdp.model';

@Component({
  selector: 'jhi-zdp-detail',
  templateUrl: './zdp-detail.component.html',
})
export class ZDPDetailComponent implements OnInit {
  zDP: IZDP | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ zDP }) => {
      this.zDP = zDP;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
