import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ZDPComponent } from './list/zdp.component';
import { ZDPDetailComponent } from './detail/zdp-detail.component';
import { ZDPUpdateComponent } from './update/zdp-update.component';
import { ZDPDeleteDialogComponent } from './delete/zdp-delete-dialog.component';
import { ZDPRoutingModule } from './route/zdp-routing.module';

@NgModule({
  imports: [SharedModule, ZDPRoutingModule],
  declarations: [ZDPComponent, ZDPDetailComponent, ZDPUpdateComponent, ZDPDeleteDialogComponent],
})
export class ZDPModule {}
