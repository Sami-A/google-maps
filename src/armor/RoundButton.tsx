import styled from "@emotion/styled";

const RoundButtonContainer = styled.div`
  background: #fff;
  height: 3rem;
  width: 3rem;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  z-index: 2;
  bottom: 5rem;
  right: 1rem;
  cursor: pointer;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
  transition: 0.3s ease-in-out;
  transition-property: background, box-shadow;

  &:hover {
    background: #e4e4e4;
    box-shadow: rgba(50, 50, 93, 0.25) 0px 6px 12px -2px,
      rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;
  }
`;

type Props = {
  onClick: () => void;
  children?: React.ReactNode;
};

const RoundButton = ({ onClick, children }: Props) => (
  <RoundButtonContainer onClick={onClick}>{children}</RoundButtonContainer>
);

export default RoundButton;
