import { State } from '../enum/state';

export interface UserMaterialCreateForm {
  materialId: number;
  materialName: string;
  descriptionMaterial: string;
  priceHourMaterial: number;
  isAvailable: boolean;
  state: State;
}
