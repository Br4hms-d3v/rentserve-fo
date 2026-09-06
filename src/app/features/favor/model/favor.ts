export interface FavorModel {
  id: number;
  nameFavor: string;
}

export interface FavorResponse {
  _embedded: {
    favorDTOList: FavorModel[];
  };
}
