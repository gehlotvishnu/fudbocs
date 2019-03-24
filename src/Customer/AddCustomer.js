import React from 'react'
import { Modal } from 'react-bootstrap';
import { Form, Row, Col,Button} from 'react-bootstrap';
import { saveCustomer} from '../httpClient';
//import Button from '@material-ui/core/Button';
//import TextField from '@material-ui/core/TextField';

class AddCustomer extends React.Component{
    constructor(props){
        super(props);

        this.state={

        }

        this.handleSubmit= this.handleSubmit.bind(this);

    }
    
    handleSubmit(){
        const that = this;
        //that.setState({isLoading:true});
        const obj = {
          name: document.getElementById('name').value,
          gender: document.getElementById('gender_m').checked? 'M' : 'F',
          HouseNo :document.getElementById('houseno').value,
          GaliSector:document.getElementById('galisector').value,
          Area:document.getElementById('area').value,
          City:document.getElementById('city').value,
          Landmark:document.getElementById('landmark').value,
          mobile: document.getElementById('mobile').value,
          email: document.getElementById('email').value,        
          remark: document.getElementById('remarks').value,
          isActive : 1
        }

        saveCustomer(obj).then(function(customers){
          that.props.setCustomers(customers);    
          that.props.handelCloseAddCustomer();
        });
    }


    render(){
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
                            <Form.Control type='text' placeholder='Full Name' id='name'/>
                        </Form.Group>                        
                        <Form.Group>
                            <Form.Label>Gender&nbsp;&nbsp;&nbsp;</Form.Label>
                            <Form.Check inline  id='gender_m' name='gender' label="Male" type='radio' value='M' defaultChecked='true'/>
                            <Form.Check inline  id='gender_f' name='gender' label="Female" type='radio' value='F' />     
                        </Form.Group>
                        
                        <Form.Group >                            
                            <Form.Label>Address</Form.Label>
                            <Row>
                                <Col><Form.Control type='text' placeholder='House No.' id='houseno'/></Col>                           
                                <Col><Form.Control type='text' placeholder='Gali No./Sector' id='galisector'/></Col>
                            </Row>                           
                            <Form.Control type='text' placeholder='Area' id='area'/>                                                   
                            <Form.Control type='text' placeholder='City' id='city'/>
                            <Form.Control type='text' placeholder='Landmark' id='landmark'/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Mobile</Form.Label>
                            <Form.Control type='text' placeholder='Mobile' id='mobile'/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Email</Form.Label>
                            <Form.Control type='email' placeholder='Email' id='email'/>
                        </Form.Group> 
                        <Form.Group>
                            <Form.Label>Remarks (if any)</Form.Label>
                            <Form.Control type='text' placeholder='Remarks' id='remarks'/>
                        </Form.Group> 
                        </Form>   
                    </Modal.Body>
                        <Modal.Footer>              
                            <Button variant="primary" onClick={this.handleSubmit} >Submit</Button>                                        
                            <Button variant="secondary" onClick={() => this.props.handelCloseAddCustomer()} style={{ marginLeft: 30}}>Close</Button> 
                        </Modal.Footer>
            </Modal>

        ]      
        )
    }
}
export default AddCustomer;