import React, { useContext, useEffect } from 'react';
import { AuthContext } from '../context';
import SelectUser from '../components/SelectUser';

const Login = () => {
    const {isAuth, setIsAuth} = useContext(AuthContext);
    const {account, setAccount} = useContext(AuthContext);
    const login = (account) => {
        setIsAuth(!isAuth);
        setAccount(account);
        localStorage.setItem('auth', 'true');
        localStorage.setItem('account', account);
    }


    return (
        <div>
            <SelectUser
                login={login}
            />
        </div>
    )
}

export default Login;