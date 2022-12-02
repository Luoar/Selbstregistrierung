import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'zdp',
        data: { pageTitle: 'selbstregistrierungApp.zDP.home.title' },
        loadChildren: () => import('./zdp/zdp.module').then(m => m.ZDPModule),
      },
      {
        path: 'stammdaten',
        data: { pageTitle: 'selbstregistrierungApp.stammdaten.home.title' },
        loadChildren: () => import('./stammdaten/stammdaten.module').then(m => m.StammdatenModule),
      },
      {
        path: 'adresse',
        data: { pageTitle: 'selbstregistrierungApp.adresse.home.title' },
        loadChildren: () => import('./adresse/adresse.module').then(m => m.AdresseModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
