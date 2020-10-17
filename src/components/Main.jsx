import React, { useState, useEffect } from 'react'
import Coinflip from '../abi/Coinflip.json'
import Web3 from 'web3'
import NavBar from './NavBar'
import ContractBalance from './ContractBalance'
import MainCard from './MainCard'
import OwnerScreen from './OwnerScreen'
import Directions from './Directions'
import styled from 'styled-components'

const AlignContent = styled.div`
    position: relative;
    top: 1rem;
    display: flex;
    justify-content: space-between;
`;

const AlignQuarter = styled.div`
    width: 25%
`;

const AlignHalf = styled.div`
    width: 50%
`;

const web3 = new Web3(Web3.givenProvider)
const contractAddress = '0xE7B308E35A71bd7b44521d4D1Cd9539Bdd356EA6'
const coinflip = new web3.eth.Contract(Coinflip.abi, contractAddress)


export default function Main() {

    const [userAddress, setUserAddress] = useState('');
    const [userBalance, setUserBalance] = useState('');
    const [userWinningsBalance, setUserWinningsBalance] = useState('');
    const [contractBalance, setContractBalance] = useState('');
    const [owner, setOwner] = useState('');
    const [isOwner, setIsOwner] = useState(false);

   

    const loadUserAddress = async() => {
        let accounts = await web3.eth.getAccounts()
        let account = accounts[0]
        return account
    }

    const loadContractBalance = async() => {
        let balance = await coinflip.methods.contractBalance().call()
        setContractBalance(web3.utils.fromWei(balance))
    }

    const loadUserBalance = async(user) => {
        let userBal = await web3.eth.getBalance(user)
        setUserBalance(Number.parseFloat(web3.utils.fromWei(userBal)).toPrecision(3))
    }

    const loadUserWinningsBalance = async(user) => {
        let config = {from: user}
        let userWin = await coinflip.methods.getWinningsBalance().call({config})
        setUserWinningsBalance(Number.parseFloat(web3.utils.fromWei(userWin)).toPrecision(4))
    }

    const loadOwner = async() => {
        let theOwner = await coinflip.methods.owner().call()
        setOwner(theOwner)
        return theOwner
    }

    const checkOwner = (add, own) => {
        if(add === own){
            setIsOwner(true)
        } else {
            setIsOwner(false)
        }
    }

    const componentDidMount = async() => {
        await loadUserAddress().then(response => {
            setUserAddress(response)
            loadUserBalance(response)
            loadUserWinningsBalance(response)
            .then(loadOwner().then(response => {
                setOwner(response)
                const ownerAdd = response
                const address = loadUserAddress().then(response => {
                    checkOwner(ownerAdd, response)
                })
            }))
            })
            await loadContractBalance()
    }

    useEffect(() => {
        if(userAddress.length === 0){
            componentDidMount()
        }
    })

    


    return (
        <div>
            <NavBar 
                userAddress={userAddress}
                userBalance={userBalance}
            />
            
            <AlignContent>
                <AlignQuarter>
                    <Directions />
                </AlignQuarter>
                <AlignHalf>
                    <ContractBalance 
                        contractBalance={contractBalance}
                    />
                    <MainCard 
                        userBalance={userBalance}
                        userWinningsBalance={userWinningsBalance}
                    />    
                </AlignHalf>
                <AlignQuarter>
                    <OwnerScreen 
                        isOwner={isOwner}

                    />
                </AlignQuarter>
            </AlignContent>
        </div>
    )
}

