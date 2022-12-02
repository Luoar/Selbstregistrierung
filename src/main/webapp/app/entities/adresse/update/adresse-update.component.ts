import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { AdresseFormService, AdresseFormGroup } from './adresse-form.service';
import { IAdresse } from '../adresse.model';
import { AdresseService } from '../service/adresse.service';
import { IZDP } from 'app/entities/zdp/zdp.model';
import { ZDPService } from 'app/entities/zdp/service/zdp.service';
import { Adresstyp } from 'app/entities/enumerations/adresstyp.model';

@Component({
  selector: 'jhi-adresse-update',
  templateUrl: './adresse-update.component.html',
})
export class AdresseUpdateComponent implements OnInit {
  isSaving = false;
  adresse: IAdresse | null = null;
  adresstypValues = Object.keys(Adresstyp);

  zDPSSharedCollection: IZDP[] = [];

  editForm: AdresseFormGroup = this.adresseFormService.createAdresseFormGroup();

  constructor(
    protected adresseService: AdresseService,
    protected adresseFormService: AdresseFormService,
    protected zDPService: ZDPService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareZDP = (o1: IZDP | null, o2: IZDP | null): boolean => this.zDPService.compareZDP(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ adresse }) => {
      this.adresse = adresse;
      if (adresse) {
        this.updateForm(adresse);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const adresse = this.adresseFormService.getAdresse(this.editForm);
    if (adresse.id !== null) {
      this.subscribeToSaveResponse(this.adresseService.update(adresse));
    } else {
      this.subscribeToSaveResponse(this.adresseService.create(adresse));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAdresse>>): void {
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

  protected updateForm(adresse: IAdresse): void {
    this.adresse = adresse;
    this.adresseFormService.resetForm(this.editForm, adresse);

    this.zDPSSharedCollection = this.zDPService.addZDPToCollectionIfMissing<IZDP>(this.zDPSSharedCollection, adresse.zdp);
  }

  protected loadRelationshipsOptions(): void {
    this.zDPService
      .query()
      .pipe(map((res: HttpResponse<IZDP[]>) => res.body ?? []))
      .pipe(map((zDPS: IZDP[]) => this.zDPService.addZDPToCollectionIfMissing<IZDP>(zDPS, this.adresse?.zdp)))
      .subscribe((zDPS: IZDP[]) => (this.zDPSSharedCollection = zDPS));
  }
}
