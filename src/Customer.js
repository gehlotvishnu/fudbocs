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
      // middleName: document.getElementById('MiddleName_0').value,
      // lastName: document.getElementById('LastName_0').value,
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
        <div>
               <table className="table table-bordered" id='customerList'>
               <thead>
                 <tr>
                   <th>Sr. No.</th>
                   <th>Name</th>
                   {/* <th>Middle Name</th>
                   <th>Last Name</th> */}
                   <th>Email</th>
                   <th>Sex</th>
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
                   {/* <td><input type='text' name='middleName' id='MiddleName_0' /></td>
                   <td><input type='text' name='lastName' id='LastName_0' /></td> */}
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
                   <td><input type='text' name='cityName' id='CityName_0' required/></td>
                   <td><input type='text' name='remark' id='Remark_0' required/></td>
                   {/* <td>
                      <select id='TiffinType_0'>
                        <option value="1">Launch</option>
                        <option value="2">Dinner</option>
                        <option value="3">Both</option>
                      </select>
                    </td>
                    <td><input type='date' id='StartDate_0' name='startDate'/></td>
                    <td><input type='date' id='EndDate_0' name='endDate'/></td> */}
                   <td><input type='button' id='AddCustomer' value='Add Customer' onClick={this.saveCustomer}/></td>
                  </tr>
                {
                  this.props.customers && this.props.customers.map(function(customer, index) {
                  return <tr>
                          <td>{index + 1}</td>

                          <td>
                            <label type='text' name="firstName" id={`FirstName_${index}`}>{customer.FirstName}</label>
                          </td>
                          {/* <td>
                            <label type='text' name="middleName" id={`MiddleName_${index}`}>{customer.MiddleName}</label>
                          </td>
                          <td>
                            <label type='text' name="lastsName" id={`LastName_${index}`}>{customer.LastName}</label>
                          </td> */}
                          <td>
                            <label type='text' name="email" id={`Email_${index}`}>{customer.Email}</label>
                          </td>
                          <td>
                            <label type='text' name="sex" id={`Sex_${index}`}>{customer.Sex}</label>
                          </td>
                          <td>
                            <label type='text' name="mobile" id={`Mobile_${index}`}>{customer.Mobile}</label>
                          </td>
                          <td>
                            <label type='text' name="cityName" id={`CityName_${index}`}>{customer.CityName}</label>
                          </td>
                          <td>
                            <label type='text' name="remark" id={`Remark_${index}`}>{customer.Remark}</label>
                          </td>
                          <td>
                              <input type='button' name='schedule' id={`Schedule_${index}`} value='Schedule' onClick={() => that.props.openDialog(customer._id, customer.FirstName)}/>
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
