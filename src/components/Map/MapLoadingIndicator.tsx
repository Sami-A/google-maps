import styled from "@emotion/styled";

import Spinner from "@/armor/Spinner";

const LoadingIndicator = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
`;

const MapLoadingIndicator: React.FC = () => (
  <LoadingIndicator>
    <Spinner />
    <h4>Loading map...</h4>
  </LoadingIndicator>
);

export default MapLoadingIndicator;
