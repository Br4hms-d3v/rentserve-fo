export interface UserMaterialModel {
  id: number;
  nameMaterial: {
    nameMaterial: string;
  };
  priceHourMaterial: number;
  isAvailable: boolean;
  picture: string;
}

export interface UserMaterialResponse {
  _embedded: {
    userMaterialDTOList: UserMaterialModel[];
  };
}
