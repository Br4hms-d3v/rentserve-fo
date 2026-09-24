import { MaterialModel } from '../../material/model/Material';
import { State } from '../enum/state';

export interface UserMaterialEditForm {
  material: MaterialModel;
  descriptionMaterial: string;
  priceHourMaterial: number;
  isAvailable: boolean;
  state: State;
}
