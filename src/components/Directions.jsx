import React, { useState } from 'react'
import styled from 'styled-components'


const DirectionsButton = styled.button`
    text-shadow: .6px .6px pink;
    width: 8rem;
    height: 3rem;
    border-radius: 1rem;
    margin-bottom: 1rem;
    background-color: #333333;
    color: white;
    font-size: 1.1rem;
    outline: none;
    cursor: pointer;
`;

const Ul = styled.ul`
    margin: auto;
    margin-left: 3.5rem;
`;

const Li = styled.li`
    margin-top: 1.3rem;
`;

export default function Directions() {

    const [visible, setVisible] = useState(false);

     //toggle directions on/off
     const hideDirections = () => {
        setVisible(!visible)
    }


    const metamaskLink = <a href="metamask.io" >MetaMask</a>
    const etherFaucet = <a href="faucet.metamask.io">Ether Faucet</a>

    const directions = visible ? 
    <> 
        <Li>Install {metamaskLink} Browser Extension</Li>
        <Li>Select Ropsten Network</Li>
        <Li>Go to the {etherFaucet} and request ETH</Li>
        <Li>Place your wager in our dApp</Li>
        <Li>Select Heads or Tails</Li>
        <Li>Wait for confirmations</Li>
        <Li>Withdraw your millions!</Li>
    </> : null;


    return (
            <Ul>
                <DirectionsButton onClick={hideDirections} >
                    Directions
                </DirectionsButton>
                { directions }
            </Ul>
        )
}