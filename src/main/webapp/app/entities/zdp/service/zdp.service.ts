import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IZDP, NewZDP } from '../zdp.model';

export type PartialUpdateZDP = Partial<IZDP> & Pick<IZDP, 'id'>;

export type EntityResponseType = HttpResponse<IZDP>;
export type EntityArrayResponseType = HttpResponse<IZDP[]>;

@Injectable({ providedIn: 'root' })
export class ZDPService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/zdps');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(zDP: NewZDP): Observable<EntityResponseType> {
    return this.http.post<IZDP>(this.resourceUrl, zDP, { observe: 'response' });
  }

  update(zDP: IZDP): Observable<EntityResponseType> {
    return this.http.put<IZDP>(`${this.resourceUrl}/${this.getZDPIdentifier(zDP)}`, zDP, { observe: 'response' });
  }

  partialUpdate(zDP: PartialUpdateZDP): Observable<EntityResponseType> {
    return this.http.patch<IZDP>(`${this.resourceUrl}/${this.getZDPIdentifier(zDP)}`, zDP, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IZDP>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IZDP[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getZDPIdentifier(zDP: Pick<IZDP, 'id'>): number {
    return zDP.id;
  }

  compareZDP(o1: Pick<IZDP, 'id'> | null, o2: Pick<IZDP, 'id'> | null): boolean {
    return o1 && o2 ? this.getZDPIdentifier(o1) === this.getZDPIdentifier(o2) : o1 === o2;
  }

  addZDPToCollectionIfMissing<Type extends Pick<IZDP, 'id'>>(zDPCollection: Type[], ...zDPSToCheck: (Type | null | undefined)[]): Type[] {
    const zDPS: Type[] = zDPSToCheck.filter(isPresent);
    if (zDPS.length > 0) {
      const zDPCollectionIdentifiers = zDPCollection.map(zDPItem => this.getZDPIdentifier(zDPItem)!);
      const zDPSToAdd = zDPS.filter(zDPItem => {
        const zDPIdentifier = this.getZDPIdentifier(zDPItem);
        if (zDPCollectionIdentifiers.includes(zDPIdentifier)) {
          return false;
        }
        zDPCollectionIdentifiers.push(zDPIdentifier);
        return true;
      });
      return [...zDPSToAdd, ...zDPCollection];
    }
    return zDPCollection;
  }
}
