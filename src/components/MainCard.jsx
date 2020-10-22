import React from 'react'
import styled from 'styled-components'
import BetForm from './BetForm'
import UserButton from './UserButton'

const Card = styled.div`
    position: relative;
    height: 29.4rem;
    width: 25rem;
    background: #5D432C;
    border: 3px solid #35281E;
    border-radius: 1.5rem;
    margin auto;
    margin-top: .5rem;
`;


export default function MainCard(props) {
    
    //passing withdraw function from Main as a prop to userButton
    const withdrawWinnings = () => {
        props.withdrawUserWinnings()
    }

    //passing flipTheCoin function from Main as props to BetForm
    const flipTheCoin = (oneZero, bet) => {
        props.flipCoin(oneZero, bet);
    }

    return (
        <Card>
            <BetForm 
                userBalance={props.userBalance}
                flip={flipTheCoin}
            />
            <UserButton 
                withdrawWin={withdrawWinnings}
            />
        </Card>
    )
}