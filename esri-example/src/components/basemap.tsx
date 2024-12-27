import React, { useEffect, useRef } from "react";
import MapView from "@arcgis/core/views/MapView";
import WebMap from "@arcgis/core/WebMap";

const BasicMap = () => {
  const mapDiv = useRef(null);

  useEffect(() => {
    if (mapDiv.current) {
      const webmap = new WebMap({
        basemap: "streets-vector",
      });
  
      const view = new MapView({
        container: mapDiv.current,
        map: webmap,
        center: [-117.1611, 32.7157],
        zoom: 12,
      });
  
      view.when()
        .then(() => console.log("Map loaded"))
        .catch((err) => {
          if (err.name === "AbortError") {
            console.log("Map loading aborted");
          } else {
            console.error(err);
          }
        });
  
      return () => view.destroy();
    }
  }, []);
  

  return <div ref={mapDiv} style={{ height: "100vh", width: "100%" }}></div>;
};

export default BasicMap;
