import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IAdresse } from '../adresse.model';
import { AdresseService } from '../service/adresse.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './adresse-delete-dialog.component.html',
})
export class AdresseDeleteDialogComponent {
  adresse?: IAdresse;

  constructor(protected adresseService: AdresseService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.adresseService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
