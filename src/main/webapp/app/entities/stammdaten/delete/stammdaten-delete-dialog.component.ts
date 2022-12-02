import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IStammdaten } from '../stammdaten.model';
import { StammdatenService } from '../service/stammdaten.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './stammdaten-delete-dialog.component.html',
})
export class StammdatenDeleteDialogComponent {
  stammdaten?: IStammdaten;

  constructor(protected stammdatenService: StammdatenService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.stammdatenService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
