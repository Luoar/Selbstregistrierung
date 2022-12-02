import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { StammdatenFormService, StammdatenFormGroup } from './stammdaten-form.service';
import { IStammdaten } from '../stammdaten.model';
import { StammdatenService } from '../service/stammdaten.service';
import { Anrede } from 'app/entities/enumerations/anrede.model';

@Component({
  selector: 'jhi-stammdaten-update',
  templateUrl: './stammdaten-update.component.html',
})
export class StammdatenUpdateComponent implements OnInit {
  isSaving = false;
  stammdaten: IStammdaten | null = null;
  anredeValues = Object.keys(Anrede);

  editForm: StammdatenFormGroup = this.stammdatenFormService.createStammdatenFormGroup();

  constructor(
    protected stammdatenService: StammdatenService,
    protected stammdatenFormService: StammdatenFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ stammdaten }) => {
      this.stammdaten = stammdaten;
      if (stammdaten) {
        this.updateForm(stammdaten);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const stammdaten = this.stammdatenFormService.getStammdaten(this.editForm);
    if (stammdaten.id !== null) {
      this.subscribeToSaveResponse(this.stammdatenService.update(stammdaten));
    } else {
      this.subscribeToSaveResponse(this.stammdatenService.create(stammdaten));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IStammdaten>>): void {
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

  protected updateForm(stammdaten: IStammdaten): void {
    this.stammdaten = stammdaten;
    this.stammdatenFormService.resetForm(this.editForm, stammdaten);
  }
}
