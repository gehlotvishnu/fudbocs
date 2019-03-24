import React, { Component } from 'react';
import moment from 'moment';

import { Modal, Button, FormControl, Row, Col } from 'react-bootstrap';

import { saveSchedule, getSchedule, updateSchedule } from '../httpClient';
import { getDaysInMonth, getMonth, getTodaysDate } from '../Helper';
import TiffinDropDown from '../Common/tiffinDropDown';
import Schedule from '../Dialog/Schedule';
import Receipt from '../Bill';

class DialogBox extends Component {
  constructor(props) {
    super(props);
    this.state = {showDialog: false, 
                  printBill: false, 
                  showSchedulerInput: false,
                  radioOptions:0,
                  clickedDay:0,
                  clickedDay2:0};

    this.saveShedule = this.saveShedule.bind(this);
    this._getSchedule = this._getSchedule.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.printBill = this.printBill.bind(this);
    this.HandleRadioOptions=this.HandleRadioOptions.bind(this);
  }

  printBill = () => {
    // your axios call here
    localStorage.setItem("pageData", "Data Retrieved from axios request")
    // route to new page by changing window.location
    window.open('http://localhost:3000/reciept', "_blank") //to open new page
  }

  setSchedule = (data) => {
    this.setState({schedule: data});
  }

  saveShedule() {
      const that = this;
      let bill = [];

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
        customerId: this.props.primaryKey,
        // tiffinType: document.getElementById('TiffinType_Schedule').value,
        isWeekend: document.getElementById('Yes').checked,
        bill: bill,
        isActive: 1
    }

    saveSchedule(obj).then(function(schedule) {
        that.setState({schedule});
    });
  }
  
  getSnapshotBeforeUpdate(prevProps, prevState) {

    if(prevProps.customerId !== this.props.customerId) {
        this._getSchedule("2019-02-07");
    }

    return false;
  }

  componentDidMount() {
    let date = new Date();

    if(document.querySelector("#StartDate")) document.querySelector("#StartDate").valueAsDate = new Date(date.getFullYear(), date.getMonth(), 2);
    if(document.querySelector("#EndDate")) document.querySelector("#EndDate").valueAsDate =  new Date(date.getFullYear(), date.getMonth() + 1, 1);

    // document.getElementById("StartDate").defaultValue = defaultStartDate;
    //console.log("component did mount")

    this._getSchedule("2019-02-07");
  }

  handleClose() {
      this.setState({showDialog: false});
  }

  updateSchedule(index, day, date, colorclass,id) {
    
    //set state if radioOption is not 'normal'
    if(this.state.radioOptions==1){
        //set first click
        if(this.state.clickedDay==0)  {
            this.setState({clickedDay:day})  
        }
        //set second click
        this.state.clickedDay!=0 ?  this.setState({clickedDay2:day}) : this.setState({clickedDay2:0})
    }
    if(this.state.radioOptions==2){
        this.setState({clickedDay:day})  
    }    
    
    let newDate = date.year() + "-" + (date.month() + 1) + "-" + day;
    let tiffin = {};

    this.state.schedule.map(function(data) {
        if(data.day === day){
            if(data.tiffinType === 1) {
                tiffin = {...tiffin, launch: {amount: data.amount, qty: data.qty}}
            }

            if(data.tiffinType === 2) {
                tiffin = {...tiffin, dinner: {amount: data.amount, qty: data.qty}}
            }

            if(data.tiffinType === 4) {
                tiffin = {...tiffin, breakFast: {amount: data.amount, qty: data.qty}}
            }
        }
    });

    this.setState({showDialog: true, index: index, date: newDate, tiffin: tiffin});
  }

  _getSchedule(date) {
    const that = this;

    getSchedule({customerId: this.props.primaryKey, date: date, role: 'admin'}).then(function(schedule) {
        if(schedule.length > 0) {
            that.setState({schedule, showSchedulerInput: false});
        } else {
            that.setState({showSchedulerInput: true});


            let date = new Date();

            if(document.querySelector("#StartDate")) document.querySelector("#StartDate").valueAsDate = new Date(date.getFullYear(), date.getMonth(), 2);
            if(document.querySelector("#EndDate")) document.querySelector("#EndDate").valueAsDate =  new Date(date.getFullYear(), date.getMonth() + 1, 1);
        }
    });
  }

  isDateExistInSchedule(day, month, year) {
    let colorCode = undefined;
    let tiffinType = '';

    this.state.schedule && (this.state.schedule || []).map(function(data, index) {
        if(moment(year + '-' + month + '-' + day).isSame(moment(year + '-' + month + '-' + data.day))) {
            if(data.qty > 0) {
                tiffinType = tiffinType + data.tiffinType;
            }
        }
    });

    // TODO : check if something breaking because of change DAY From Index
    if(tiffinType.indexOf('1') > -1 && tiffinType.indexOf('2') > -1) {
        colorCode = {colorCode: 'both', index: day};
    } else if(tiffinType.indexOf('1') > -1) {
        colorCode = {colorCode: 'launch', index: day};
    } else if(tiffinType.indexOf('2') > -1) {
        colorCode = {colorCode: 'dinner', index: day};
    } else if(tiffinType === '') {
        colorCode = {colorCode: '', index: day}
    }
    
    return colorCode;
  }

  createCalendar = (date) => {
    const days = getDaysInMonth(date.month(), date.year());

    let table = []
    let tr = [];
    let td = [];

    let todaysDay = date.startOf('month').get('day');

    for(let i = 1; i < todaysDay; i++)
    {
        td.push(<td></td>)
    }

    todaysDay = 8 - todaysDay;

    for (let i = 1; i <= days; i++) {
        
        var colorCode = this.isDateExistInSchedule(i, date.month() + 1, date.year());
        
        if(this.state.radioOptions==1  && this.state.clickedDay!=0 && this.state.clickedDay2==0 && i> this.state.clickedDay)
            colorCode=0;
        if(this.state.radioOptions==1  && this.state.clickedDay2!=0 &&(i> this.state.clickedDay  && i < this.state.clickedDay2))
            colorCode=0;
        if(this.state.radioOptions==2  && this.state.clickedDay!=0 && i> this.state.clickedDay)
            colorCode.colorCode='both';
        

        if(i%(todaysDay) === 0) {
            todaysDay += 7;
            td.push(<td className={colorCode && colorCode.colorCode} onClick={() => this.updateSchedule(colorCode && colorCode.index, i, date,colorCode && colorCode.colorCode)}>{i}</td>)
            table.push(<tr>{td}</tr>);
            td = [];
        } else {
            td.push(<td className={colorCode && colorCode.colorCode} onClick={() => this.updateSchedule(colorCode && colorCode.index, i, date,colorCode && colorCode.colorCode)}>{i}</td>)
        }
    }

    if(td.length > 0) {
        table.push(<tr>{td}</tr>);
    }

    return table
  }

  HandleRadioOptions=(event) => {
    //const that = this;
    this.setState({showDialog:false});
    this.setState({radioOptions: event.target.value});
    this.setState({clickedDay:0});
    this.setState({clickedDay2:0});    
  }
  

  render() {
    return (
        <Modal
            title="Manage Schedule"
            show={true}
            onHide={this.props.handleClose} >
            <Modal.Header closeButton>
            <Modal.Title id="example-modal-sizes-title-lg">
              Tiffin Calendar : {this.props.customerName}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>         

           {
               this.state.showSchedulerInput && <div>
                    <Row className="show-grid">
                        <Col md={6} mdPush={6}>
                        Start Date: <FormControl type='date' name='startDate' id='StartDate' />
                        </Col>
                        <Col md={6} mdpull={6}>
                        End Date: <FormControl type='date' name='endDate' id='EndDate' />
                        </Col>
                    </Row>
                  <TiffinDropDown id="Schedule" tiffin={{breakFast: {amount: 20, qty: 1}, launch: {amount: 45, qty: 1}, dinner: {amount: 45, qty: 1} }}/> &nbsp; &nbsp;<br />
                   <label>Include Weekends:</label> &nbsp;
                   <input type="radio" id="Yes" name="drone" value="yes"
                           checked />
                   <label htmlFor="Yes">Yes</label>&nbsp;
                   <input type="radio" id="No" name="drone" value="no" />
                   <label htmlFor="No">No</label> <br />
                   {/* <label>Amount:</label> &nbsp;
                   <input type='text' name='amount' id='Amount' defaultValue='40' /> */}
                   <input type='button' name='saveSchedule' id='SaveShedule' value='Save' onClick={() => this.saveShedule()}/>
               </div>
           }
                <div>
                    <Row className="show-grid">
                        <Col md={6} mdPush={6}>
                        Stop From: <FormControl  name='StopFrom' id='StopFrom' placeholder='Choose Date from Calender' />
                        </Col>
                        <Col md={6} mdpull={6}>
                        Start From: <FormControl  name='StartFrom' id='StartFrom' placeholder='Choose Date from Calender'  />
                        </Col>
                    </Row>
                </div>
            <div>
                <input type='radio' id='radio_normal' value='0' checked={this.state.radioOptions==0} onChange={this.HandleRadioOptions}/>&nbsp;
                <label>Normal</label>&nbsp;                    
                <input type='radio' id='radio_stop_from' value='1' checked={this.state.radioOptions==1} onChange={this.HandleRadioOptions}/>&nbsp;
                <label>Stop After and Start From</label>&nbsp;                   
                <input type='radio' id='radio_start_from' value='2' checked={this.state.radioOptions==2} onChange={this.HandleRadioOptions}/>&nbsp;
                <label>Start From</label>&nbsp;
            </div>

            
            {
                this.state.radioOptions!=0 &&
                <TiffinDropDown id="Schedule" tiffin={{breakFast: {amount: 20, qty: 1}, launch: {amount: 45, qty: 1}, dinner: {amount: 45, qty: 1} }}/> 
            }
          
        
                
           </Modal.Body>
            <div className="month"> 
                <ul>
                    <li className="prev">&#10094;</li>
                    <li className="next">&#10095;</li>
                    <li>{getMonth(getTodaysDate().month())}<br /><span>{getTodaysDate().year()}</span></li>
                </ul>
            </div>
            <table className="weekdays">
                <thead>
                <tr>
                    <td>Mo</td>
                    <td>Tu</td>
                    <td>We</td>
                    <td>Th</td>
                    <td>Fr</td>
                    <td>Sa</td>
                    <td>Su</td>
                </tr>
                </thead>
                <tbody  className="days">
                    {this.createCalendar(getTodaysDate())}
                </tbody>
            </table>
            {
                (this.state.showDialog && this.state.radioOptions==0) && <Schedule role='admin' index={this.state.index} _id={this.state.schedule[0].id} tiffin={this.state.tiffin} customerId={this.props.customerId} date={this.state.date} setSchedule={this.setSchedule} handleClose={() => this.handleClose()}/>
            }
            <Modal.Footer>
            {this.state.radioOptions!=0 ?
                                        <div>
                                        <Button variant="primary"
                                            style={{
                                                marginLeft: 30
                                            }}
                                        >
                                        Save
                                        </Button> </div>
            : undefined
            }
            <Button variant="secondary"
            	style={{
                    marginLeft: 30
                }}
              onClick={() => this.props.handleClose()}>
              Close
            </Button>
            </Modal.Footer>
        </Modal>
        )
    }
}

export default DialogBox;