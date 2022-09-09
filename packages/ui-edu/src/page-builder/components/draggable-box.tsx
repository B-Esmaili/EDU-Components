import { Box } from "grommet";
import styled from "styled-components";

export const DraggableBox = styled(Box)<{
  transform?: string;
  transition?: string;
}>`
  ${({ transform }) => transform && `transform:${transform};`}
  ${({ transition }) => transition && `transition:${transition};`}
  position:relative;  
`;
