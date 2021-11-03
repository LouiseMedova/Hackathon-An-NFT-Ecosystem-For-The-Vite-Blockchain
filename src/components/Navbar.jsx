import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context';
import MyButton from '../UI/button/MyButton';

const Navbar = () => {
   
    const {isAuth, setIsAuth} = useContext(AuthContext);
  

    const logout = () => {
      setIsAuth(false);
      localStorage.removeItem('auth');
      localStorage.removeItem('account');
    }

    return (
      isAuth
      ?
     <div className="navbar">
            <MyButton onClick={logout}> Log Out</MyButton>
           <div className="navbar__links">
            <Link to="/mytokens">My Page</Link>
            <Link to="/alltokens">All Tokens</Link>
        </div>
      </div>
      : null
    );
};

export default Navbar;