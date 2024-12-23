import React, { useEffect, useRef } from 'react';
import { loadModules } from 'esri-loader';

interface MapViewProps {
  accessToken: string;
}

const MapViewComponent: React.FC<MapViewProps> = ({ accessToken }) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let view: __esri.MapView | null = null;
    const options = {
      url: 'https://js.arcgis.com/4.27/',
      css: true
    };

    loadModules(['esri/Map', 'esri/views/MapView', 'esri/layers/TileLayer'], options)
      .then(([ArcGISMap, MapView, TileLayer]: any) => {
        const mapboxTileLayer = new TileLayer({
          urlTemplate: `https://api.mapbox.com/styles/v1/milehighfd/clrbkarok006k01qrefrxgp51/tiles/512/{z}/{x}/{y}@2x?access_token=${accessToken}`
        });

        const map = new ArcGISMap({
          basemap: {
            baseLayers: [mapboxTileLayer]
          }
        });

        view = new MapView({
          container: mapRef.current as HTMLDivElement,
          map,
          center: [-105.0, 39.5],
          zoom: 10
        });
      })
      .catch((err) => {
        console.error('Error:', err);
      });

    return () => {
      if (view) {
        view.destroy();
      }
    };
  }, [accessToken]);

  return <div ref={mapRef} style={{ width: '100%', height: '100%' }} />;
};

export default MapViewComponent;
