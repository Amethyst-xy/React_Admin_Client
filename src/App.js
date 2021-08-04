import React from 'react';
import {BrowserRouter,Route} from 'react-router-dom';
import Admin from './pages/admin/admin';
import Login from './pages/login/login';

function App() {
  return (
    <BrowserRouter>
        <Route path='/' component={Admin}></Route>
        <Route path='/login' component={Login}></Route>
    </BrowserRouter>
  );
}

export default App;
