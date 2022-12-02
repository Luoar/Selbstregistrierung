import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IZDP } from '../zdp.model';
import { ZDPService } from '../service/zdp.service';

@Injectable({ providedIn: 'root' })
export class ZDPRoutingResolveService implements Resolve<IZDP | null> {
  constructor(protected service: ZDPService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IZDP | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((zDP: HttpResponse<IZDP>) => {
          if (zDP.body) {
            return of(zDP.body);
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
