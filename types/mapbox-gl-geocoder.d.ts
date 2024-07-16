import { IControl } from "mapbox-gl";

declare module "@mapbox/mapbox-gl-geocoder" {
  export default class MapboxGeocoder implements IControl {
    constructor(options: any);
    onAdd(map: mapboxgl.Map): HTMLElement;
    onRemove(): void;
  }
}
