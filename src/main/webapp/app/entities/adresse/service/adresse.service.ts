import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAdresse, NewAdresse } from '../adresse.model';

export type PartialUpdateAdresse = Partial<IAdresse> & Pick<IAdresse, 'id'>;

export type EntityResponseType = HttpResponse<IAdresse>;
export type EntityArrayResponseType = HttpResponse<IAdresse[]>;

@Injectable({ providedIn: 'root' })
export class AdresseService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/adresses');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(adresse: NewAdresse): Observable<EntityResponseType> {
    return this.http.post<IAdresse>(this.resourceUrl, adresse, { observe: 'response' });
  }

  update(adresse: IAdresse): Observable<EntityResponseType> {
    return this.http.put<IAdresse>(`${this.resourceUrl}/${this.getAdresseIdentifier(adresse)}`, adresse, { observe: 'response' });
  }

  partialUpdate(adresse: PartialUpdateAdresse): Observable<EntityResponseType> {
    return this.http.patch<IAdresse>(`${this.resourceUrl}/${this.getAdresseIdentifier(adresse)}`, adresse, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAdresse>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAdresse[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getAdresseIdentifier(adresse: Pick<IAdresse, 'id'>): number {
    return adresse.id;
  }

  compareAdresse(o1: Pick<IAdresse, 'id'> | null, o2: Pick<IAdresse, 'id'> | null): boolean {
    return o1 && o2 ? this.getAdresseIdentifier(o1) === this.getAdresseIdentifier(o2) : o1 === o2;
  }

  addAdresseToCollectionIfMissing<Type extends Pick<IAdresse, 'id'>>(
    adresseCollection: Type[],
    ...adressesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const adresses: Type[] = adressesToCheck.filter(isPresent);
    if (adresses.length > 0) {
      const adresseCollectionIdentifiers = adresseCollection.map(adresseItem => this.getAdresseIdentifier(adresseItem)!);
      const adressesToAdd = adresses.filter(adresseItem => {
        const adresseIdentifier = this.getAdresseIdentifier(adresseItem);
        if (adresseCollectionIdentifiers.includes(adresseIdentifier)) {
          return false;
        }
        adresseCollectionIdentifiers.push(adresseIdentifier);
        return true;
      });
      return [...adressesToAdd, ...adresseCollection];
    }
    return adresseCollection;
  }
}
