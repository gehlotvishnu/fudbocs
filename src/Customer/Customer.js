import React, { Component } from 'react';
import '../App.css';
import { getCustomers, Set_isActive, getSchedule, updateSchedule } from '../httpClient';
import LoadingOverlay from 'react-loading-overlay';
import { getTodaysDate } from '../Helper.js'
import moment from 'moment'
import { Alert } from 'react-bootstrap';


class Customer extends Component {
  constructor(props) {
    super(props);
    this.Set_Active_Inactive_Customer = this.Set_Active_Inactive_Customer.bind(this);
    this.Cancel_LunchorDinner = this.Cancel_LunchorDinner.bind(this);
  }

  componentDidMount() {
    const that = this;

    getCustomers().then(function (customers) {
      that.props.setCustomers(customers);
    });
  }

  //active inactive customer
  Set_Active_Inactive_Customer(CustomerId, ticked, i) {
    //change state
    var customers_old = this.props.customers;
    customers_old[i].isActive = !(ticked);
    var customers_new = customers_old;
    this.props.setCustomers(customers_new);

    //update in db
    Set_isActive(CustomerId, !(ticked) == true ? 1 : 0);
  }

  //cancel todays launch or dinner of any customer
  Cancel_LunchorDinner(tiffinType, CustomerId) {

    //check for deadline timeing for lunch 11:00 & Dinner 6:00
    const now = new Date();
    const lunch_dealine = new Date();
    const dinner_dealine = new Date();


    //get toadys date in deafult js format
    const date = moment().format("MM-DD-YYYY");
    //get schedule-id
    getSchedule({ customerId: CustomerId, date: date, role: 'admin' }).then(function (schedule) {
      if (schedule.length > 0) {
        //update in db        
        let bill = [];
        bill.push({ tiffinType: tiffinType, amount: 0, qty: 0, isActive: 0 })
        const obj = {
          _id: schedule[0].id,
          customerId: CustomerId,
          date: date,
          bill: bill,
          role: 'admin'
        }
        updateSchedule(obj).then(function (data) {
          alert("Done");
        });
      } else {
        alert("Schedule not exist");
      }
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
              <th>Gender</th>
              <th>Address</th>
              <th>Mobile</th>
              <th>Email</th>
              <th>Remark</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {
              this.props.customers && this.props.customers.map(function (customer, index) {
                return <tr>
                  <td>
                    {index + 1}<br />
                    <input type="hidden" id="CustomerId" name="CustomerId" value={customer.id}></input>
                    <input type="checkbox" id={`chk_active_${index}`} name="chk_active" checked={customer.isActive == 1 ? true : false} onClick={() => that.Set_Active_Inactive_Customer(customer.id, customer.isActive == 1 ? true : false, index)}></input>

                  </td>
                  <td>
                    <label type='text' name="name" id={`name_${index}`}>{customer.name}</label>
                    <br />
                    <input className='HyperLink' type="button" name='Cancel_lunch' id={`Cancel_lunch_${index}`} value='Cancel Lunch' onClick={() => that.Cancel_LunchorDinner(1, customer.id)} />
                    <br />
                    <input className='HyperLink' type="button" name='Cancel_dinner' id={`Cancel_dinner_${index}`} value='Cancel Dinner' onClick={() => that.Cancel_LunchorDinner(2, customer.id)} />
                  </td>
                  <td>
                    <label type='text' name="gender" id={`gender_${index}`}>{customer.gender}</label>
                  </td>
                  <td>
                    <label type='text' name="address" id={`address_${index}`}>{customer.HouseNo + ',' + customer.GaliSector + ',' + customer.Area + ',' + customer.City}<br />{customer.Landmark != '' && 'LANDMARK:' + customer.Landmark}</label>
                  </td>
                  <td>
                    <label type='text' name="mobile" id={`mobile_${index}`}>{customer.mobile}</label>
                  </td>
                  <td>
                    <label type='text' name="email" id={`email_${index}`}>{customer.email}</label>
                  </td>
                  <td>
                    <label type='text' name="remark" id={`remark_${index}`}>{customer.remark}</label>
                  </td>
                  <td>
                    <div>
                      <input type='button' name='Edit' id={`Edit_${index}`} value='Edit Customer' onClick={() => that.props.openEditCustDialog(customer)} />
                      &nbsp;<input type='button' name='schedule' id={`Schedule_${index}`} value='Schedule' onClick={() => that.props.openScheduleDialog(customer)} />
                      &nbsp;<a href={`/user/${customer._id}`} target='_blank'>Get Link</a>
                    </div>
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
