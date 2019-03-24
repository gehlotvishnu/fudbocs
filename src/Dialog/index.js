import React, { Component } from 'react';
import { Modal, Button, FormControl, Row, Col } from 'react-bootstrap';
import { saveSchedule} from '../httpClient';
import TiffinDropDown from '../Common/tiffinDropDown';
import moment from 'moment';

class DialogBox extends Component {
  constructor(props) {
    super(props);    
    this.saveShedule = this.saveShedule.bind(this);
   }

  componentDidMount() {
    var date = new Date(); //gives today date 
    var startDay=new Date(date.getFullYear(), date.getMonth(),1);       
    var endDay=new Date(date.getFullYear(), date.getMonth() + 1, 0);          
    console.log(startDay)
    console.log(endDay)
    document.getElementById("StartDate").value =  moment(startDay).format('YYYY-MM-DD') ;
    document.getElementById("EndDate").value = moment(endDay).format('YYYY-MM-DD') ;

  }
  

  saveShedule() {
      const that = this;
      let bill = [];

      that.props.Set_label_loading(true,'Saving...');
      that.props.handleClose();

      if(document.getElementById('BreakFast_Schedule').checked) {
        bill.push({tiffinType: '4', amount: document.getElementById('Amount_BreakFast_Schedule').value, qty: document.getElementById('Quantity_BreakFast_Schedule').value})
      }

      if(document.getElementById('Launch_Schedule').checked) {
        bill.push({tiffinType: '1', amount: document.getElementById('Amount_Launch_Schedule').value, qty: document.getElementById('Quantity_Launch_Schedule').value})
      }

      if(document.getElementById('Dinner_Schedule').checked) {
        bill.push({tiffinType: '2', amount: document.getElementById('Amount_Dinner_Schedule').value, qty: document.getElementById('Quantity_Dinner_Schedule').value})
      }

      const obj = {
        startDate: document.getElementById('StartDate').value,
        endDate: document.getElementById('EndDate').value,
        customerId: this.props.customerId,
        breakfast: document.getElementById('BreakFast_Schedule').checked ? 1 : 0,
        breakfast_qty: document.getElementById('BreakFast_Schedule').checked ? document.getElementById('Quantity_BreakFast_Schedule').value : 0, 
        breakfast_amount: document.getElementById('BreakFast_Schedule').checked ? document.getElementById('Amount_BreakFast_Schedule').value : 0, 
        lunch:document.getElementById('Launch_Schedule').checked ? 1 : 0       , 
        lunch_qty: document.getElementById('Launch_Schedule').checked ? document.getElementById('Quantity_Launch_Schedule').value : 0, 
        lunch_amount: document.getElementById('Launch_Schedule').checked ? document.getElementById('Amount_Launch_Schedule').value : 0, 
        dinner:document.getElementById('Dinner_Schedule').checked ? 1 : 0, 
        dinner_qty: document.getElementById('Dinner_Schedule').checked ? document.getElementById('Quantity_Dinner_Schedule').value :0, 
        dinner_amount: document.getElementById('Dinner_Schedule').checked ? document.getElementById('Amount_Dinner_Schedule').value : 0,  
        exclude_MON: document.getElementById('chkbox_mon').checked ? 1: 0, 
        exclude_TUE: document.getElementById('chkbox_tue').checked ? 1: 0, 
        exclude_WED: document.getElementById('chkbox_wed').checked ? 1: 0,  
        exclude_THU: document.getElementById('chkbox_thu').checked ? 1: 0, 
        exclude_FRI: document.getElementById('chkbox_fri').checked ? 1: 0,  
        exclude_SAT: document.getElementById('chkbox_sat').checked ? 1: 0,  
        exclude_SUN: document.getElementById('chkbox_sun').checked ? 1: 0,        
        createdBy: 'Admin',
        // tiffinType: document.getElementById('TiffinType_Schedule').value,
        //isWeekend: document.getElementById('Yes').checked,
        bill: bill,
        isActive: 1
    } 
    saveSchedule(obj).then(function(schedule) {
        that.props.Set_label_loading(false,'Successfully Saved.');   
        console.log('Saved Successfully')             
    });
  } 

  check(role, date, time) {
    if(role === 'user') {
        if(moment().isAfter(moment(date))) {
            if(moment().diff(date, 'days') === 0) {
                if(moment().isAfter(moment(time, "HH:mm a"))) {
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
            title="Manage Schedule"
            show={true}
            onHide={this.props.handleClose} >
            <Modal.Header closeButton>
            <Modal.Title id="example-modal-sizes-title-lg">
              Schedule Preferences : {this.props.customerName}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>          
            <div>
                <Row className="show-grid">
                    <Col md={6} mdPush={6}>
                    Start Date: <FormControl type='date' name='startDate' id='StartDate' />
                    </Col>
                    <Col md={6} mdpull={6}>
                    End Date: <FormControl type='date' name='endDate' id='EndDate' />
                    </Col>
                </Row>
                <TiffinDropDown id="Schedule" check={this.check} role={this.props.role} tiffin={{breakFast: {amount: 20, qty: 1}, launch: {amount: 45, qty: 1}, dinner: {amount: 45, qty: 1} }}/> &nbsp; &nbsp;<br />                
                <label>Exclude Days:</label>&nbsp;
                <label><input type='checkbox' id='chkbox_mon'/>MON</label>&nbsp;
                <label><input type='checkbox' id='chkbox_tue'/>TUE</label>&nbsp;
                <label><input type='checkbox' id='chkbox_wed'/>WED</label>&nbsp;
                <label><input type='checkbox' id='chkbox_thu'/>THU</label>&nbsp;
                <label><input type='checkbox' id='chkbox_fri'/>FRI</label>&nbsp;
                <label><input type='checkbox' id='chkbox_sat'/>SAT</label>&nbsp;
                <label><input type='checkbox' id='chkbox_sun'/>SUN</label>
                <br />
            </div>                       
           </Modal.Body>           
            <Modal.Footer>            
                <Button variant="primary" style={{ marginLeft: 30}}   onClick={() => this.saveShedule() }>
                Save
                </Button>
                <Button variant="secondary"	style={{ marginLeft: 30}}  onClick={() => this.props.handleClose()}>
                Close
                </Button>
            </Modal.Footer>
        </Modal>

        )
    }
}

export default DialogBox;