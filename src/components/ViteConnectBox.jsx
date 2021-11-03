import React, { useState, useContext, useEffect } from 'react';
import Connector from '@vite/connector';
import { AuthContext } from '../context';
import QRBox from './QRBox';
import TokenService from '../API/TokenService';

const store = {
    connected: "vc_not_initialized",
    address: "vite_placeholder",
    contract_owner: 'vite_ad43000f81aee4468387854e20a8c53e2c9027b8655ad2de6c',
    uri: ""
}

// Setup ViteConnect to allow user to securely fund and guess answers.
const BRIDGE = 'wss://biforst.vite.net'
let instance = null;

const ViteConnectBox = () => {
    const {qrdata, setQRdata, vbInstance, setVBInstance, isConnected, setIsConnected, isAuth, setIsAuth, account, setAccount} = useContext(AuthContext);
    const [init, setInit] = useState(false)
    const initConnector = () => {
        instance = new Connector({ bridge: BRIDGE })
        console.log(instance);
        console.log("IS_CONNECTED", isConnected);
        console.log("IS_AUTH", isAuth);
        instance.createSession().then(() => {
            store.uri = instance.uri;
            console.log('connect uri', instance.uri);
            console.log(instance.uri.length);
            setQRdata(instance.uri);
            setIsConnected(true);
            localStorage.setItem('account', account)
            store.state = 'waiting';
        });
        instance.on('connect', (err, payload) => {
            const { accounts } = payload.params[0];
            if (!accounts || !accounts[0]) throw new Error('address is null');
    
            const address = accounts[0];
            console.log('user address', address);
            setIsAuth(true)
            setAccount(address)
            localStorage.setItem('auth', true);
            localStorage.setItem('account', address);
            setVBInstance(instance);
            store.address = address;
            store.state = 'connected'
        })
    
        instance.on('disconnect', err => {
            console.log(err)
            store.state = 'disconnected'
            instance.destroy();
            setVBInstance(null)
            setIsConnected(false);
            setQRdata('');
            setIsAuth(false)
            localStorage.removeItem('auth')
            localStorage.removeItem('account')
            setTimeout(initConnector, 5000);
            console.log('called init connector');

        })
    }

    useEffect(() => {
        console.log('AUTH', localStorage.getItem('auth'));
        console.log('ACCOUNT', localStorage.getItem('account'));
        console.log(vbInstance);
        TokenService.setVbInstance(vbInstance)
        if(localStorage.getItem('auth') === 'true') {
            console.log('HERE',localStorage.getItem('account') );
            const account = localStorage.getItem('account');
            setAccount(account)
            setIsConnected(true)
            setIsAuth(true)
        } else {
            if(!init) {
                setInit(true)
                initConnector();
            }
        }
    }, [])
    
    useEffect(() => {
        TokenService.setVbInstance(vbInstance)
    }, [vbInstance])


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