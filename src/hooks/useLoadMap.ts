import React from "react";

const API_KEY = import.meta.env.VITE__GOOGLE_MAP_API_KEY;

const useLoadMap = (initializeMap: () => void) => {
  const [loadingMap, setLoadingMap] = React.useState<boolean>(true);

  const renderCount = React.useRef(0);

  React.useEffect(() => {
    //This will prevent from loading the google map script more than once
    if (renderCount.current > 0) return;
    renderCount.current = 1;

    const googleMapScript = document.createElement("script");

    googleMapScript.src = `https://maps.google.com/maps/api/js?key=${API_KEY}`;
    googleMapScript.type = "text/javascript";
    googleMapScript.defer = true;

    document.getElementsByTagName("head")[0].appendChild(googleMapScript);

    googleMapScript.addEventListener(
      "load", // no need to cleanup. This happenes only once
      () => {
        initializeMap();
        setLoadingMap(false);
      },
      { once: true }
    );
  }, [initializeMap]);

  return loadingMap;
};

export default useLoadMap;
