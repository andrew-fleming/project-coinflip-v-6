import React from 'react'
import styled from 'styled-components'

const Div1 = styled.div`
    font-size: 1.7rem;
    display: flex;
    justify-content: center;
    `;

const Div2 = styled(Div1)`
    margin-top: rem;
`;

export default function ContractBalance(props) {

    const conBal = props.contractBalance

    const balanceMessage = conBal;

    return (
        <>
        <Div1>
                {conBal} ETH
        </Div1>
        <Div2>
            Available to Win
        </Div2>
        </>
    )
}