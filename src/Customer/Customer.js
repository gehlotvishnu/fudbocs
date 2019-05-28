import React, { Component } from 'react';
import '../App.css';
import { getCustomers } from '../httpClient';
import LoadingOverlay from 'react-loading-overlay';


class Customer extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const that = this;

    getCustomers().then(function (customers) {
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
                    {index + 1}
                    <input type="hidden" id="CustomerId" name="CustomerId" value={customer.id}></input>
                  </td>
                  <td>
                    <label type='text' name="name" id={`name_${index}`}>{customer.name}</label>
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
