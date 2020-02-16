import React, { Component } from 'react';
import axios from 'axios';
import "react-datepicker/dist/react-datepicker.css";
import { Auth } from '../App'
import urlConfig from '../urls'

let urls = urlConfig[process.env.NODE_ENV];

function getAllAttributes(state, form){
  let keys = Object.keys(state);
  keys.forEach((key)=>{
    state[key] = form[key].value;
  })
  return state;
}

export default class OwnerSignup extends Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      name:'',
      email: '',
      address:'',
      city:'',
      zipcode:'',
      restaurant_name: '',
      restaurant_address: '',
      restaurant_city: '',
      restaurant_zipcode:'',
      password: '', 
      confirm_password: '',
    }
  }

  async onSubmit(e) {
    e.preventDefault();
    this.state = getAllAttributes(this.state, e.target);
    let owner = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      address:{
        street: this.state.address,
        city: this.state.city,
        zip: this.state.zipcode
      }
    };

    let restaurant = {
      name: this.state.restaurant_name,
      address: {
          street: this.state.restaurant_address,
          city: this.state.restaurant_city,
          zip: this.state.restaurant_zipcode
      }
    };


  try{
      let response = await axios({method: 'post', url: urls.owner_signup, 
          data: {owner: owner, restaurant: restaurant}, 
        headers: {'Content-Type': 'application/json'}
      });
      await Auth.authenticate({email:response.data.email, password:this.state.password}, () => {});
      this.props.history.push("/");
    }catch(err){
      console.log(err);
    }
  }

  render() {
    return (
      <div>
        <h3>New Restaurant Owner Account</h3>
        <form onSubmit={this.onSubmit}>
        <div className="form-group" > 
            <label>Name </label>
            <input  type="text"
                required
                className="form-control"
                name="name"
            />
          </div>
          <div className="form-group" > 
            <label>Email </label>
            <input  type="email"
                required
                className="form-control"
                name="email"
            />
          </div>
          <div className="form-group"> 
            <label>Address</label>
            <input  type="text"
                required
                className="form-control"
                name='address'
            />
         </div>
         <div className="form-group"> 
            <label>City</label>
            <input  type="text"
                required
                className="form-control"
                name='city'
            />
         </div>
         <div className="form-group"> 
            <label>Zipcode</label>
            <input  type="text"
                required
                className="form-control"
                name='zipcode'
            />
         </div>
         <div className="form-group"> 
            <label>Restaurant Name </label>
            <input  type="text"
                required
                className="form-control"
                name='restaurant_name'
            />
         </div>
        <div className="form-group"> 
            <label>Restaurant Address </label>
            <input  type="text"
                required
                className="form-control"
                name='restaurant_address'
            />
          </div>
          <div className="form-group"> 
            <label>Restaurant City </label>
            <input  type="text"
                required
                className="form-control"
                name='restaurant_city'
            />
          </div>
          <div className="form-group"> 
            <label>Restaurant Zipcode </label>
            <input  type="text"
                required
                className="form-control"
                name='restaurant_zipcode'
            />
          </div>
          <div className="form-group"> 
            <label>Password </label>
            <input  type="password"
                required
                className="form-control"
                name='password'
            />
          </div>
          <div className="form-group"> 
            <label>Confirm Password </label>
            <input  type="password"
                required
                className="form-control"
                name='confirm_password'
            />
          </div>

          <div className="form-group">
            <input type="submit" value="Create Account" className="btn btn-primary" />
          </div>
        </form>
      </div>
    )
  }
}