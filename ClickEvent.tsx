import React, { useRef, useEffect } from 'react';
import { loadModules } from 'esri-loader';

const MapWithHitTest: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let view: __esri.MapView | null = null;

    loadModules(
      [
        'esri/Map',
        'esri/views/MapView',
        'esri/layers/FeatureLayer'
      ],
      { url: 'https://js.arcgis.com/4.27/' }
    )
      .then(([ArcGISMap, MapView, FeatureLayer]: any) => {
        const map = new ArcGISMap({
          basemap: 'streets-navigation-vector'
        });

        const layer1 = new FeatureLayer({
          url: 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer/2',
          title: 'Layer 1'
        });

        const layer2 = new FeatureLayer({
          url: 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer/3',
          title: 'Layer 2'
        });

        map.addMany([layer1, layer2]);

        view = new MapView({
          container: mapRef.current as HTMLDivElement,
          map,
          center: [-99.13, 19.43],
          zoom: 5
        });

        view.on('click', (event: __esri.MapViewClickEvent) => {
          view?.hitTest(event).then((response) => {
            const results = response.results;

            if (results.length > 0) {
              results.forEach((result: __esri.HitTestResult) => {
                if (result.graphic) {
                  const { layer, attributes } = result.graphic as __esri.Graphic;
                  console.log('Capa:', (layer as __esri.FeatureLayer).title);
                  console.log('Atributos:', attributes);
                }
              });
            } else {
              console.log('No se intersectó ninguna entidad en este punto.');
            }
          });
        });
      })
      .catch((err) => {
        console.error('Error al cargar módulos de ArcGIS:', err);
      });

    return () => {
      if (view) {
        view.destroy();
      }
    };
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

export default MapWithHitTest;
