import Container from './elements/fabric/container';

const PageBuilderRoot = () => {
  const id = 'root';

  return <Container path={id} uid={id}></Container>;
};

export default PageBuilderRoot;
