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
// import { Link, glide } from 'react-tiger-transition';
// import "react-tiger-transition/styles/main.min.css";
import { spring, AnimatedSwitch } from 'react-router-transition';
// we need to map the `scale` prop we define below
// to the transform style property
function mapStyles(styles) {
  return {
    opacity: styles.opacity,
    transform: `scale(${styles.scale})`,
  };
}

// wrap the `spring` helper to use a bouncy config
function bounce(val) {
  return spring(val, {
    stiffness: 250,
    damping: 22,
  });
}

// child matches will...
const bounceTransition = {
  // start in a transparent, upscaled state
  atEnter: {
    opacity: 0,
    scale: 1.2,
  },
  // leave in a transparent, downscaled state
  atLeave: {
    opacity: bounce(0),
    scale: bounce(0.5),
  },
  // and rest at an opaque, normally-scaled state
  atActive: {
    opacity: bounce(1),
    scale: bounce(1),
  },
};

function App() {
  return (
    <Router>
      
      <div className="App">
       <AnimatedSwitch
          // atEnter={{ opacity: 0 }}
          // atLeave={{ display:none,opacity: 0 }}
          // atActive={{ opacity: 1 }}
          atEnter={bounceTransition.atEnter}
          atLeave={bounceTransition.atLeave}
          atActive={bounceTransition.atActive}
          mapStyles={mapStyles}
          className="switch-wrapper"
        >
          <Route exact path="/convert" component={Convert} />
          <Route exact path="/" component={Landing} />
      </AnimatedSwitch>

      </div>
    </Router>
  );
}

export default App;