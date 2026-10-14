import { UserPseudoModel } from '../../user/model/user-pseudo';

export interface ReviewUserMaterialModel {
  id: number;
  comment: string;
  rating: number;
  user: {
    id: number;
    pseudo: UserPseudoModel;
  };
  createdAt: Date;
}

export interface ReviewUserMaterialResponse {
  _embedded: {
    reviewUserMaterialDTOList: ReviewUserMaterialModel[];
  };
}
