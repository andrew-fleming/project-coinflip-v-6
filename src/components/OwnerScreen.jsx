import React, { useState } from 'react'
import styled from 'styled-components'

const AlignDivButton = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const AlignDiv = styled(AlignDivButton)`
    margin-top: 3rem;
`;

const Ul = styled.ul`
    margin: auto;
    margin-right: 4rem;
`;

const OwnerButton = styled.button`
    width: 8rem;
    height: 3rem;
    border-radius: 1rem;
    background-color: #333333;
    color: white;
    text-shadow: .8px .8px #5D7B93;
    font-size: 1.1rem;
    outline: none;
    cursor: pointer;
    margin-bottom: 1.2rem;
`;


const ContractInput = styled.input`
    width: 4rem;
    height: 1rem;
`;

const WinningsInput = styled(ContractInput)`
`;

const ContractButton = styled.button`
    width: 4.5rem;
    height: 1.4rem;
    background-color: orange;
`;

const WinningsButton = styled(ContractButton)`
`;

const WithdrawAllButton = styled.button`
    width: 10rem;
    height: 4rem;
    background-color: green;
    font-size: 1.2rem;
`;


export default function OwnerScreen(props) {

    
    const [visible, setVisible] = useState(false);

   

    const openOwner = props.isOwner

    


   //toggle hide/show owner functions
   const hideOwnerFunctions = () => {
    if(openOwner === false){
        alert('You are not the owner!')
    } else {
        setVisible(!visible)
    }
}

    const ownerFunctions = visible ? 
    <>
        <AlignDiv>
            Fund Contract:
            <ContractInput 
                placeholder='0.0'
                
            />
            <ContractButton >
                Submit
            </ContractButton>
        </AlignDiv>
        <AlignDiv>
            Fund Winnings:
            <WinningsInput 
                placeholder='0.0'
                   
            />
            <WinningsButton >
                Submit
            </WinningsButton>
        </AlignDiv>
        <AlignDiv>
            <WithdrawAllButton >
                Withdraw All
            </WithdrawAllButton>
        </AlignDiv>

    </> : null;



    return (
            <Ul>
                <AlignDivButton>
                    <OwnerButton onClick={hideOwnerFunctions}>
                        Owner
                    </OwnerButton>
                </AlignDivButton>
                { ownerFunctions }
            </Ul>
    )
}