import { IStammdaten } from 'app/entities/stammdaten/stammdaten.model';

export interface IZDP {
  id: number;
  zdpNummer?: number | null;
  stammdaten?: Pick<IStammdaten, 'id'> | null;
}

export type NewZDP = Omit<IZDP, 'id'> & { id: null };
