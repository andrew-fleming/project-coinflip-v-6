import React from 'react'
import styled from 'styled-components'

import { useUser } from '../context/UserContext'

const WithdrawButton = styled.button`
    position: relative;
    top: 5rem;
    border: 1px solid #666666;
    background-color: #333333;
    border-radius: 1rem;
    width 23rem;
    height: 5.4rem;
    margin-left: 1rem;
    cursor: pointer;
    outline: none;

    :hover {
        background-color: #696969;
        border: 1px solid pink;
    } 
`;

const Text = styled.div`
    position: relative;
    top: 4rem;
    font-size: 1rem;
    margin-left: 2rem;
    color: white;
    `;

const Text1 = styled(Text)`
    margin-right: 2rem;
`;

const AlignText = styled.div`
    display: flex;
    justify-content: center;
`;

const Text2 = styled.div`
    font-size: 1.5rem;
    color: white;
    text-shadow: .6px .6px pink;
`;

const Line = styled.div`
    position: relative;
    top: 3rem;
    display:block;
    border:none;
    color: #5D432C;
    height:3px;
    background: white;
    background: -webkit-gradient(radial, 50% 50%, 0, 50% 50%, 190, from(#666666), to(#5D432C));
`;


export default function UserButton(props) {

    //user context
    const {
        winningsBalance
    } = useUser()

    const handleWithdraw = () => {
        props.withdrawWin();
    }

    return (
        <>
            <Line/>
            <AlignText>
                <Text>
                    Your Winnings: 
                </Text>
                <Text1>
                    { winningsBalance }
                </Text1>
            </AlignText>
            <WithdrawButton onClick={handleWithdraw}>
                <Text2>
                    Withdraw
                </Text2>
            </WithdrawButton>
        </>
    )
}