import React, { Component } from 'react';
import './App.css';
import { saveCustomer, getCustomers } from './httpClient';

class Customer extends Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.saveCustomer = this.saveCustomer.bind(this);
  }
  
  componentDidMount() {
    const that = this;

    getCustomers().then(function(customers) {
      that.props.setCustomers(customers);
    });
  }

  saveCustomer() {
    const that = this;

    const obj = {
      firstName: document.getElementById('FirstName_0').value,
      email: document.getElementById('Email_0').value,
      sex: document.getElementById('Sex_0').value,
      mobile: document.getElementById('Mobile_0').value,
      cityName: document.getElementById('CityName_0').value,
      remark: document.getElementById('Remark_0').value
    }

    saveCustomer(obj).then(function(customers){
      document.getElementById('FirstName_0').value = 'Mr. ';
      document.getElementById('Email_0').value = '';
      document.getElementById('Mobile_0').value = '';
      document.getElementById('CityName_0').value = '';
      document.getElementById('Remark_0').value = '';

      that.props.setCustomers(customers);
    });
  }

  render() {
    const that = this;
    return [
        <div className='customer-list'>
               <table className="table table-bordered" id='customerList'>
               <thead>
                 <tr>
                   <th>Sr. No.</th>
                   <th>Name</th>
                   <th>Email</th>
                   <th>Gender</th>
                   <th>Mobile</th>
                   <th>Address</th>
                   <th>Remark</th>
                   <th>Action</th>
                 </tr>
               </thead>
     
               <tbody>
                  <tr>
                    <td></td>
                   <td><input type='text' name='firstName' id='FirstName_0' required/></td>
                   <td><input type='text' name='email' id='Email_0' /></td>
                   <td>
                    <select id='Sex_0'>
                      <option value="M">
                        Male
                      </option>
                      <option value="F">
                        Female
                      </option>
                    </select>
                   </td>
                   <td><input type='text' name='mobile' id='Mobile_0' required/></td>
                   <td><input type='text' size='40' name='cityName' id='CityName_0' required/></td>
                   <td><input type='text' name='remark' id='Remark_0' required/></td>
                   <td><input type='button' id='AddCustomer' value='Add Customer' onClick={this.saveCustomer}/></td>
                  </tr>
                {
                  this.props.customers && this.props.customers.map(function(customer, index) {
                  return <tr>
                          <td>{index + 1}</td>

                          <td>
                            <label type='text' name="firstName" id={`FirstName_${index}`}>{customer.name}</label>
                          </td>
                          <td>
                            <label type='text' name="email" id={`Email_${index}`}>{customer.email}</label>
                          </td>
                          <td>
                            <label type='text' name="sex" id={`Sex_${index}`}>{customer.gender}</label>
                          </td>
                          <td>
                            <label type='text' name="mobile" id={`Mobile_${index}`}>{customer.mobileNo}</label>
                          </td>
                          <td>
                            <label type='text' name="cityName" id={`CityName_${index}`}>{customer.address}</label>
                          </td>
                          <td>
                            <label type='text' name="remark" id={`Remark_${index}`}>{customer.remark}</label>
                          </td>
                          <td>
                              <input type='button' name='schedule' id={`Schedule_${index}`} value='Schedule' onClick={() => that.props.openDialog(customer.id, customer.name, customer.id)}/>
                              &nbsp;<a href={`/user/${customer._id}`} target='_blank'>Get Link</a>
                          </td>
                        </tr>;
                  })
               }
               </tbody>
     
             </table>
        </div>
    ]
  }
}

export default Customer;
