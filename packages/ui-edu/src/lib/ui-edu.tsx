import styled from 'styled-components';

/* eslint-disable-next-line */
export interface UiEduProps {}

const StyledUiEdu = styled.div`
  color: pink;
`;

export function UiEdu(props: UiEduProps) {
  return (
    <StyledUiEdu>
      <h1>Welcome to UiEdu!</h1>
    </StyledUiEdu>
  );
}

export default UiEdu;
