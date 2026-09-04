export interface MaterialModel {
  id: number;
  nameMaterial: string;
}

export interface MaterialResponse {
  _embedded: {
    materialDTOList: MaterialModel[];
  };
}
