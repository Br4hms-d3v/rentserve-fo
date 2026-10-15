import { UserMaterialModel } from '../../userMaterial/model/userMaterial';
import { UserFavorModel } from '../../userFavor/model/userFavor';

export interface RentalCreateForm {
  dateStart: string;
  dateEnd: string;
  startTime: string;
  endTime: string;
  userMaterial: { id: number | null };
  userFavor: { id: number | null };
}
