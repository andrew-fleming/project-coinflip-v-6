import React, { useState, useEffect } from 'react'
import styled, { keyframes } from 'styled-components'
import { bounce } from 'react-animations'

const bounceAnimation = keyframes`${bounce}`;

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
    animation-duration: 1.5s;
    animation-name: ${props => (props.isActive ? bounceAnimation : '')};
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
    const [isActive, setIsActive] = useState(false);

     //toggle directions on/off
     
    const hideDirections = () => {
        if(visible === true){
            setVisible(!visible)
        } else {
        const timeout = setTimeout(() => {
            setVisible(!visible)
            }, 1400)
        }
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
                <DirectionsButton 
                    isActive={isActive}
                    onClick={(event) => {
                    setIsActive(!isActive)
                    hideDirections()
                }}>
                    Directions
                </DirectionsButton>
                { directions }
            </Ul>
        )
}