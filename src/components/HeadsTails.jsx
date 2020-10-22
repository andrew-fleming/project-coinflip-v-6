import React from 'react'
import styled from 'styled-components'
import ethLogo from '../assets/ethLogo.png'


const Circle = styled.div`
    position: relative;
    top: 2rem;
    border: 1px solid pink;
    border-radius: 1rem;
    width 23rem;
    height: 10.8rem;
    margin: auto;
`;

const Text = styled.div`
    color: white;
    font-size: 1rem;
    display: flex;
    justify-content: space-around;
    margin-top: .5rem;
    margin-left: 1rem;
    margin-right: 1.8rem;
`;

const CoinAlign = styled.div`
    display: flex;
    justify-content: space-around;
    `;

const HeadsButton = styled.button`
    background-color: #df99a5;
    border-radius: 50%;
    height: 7rem;
    width: 7rem;
    margin-top: 1.5rem;
    box-shadow: 2px 2px black;
    cursor: pointer;
    outline: none;

    :hover {
        background-color: pink;
    }
    `;

const TailsButton = styled(HeadsButton)`
    background-color: #5D7B93;

    :hover {
        background-color: #7994aa;
    }
`;

const Img = styled.img`
    height: 4rem;
    width: 4rem;
`;



export default function HeadsTails(props) {

    const handleHeads = () => {
        if(props.betAmt <= .008){
            alert('Bets must be higher than .008 ETH')
        } else {
        let guess = 0
        let bet = props.betAmt
        props.flipTheCoin(guess, bet)
        }
    }
    
    const handleTails = () => {
        if(props.betAmt <= .008){
            alert('Bets must be higher than .008 ETH')
        } else {
        let guess = 1
        let bet = props.betAmt
        props.flipTheCoin(guess, bet)
        }
    }

    return (
        <Circle>
            <Text>
                <div>
                    Heads
                </div>
                <div>
                    or
                </div>
                <div>
                    Tails
                </div>
            </Text>

            <CoinAlign>
                <HeadsButton onClick={handleHeads}>
                    <Img src={ethLogo} alt='ethereum logo'/>
                </HeadsButton>

                <TailsButton onClick={handleTails}>
                    <Img src={ethLogo} alt='ethereum logo'/>
                </TailsButton>
            </CoinAlign>
        </Circle>
    )
}