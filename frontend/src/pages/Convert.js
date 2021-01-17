import React, { Component, useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios'

function Convert() {
    const [link, setLink] = useState("")
    const [loading, setLoading] = useState(false)
    
    const handleSubmit = (evt) => {
        setLoading(true);
        evt.preventDefault();
        // alert(`Submitted Link Is: ${link}`);
        const endpoint = "http://localhost:3001/convert/" + document.getElementById('fieldInput').value;
        //const params = {body: {"link" : document.getElementById('fieldInput').value}};
        console.log(endpoint)
        axios.get(endpoint).then(data => {
            setLoading(false)
            console.log(data);
            //window.open(data.link)
        }).catch(err =>{
            setLoading(false)
            alert('Oh no! this link isn\'t valid');
            console.log(err);
        });

        // const timer = setTimeout(() => {
        //     setLoading(false)
        //     setLink("")
        // }, 3000);
        // return () => clearTimeout(timer);
    }

    return (
      <div className="container-fluid poppin">
        <div className="row align-items-center" style={{textAlign:"center",verticalAlign: "middle"}}>
            <div className="col-lg-1 align-middle">
              
            </div>
            <div className="col-lg-10" style={{height:"0vh",verticalAlign: "middle",textAlign:"Center",padding:"0vh 5vw 0px 5vw"}}>
            <h1 style={{fontSize:45,fontWeight:700}}>Doc-2-HTML.</h1>
            <p>
                <br/>
                Convert Google Docs to HTML webpages 
            </p>
            <form onSubmit={handleSubmit}>
                <div class="form-group">
                <input className="form-control" type="text" id = "fieldInput" value={link}
                    onChange={e => setLink(e.target.value)} placeholder="Enter Your Google Docs Link Here"/>
                </div>
                <button type="submit" class="btn btn-primary">Convert</button>
            </form>
            <br/>
            {
                loading!=null && loading?(
                <div>
                {/* <div className="progress" style={{margin:"0px 200px"}}>
                    <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style={{width: "100%"}}></div>
                </div>
                <br/> */}
                <img src="https://media.giphy.com/media/VjAB0fOmK15Ze/source.gif" style={{width:"30%",boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"}}  />
                <br/>
                <br/>
                <div className="progress" style={{margin:"0px 200px"}}>
                    <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style={{width: "100%"}}></div>
                </div>
                </div>
                )
                :
                null
            }
            </div>
            <div className="col-lg-1 align-middle">
              
            </div>
          </div>
        </div>
    );
  
}

export default Convert;