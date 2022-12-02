import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { StammdatenComponent } from './list/stammdaten.component';
import { StammdatenDetailComponent } from './detail/stammdaten-detail.component';
import { StammdatenUpdateComponent } from './update/stammdaten-update.component';
import { StammdatenDeleteDialogComponent } from './delete/stammdaten-delete-dialog.component';
import { StammdatenRoutingModule } from './route/stammdaten-routing.module';

@NgModule({
  imports: [SharedModule, StammdatenRoutingModule],
  declarations: [StammdatenComponent, StammdatenDetailComponent, StammdatenUpdateComponent, StammdatenDeleteDialogComponent],
})
export class StammdatenModule {}
