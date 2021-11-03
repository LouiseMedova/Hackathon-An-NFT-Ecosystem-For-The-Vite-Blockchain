import React, { useState, useContext, useEffect } from 'react';
import Connector from '@vite/connector';
import { AuthContext } from '../context';
import QRBox from './QRBox';
import TokenService from '../API/TokenService';



const ViteConnectBox = () => {
    const {qrdata, setQRdata, isConnected, setIsConnected, isAuth, setIsAuth, account, setAccount} = useContext(AuthContext);
    const [init, setInit] = useState(false)

    const QRData = (uri) => {
        setQRdata(uri);
        setIsConnected(true);
    }

    const connectUser = (address) => {
        setIsAuth(true)
        setAccount(address)
        localStorage.setItem('auth', true);
        localStorage.setItem('account', address);
    }

    const disconnect = () => {
        setIsConnected(false);
        setQRdata('');
        setIsAuth(false)
        localStorage.removeItem('auth')
        localStorage.removeItem('account')
        setInit(false)
    }

    useEffect(() => {
        console.log('AUTH', localStorage.getItem('auth'));
        console.log('ACCOUNT', localStorage.getItem('account'));
        if(localStorage.getItem('auth') === 'true') {
            console.log('HERE',localStorage.getItem('account') );
            const account = localStorage.getItem('account');
            setAccount(account)
            setIsConnected(true)
            setIsAuth(true)
        } else {
            if(!init) {
                setInit(true)
                TokenService.connectToBridge(QRData, connectUser, disconnect);
            }
        }
    }, [])

    useEffect(() => {
        if(!init) {
            setInit(true)
            console.log('INIT');
            TokenService.connectToBridge(QRData, connectUser, disconnect);
        }

    }, [init])

    return (
        <div>
            { !isAuth
              ? <div>       
                { isConnected && qrdata.length > 46
                    ? <QRBox qrdata={qrdata} />
                    : <div>Loading</div>} </div>
                : null}
        </div>
    );
};

export default ViteConnectBox;