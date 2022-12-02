import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ZDPFormService, ZDPFormGroup } from './zdp-form.service';
import { IZDP } from '../zdp.model';
import { ZDPService } from '../service/zdp.service';
import { IStammdaten } from 'app/entities/stammdaten/stammdaten.model';
import { StammdatenService } from 'app/entities/stammdaten/service/stammdaten.service';

@Component({
  selector: 'jhi-zdp-update',
  templateUrl: './zdp-update.component.html',
})
export class ZDPUpdateComponent implements OnInit {
  isSaving = false;
  zDP: IZDP | null = null;

  stammdatensCollection: IStammdaten[] = [];

  editForm: ZDPFormGroup = this.zDPFormService.createZDPFormGroup();

  constructor(
    protected zDPService: ZDPService,
    protected zDPFormService: ZDPFormService,
    protected stammdatenService: StammdatenService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareStammdaten = (o1: IStammdaten | null, o2: IStammdaten | null): boolean => this.stammdatenService.compareStammdaten(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ zDP }) => {
      this.zDP = zDP;
      if (zDP) {
        this.updateForm(zDP);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const zDP = this.zDPFormService.getZDP(this.editForm);
    if (zDP.id !== null) {
      this.subscribeToSaveResponse(this.zDPService.update(zDP));
    } else {
      this.subscribeToSaveResponse(this.zDPService.create(zDP));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IZDP>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(zDP: IZDP): void {
    this.zDP = zDP;
    this.zDPFormService.resetForm(this.editForm, zDP);

    this.stammdatensCollection = this.stammdatenService.addStammdatenToCollectionIfMissing<IStammdaten>(
      this.stammdatensCollection,
      zDP.stammdaten
    );
  }

  protected loadRelationshipsOptions(): void {
    this.stammdatenService
      .query({ filter: 'zdp-is-null' })
      .pipe(map((res: HttpResponse<IStammdaten[]>) => res.body ?? []))
      .pipe(
        map((stammdatens: IStammdaten[]) =>
          this.stammdatenService.addStammdatenToCollectionIfMissing<IStammdaten>(stammdatens, this.zDP?.stammdaten)
        )
      )
      .subscribe((stammdatens: IStammdaten[]) => (this.stammdatensCollection = stammdatens));
  }
}
