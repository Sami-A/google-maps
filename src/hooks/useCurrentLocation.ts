import React from "react";

type Coordinates = {
  position: { lat: number; lng: number };
  accuracy: number;
};

const useCurrentLocation = (): {
  requestLocation: () => void;
  locating: boolean;
  currentLocation: Coordinates | null;
} => {
  const [
    currentLocation,
    setCurrentLocation
  ] = React.useState<Coordinates | null>(null);

  const [locating, setLocating] = React.useState<boolean>(false);

  const watchId = React.useRef<number | null>(null);

  const saveCurrentLocation = (position: GeolocationPosition) => {
    //console.log("Position:", position);
    const coords = {
      position: {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      },
      accuracy: position.coords.accuracy
    };
    setLocating(false);
    setCurrentLocation(coords);
  };

  const onError = ({ code }: GeolocationPositionError) => {
    setLocating(false);
    if (code === GeolocationPositionError.PERMISSION_DENIED)
      alert("Geolocation has been denied.");
    else if (code === GeolocationPositionError.TIMEOUT)
      alert("Geolocation timeout");
    else if (code === GeolocationPositionError.POSITION_UNAVAILABLE)
      alert("You position is not available.");
    else alert("Unknown error has occurred.");
  };

  const requestLocation = () => {
    if (navigator.geolocation) {
      setLocating(true);
      watchId.current = navigator.geolocation.watchPosition(
        saveCurrentLocation,
        onError,
        { maximumAge: 1800000, enableHighAccuracy: true }
        /** Note: HighAccuracy takes a bit longger according to the API reference */
      );

      /**
       * - if the user doesn't take action,-
       * it removes the progress indicator that is being shown after a few second.
       * - Although, the listener will wait for thr user's action in the background.
       */
      const timeoutId = setTimeout(() => {
        setLocating(false);
        clearTimeout(timeoutId);
      }, 12000);
    } else alert("Geolocation is not supported on your browser.");
  };

  React.useEffect(() => {
    return () => {
      if (watchId.current) navigator.geolocation.clearWatch(watchId.current);
    };
  }, []);

  return { requestLocation, locating, currentLocation };
};

export default useCurrentLocation;
