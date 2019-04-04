import React from 'react'
import { Modal } from 'react-bootstrap';
import { Form, Row, Col, Button } from 'react-bootstrap';
import { editSaveCustomer } from '../httpClient';
import { getCustomersById } from '../httpClient'
import TiffinDropDown from '../Common/tiffinDropDown';
import LoadingOverlay from 'react-loading-overlay';
import moment from 'moment';

class EditCustomer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      DataLoading: true
    }

    this.HandleUpdate = this.HandleUpdate.bind(this);
  }

  componentDidMount() {
    this.setState({ DataLoading: true });

    //getCustomersById(this.props.customerId).then(function (customer) {*/
    const customer = this.props.customerInfo;
    document.getElementById('name').value = customer.name;
    customer.gender == 'M' ? document.getElementById('gender_m').checked = true : document.getElementById('gender_f').checked = true
    document.getElementById('houseno').value = customer.HouseNo;
    document.getElementById('galisector').value = customer.GaliSector;
    document.getElementById('area').value = customer.Area;
    document.getElementById('city').value = customer.City;
    document.getElementById('landmark').value = customer.Landmark;
    document.getElementById('mobile').value = customer.mobile;
    document.getElementById('email').value = customer.email
    document.getElementById('remarks').value = customer.remark
    customer.isActive == 1 ? document.getElementById('active').checked = true : document.getElementById('active').checked = false
    customer.breakfast == 1 ? document.getElementById('BreakFast_Schedule').checked = true : document.getElementById('BreakFast_Schedule').checked = false
    customer.breakfast == 1 ? document.getElementById('Quantity_BreakFast_Schedule').value = customer.breakfast_qty : document.getElementById('Quantity_BreakFast_Schedule').value = 0
    customer.breakfast == 1 ? document.getElementById('Amount_BreakFast_Schedule').value = customer.breakfast_amount : document.getElementById('Amount_BreakFast_Schedule').value = 0
    customer.lunch == 1 ? document.getElementById('Launch_Schedule').checked = true : document.getElementById('Launch_Schedule').checked = false
    customer.lunch == 1 ? document.getElementById('Quantity_Launch_Schedule').value = customer.lunch_qty : document.getElementById('Quantity_Launch_Schedule').value = 0
    customer.lunch == 1 ? document.getElementById('Amount_Launch_Schedule').value = customer.lunch_amount : document.getElementById('Amount_Launch_Schedule').value = 0
    customer.dinner == 1 ? document.getElementById('Dinner_Schedule').checked = true : document.getElementById('Dinner_Schedule').checked = false
    customer.dinner == 1 ? document.getElementById('Quantity_Dinner_Schedule').value = customer.dinner_qty : document.getElementById('Quantity_Dinner_Schedule').value = 0
    customer.dinner == 1 ? document.getElementById('Amount_Dinner_Schedule').value = customer.dinner_amount : document.getElementById('Amount_Dinner_Schedule').value = 0
    customer.exclude_MON == 1 ? document.getElementById('chkbox_mon').checked = true : document.getElementById('chkbox_mon').checked = false
    customer.exclude_TUE == 1 ? document.getElementById('chkbox_tue').checked = true : document.getElementById('chkbox_tue').checked = false
    customer.exclude_WED == 1 ? document.getElementById('chkbox_wed').checked = true : document.getElementById('chkbox_wed').checked = false
    customer.exclude_THU == 1 ? document.getElementById('chkbox_thu').checked = true : document.getElementById('chkbox_thu').checked = false
    customer.exclude_FRI == 1 ? document.getElementById('chkbox_fri').checked = true : document.getElementById('chkbox_fri').checked = false
    customer.exclude_SAT == 1 ? document.getElementById('chkbox_sat').checked = true : document.getElementById('chkbox_sat').checked = false
    customer.exclude_SUN == 1 ? document.getElementById('chkbox_sun').checked = true : document.getElementById('chkbox_sun').checked = false

    //});

    this.setState({ DataLoading: false });
  }

  check(role, date, time) {
    return true;
  }


  HandleUpdate() {
    const that = this;

    that.props.Set_label_loading(true, 'Saving...');
    that.props.handelCloseEditCustomer();

    const obj = {
      //id: this.props.customerId,
      id: this.props.customerInfo.id,
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
      isActive: document.getElementById('active').checked == true ? 1 : 0,
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

    editSaveCustomer(obj).then(function (customers) {
      that.props.setCustomers(customers);
      that.props.Set_label_loading(false, 'Customer Updated Successfully');
    });
  }


  render() {
    return ([
      <Modal title="Edit Customer" show={true} onHide={this.props.handelCloseEditCustomer}>
        <Modal.Header closeButton>
          <Modal.Title >
            Edit Customer
                    </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <LoadingOverlay
            active={this.state.DataLoading}
            spinner
            text='Loading your content...'
          >
          </LoadingOverlay>
          <Form>
            <Form.Group>
              <Form.Label>Customer Name</Form.Label>
              <Form.Control type='text' placeholder='Full Name' id='name' />
            </Form.Group>
            <Form.Group>
              <Form.Label>Gender&nbsp;&nbsp;&nbsp;</Form.Label>
              <Form.Check inline id='gender_m' name='gender' label="Male" type='radio' value='M' />
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
              <Form.Check inline id='active' name='active' type='checkbox' label='&nbsp;&nbsp;Active ' />
            </Form.Group>
            <Form.Group>
              <TiffinDropDown id="Schedule" check={this.check} role={this.props.role} tiffin={{}} />
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
          <Button variant="primary" onClick={this.HandleUpdate} >Update</Button>
          <Button variant="secondary" onClick={() => this.props.handelCloseEditCustomer()} style={{ marginLeft: 30 }}>Close</Button>
        </Modal.Footer>
      </Modal>

    ]
    )
  }
}
export default EditCustomer;