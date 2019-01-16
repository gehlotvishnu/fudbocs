import React, { Component } from 'react';
import moment from 'moment';

import Dialog from 'react-dialog'
import { Modal, Button, FormControl, Grid, Row, Col } from 'react-bootstrap';

import { saveSchedule, getSchedule, updateSchedule } from '../httpClient';
import { getDaysInMonth, getMonth, getTodaysDate } from '../Helper';
import TiffinDropDown from '../Common/tiffinDropDown';
import Schedule from '../Dialog/Schedule';
import Receipt from '../Bill';

class DialogBox extends Component {
  constructor(props) {
    super(props);
    this.state = {showDialog: false, printBill: false, showSchedulerInput: false};

    this.saveShedule = this.saveShedule.bind(this);
    this._getSchedule = this._getSchedule.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.printBill = this.printBill.bind(this);
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
        customerId: this.props.customerId,
        // tiffinType: document.getElementById('TiffinType_Schedule').value,
        isWeekend: document.getElementById('Yes').checked,
        bill: bill
    }

    saveSchedule(obj).then(function(schedule) {
        console.log("Schedule.............", schedule);
        that.setState({schedule});
    });
  }
  
  getSnapshotBeforeUpdate(prevProps, prevState) {

    if(prevProps.customerId !== this.props.customerId) {
        this._getSchedule();
    }

    return false;
  }

  componentDidMount() {
    let date = new Date();

    if(document.querySelector("#StartDate")) document.querySelector("#StartDate").valueAsDate = new Date(date.getFullYear(), date.getMonth(), 2);
    if(document.querySelector("#EndDate")) document.querySelector("#EndDate").valueAsDate =  new Date(date.getFullYear(), date.getMonth() + 1, 1);

    // document.getElementById("StartDate").defaultValue = defaultStartDate;

      this._getSchedule();
  }

  handleClose() {
      this.setState({showDialog: false});
  }

  updateSchedule(index, day, date) {
    let newDate = date.year() + "-" + (date.month() + 1) + "-" + day;
    let tiffin = {};

    this.state.schedule.monthSchedule.map(function(data) {
        if(data.date === newDate){
            tiffin = data.tiffin;
        }
    });

    this.setState({showDialog: true, index: index, date: newDate, tiffin: tiffin});
  }

  _getSchedule(date) {
    const that = this;

    getSchedule({customerId: this.props.customerId, date: date}).then(function(schedule) {
        console.log("Schedule.............", schedule);
        if(schedule.monthSchedule) {
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

    this.state.schedule && (this.state.schedule.monthSchedule || []).map(function(data, index) {
        if(moment(year + '-' + month + '-' + day).isSame(data.date)) {
            if(data.tiffin) {
                if(data.tiffin.launch && data.tiffin.dinner) {
                    colorCode = {colorCode: 'both', index: index};
                } else if(data.tiffin.launch) {
                    colorCode = {colorCode: 'launch', index: index};
                } else if(data.tiffin.dinner) {
                    colorCode = {colorCode: 'dinner', index: index};
                }
            }
        }
    });

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
        const colorCode = this.isDateExistInSchedule(i, date.month() + 1, date.year());

        if(i%(todaysDay) === 0) {
            todaysDay += 7;
            td.push(<td className={colorCode && colorCode.colorCode} onClick={() => this.updateSchedule(colorCode && colorCode.index, i, date)}>{i}</td>)
            table.push(<tr>{td}</tr>);
            td = [];
        } else {
            td.push(<td className={colorCode && colorCode.colorCode} onClick={() => this.updateSchedule(colorCode && colorCode.index, i, date)}>{i}</td>)
        }
    }

    if(td.length > 0) {
        table.push(<tr>{td}</tr>);
    }

    return table
  }

  render() {

    return (
        <Modal
            title="Manage Schedule"
            show={true}
            onHide={this.props.handleClose} >
            <Modal.Header closeButton>
            <Modal.Title id="example-modal-sizes-title-lg">
              Tiffin Calendar
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <label><strong>{this.props.customerName}</strong> Tiffing Schedule</label>
            <hr />

           {
               this.state.showSchedulerInput && <div>
                   <Grid>
                    <Row className="show-grid">
                        <Col md={6} mdPush={6}>
                        Start Date: <FormControl type='date' name='startDate' id='StartDate' />
                        </Col>
                        <Col md={6} mdPull={6}>
                        End Date: <FormControl type='date' name='endDate' id='EndDate' />
                        </Col>
                    </Row>
                    </Grid>
                  <TiffinDropDown id="Schedule" tiffin={{breakFast: {amount: 20, qty: 1}, launch: {amount: 40, qty: 1}, dinner: {amount: 40, qty: 1} }}/> &nbsp; &nbsp;<br />
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
                this.state.showDialog && <Schedule index={this.state.index} _id={this.state.schedule._id} tiffin={this.state.tiffin} customerId={this.props.customerId} date={this.state.date} setSchedule={this.setSchedule} handleClose={() => this.handleClose()}/>
            }
            <Modal.Footer>
            <Button variant="secondary" type="button" 
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