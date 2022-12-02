import { Anrede } from 'app/entities/enumerations/anrede.model';

export interface IStammdaten {
  id: number;
  anrede?: Anrede | null;
  nachname?: string | null;
  vorname?: string | null;
  eMail?: string | null;
  telefonMobile?: string | null;
}

export type NewStammdaten = Omit<IStammdaten, 'id'> & { id: null };
