import React from 'react';
import styled from 'styled-components'
import backgroundImage from './backgroundImage.jpg'
import Main from './components/Main'

const Img = styled.div`
  border: 1px solid #000;
  background-image: url(${backgroundImage});
  background-repeat: repeat-y;
  width: 99.8%;
  height: 665px;
`;

function App() {
  return (
    <Img>
      <Main />
    </Img>
  );
}

export default App;
