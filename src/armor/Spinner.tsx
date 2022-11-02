import styled from "@emotion/styled";

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 5px solid;
  border-color: #dbdcef;
  border-right-color: #000000;
  animation: spin 1s infinite linear;

  @keyframes spin {
    to {
      transform: rotate(1turn);
    }
  }
`;

export default () => <Spinner />;
