import { useContext } from 'react';
import Container from './elements/fabric/container';
import { PageBuilderContext } from './page-builder-context';

const PageBuilderRoot = () => {
  const id = 'root';
 
  const {setActiveElementId} = useContext(PageBuilderContext);

  return  <Container path={id} uid={id} >
       <button onClick={()=>setActiveElementId({path : prompt("element id ?")! , uid:""})}>set Active Element</button>
  </Container>
};

export default PageBuilderRoot;
