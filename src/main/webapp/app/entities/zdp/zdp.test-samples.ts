import { IZDP, NewZDP } from './zdp.model';

export const sampleWithRequiredData: IZDP = {
  id: 25645,
};

export const sampleWithPartialData: IZDP = {
  id: 19898,
};

export const sampleWithFullData: IZDP = {
  id: 69628,
  zdpNummer: 50057,
};

export const sampleWithNewData: NewZDP = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
