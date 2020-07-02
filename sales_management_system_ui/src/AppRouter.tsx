import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Login from './components/Login';
import Welcome from './components/Welcome';
import Callback from './components/Callback';
import Renew from './components/Renew';


function AppRouter():any{
    return (
        <Router>
            <Route path='/' exact component={Login}/>
            <Route exact path='/Callback' component={Callback} />
            <Route exact path='/Renew' component={Renew} />
            <Route path='/Home/Welcome' exact component={Welcome}/>
        </Router>
    );
}

export default AppRouter;