export interface Boundary {
  search: string;
  polygonStyle: PolygonStyle;
  option: Option;
}

interface PolygonStyle {
  fillColor: string;
  strokeColor: string;
  strokeThickness: number;
}

interface Option {
  entityType: string;
}
