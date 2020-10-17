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

    let userBal = props.userBalance
    let userWin = props.userWinningsBalance 

    return (
        <Card>
            <BetForm 
                userBalance={userBal}
            />
            <UserButton 
                userWinnings={userWin}
            />
        </Card>
    )
}