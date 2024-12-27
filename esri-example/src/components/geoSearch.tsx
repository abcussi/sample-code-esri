/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/EsriMapWithSearch.tsx

import React, { useEffect, useRef } from 'react';
import { loadModules } from 'esri-loader';

const EsriMapWithSearch: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let view: __esri.MapView;

    const initializeMap = async () => {
      try {
        const [
          ArcGISMap,
          MapView,
          Search,
          Expand
        ] = await loadModules(
          [
            'esri/Map',
            'esri/views/MapView',
            'esri/widgets/Search',
            'esri/widgets/Expand'      // Importamos Expand
          ],
          { url: 'https://js.arcgis.com/4.27/' }
        );

        // 1. Crear el mapa
        const map = new ArcGISMap({
          basemap: 'streets-navigation-vector'
        });

        // 2. Crear la vista
        view = new MapView({
          container: mapRef.current as HTMLDivElement,
          map: map,
          center: [-99.13, 19.43],
          zoom: 5
        });

        // 3. Esperar a que la vista se cargue
        await view.when();

        // 4. Crear el widget de búsqueda
        const searchWidget = new Search({
          view,
          allPlaceholder: 'Buscar ubicación...',
          includeDefaultSources: true
        });

        // 5. Envolver el widget de búsqueda con Expand
        const searchExpand = new Expand({
          view,
          content: searchWidget,
          expandIconClass: 'esri-icon-search', // Ícono de búsqueda
          expanded: false                      // Puedes cambiarlo a true para expandirlo por defecto
        });

        // 6. Agregar el Expand al UI de la vista
        view.ui.add(searchExpand, 'top-right');
        view.on('click', (event: __esri.ViewClickEvent) => {
          view?.hitTest(event).then((hitResult: __esri.HitTestResult) => {
            const results = hitResult.results;
        
            if (results.length > 0) {
              results.forEach((graphicHit: any) => {
                if (graphicHit.graphic) {
                  const { layer, attributes } = graphicHit.graphic;
                  console.log('Capa:', (layer as __esri.FeatureLayer).title);
                  console.log('Atributos:', attributes);
                }
              });
            } else {
              console.log('No se intersectó ninguna entidad en este punto.');
            }
          });
        });
      } catch (error) {
        console.error('Error al inicializar el mapa o widgets:', error);
      }
    };

    initializeMap();

    return () => {
      if (view) {
        view.destroy();
      }
    };
  }, []);

  return (
    <div
      ref={mapRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative', // La vista ArcGIS ya lo maneja internamente
        overflow: 'hidden'
      }}
    />
  );
};

export default EsriMapWithSearch;
