import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Login from './components/Login';
import Layout from './components/Layout';
import Callback from './components/Callback';
import Renew from './components/Renew';


function AppRouter():any{
    return (
        <Router>
            <Route path='/' exact component={Login}/>
            <Route path='/Callback' exact  component={Callback} />
            <Route path='/Renew' exact component={Renew} />
            <Route path='/Home/Welcome' component={Layout}/>
        </Router>
    );
}

export default AppRouter;