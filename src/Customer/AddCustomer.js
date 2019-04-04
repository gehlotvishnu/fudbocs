import React from 'react'
import { Modal } from 'react-bootstrap';
import { Form, Row, Col, Button, Tabs, Tab } from 'react-bootstrap';
import { saveCustomer } from '../httpClient';
import TiffinDropDown from '../Common/tiffinDropDown';
import moment from 'moment';
//import Button from '@material-ui/core/Button';
//import TextField from '@material-ui/core/TextField';


class AddCustomer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    }

    this.handleSubmit = this.handleSubmit.bind(this);

  }

  check(role, date, time) {
    return true;
  }

  handleSubmit() {
    const that = this;

    that.props.Set_label_loading(true, 'Saving...');
    that.props.handelCloseAddCustomer();

    //that.setState({isLoading:true});
    const obj = {
      name: document.getElementById('name').value,
      gender: document.getElementById('gender_m').checked ? 'M' : 'F',
      HouseNo: document.getElementById('houseno').value,
      GaliSector: document.getElementById('galisector').value,
      Area: document.getElementById('area').value,
      City: document.getElementById('city').value,
      Landmark: document.getElementById('landmark').value,
      mobile: document.getElementById('mobile').value,
      email: document.getElementById('email').value,
      remark: document.getElementById('remarks').value,
      isActive: 1,
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
      exclude_SUN: document.getElementById('chkbox_sun').checked ? 1 : 0
    }

    saveCustomer(obj).then(function (customers) {
      that.props.setCustomers(customers);
      that.props.Set_label_loading(false, 'Customer Added Successfully');
    });
  }




  render() {
    return ([
      <Modal title="Add Customer" show={true} onHide={this.props.handelCloseAddCustomer}>
        <Modal.Header closeButton>
          <Modal.Title >
            Add Customer
                    </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Customer Name</Form.Label>
              <Form.Control type='text' placeholder='Full Name' id='name' />
            </Form.Group>
            <Form.Group>
              <Form.Label>Gender&nbsp;&nbsp;&nbsp;</Form.Label>
              <Form.Check inline id='gender_m' name='gender' label="Male" type='radio' value='M' defaultChecked='true' />
              <Form.Check inline id='gender_f' name='gender' label="Female" type='radio' value='F' />
            </Form.Group>
            <Form.Group >
              <Form.Label>Address</Form.Label>
              <Row>
                <Col><Form.Control type='text' placeholder='House No.' id='houseno' /></Col>
                <Col><Form.Control type='text' placeholder='Gali No./Sector' id='galisector' /></Col>
              </Row>
              <Form.Control type='text' placeholder='Area' id='area' />
              <Form.Control type='text' placeholder='City' id='city' />
              <Form.Control type='text' placeholder='Landmark' id='landmark' />
            </Form.Group>
            <Form.Group>
              <Form.Label>Mobile</Form.Label>
              <Form.Control type='text' placeholder='Mobile' id='mobile' />
            </Form.Group>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control type='email' placeholder='Email' id='email' />
            </Form.Group>
            <Form.Group>
              <Form.Label>Remarks (if any)</Form.Label>
              <Form.Control type='text' placeholder='Remarks' id='remarks' />
            </Form.Group>
            <Form.Group>
              <TiffinDropDown id="Schedule" check={this.check} role={this.props.role} tiffin={{ breakFast: { amount: 20, qty: 1 }, launch: { amount: 45, qty: 1 }, dinner: { amount: 45, qty: 1 } }} /> &nbsp; &nbsp;<br />
              <label>Exclude Days:</label>&nbsp;
                <label><input type='checkbox' id='chkbox_mon' />MON</label>&nbsp;
                <label><input type='checkbox' id='chkbox_tue' />TUE</label>&nbsp;
                <label><input type='checkbox' id='chkbox_wed' />WED</label>&nbsp;
                <label><input type='checkbox' id='chkbox_thu' />THU</label>&nbsp;
                <label><input type='checkbox' id='chkbox_fri' />FRI</label>&nbsp;
                <label><input type='checkbox' id='chkbox_sat' />SAT</label>&nbsp;
                <label><input type='checkbox' id='chkbox_sun' />SUN</label>
            </Form.Group>
          </Form>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={this.handleSubmit} >Submit</Button>
          <Button variant="secondary" onClick={() => this.props.handelCloseAddCustomer()} style={{ marginLeft: 30 }}>Close</Button>
        </Modal.Footer>
      </Modal>

    ]
    )
  }
}
export default AddCustomer;