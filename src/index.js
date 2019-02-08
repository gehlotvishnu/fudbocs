import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import './index.css';
import App from './App';
import Bill from './Bill';
import Print from './Print';
import Home from './User/Home'

import * as serviceWorker from './serviceWorker';

ReactDOM.render((
    <BrowserRouter>
       <main>
        <Switch>
            <Route exact path='/' component={App}/>
            <Route path='/user/:customerId' component={Home}/>
            <Route path='/reciept' component={Bill}/>
            <Route path='/print-customer' component={Print}/>
        </Switch>
        </main>
    </BrowserRouter>
  ), document.getElementById('root'))
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
