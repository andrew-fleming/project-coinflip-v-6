import React, { useState } from 'react';
import styled from 'styled-components'
import backgroundImage from './assets/backgroundImage.jpg'
import Main from './components/Main'

import { UserProvider } from './context/UserContext'
import { ContractProvider } from './context/ContractContext'

const Img = styled.div`
  border: 1px solid #000;
  background-image: url(${backgroundImage});
  background-repeat: repeat-y;
  width: 99.8%;
  height: 665px;
`;


function App() {

  //user state
  const [userAddress, setUserAddress] = useState('');
  const [userBalance, setUserBalance] = useState('');
  const [winningsBalance, setWinningsBalance] = useState('');

  const userState = {
    userAddress, 
    setUserAddress, 
    userBalance, 
    setUserBalance, 
    winningsBalance, 
    setWinningsBalance,
  }

  //contract state
  const [contractBalance, setContractBalance] = useState('');
  const [owner, setOwner] = useState('');
  const [isOwner, setIsOwner] = useState(false);
  const [sentQueryId, setSentQueryId] = useState('');
  const [awaitingCallbackResponse, setAwaitingCallbackResponse] = useState('');
  const [awaitingWithdrawal, setAwaitingWithdrawal] = useState('');

  const contractState = {
    contractBalance,
    setContractBalance,
    owner,
    setOwner, 
    isOwner,
    setIsOwner,
    sentQueryId,
    setSentQueryId,
    awaitingCallbackResponse,
    setAwaitingCallbackResponse,
    awaitingWithdrawal,
    setAwaitingWithdrawal,
  }

  

  return (
    <Img>
      <UserProvider value={userState}>
        <ContractProvider value={contractState}>
          <Main />
        </ContractProvider>
      </UserProvider>
    </Img>
  );
}

export default App;
