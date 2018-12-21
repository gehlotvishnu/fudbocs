import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import './index.css';
import App from './App';
import Bill from './Bill';

import * as serviceWorker from './serviceWorker';

ReactDOM.render((
    <BrowserRouter>
       <main>
        <Switch>
            <Route exact path='/' component={App}/>
            <Route path='/reciept' component={Bill}/>
        </Switch>
        </main>
    </BrowserRouter>
  ), document.getElementById('root'))
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
