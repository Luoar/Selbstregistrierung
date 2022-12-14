import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAdresse } from '../adresse.model';
import { AdresseService } from '../service/adresse.service';

@Injectable({ providedIn: 'root' })
export class AdresseRoutingResolveService implements Resolve<IAdresse | null> {
  constructor(protected service: AdresseService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAdresse | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((adresse: HttpResponse<IAdresse>) => {
          if (adresse.body) {
            return of(adresse.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
