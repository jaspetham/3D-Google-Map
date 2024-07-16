"use client";
import React, { useEffect, useRef } from "react";
import "./Map.css";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";

const MapComponent: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mapboxgl.accessToken =
      "pk.eyJ1IjoiamFzcGVydGhhbSIsImEiOiJjbHYwcDhwZjQxcG0yMmtud3g2cHpvM2NtIn0.Cy3ojohXpZUf4juJpIja9w";

    if (mapContainer.current) {
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/jaspertham/clv0psonj007f01qr0swl74u8",
        center: [101.6774, 3.1176],
        antialias: true,
        zoom: 15.5,
        pitch: 45,
        bearing: -17.6,
      });

      // Add zoom controls
      map.addControl(new mapboxgl.NavigationControl(), "top-left");

      const geocoder = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl,
        types: "address,poi",
        proximity: [101.6774, 3.1176], // Optional: Bias search results to a specific location
        marker: true, // Optional: Show a marker for the selected result
      });

      map.addControl(geocoder as unknown as mapboxgl.IControl);

      map.on("load", () => {
        const style = map.getStyle();
        if (style && style.layers) {
          const layers = style.layers;
          const labelLayerId = layers.find(
            (layer: any) =>
              layer.type === "symbol" && layer.layout["text-field"]
          )?.id;

          if (labelLayerId) {
            map.addLayer(
              {
                id: "add-3d-buildings",
                source: "composite",
                "source-layer": "building",
                filter: ["==", "extrude", "true"],
                type: "fill-extrusion",
                minzoom: 15,
                paint: {
                  "fill-extrusion-color": "#aaa",
                  "fill-extrusion-height": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    15,
                    0,
                    15.05,
                    ["get", "height"],
                  ],
                  "fill-extrusion-base": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    15,
                    0,
                    15.05,
                    ["get", "min_height"],
                  ],
                  "fill-extrusion-opacity": 0.6,
                },
              },
              labelLayerId
            );
          }
        }
      });

      return () => map.remove();
    }
  }, []);

  return (
    <div
      ref={mapContainer}
      style={{ position: "absolute", top: 0, bottom: 0, width: "100%" }}
    />
  );
};

export default MapComponent;
