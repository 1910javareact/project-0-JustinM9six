import React from 'react';
import './App.css';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';
import { Login } from './components/login/Login';
import B99Nav from './components/navbar/Navbar';

const App: React.FC = () => {
  return (
    <Router>
    <div className='App'>
      <nav>
        <B99Nav />
      </nav>
      <header className='App-header'>
        <Switch>
          <Route path='/' component={Login} />
        </Switch>
      </header>
    </div>
    </Router>
  );
};

export default App;
