import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IZDP } from '../zdp.model';
import { ZDPService } from '../service/zdp.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './zdp-delete-dialog.component.html',
})
export class ZDPDeleteDialogComponent {
  zDP?: IZDP;

  constructor(protected zDPService: ZDPService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.zDPService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
