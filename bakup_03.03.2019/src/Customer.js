import React, { Component } from 'react';
import './App.css';
import { saveCustomer, getCustomers,editSaveCustomer } from './httpClient';
import LoadingOverlay from 'react-loading-overlay';

class Customer extends Component {
  constructor(props) {
    super(props);

    //editindex :state to track which customer edit button clicked
    this.state = {isLoading:false,
                   editindex:-1};

    this.saveCustomer = this.saveCustomer.bind(this);
    this.editCustomer = this.editCustomer.bind(this);
    this.editSaveCustomer = this.editSaveCustomer.bind(this);
    this.editCancel = this.editCancel.bind(this);
  }
  
  componentDidMount() {
    const that = this;

    getCustomers().then(function(customers) {
      that.props.setCustomers(customers);
    });
  }

  saveCustomer() {
    const that = this;
    that.setState({isLoading:true});
    const obj = {
      firstName: document.getElementById('FirstName_0').value,
      email: document.getElementById('Email_0').value,
      sex: document.getElementById('Sex_0').value,
      mobile: document.getElementById('Mobile_0').value,
      cityName: document.getElementById('CityName_0').value,
      remark: document.getElementById('Remark_0').value
    }

    saveCustomer(obj).then(function(customers){     
      document.getElementById('FirstName_0').value = '';
      document.getElementById('Email_0').value = '';
      document.getElementById('Mobile_0').value = '';
      document.getElementById('CityName_0').value = '';
      document.getElementById('Remark_0').value = '';

      that.props.setCustomers(customers);

      that.setState({isLoading:false});
    });
  }

  //click handeler edit customer button
  editCustomer(editindex){
    const that = this;
    that.setState({editindex:editindex});    
  }

  //click handeler Save button details(on edit)
  editSaveCustomer(customerId,index){
    const that = this;
    that.setState({isLoading:true});
    const obj = {
      id : customerId,
      firstName: document.getElementById('edit_FirstName_'+ index).value,
      email: document.getElementById('edit_email_'+ index).value,
      sex: document.getElementById('edit_sex_'+ index).value,
      mobile: document.getElementById('edit_mobile_'+ index).value,
      cityName: document.getElementById('edit_cityName_'+ index).value,
      remark: document.getElementById('edit_remark_'+ index).value
    }
    editSaveCustomer(obj).then(function(customers){           
           that.setState({editindex:-1});
           that.props.setCustomers(customers);
           that.setState({isLoading:false});
    });
    

  }


  //click handeler Cancel button details(on edit)
  editCancel(){
  const that = this;
  that.setState({editindex:-1});

  }


  render() {
    const that = this;
    return[
        <div className='customer-list'>
        
        <LoadingOverlay
            active={this.state.isLoading}
            spinner
            text='Saving your content...'
            >
          </LoadingOverlay>
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
                            { that.state.editindex==index                          
                            ? <input type='text' name ='edit_firstName' id={`edit_FirstName_${index}`} defaultValue={customer.name} />
                            :<label type='text' name="firstName" id={`FirstName_${index}`}>{customer.name}</label>
                            }
                          </td>
                          <td>
                            { that.state.editindex==index                           
                            ? <input type='text' name ='edit_email' id={`edit_email_${index}`} defaultValue={customer.email} />
                            :<label type='text' name="email" id={`Email_${index}`}>{customer.email}</label>}
                          </td>
                          <td>
                            { that.state.editindex==index                              
                             ? <select id={`edit_sex_${index}`} defaultValue={customer.gender} >
                                  <option value="M" >
                                    Male
                                  </option>
                                  <option value="F">
                                    Female
                                  </option>
                                </select>
                             :<label type='text' name="sex" id={`Sex_${index}`}>{customer.gender}</label>
                            }
                          </td>
                          <td>
                            { that.state.editindex==index                            
                            ? <input type='text' name ='edit_mobile' id={`edit_mobile_${index}`} defaultValue={customer.mobileNo} />
                            : <label type='text' name="mobile" id={`Mobile_${index}`}>{customer.mobileNo}</label>
                            }
                          </td>
                          
                          <td>
                          { that.state.editindex==index                           
                            ? <input type='text' name ='edit_cityName' id={`edit_cityName_${index}`} defaultValue={customer.address} />
                            :<label type='text' name="cityName" id={`CityName_${index}`}>{customer.address}</label>
                          }
                          </td>
                          <td>
                          { that.state.editindex==index                            
                            ? <input type='text' name ='edit_remark' id={`edit_remark_${index}`} defaultValue={customer.remark} />
                            : <label type='text' name="remark" id={`Remark_${index}`}>{customer.remark}</label>
                          }
                          </td>
                          <td>
                          { that.state.editindex==index                         
                            ?  <div>
                                   <input type='button' name='edit_save' id={`edit_save_${index}`} value='Save' onClick={(e)=>that.editSaveCustomer(customer.id,index)}/>
                                   <br/>
                                   <input type='button' name='edit_cancel' id={`edit_cancel_${index}`} value='Cancel' onClick={that.editCancel}/>  
                               </div>
                            : <div>
                                <input type='button' name='Edit' id={`Edit_${index}`} value='Edit Customer' onClick={(e)=>that.editCustomer(index)} />
                                  &nbsp;<input type='button' name='schedule' id={`Schedule_${index}`} value='Schedule' onClick={()  => that.props.openDialog(customer.id, customer.name, customer.id)}/>
                                  &nbsp;<a href={`/user/${customer._id}`} target='_blank'>Get Link</a>
                              </div>
                          }
                              
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
