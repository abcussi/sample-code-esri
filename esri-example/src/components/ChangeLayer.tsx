
// src/components/MapWithToggle.tsx
import React, { useEffect, useRef, useState, ChangeEvent } from 'react';
import { loadModules } from 'esri-loader';

const MapWithToggle: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [streamsLayer, setStreamsLayer] = useState<__esri.FeatureLayer | null>(null);
  const [visible, setVisible] = useState<boolean>(true);

  useEffect(() => {
    let view: __esri.MapView | null = null;

    loadModules([
      'esri/Map',
      'esri/views/MapView',
      'esri/layers/FeatureLayer'
    ], { 
      url: 'https://js.arcgis.com/4.27/' 
    })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then(([ArcGISMap, MapView, FeatureLayer]: any) => {
        const map = new ArcGISMap({
          basemap: 'streets-navigation-vector'
        });

        view = new MapView({
          container: mapRef.current as HTMLDivElement,
          map,
          center: [-99.13, 19.43],
          zoom: 5
        });

        const layer = new FeatureLayer({
          // Reemplaza con la URL de tu servicio o parámetros de tu "streams"
          url: 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer/2',
          title: 'Streams',
          visible: visible
        });

        map.add(layer);
        setStreamsLayer(layer);
      })
      .catch((err) => console.error(err));

    return () => {
      if (view) {
        view.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (streamsLayer) {
      streamsLayer.visible = visible;
    }
  }, [visible, streamsLayer]);

  const handleToggle = (event: ChangeEvent<HTMLInputElement>) => {
    setVisible(event.target.checked);
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <div style={{
        position: 'absolute',
        zIndex: 10,
        background: '#fff',
        padding: '6px',
        borderRadius: '4px',
        top: '10px',
        left: '10px'
      }}>
        <label>
          <input
            type="checkbox"
            checked={visible}
            onChange={handleToggle}
          />
          Mostrar Streams
        </label>
      </div>
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

export default MapWithToggle;
