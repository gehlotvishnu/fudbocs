import React, { Component } from 'react';
import moment from 'moment';

import { Modal, Button, FormControl, Row, Col } from 'react-bootstrap';

import { saveSchedule, getSchedule, updateSchedule } from '../httpClient';
import { getDaysInMonth, getMonth, getTodaysDate } from '../Helper';
import TiffinDropDown from '../Common/tiffinDropDown';
import Schedule from '../Dialog/Schedule';
import Receipt from '../Bill';
import LoadingOverlay from 'react-loading-overlay';

class DialogBox extends Component {
  constructor(props) {
    super(props);
    this.state = {showDialog: false, 
                  printBill: false, 
                  showSchedulerInput: false,                 
                  Start_Stop_Click:0,
                  StopDay:0,
                  StartDay:0,
                  SaveLoading:false,
                };

    this.saveShedule = this.saveShedule.bind(this);
    this._getSchedule = this._getSchedule.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.printBill = this.printBill.bind(this);    
    this.HandleStartStopDates_onClick=this.HandleStartStopDates_onClick.bind(this);
    this.HandleStartStopDates_onChange=this.HandleStartStopDates_onChange.bind(this);
    this.HandleSaveCalender=this.HandleSaveCalender.bind(this);
    this.setSchedule=this.setSchedule.bind(this);
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
  /*
  getSnapshotBeforeUpdate(prevProps, prevState) {

    if(prevProps.customerId !== this.props.customerId) {
        this._getSchedule(getTodaysDate());
    }

    return false;
  }*/

  componentDidMount() {
    //let date = new Date();

    //if(document.querySelector("#StartDate")) document.querySelector("#StartDate").valueAsDate = new Date(date.getFullYear(), date.getMonth(), 2);
    //if(document.querySelector("#EndDate")) document.querySelector("#EndDate").valueAsDate =  new Date(date.getFullYear(), date.getMonth() + 1, 1);

    // document.getElementById("StartDate").defaultValue = defaultStartDate;
    //console.log("component did mount")

    this._getSchedule(getTodaysDate().format('YYYY-MM-DD'));
  }

  handleClose() {
      this.setState({showDialog: false});
  }

  updateSchedule(index, day, date, colorclass,id) {
  
    if(this.state.Start_Stop_Click==1){
        var txt_stop = document.getElementById('StopFrom');
        txt_stop.value = moment([date.year(),date.month(),day]).format('DD-MM-YYYY');
        this.setState({StopDay:day});
    }
    else if(this.state.Start_Stop_Click==2){
        var txt_start = document.getElementById('StartFrom');
        txt_start.value = moment([date.year(),date.month(),day]).format('DD-MM-YYYY');
        this.setState({StartDay:day});
    }
    else{   
    
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
  }

  _getSchedule(date) {
    const that = this;
    console.log(date)
    getSchedule({customerId: this.props.primaryKey, date: date, role: 'admin'}).then(function(schedule) {
        if(schedule.length > 0) {
            that.setState({schedule:schedule, showSchedulerInput: false});
            console.log(schedule)
        } else {
            that.setState({showSchedulerInput: true});

            var date = new Date(); //gives today date 
            var startDay=new Date(date.getFullYear(), date.getMonth(),1);       
            var endDay=new Date(date.getFullYear(), date.getMonth() + 1, 0);
          
            if(document.querySelector("#StartDate")) document.querySelector("#StartDate").value =  moment(startDay).format('YYYY-MM-DD') ;
            if(document.querySelector("#EndDate")) document.querySelector("#EndDate").value = moment(endDay).format('YYYY-MM-DD') ;
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
        
       if(this.state.Start_Stop_Click!=0){        
        if((this.state.StopDay!=0 && i >= this.state.StopDay  ) && (this.state.StartDay!=0 && i < this.state.StartDay  ))
            colorCode=0;
        else if(this.state.StopDay!=0 && this.state.StartDay==0 && i >= this.state.StopDay )
            colorCode=0;
        else if(this.state.StartDay!=0 && this.state.StopDay==0 && i >= this.state.StartDay )
            colorCode.colorCode='both';
       }
      

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

//Click event of stop date and start date textboxes  
  HandleStartStopDates_onClick=(event)=>{
   this.setState({showDialog:false});

   if(event.target.id=='StopFrom') 
    this.setState({Start_Stop_Click:1});  

   if(event.target.id=='StartFrom') 
    this.setState({Start_Stop_Click:2}); 
  }

  //change event of stop date and start date textboxes
  HandleStartStopDates_onChange=(event)=>{ 
    var dt=event.target;  
    
    if(dt.id=='StopFrom') 
     this.setState({StopDay:dt.value.substr(0,2)});  
 
    if(dt.id=='StartFrom') 
     this.setState({StartDay: dt.value.substr(0,2)});   
   }
  
   HandleSaveCalender(){
    const that = this;

    //show loading
    that.setState({SaveLoading:true});
    console.log(that.state.SaveLoading)
    
    //get indexes for loop
    var index1=0;
    var index2=0;
    if(that.state.StopDay==0 && that.state.StartDay!=0){
         index1=that.state.StartDay;
         var startdt= document.getElementById('StartFrom').value;
         //[month - 1] (zero based index for months)
         index2=getDaysInMonth(startdt.substr(3,2), startdt.substr(6));      
    }
    if(that.state.StartDay==0 && that.state.StopDay!=0){
        index1=that.state.StopDay;
        var stopdt= document.getElementById('StopFrom').value;
        index2=getDaysInMonth(stopdt.substr(3,2), stopdt.substr(6));
    }
   if(that.state.StartDay!=0 && that.state.StopDay!=0){
    index1=that.state.StopDay;   
    index2=that.state.StartDay;
    }    
    //for loop for each day
    for(let i=index1;i<=index2;i++)
    {
        //get tiffin data
        const { props } = this;
		let bill = [];
		if(document.getElementById('BreakFast_StopStart').checked) {
			const amt = this.props.role === 'admin' ? document.getElementById('Amount_BreakFast_StopStart').value : this.props.breakFast ? this.props.breakFast.amount : '20';
			const qty = this.props.role === 'admin' ? document.getElementById('Quantity_BreakFast_StopStart').value : this.props.breakFast ? this.props.breakFast.qty : '1';

			bill.push({tiffinType: '4', amount: amt, qty: qty, isActive: 1})
		} else {
			bill.push({tiffinType: '4', amount: 0, qty: 0, isActive: 0})
		}

		if(document.getElementById('Launch_StopStart').checked) {
			const amt = this.props.role === 'admin' ? document.getElementById('Amount_Launch_StopStart').value : this.props.launch ? this.props.launch.amount : '45';
			const qty = this.props.role === 'admin' ? document.getElementById('Quantity_Launch_StopStart').value : this.props.launch ? this.props.launch.qty : '1';
			bill.push({tiffinType: '1', amount: amt, qty: qty, isActive: 1})
		} else {
			bill.push({tiffinType: '1', amount: 0, qty: 0, isActive: 0})
		}

		if(document.getElementById('Dinner_StopStart').checked) {
			const amt = this.props.role === 'admin' ?  document.getElementById('Amount_Dinner_StopStart').value : this.props.dinner ? this.props.dinner.amount : '45';
			const qty = this.props.role === 'admin' ?  document.getElementById('Quantity_Dinner_StopStart').value : this.props.dinner ? this.props.dinner.qty : '1';
			bill.push({tiffinType: '2', amount: amt, qty: qty, isActive: 1})
		} else {
			bill.push({tiffinType: '2', amount: 0, qty: 0, isActive: 0})
        }
        
        //update day by day
        var obj = {
			_id: this.state.schedule[0].id,
			customerId: props.customerId,
            index: props.index,
            //month are zero indexed so jan is 0 
			date: getTodaysDate().year() +'-' + (getTodaysDate().month()+1) + '-' + i ,
			bill: bill,
			role: props.role,
			isActive: 1
            // tiffinType: document.getElementById('TiffinType_Update').value,
            
        }
       
		updateSchedule(obj).then(function(data) {           
		});    
    }

    //close
    //that.props.handleClose();
     //console.log(data)
     //that.setSchedule(data);

     //reload the schedule state array
     that._getSchedule(getTodaysDate().format('YYYY-MM-DD')); 

    //hide loading
    that.setState({SaveLoading:false});
    console.log(this.state.SaveLoading)

    //reset
    that.setState({Start_Stop_Click:0});
    that.setState({StopDay:0});
    that.setState({StartDay:0});
    document.getElementById('StartFrom').value='';
    document.getElementById('StopFrom').value='';

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
           {  !this.state.showSchedulerInput &&  <div>
                    <Row className="show-grid">
                        <Col md={6} mdPush={6}>
                        Stop From: <FormControl  name='StopFrom' id='StopFrom' placeholder='Choose Date from Calender' onClick={this.HandleStartStopDates_onClick} onChange={this.HandleStartStopDates_onChange}/>
                        </Col>
                        <Col md={6} mdpull={6}>
                        Start From: <FormControl  name='StartFrom' id='StartFrom' placeholder='Choose Date from Calender' onClick={this.HandleStartStopDates_onClick} onChange={this.HandleStartStopDates_onChange}/>
                        </Col>
                    </Row>
                </div>    
                }      
            {
                this.state.Start_Stop_Click!=0 &&
                <TiffinDropDown id="StopStart" check={this.check} role={this.props.role} tiffin={{breakFast: {amount: 20, qty: 1}, launch: {amount: 45, qty: 1}, dinner: {amount: 45, qty: 1} }}/> 
            }        
              
           </Modal.Body>
           <LoadingOverlay active={this.state.SaveLoading} spinner  text='Loading ..'> 
            </LoadingOverlay> 
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
                (this.state.showDialog && this.state.Start_Stop_Click==0) && <Schedule role='admin' index={this.state.index} _id={this.state.schedule[0].id} tiffin={this.state.tiffin} customerId={this.props.customerId} date={this.state.date} setSchedule={this.setSchedule} handleClose={() => this.handleClose()}/>
            }            
            <Modal.Footer>              
            {this.state.Start_Stop_Click!=0 &&
                                        <div>
                                        <Button variant="primary" onClick={this.HandleSaveCalender} disabled={this.state.SaveLoading}
                                            style={{
                                                marginLeft: 30
                                            }}
                                        >
                                        Save
                                        </Button>                                        
                                        </div>
            
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