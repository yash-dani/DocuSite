import React, { Component } from "react";
import { Link } from "react-router-dom";
import flowerDoc from "../flowerDoc3.png"
import demoGif from "../demoGif2.gif"

import Convert from "./Convert";
// Landing/homepage
class Landing extends Component {
  render() {
    return (
        <div>
      <div className="container-fluid poppin">
        <div className="row align-items-center" style={{textAlign:"center",verticalAlign: "middle"}}>
            <div className="col-lg-12" style={{height:"100%",verticalAlign: "middle",textAlign:"Center",padding:"10vh 5vw 0px 5vw"}}>
              <h1 style={{fontSize:45,fontWeight:700}}>Web Development Made Easy.</h1>
              <p>
                <b>DocSite</b> converts Google Docs into full fledged webpages, so anyone can build their own websites.
                
             
              </p>
               <img src={flowerDoc} style={{height:"330px"}}/>
              <img src={demoGif} style={{height:"300px",boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"}}  />
                
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
          </div>


        </div>
        {/* <Convert/> */}
        </div>
    );
  }
}

export default Landing;