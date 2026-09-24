import { MaterialModel } from '../../material/model/Material';
import { UserPseudoModel } from '../../user/model/user-pseudo';
import { State } from '../enum/state';

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
