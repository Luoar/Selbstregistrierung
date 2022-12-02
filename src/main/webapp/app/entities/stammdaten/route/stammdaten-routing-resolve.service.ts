import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IStammdaten } from '../stammdaten.model';
import { StammdatenService } from '../service/stammdaten.service';

@Injectable({ providedIn: 'root' })
export class StammdatenRoutingResolveService implements Resolve<IStammdaten | null> {
  constructor(protected service: StammdatenService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IStammdaten | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((stammdaten: HttpResponse<IStammdaten>) => {
          if (stammdaten.body) {
            return of(stammdaten.body);
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
