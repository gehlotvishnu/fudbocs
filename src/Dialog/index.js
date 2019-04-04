import React, { Component } from 'react';
import { Modal, Button, FormControl, Row, Col } from 'react-bootstrap';
import { saveSchedule } from '../httpClient';
import TiffinDropDown from '../Common/tiffinDropDown';
import moment from 'moment';

class DialogBox extends Component {
  constructor(props) {
    super(props);
    this.saveShedule = this.saveShedule.bind(this);
  }

  componentDidMount() {
    //var date = new Date(); //gives today date 
    //var startDay = new Date(date.getFullYear(), date.getMonth(), 1);
    var startDay = new Date();
    //var endDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    //console.log(startDay)
    //console.log(endDay)
    document.getElementById("StartDate").value = moment(startDay).format('YYYY-MM-DD');
    // document.getElementById("EndDate").value = moment(endDay).format('YYYY-MM-DD');

  }


  saveShedule() {
    const that = this;
    let bill = [];
    const date = new Date();
    const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const endDateFormatted = moment(endDate).format('YYYY-MM-DD');


    that.props.Set_label_loading(true, 'Saving...');
    that.props.handleClose();

    if (this.props.customerInfo.breakfast) {
      bill.push({ tiffinType: '4', amount: this.props.customerInfo.breakfast_amount, qty: this.props.customerInfo.breakfast_qty })
    }
    if (this.props.customerInfo.lunch) {
      bill.push({ tiffinType: '1', amount: this.props.customerInfo.lunch_amount, qty: this.props.customerInfo.lunch_qty })
    }
    if (this.props.customerInfo.dinner) {
      bill.push({ tiffinType: '2', amount: this.props.customerInfo.dinner_amount, qty: this.props.customerInfo.dinner_qty })
    }

    const obj = {
      startDate: document.getElementById('StartDate').value,
      endDate: endDateFormatted,

      /*endDate: document.getElementById('EndDate').value,     
      customerId: this.props.customerId,
      customerId: this.props.customerInfo.id,
      breakfast: document.getElementById('BreakFast_Schedule').checked ? 1 : 0,
      breakfast_qty: document.getElementById('BreakFast_Schedule').checked ? document.getElementById('Quantity_BreakFast_Schedule').value : 0,
      breakfast_amount: document.getElementById('BreakFast_Schedule').checked ? document.getElementById('Amount_BreakFast_Schedule').value : 0,
      lunch: document.getElementById('Launch_Schedule').checked ? 1 : 0,
      lunch_qty: document.getElementById('Launch_Schedule').checked ? document.getElementById('Quantity_Launch_Schedule').value : 0,
      lunch_amount: document.getElementById('Launch_Schedule').checked ? document.getElementById('Amount_Launch_Schedule').value : 0,
      dinner: document.getElementById('Dinner_Schedule').checked ? 1 : 0,
      dinner_qty: document.getElementById('Dinner_Schedule').checked ? document.getElementById('Quantity_Dinner_Schedule').value : 0,
      dinner_amount: document.getElementById('Dinner_Schedule').checked ? document.getElementById('Amount_Dinner_Schedule').value : 0,
      exclude_MON: document.getElementById('chkbox_mon').checked ? 1 : 0,
      exclude_TUE: document.getElementById('chkbox_tue').checked ? 1 : 0,
      exclude_WED: document.getElementById('chkbox_wed').checked ? 1 : 0,
      exclude_THU: document.getElementById('chkbox_thu').checked ? 1 : 0,
      exclude_FRI: document.getElementById('chkbox_fri').checked ? 1 : 0,
      exclude_SAT: document.getElementById('chkbox_sat').checked ? 1 : 0,
      exclude_SUN: document.getElementById('chkbox_sun').checked ? 1 : 0,*/

      customerId: this.props.customerInfo.id,
      exclude_MON: this.props.customerInfo.exclude_MON,
      exclude_TUE: this.props.customerInfo.exclude_TUE,
      exclude_WED: this.props.customerInfo.exclude_WED,
      exclude_THU: this.props.customerInfo.exclude_THU,
      exclude_FRI: this.props.customerInfo.exclude_FRI,
      exclude_SAT: this.props.customerInfo.exclude_SAT,
      exclude_SUN: this.props.customerInfo.exclude_SUN,
      createdBy: 'Admin',
      // tiffinType: document.getElementById('TiffinType_Schedule').value,
      //isWeekend: document.getElementById('Yes').checked,
      bill: bill,
      isActive: 1
    }
    saveSchedule(obj).then(function (schedule) {
      that.props.Set_label_loading(false, 'Successfully Saved.');
    });
  }

  check(role, date, time) {
    if (role === 'user') {
      if (moment().isAfter(moment(date))) {
        if (moment().diff(date, 'days') === 0) {
          if (moment().isAfter(moment(time, "HH:mm a"))) {
            return false;
          } else {
            return true;
          }
        }

        return false;
      }
    }

    return true;
  }


  render() {
    return (
      <Modal
        title="Schedule Customer"
        show={true}
        onHide={this.props.handleClose} >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
            Schedule Customer : {this.props.customerInfo.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <Row className="show-grid">
              <Col md={6} mdPush={6}>
                Start Date: <FormControl type='date' name='startDate' id='StartDate' />
              </Col>
            </Row>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" style={{ marginLeft: 30 }} onClick={() => this.saveShedule()}>
            Save
                </Button>
          <Button variant="secondary" style={{ marginLeft: 30 }} onClick={() => this.props.handleClose()}>
            Close
                </Button>
        </Modal.Footer>
      </Modal>

    )
  }
}

export default DialogBox;