import { Token } from '@solana/spl-token';
import React, {useState, useEffect} from 'react';
import {BrowserRouter} from "react-router-dom";
import TokenService from './API/TokenService';
import AppRouter from './components/AppRouter';
import Navbar from './components/Navbar';
import ViteConnectBox from './components/ViteConnectBox';
import {AuthContext} from "./context";

function App() {
  const [isConnected, setIsConnected] = useState(false)
  const [vbInstance, setVBInstance] = useState(null)
  const [qrdata, setQRdata] = useState('');
  const [isAuth, setIsAuth] = useState(false);
  const [account, setAccount] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isEvent, setIsEvent] = useState(false);
  const [event, setEvent] = useState('');
  
  

  useEffect(() => {
    console.log('IS_CONNECTED',isConnected);
    console.log(localStorage.getItem('auth'));
    // if(localStorage.getItem('connection') == true){
    //   setIsConnected(true);
    //   const uri = localStorage.getItem('qrdata') 
    //   setQRdata(uri)
    //   localStorage.setItem('connection', true)
    // } else {
    //   TokenService.getStore(connection, authorised, reconnect);
    // }
    // if (localStorage.getItem('auth')) {
    //   console.log(localStorage.getItem('auth'));
    //   setIsAuth(true);
    // }
    if (localStorage.getItem('account')) {
      console.log(localStorage.getItem('account'));
      setAccount(localStorage.getItem('account'));
    }
  
    setIsLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{
      qrdata,
      setQRdata,
      vbInstance,
      setVBInstance,
      isConnected,
      setIsConnected,
      isAuth,
      setIsAuth,
      account,
      setAccount,
      isLoading,
      event,
      setEvent,
      isEvent,
      setIsEvent
    }}>
    <BrowserRouter>
      
      <ViteConnectBox />
      <Navbar />
      <AppRouter />
    </BrowserRouter>
    </AuthContext.Provider>
  );
};

export default App;