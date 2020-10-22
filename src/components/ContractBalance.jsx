import React from 'react'
import styled from 'styled-components'

import { useContract } from '../context/ContractContext'

const Div1 = styled.div`
    font-size: 1.7rem;
    display: flex;
    justify-content: center;
    `;

const Div2 = styled(Div1)`
    margin-top: rem;
`;

export default function ContractBalance() {

    //contract context
    const {
        contractBalance
    } = useContract()


    return (
        <>
        <Div1>
                {`${contractBalance} ETH`} 
        </Div1>
        <Div2>
            Available to Win
        </Div2>
        </>
    )
}