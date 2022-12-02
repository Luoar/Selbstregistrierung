import { Anrede } from 'app/entities/enumerations/anrede.model';

import { IStammdaten, NewStammdaten } from './stammdaten.model';

export const sampleWithRequiredData: IStammdaten = {
  id: 9924,
};

export const sampleWithPartialData: IStammdaten = {
  id: 74441,
  telefonMobile: 'Facilitator ADP',
};

export const sampleWithFullData: IStammdaten = {
  id: 6779,
  anrede: Anrede['Herr'],
  nachname: 'Virginia Lights',
  vorname: 'Louisiana',
  eMail: 'transmit',
  telefonMobile: 'static',
};

export const sampleWithNewData: NewStammdaten = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
