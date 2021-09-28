import React, { useContext } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Loader from '../UI/loader/Loader';
import { privateRoutes, publicRoutes } from '../routes';
import { AuthContext } from '../context';

const AppRouter = function() {
     const {isAuth, account, isLoading} = useContext(AuthContext);
    if(isLoading) {
        return <Loader />
    }

    return (
        isAuth
        ?  <Switch>
            {privateRoutes.map(route => 
                <Route 
                    component={route.component}
                    path={route.path}
                    exact={route.exact}
                    key={route.path}
                />
             )}
            <Redirect to='/alltokens' />
           </Switch>
        : <Switch>
         {publicRoutes.map(route => 
            <Route 
                component={route.component}
                path={route.path}
                exact={route.exact}
                key={route.path}
            />
         )}
        <Redirect to='/login' />
       </Switch>
    )
}

export default AppRouter;