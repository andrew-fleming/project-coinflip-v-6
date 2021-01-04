import React, { useState } from 'react'
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

const Clickable = styled.span`
    color: blue;
    :hover {
        cursor: pointer;
        color: pink;
    }
`;


export default function Directions() {

    const [visible, setVisible] = useState(false);
    const [isActive, setIsActive] = useState(false);

    /**
     * The following functions redirect the user to both MetaMask.io and a Ropsten Ether faucet
     * respectively.
     * 
     * @param {*event} The event parameter is included so the DOM doesn't rerender upon the onClick event.
     */


    const handleMetamask = (e) => {
        e.preventDefault()
        window.open(window.location.replace('https://metamask.io'))
    }

    const handleFaucet = (e) => {
        e.preventDefault()
        window.open(window.location.replace('https://faucet.dimensions.network/'))
    }

     //toggle directions on/off
    const hideDirections = () => {
        if(visible === true){
            setVisible(!visible)
        } else {
        setTimeout(() => {
            setVisible(!visible)
            }, 1400)
        }
    }

    const directions = visible ? 
    <> 
        <Li>Install <Clickable onClick={ handleMetamask } >MetaMask</Clickable> Browser Extension</Li>
        <Li>Select Ropsten Network</Li>
        <Li>Go to an <Clickable onClick={ handleFaucet } >Ether faucet</Clickable> and request ETH</Li>
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