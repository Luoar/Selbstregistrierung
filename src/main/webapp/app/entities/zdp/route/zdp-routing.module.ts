import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ZDPComponent } from '../list/zdp.component';
import { ZDPDetailComponent } from '../detail/zdp-detail.component';
import { ZDPUpdateComponent } from '../update/zdp-update.component';
import { ZDPRoutingResolveService } from './zdp-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const zDPRoute: Routes = [
  {
    path: '',
    component: ZDPComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ZDPDetailComponent,
    resolve: {
      zDP: ZDPRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ZDPUpdateComponent,
    resolve: {
      zDP: ZDPRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ZDPUpdateComponent,
    resolve: {
      zDP: ZDPRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(zDPRoute)],
  exports: [RouterModule],
})
export class ZDPRoutingModule {}
