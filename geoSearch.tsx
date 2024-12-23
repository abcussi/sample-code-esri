// src/components/EsriMapWithSearch.tsx

import React, { useEffect, useRef } from 'react';
import { loadModules } from 'esri-loader';

const EsriMapWithSearch: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let view: __esri.MapView | null = null;

    loadModules(
      [
        'esri/Map',
        'esri/views/MapView',
        'esri/widgets/Search',
        'esri/geometry/Extent'
      ],
      {
        url: 'https://js.arcgis.com/4.27/'
      }
    )
      .then(([ArcGISMap, MapView, Search, Extent]: any) => {
        const map = new ArcGISMap({
          basemap: 'streets-navigation-vector'
        });

        view = new MapView({
          container: mapRef.current as HTMLDivElement,
          map: map,
          center: [-99.13, 19.43],
          zoom: 5
        });

        const searchExtent = new Extent({
          xmin: -105,
          ymin: 19,
          xmax: -98,
          ymax: 21,
          spatialReference: { wkid: 4326 }
        });

        const searchWidget = new Search({
          view: view,
          allPlaceholder: 'Buscar ubicación...',
          includeDefaultSources: false,
          sources: [
            {
              locator: {
                url: 'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer'
              },
              singleLineFieldName: 'SingleLine',
              placeholder: 'Ejemplo: Ciudad de México',
              outFields: ['Addr_type'],
              searchExtent: searchExtent
            }
          ]
        });

        view.ui.add(searchWidget, 'top-right');
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

  return <div ref={mapRef} style={{ width: '100%', height: '100%' }} />;
};

export default EsriMapWithSearch;
