import React, {useState, useEffect} from 'react';
import {BrowserRouter} from "react-router-dom";
import AppRouter from './components/AppRouter';
import Navbar from './components/Navbar';
import {AuthContext} from "./context";

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [account, setAccount] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isEvent, setIsEvent] = useState(false);
  const [event, setEvent] = useState('');

  useEffect(() => {
    if (localStorage.getItem('auth')) {
      console.log('AUTH');
      setIsAuth(true);
    }
    if (localStorage.getItem('account')) {
      console.log(localStorage.getItem('account'));
      setAccount(localStorage.getItem('account'));
    }
    setIsLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{
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
      <Navbar />
      <AppRouter />
    </BrowserRouter>
    </AuthContext.Provider>
  );
};

export default App;