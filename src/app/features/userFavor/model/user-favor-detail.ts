import { FavorModel } from '../../favor/model/favor';
import { UserPseudoModel } from '../../user/model/user-pseudo';

export interface UserFavorDetailModel {
  id: number;
  descriptionFavor: string;
  priceHourFavor: number;
  isAvailable: boolean;
  pictures: string;
  user: UserPseudoModel;
  favor: FavorModel;
}
