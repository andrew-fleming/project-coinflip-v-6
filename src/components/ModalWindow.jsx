import React from 'react'
import styled from 'styled-components'

const MODAL_STYLES ={
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#FFF',
    padding: '50px',
    height: '9rem',
    width: '24rem',
    zIndex: 1000
}

const OVERLAY_STYLES = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, .7)',
    zIndex: 1000
}

const Message = styled.div`
    font-size: 2rem;
`;

const DivAlign = styled.div`
    display: flex;
    justify-content: center;
`;

const DivAlignBtn = styled(DivAlign)`
    margin-top: 3rem;
    margin-bottom: 0;
`;

const Button = styled.button`
    height: 2.5rem;
    width: 5rem;
    background-color: pink;
`;
 

export default function ModalWindow({ open, children, onClose }) {

    if(!open) return null
    return (

        <>
            <div style={OVERLAY_STYLES} />
            <div style={MODAL_STYLES}>
            <DivAlign>
                <Message>
                    {children}
                </Message>
            </DivAlign>
            <DivAlignBtn>
                <Button onClick={onClose}>Close</Button>
            </DivAlignBtn>
            </div>
        </>
    )
}

