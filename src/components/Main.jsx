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
const contractAddress = '0x4599B5156176a3d59a753CB5825C40B8d307c1e6'
const coinflip = new web3.eth.Contract(Coinflip.abi, contractAddress)


export default function Main() {

    const [userAddress, setUserAddress] = useState('');
    const [userBalance, setUserBalance] = useState('');
    const [winningsBalance, setWinningsBalance] = useState('');
    const [contractBalance, setContractBalance] = useState('');
    const [owner, setOwner] = useState('');
    const [isOwner, setIsOwner] = useState(false);
    const [sentQueryId, setSentQueryId] = useState('');
    const [awaitingResponse, setAwaitingResponse] = useState(false);

   

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

    const loadWinningsBalance = async(userAdd) => {
        let config = {from: userAdd}
        let bal = await coinflip.methods.getWinningsBalance().call(config)
        setWinningsBalance(Number.parseFloat(web3.utils.fromWei(bal)).toPrecision(3));
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

    

    //init
    const componentDidMount = async() => {
        await loadUserAddress().then(response => {
            setUserAddress(response)
            loadUserBalance(response)
            loadWinningsBalance(response)
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


    //init
    useEffect(() => {
        if(userAddress.length === 0){
            componentDidMount()
        }
    })

    
     //set coinflip function with heads/tails functions
     const flip = async(oneZero, bet) => {
        let guess = oneZero
        let betAmt = bet
        let config = {
            value: web3.utils.toWei(betAmt, 'ether'),
            from: userAddress
        }
        coinflip.methods.flip(guess).send(config)
        //set queryId to state
        .on('receipt', function(receipt){
            console.log(receipt)
            setSentQueryId(receipt.events.sentQueryId.returnValues[1])
            setAwaitingResponse(true)
        })
    }

    useEffect(() => {
        if(awaitingResponse){
            coinflip.events.callbackReceived({
                fromBlock: 'latest'
            }, function(error, event){ if(event.returnValues[0] === sentQueryId){
                if(event.returnValues[1] === 'Winner'){
                    alert('You won ' + web3.utils.fromWei(event.returnValues[2]) + ' ETH!')
                    loadWinningsBalance(userAddress)
                    loadContractBalance()
                } else {
                    alert('Sorry, you lost ' + web3.utils.fromWei(event.returnValues[2]) + ' ETH..')
                    loadWinningsBalance(userAddress)
                }
            } setAwaitingResponse(false) })
            setSentQueryId('')
        }
    }, [awaitingResponse, sentQueryId])




    //set owner functions
    const fundContract = (x) => {
        let fundAmt = x
        let config = {
            value: web3.utils.toWei(fundAmt, 'ether'),
            from: userAddress
        }
        coinflip.methods.fundContract().send(config)
    }

    const fundWinnings = (x) => {
        let fundAmt = x
        let config = {
            value: web3.utils.toWei(fundAmt, 'ether'),
            from: userAddress
        }
        coinflip.methods.fundWinnings().send(config)
    }

    const withdrawAll = () => {
        var balance = contractBalance
        coinflip.methods.withdrawAll().send(balance, {from: userAddress})
    }

    //user withdraw function
    const withdrawUserWinnings = () => {
        var balance = winningsBalance
        coinflip.methods.withdrawUserWinnings().send(balance, {from: userAddress})
    }



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
                        userWinningsBalance={winningsBalance}
                        withdrawUserWinnings={withdrawUserWinnings}
                        flipCoin={flip}
                    />    
                </AlignHalf>
                <AlignQuarter>
                    <OwnerScreen 
                        fundContract={fundContract}
                        fundWinnings={fundWinnings}
                        withdrawAll={withdrawAll}
                        isOwner={isOwner}
                    />
                </AlignQuarter>
            </AlignContent>
        </div>
    )
}

