/**
 * Custome Google Map.
 * No dependency has been used.
 *
 * Features
 * ***********
 * [/] Load fullscreen map
 * [/] Set initi map center to times square new york
 * [/] Toggle map view between Satellite and Map
 * [/] Keep red pin maker center when map center changes(stop centering on blue dot marker)
 * [/] Get user's permission to access current location
 * [/] Get curent location and set to a new center
 * [/] Show error alert for diffrent error codes
 * [/] Add Blue dote marker on the new location
 * [/] Draw circle around the new center to indicate accuracy based on accuracy value of the user's location
 * [/] Watch user's location change and update marker position accordingly
 * [/] Monitor accuracy and update the circle radius
 *
 *   -------Note-------
 *   - When user moves and there position is updated, the circle around the marker
 *     might not be visible because I set the zoom level far way.
 *   - If accuracy level is very higth and zoomed-in very close,
 *     the circle radius might cover the whole screen.
 *   - Zoom-in closer to the marker & you shall see the circle.
 */

import React from "react";

import useLoadMap from "@/hooks/useLoadMap";
import useCurrentLocation from "@/hooks/useCurrentLocation";

import MapLoadingIndicator from "./MapLoadingIndicator";
import MapTypeToggler from "./MapTypeToggler";

import { MapType } from "./type";
import { mapConfig } from "./config";

import RoundButton from "@/armor/RoundButton";
import Spinner from "@/armor/Spinner";

import { CrosshairIcon } from "@/svg/icons";

export default function Map(): ReturnType<React.FC> {
  const [map, setMap] = React.useState<google.maps.Map>();
  const [marker, setMarker] = React.useState<google.maps.Marker>();
  const [circle, setCircle] = React.useState<google.maps.Circle>();

  const mapRef = React.useRef<HTMLDivElement>(null);

  const { requestLocation, currentLocation, locating } = useCurrentLocation();

  const centerChangedTimeout = React.useRef<number>();
  const listenToMapCenterChanged = React.useCallback(() => {
    if (!map || !marker) return;

    // debouncing...
    clearTimeout(centerChangedTimeout.current);
    centerChangedTimeout.current = window.setTimeout(() => {
      marker.setPosition(map.getCenter());
      clearTimeout(centerChangedTimeout.current);
    }, 100);
  }, [map, marker]);

  React.useEffect(() => {
    if (!map || currentLocation) return; // we don't want to track "center_changed" on user's location

    const onMapChange = google.maps.event.addListener(
      map,
      "center_changed",
      listenToMapCenterChanged
    );

    return () => {
      /** --Note--
       * - This clean-up function will run when currentLocation state is updated
       * even though the component is not unmounting.
       * - This behavior is intentional, because we want to
       * remove the "center_changed" event listener when currentLocation state is updated
       * since we don't want to keep centering on the blue dot marker.
       * - After this, the useEffect will be useless as the first line condition
       * finds currentLocation is not empty and returns.
       **/
      google.maps.event.removeListener(onMapChange);
    };
  }, [map, currentLocation, listenToMapCenterChanged]);

  const addMarker = React.useCallback(
    (location) => {
      if (!window.google || !map || !marker || !location) return; // map might not be ready yet

      marker.setMap(map);
      marker.setPosition(location.position);
      marker.setIcon({
        ...mapConfig.icon,
        path: google && google.maps.SymbolPath.CIRCLE // the blue dote icon, as requested :)
      });

      circle?.setMap(map);
      circle?.setRadius(location.accuracy); // if you zoom in/out, the radius coverage will get smaller/larger accordingly
      circle?.setCenter(location.position);

      map.setCenter(location.position);
    },
    [map, marker, circle]
  );

  React.useEffect(() => {
    addMarker(currentLocation);
  }, [currentLocation, addMarker]); // currentLocation gets updated if user moves and the marker will move to the new location

  const getCurrentLocation = () => {
    /**
     *  This triggers the above useEffct function on "currentLocation" change,
     *  which in turn changes to the user's location, update marker icon, and show accuracy level by drawing circle around it.
     **/
    requestLocation();
  };

  const changeMapType = () => {
    if (!map) return;

    if (map.getMapTypeId() === MapType.roadmap)
      map.setMapTypeId(MapType.satelite);
    else map.setMapTypeId(MapType.roadmap);
  };

  const initializeMap = () => {
    if (!mapRef.current) return;
    const newMap = new google.maps.Map(mapRef.current, {
      ...mapConfig.map,
      center: mapConfig.defaultCenter,
      mapTypeId: MapType.roadmap
    });

    newMap.setCenter(mapConfig.defaultCenter);

    /**
     * We can add click event on the MArker and show more information
     * about the location. However, the API_KEY is not enabled to get Geocoding service.
     * */
    const newMarker = new google.maps.Marker({
      map: newMap,
      position: mapConfig.defaultCenter,
      animation: google.maps.Animation.DROP
    });

    /**
     * - Initially the Circle() Object will be invisible.
     * - since we are not yet tell it where to put the circle.
     * - however, when we accept user's location, the cicrcle will appear.
     * - We declared it here to prevent creating mutiple circles. They tend to stack up on top of one another and the color gets bolder & bolder
     * - All we need to do is, give the address of the
     * map and the position inside the map(checkout addMarker() function).
     */
    const newCircle = new google.maps.Circle(mapConfig.circle);

    setMap(newMap);
    setMarker(newMarker);
    setCircle(newCircle);
  };

  const isMapLoading = useLoadMap(initializeMap); // loads the map script in to the app head tag

  return (
    <>
      {/**  This is where the map view gets rendered **/}
      <div ref={mapRef} style={{ height: "100vh" }}></div>

      {isMapLoading ? (
        <MapLoadingIndicator />
      ) : (
        map && (
          <>
            <MapTypeToggler
              mapTypeId={
                !map ? MapType.roadmap : (map.getMapTypeId() as MapType)
              }
              onChange={changeMapType}
            />
            <RoundButton onClick={getCurrentLocation}>
              {locating ? <Spinner /> : <CrosshairIcon size={24} />}
            </RoundButton>
          </>
        )
      )}
    </>
  );
}
