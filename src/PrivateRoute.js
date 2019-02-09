import React from 'react';
import { Route, Redirect } from 'react-router-dom';

export const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => (
        localStorage.getItem('fudbocs')
            ? <Component {...props} />
            : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
    )} />
)

//http://jasonwatmore.com/post/2018/09/11/react-basic-http-authentication-tutorial-example
//http://jasonwatmore.com/post/2017/12/07/react-redux-jwt-authentication-tutorial-example
//https://medium.appbase.io/how-to-implement-authentication-for-your-react-app-cf09eef3bb0b