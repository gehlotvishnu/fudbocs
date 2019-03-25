import React from 'react'
import { Modal } from 'react-bootstrap';
import { Form, Row, Col, Button } from 'react-bootstrap';
import { editSaveCustomer } from '../httpClient';
import { getCustomersById } from '../httpClient'

class EditCustomer extends React.Component {
  constructor(props) {
    super(props);

    this.HandleUpdate = this.HandleUpdate.bind(this);
  }

  componentDidMount() {
    getCustomersById(this.props.customerId).then(function (customer) {
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
    });
  }

  HandleUpdate() {
    const that = this;
    that.setState({ isLoading: true });
    const obj = {
      id: this.props.customerId,
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
      isActive: document.getElementById('active').checked == true ? 1 : 0
    }

    editSaveCustomer(obj).then(function (customers) {
      that.props.setCustomers(customers);
      that.props.handelCloseEditCustomer();
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
              <Form.Check inline id='active' name='active' type='checkbox' label='&nbsp;&nbsp;Active' />
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