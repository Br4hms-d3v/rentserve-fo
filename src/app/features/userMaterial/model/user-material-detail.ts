import { MaterialModel } from '../../material/model/Material';
import { UserPseudoModel } from '../../user/model/user-pseudo';

export interface UserMaterialDetailModel {
  id: number;
  descriptionMaterial: string;
  priceHourMaterial: bigint;
  isAvailable: boolean;
  pictures: string;
  user: UserPseudoModel;
  material: MaterialModel;
  state: string;
}
