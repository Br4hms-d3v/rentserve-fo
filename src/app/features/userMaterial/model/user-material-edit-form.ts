import { State } from '../enum/state';

export interface UserMaterialEditForm {
  materialId: number;
  descriptionMaterial: string;
  priceHourMaterial: number;
  isAvailable: boolean;
  state: State;
}
