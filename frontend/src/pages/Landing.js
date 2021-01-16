import React, { Component } from "react";
import { Link } from "react-router-dom";

// Landing/homepage
class Landing extends Component {
  render() {
    return (
      <div className="container-fluid poppin bg-dark text-light">
        <div className="row align-items-center" style={{textAlign:"center",verticalAlign: "middle"}}>
            <div className="col-lg-6" style={{height:"100vh",verticalAlign: "middle",textAlign:"Left",padding:"20vh 5vw 0px 5vw"}}>
              <h1 style={{fontSize:45,fontWeight:700}}>Web Development Made Easy.</h1>
              <p>
                <br/>
                <b>NAME</b> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                <br/><br/>
                Tagline to be inserted Here. Tagline Here.
              </p>
              <Link
                to="/convert"
                style={{
                  width: "140px",
                  borderRadius: "3px",
                  marginBottom:20
                }}
                className="btn btn-raised btn-primary"
              >
                Get Started
              </Link>
            </div>
            <div className="col-lg-6 align-middle">
              
            </div>
          </div>
        </div>
    );
  }
}

export default Landing;