import { IZDP } from 'app/entities/zdp/zdp.model';
import { Adresstyp } from 'app/entities/enumerations/adresstyp.model';

export interface IAdresse {
  id: number;
  strasseUndNummer?: string | null;
  adresszusatz?: string | null;
  postfach?: string | null;
  telefonFix?: string | null;
  telefonGeschaeft?: string | null;
  fax?: string | null;
  adresstyp?: Adresstyp | null;
  zdp?: Pick<IZDP, 'id'> | null;
}

export type NewAdresse = Omit<IAdresse, 'id'> & { id: null };
