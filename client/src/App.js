import React from "react";
import axios from 'axios'
import './App.css';
import { useState } from "react";
import { Component } from 'react'
import Particles from 'react-particles-js';
import Box from '@material-ui/core/Box';
import { Container, Grid } from '@material-ui/core';
import { Paper } from '@material-ui/core';
const particleOptions = {
    particles: {
        number: {
            value: 100,
            density: {
                enable: true,
                value_area: 800
            }
        }
    }
}


class App extends Component {
    state={log:"",permission:""}
     
    postLog= (e)=>{
        
        e.preventDefault();
        let val={log:this.state.log};
        axios.post('http://localhost:5000/submit',val);
    }
    getAllData= async ()=>{
        const res=await axios.get(`http://localhost:5000/get_submit/${this.state.log}`);
        console.log(res.data);
        this.setState({permission : res.data})
    }

    render(){
        return (
            <div>
                
                <div className="log_submit">
                    <form onSubmit={this.postLog}>
                        <label>Log Details</label><p></p>
                        <input type="text" name="log" value={this.state.log} onChange={(e)=>{this.setState({log : e.target.value})}}></input>
                        <button class="btn" type ="submit">Submit</button>
                    </form>
                </div>
                
                <button  onClick={this.getAllData}>Show</button>
                
                <p>{this.state.permission}</p>
                
            </div>
        )
    }
}




export default App
