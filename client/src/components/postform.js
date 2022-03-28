import React, { Component } from 'react'
import axios from 'axios'
class postform extends Component {

    state={
        log:"",
    };
    handleSubmit = event => {
        event.preventDefault();
        const user = {
          log: this.state.log
        }
        axios.post('http://localhost:3000/submit', { submit })
          .then(res=>{
            console.log(res);
            console.log(res.data);
            window.location = "/retrieve" //This line of code will redirect you once the submission is succeed
          })
      }
    handleChange = event =>{
        this.setState({ log: event.target.value});
      }
  render() {
    return (
      <div>
            <form onSubmit={this.handleSubmit}>
            <label>Log Details</label><p></p>
            <input type ="text" id="logd" name="log" placeholder="Enter the log here" onChange={this.handlechange}></input>
            <button class="btn" type ="submit">Submit</button>
            </form>
            {/* <form action="/submit_file" method="POST" enctype="multipart/form-data">
            <input type="file" name="file"></input>
            <button class="btn" type="submit">Upload</button>
            </form>  */}
      </div>
    )
  }
}

export default postform