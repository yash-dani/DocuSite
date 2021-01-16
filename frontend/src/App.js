import React from 'react';
import logo from './logo.svg';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Landing from "./pages/Landing";
import Convert from "./pages/Convert";


function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route exact path="/" component={Landing} />
          <Route exact path="/convert" component={Convert} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;