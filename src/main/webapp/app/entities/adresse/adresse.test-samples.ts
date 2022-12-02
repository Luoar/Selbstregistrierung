import { Adresstyp } from 'app/entities/enumerations/adresstyp.model';

import { IAdresse, NewAdresse } from './adresse.model';

export const sampleWithRequiredData: IAdresse = {
  id: 36217,
};

export const sampleWithPartialData: IAdresse = {
  id: 16772,
  strasseUndNummer: 'navigating Buckinghamshire',
  adresszusatz: 'Business-focused Analyst',
  telefonFix: 'compress',
};

export const sampleWithFullData: IAdresse = {
  id: 27611,
  strasseUndNummer: 'Chips generate',
  adresszusatz: 'Peso Concrete programming',
  postfach: 'Solutions Ouguiya Forward',
  telefonFix: 'Integration Agent',
  telefonGeschaeft: 'circuit',
  fax: 'Global Tunisian Developer',
  adresstyp: Adresstyp['Domizil'],
};

export const sampleWithNewData: NewAdresse = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
