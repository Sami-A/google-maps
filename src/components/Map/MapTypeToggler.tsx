import React from "react";
import styled from "@emotion/styled";

import { MapType } from "./type";

import { MapIcon, LandIcon } from "@/svg/icons";

const MapTypeTogglerContainer = styled.div`
  background: #fff;
  padding: 0.7rem 1rem;
  position: absolute;
  z-index: 2;
  top: 1rem;
  right: 1rem;
  border-radius: 0.3rem;
  cursor: pointer;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
  transition: 0.3s ease-in-out;
  transition-property: background, box-shadow;

  &:hover {
    background: #e4e4e4;
    box-shadow: rgba(50, 50, 93, 0.25) 0px 6px 12px -2px,
      rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;
  }

  & > span {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

type MapTypeProps = {
  mapTypeId: MapType;
  onChange: Function;
};

const MapTypeToggler: React.FC<MapTypeProps> = ({ mapTypeId, onChange }) => {
  const [mapType, setMapType] = React.useState<MapType>(mapTypeId);

  const toggleMapType = () => {
    if (mapType === MapType.roadmap) {
      onChange(MapType.satelite);
      setMapType(MapType.satelite);
    } else {
      onChange(MapType.roadmap);
      setMapType(MapType.roadmap);
    }
  };

  return (
    <MapTypeTogglerContainer onClick={toggleMapType}>
      {mapType === MapType.roadmap ? (
        <span>
          <LandIcon /> Satellite
        </span>
      ) : (
        <span>
          <MapIcon /> Map
        </span>
      )}
    </MapTypeTogglerContainer>
  );
};

export default MapTypeToggler;
