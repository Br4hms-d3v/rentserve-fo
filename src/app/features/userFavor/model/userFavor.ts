export interface UserFavorModel {
  id: number;
  nameFavor: {
    nameFavor: string;
  };
  priceHourFavor: number;
  isAvailable: boolean;
  picture: string;
}

export interface UserFavorResponse {
  _embedded: {
    userFavorDTOList: UserFavorModel[];
  };
}
