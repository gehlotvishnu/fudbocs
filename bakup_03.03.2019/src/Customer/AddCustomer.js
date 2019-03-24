import React from 'react'
import { Modal, Button, ButtonToolbar } from 'react-bootstrap';

class AddCustomer extends React.Component{
    constructor(props){
        super(props);

    }

    render(){
        return ([
            <Modal title="Add Customer" show={true}onHide={this.props.handleClose}>
                <Modal.Body>
                    Add Customer					
				</Modal.Body>
            </Modal>

        ]      
        )
    }
}
export default AddCustomer;