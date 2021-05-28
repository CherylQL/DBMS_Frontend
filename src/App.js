import React from 'react'
import './App.css';
import Home from './routes/home.jsx';
import Auth from './routes/auth.jsx';
import { BrowserRouter as Router, Route, Switch  } from 'react-router-dom';

export default class App extends React.Component {

  render() {
    return (
      <div>
        <Router>
          <Switch>
            <Route exact path="/" component = {Home} />
            <Route path="/auth" component={Auth} />
          </Switch>
        </Router>
      </div>
    );
  }
}
