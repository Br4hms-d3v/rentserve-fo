import { UserPseudoModel } from '../../user/model/user-pseudo';
import { State } from '../enum/state';
import { MaterialModel } from '../../material/model/Material';

export interface UserMaterialDetailModel {
  id: number;
  descriptionMaterial: string;
  priceHourMaterial: number;
  isAvailable: boolean;
  pictures: string;
  user: UserPseudoModel;
  material: MaterialModel;
  state: State;
}
