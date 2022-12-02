import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IStammdaten, NewStammdaten } from '../stammdaten.model';

export type PartialUpdateStammdaten = Partial<IStammdaten> & Pick<IStammdaten, 'id'>;

export type EntityResponseType = HttpResponse<IStammdaten>;
export type EntityArrayResponseType = HttpResponse<IStammdaten[]>;

@Injectable({ providedIn: 'root' })
export class StammdatenService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/stammdatens');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(stammdaten: NewStammdaten): Observable<EntityResponseType> {
    return this.http.post<IStammdaten>(this.resourceUrl, stammdaten, { observe: 'response' });
  }

  update(stammdaten: IStammdaten): Observable<EntityResponseType> {
    return this.http.put<IStammdaten>(`${this.resourceUrl}/${this.getStammdatenIdentifier(stammdaten)}`, stammdaten, {
      observe: 'response',
    });
  }

  partialUpdate(stammdaten: PartialUpdateStammdaten): Observable<EntityResponseType> {
    return this.http.patch<IStammdaten>(`${this.resourceUrl}/${this.getStammdatenIdentifier(stammdaten)}`, stammdaten, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IStammdaten>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IStammdaten[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getStammdatenIdentifier(stammdaten: Pick<IStammdaten, 'id'>): number {
    return stammdaten.id;
  }

  compareStammdaten(o1: Pick<IStammdaten, 'id'> | null, o2: Pick<IStammdaten, 'id'> | null): boolean {
    return o1 && o2 ? this.getStammdatenIdentifier(o1) === this.getStammdatenIdentifier(o2) : o1 === o2;
  }

  addStammdatenToCollectionIfMissing<Type extends Pick<IStammdaten, 'id'>>(
    stammdatenCollection: Type[],
    ...stammdatensToCheck: (Type | null | undefined)[]
  ): Type[] {
    const stammdatens: Type[] = stammdatensToCheck.filter(isPresent);
    if (stammdatens.length > 0) {
      const stammdatenCollectionIdentifiers = stammdatenCollection.map(stammdatenItem => this.getStammdatenIdentifier(stammdatenItem)!);
      const stammdatensToAdd = stammdatens.filter(stammdatenItem => {
        const stammdatenIdentifier = this.getStammdatenIdentifier(stammdatenItem);
        if (stammdatenCollectionIdentifiers.includes(stammdatenIdentifier)) {
          return false;
        }
        stammdatenCollectionIdentifiers.push(stammdatenIdentifier);
        return true;
      });
      return [...stammdatensToAdd, ...stammdatenCollection];
    }
    return stammdatenCollection;
  }
}
