

import React, { Component } from 'react';
import { FormControl, Row, Col, FormCheck, Alert } from 'react-bootstrap';

export default class TiffinDropDown extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isDialogOpen: false,
      show: false
    }

    this.check = this.check.bind(this);
    this.handleCheckboxClick = this.handleCheckboxClick.bind(this);
  }

  setValues(checkBoxId, amountId, qtyId, schedule, amount, role) {
    if (document.getElementById(checkBoxId).checked) {
      const amt = schedule ? schedule.amount : amount;
      const qty = schedule ? schedule.qty : '1';
      if (role === 'user') {
        document.getElementById(amountId).innerHTML = `Rs. ${amt}`
        document.getElementById(qtyId).innerHTML = `Qty. ${qty}`
      } else {
        document.getElementById(amountId).value = amt;
        document.getElementById(qtyId).value = qty;
      }
    } else {
      if (role === 'user') {
        document.getElementById(amountId).innerHTML = '';
        document.getElementById(qtyId).innerHTML = '';

      } else {
        document.getElementById(amountId).value = '';
        document.getElementById(qtyId).value = '';
      }
    }
  }

  handleCheckboxClick(code, id, role, ) {
    if (code === 4) {
      this.setValues('BreakFast_' + id, 'Amount_BreakFast_' + id, 'Quantity_BreakFast_' + id, this.props.tiffin.breakFast, '20', role);
    }

    if (code === 1) {
      this.setValues('Launch_' + id, 'Amount_Launch_' + id, 'Quantity_Launch_' + id, this.props.tiffin.launch, '45', role);
    }

    if (code === 2) {
      this.setValues('Dinner_' + id, 'Amount_Dinner_' + id, 'Quantity_Dinner_' + id, this.props.tiffin.dinner, '45', role);
    }
  }

  check(role, date, time) {
    const result = this.props.check(role, date, time);
    if (!result) {
      this.setState({ show: true });
    } else {
      this.setState({ show: false });
    }

    return result;
  }

  handleTimeout(e) {
    e.preventDefault();

    this.setState({ show: true, msg: 'Please call admin(9351275165), if you want to modify schedule for current datetime.' })
  }

  render() {
    const handleHide = () => this.setState({ show: false });
    const that = this;
    const { role, date, id, tiffin } = this.props;

    const getBreakFast = function (name, value, checkBoxId, amountId, qtyId, schedule, time, tiffinType) {
      if (role === 'user') {
        return <div>
          <FormCheck type='checkbox' name={name} id={checkBoxId} value={value} defaultChecked={schedule ? 'checked' : ''} onClick={(e) => that.check(role, date, time) ? that.handleCheckboxClick(tiffinType, id, role) : that.handleTimeout(e)} label={value} />
          {schedule ? <label id={amountId}>Rs. {schedule.amount}</label> : <label id={amountId}></label>}<br />
          {schedule ? <label id={qtyId}>Qty. {schedule.qty}</label> : <label id={qtyId}></label>}
        </div>
      } else {
        return <div>
          <FormCheck type='checkbox' name={name} id={checkBoxId} value={value} defaultChecked={schedule ? 'checked' : ''} onClick={(e) => that.check(role, date, time) ? that.handleCheckboxClick(tiffinType, id, role) : that.handleTimeout(e)} label={value} />
          <FormControl type='text' name='amount' id={amountId} defaultValue={schedule ? schedule.amount : ''} size='5' />
          <FormControl type='text' name='quantity' id={qtyId} defaultValue={schedule ? schedule.qty : ''} size='5' />
        </div>
      }
    }

    return <section>
      {
        this.state.show && <Alert show={this.state.show} dismissable="true" variant="danger">
          <p className="d-flex">
            {this.state.msg}
            <div className="justify-content-end">
              <button onClick={handleHide} className="close"><span aria-hidden="true">×</span></button>
            </div>
          </p>

        </Alert>
      }
      <Row className="show-grid">
        <Col >
          {getBreakFast('breakFast', 'Break Fast', 'BreakFast_' + id, 'Amount_BreakFast_' + id, 'Quantity_BreakFast_' + id, tiffin.breakFast, '07:00 am', 4)}
        </Col>
        <Col >
          {getBreakFast('launch', 'Launch', 'Launch_' + id, 'Amount_Launch_' + id, 'Quantity_Launch_' + id, tiffin.launch, '10:00 am', 1)}
        </Col>

        <Col >
          {getBreakFast('dinner', 'Dinner', 'Dinner_' + id, 'Amount_Dinner_' + id, 'Quantity_Dinner_' + id, tiffin.dinner, '17:00 pm', 2)}
        </Col>
      </Row>
    </section>
  }
}

	// <select id={'TiffinType_' + id} >
							// 	<option value="0">--Select--</option>
							// 	<option class="launch" value="1">Launch</option>
							// 	<option class="dinner" value="2">Dinner</option>
							// 	<option class="both" value="3">Both</option>
							// </select>