/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef, useEffect } from 'react';
import { loadModules } from 'esri-loader';

const ArcGISMap: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let view: __esri.MapView | null = null;

    // URL de tu servicio web (desde ArcGIS Pro)
    const serviceUrl = 'https://mi-servidor.com/arcgis/rest/services/MiCapa/FeatureServer/0';

    loadModules([
      'esri/Map',
      'esri/views/MapView',
      'esri/layers/FeatureLayer'
    ], {
      url: 'https://js.arcgis.com/4.27/' 
    })
      .then(([ArcGISMap, MapView, FeatureLayer]: any) => {
        const map = new ArcGISMap({
          basemap: 'streets-navigation-vector'
        });

        const myFeatureLayer = new FeatureLayer({
          url: serviceUrl,
        });

        map.add(myFeatureLayer);

        view = new MapView({
          container: mapRef.current as HTMLDivElement,
          map: map,
          center: [-99.13, 19.43], 
          zoom: 5
        });
      })
      .catch((err) => {
        console.error('Error al cargar módulos de ArcGIS:', err);
      });

    // Limpieza al desmontar
    return () => {
      if (view) {
        view.destroy();
      }
    };
  }, []);

  return <div ref={mapRef} style={{ width: '100%', height: '100%' }} />;
};

export default ArcGISMap;
