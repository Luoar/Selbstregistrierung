import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { StammdatenComponent } from '../list/stammdaten.component';
import { StammdatenDetailComponent } from '../detail/stammdaten-detail.component';
import { StammdatenUpdateComponent } from '../update/stammdaten-update.component';
import { StammdatenRoutingResolveService } from './stammdaten-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const stammdatenRoute: Routes = [
  {
    path: '',
    component: StammdatenComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: StammdatenDetailComponent,
    resolve: {
      stammdaten: StammdatenRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: StammdatenUpdateComponent,
    resolve: {
      stammdaten: StammdatenRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: StammdatenUpdateComponent,
    resolve: {
      stammdaten: StammdatenRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(stammdatenRoute)],
  exports: [RouterModule],
})
export class StammdatenRoutingModule {}
