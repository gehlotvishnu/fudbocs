import React from 'react';
import moment from 'moment';
import { Modal, Button, FormControl, Row, Col } from 'react-bootstrap';
import { saveSchedule, getSchedule, updateSchedule, updateScheduleFrom } from '../httpClient';
import { getDaysInMonth, getMonth, getTodaysDate } from '../Helper';
import TiffinDropDown from '../Common/tiffinDropDown';
import Schedule from '../Dialog/Schedule';
import Receipt from '../Bill';
import LoadingOverlay from 'react-loading-overlay';

class Calender extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showDialog: false,
      Start_Stop_Click: 0,
      StopDay: 0,
      StartDay: 0,
      chk_breakfast: false,
      chk_launch: false,
      chk_dinner: false,
      SaveLoading: false,
    };


    this._getSchedule = this._getSchedule.bind(this);
    this.handleClose = this.handleClose.bind(this);
    //this.printBill = this.printBill.bind(this);    
    this.HandleStartStopDates_onClick = this.HandleStartStopDates_onClick.bind(this);
    this.HandleStartStopDates_onChange = this.HandleStartStopDates_onChange.bind(this);
    this.HandleSaveCalender = this.HandleSaveCalender.bind(this);
    this.setSchedule = this.setSchedule.bind(this);
    this.HandleCheckTiffin = this.HandleCheckTiffin.bind(this);
  }

  //load calender by getting schedule
  componentDidMount() {
    this._getSchedule(getTodaysDate().format('YYYY-MM-DD'));
  }

  //set calender of month schedule state
  setSchedule = (data) => {
    this.setState({ schedule: data });
  }

  handleClose() {
    this.setState({ showDialog: false });
  }

  updateSchedule(index, day, date, colorclass, id) {

    if (this.state.Start_Stop_Click == 1) {
      var txt_stop = document.getElementById('StopFrom');
      txt_stop.value = moment([date.year(), date.month(), day]).format('DD-MM-YYYY');
      this.setState({ StopDay: day });
    }
    else if (this.state.Start_Stop_Click == 2) {
      var txt_start = document.getElementById('StartFrom');
      txt_start.value = moment([date.year(), date.month(), day]).format('DD-MM-YYYY');
      this.setState({ StartDay: day });
    }
    else {

      let newDate = date.year() + "-" + (date.month() + 1) + "-" + day;
      let tiffin = {};

      this.state.schedule.map(function (data) {
        if (data.day === day) {
          if (data.tiffinType === 1) {
            tiffin = { ...tiffin, launch: { amount: data.amount, qty: data.qty } }
          }

          if (data.tiffinType === 2) {
            tiffin = { ...tiffin, dinner: { amount: data.amount, qty: data.qty } }
          }

          if (data.tiffinType === 4) {
            tiffin = { ...tiffin, breakFast: { amount: data.amount, qty: data.qty } }
          }
        }
      });
      this.setState({ showDialog: true, index: index, date: newDate, tiffin: tiffin });
    }
  }

  _getSchedule(date) {
    const that = this;
    getSchedule({ customerId: this.props.customerInfo.id, date: date, role: 'admin' }).then(function (schedule) {
      if (schedule.length > 0) {
        that.setState({ schedule: schedule });
      }
    });
  }

  //get css for any day
  isDateExistInSchedule(day, month, year) {
    let colorCode = undefined;
    let tiffinType = '';

    this.state.schedule && (this.state.schedule || []).map(function (data, index) {
      if (moment(year + '-' + month + '-' + day).isSame(moment(year + '-' + month + '-' + data.day))) {
        if (data.qty > 0) {
          tiffinType = tiffinType + data.tiffinType;
        }
      }
    });

    // TODO : check if something breaking because of change DAY From Index
    if (tiffinType.indexOf('1') > -1 && tiffinType.indexOf('2') > -1) {
      colorCode = { colorCode: 'both', index: day };
    } else if (tiffinType.indexOf('1') > -1) {
      colorCode = { colorCode: 'launch', index: day };
    } else if (tiffinType.indexOf('2') > -1) {
      colorCode = { colorCode: 'dinner', index: day };
    } else if (tiffinType === '') {
      colorCode = { colorCode: '', index: day }
    }

    return colorCode;
  }

  getColorCode(breakfast, launch, dinner) {
    var colorCode = '';
    if (launch && dinner)
      return colorCode = { colorCode: 'both' };
    else if (launch)
      return colorCode = { colorCode: 'launch' };
    else if (dinner)
      return colorCode = { colorCode: 'dinner' };
    else
      return colorCode = { colorCode: '' };
  }


  createCalendar = (date) => {
    const days = getDaysInMonth(date.month(), date.year());
    let table = []
    let tr = [];
    let td = [];

    let todaysDay = date.startOf('month').get('day');
    for (let i = 1; i < todaysDay; i++) {
      td.push(<td></td>)
    }
    todaysDay = 8 - todaysDay;

    for (let i = 1; i <= days; i++) {

      var colorCode = this.isDateExistInSchedule(i, date.month() + 1, date.year());

      if (this.state.Start_Stop_Click != 0) {
        if ((this.state.StopDay != 0 && i >= this.state.StopDay) && (this.state.StartDay != 0 && i < this.state.StartDay))
          colorCode = this.getColorCode(this.state.chk_breakfast, this.state.chk_launch, this.state.chk_dinner)
        else if (this.state.StopDay != 0 && this.state.StartDay == 0 && i >= this.state.StopDay)
          colorCode = this.getColorCode(this.state.chk_breakfast, this.state.chk_launch, this.state.chk_dinner)
        else if (this.state.StartDay != 0 && this.state.StopDay == 0 && i >= this.state.StartDay)
          colorCode = this.getColorCode(this.state.chk_breakfast, this.state.chk_launch, this.state.chk_dinner)
      }


      if (i % (todaysDay) === 0) {
        todaysDay += 7;
        td.push(<td className={colorCode && colorCode.colorCode} onClick={() => this.updateSchedule(colorCode && colorCode.index, i, date, colorCode && colorCode.colorCode)}>{i}</td>)
        table.push(<tr>{td}</tr>);
        td = [];
      } else {
        td.push(<td className={colorCode && colorCode.colorCode} onClick={() => this.updateSchedule(colorCode && colorCode.index, i, date, colorCode && colorCode.colorCode)}>{i}</td>)
      }
    }

    if (td.length > 0) {
      table.push(<tr>{td}</tr>);
    }

    return table
  }

  //click on checknoxes of Tiffin Drowpdown
  HandleCheckTiffin(role, date, time) {
    if (document.getElementById('BreakFast_StopStart').checked) {
      this.setState({ chk_breakfast: true });
    } else {
      this.setState({ chk_breakfast: false });
    }
    if (document.getElementById('Launch_StopStart').checked) {
      this.setState({ chk_launch: true });
    } else {
      this.setState({ chk_launch: false });
    }
    if (document.getElementById('Dinner_StopStart').checked) {
      this.setState({ chk_dinner: true });
    } else {
      this.setState({ chk_dinner: false });
    }

    if (role === 'user') {
      if (moment().isAfter(moment(date))) {
        if (moment().diff(date, 'days') === 0) {
          if (moment().isAfter(moment(time, "HH:mm a"))) {
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
  HandleStartStopDates_onClick = (event) => {
    this.setState({ showDialog: false });

    if (event.target.id == 'StopFrom') {
      this.setState({ Start_Stop_Click: 1 });
      //document.getElementById('BreakFast_StopStart').checked=false;
    }

    if (event.target.id == 'StartFrom')
      this.setState({ Start_Stop_Click: 2 });
  }

  //change event of stop date and start date textboxes
  HandleStartStopDates_onChange = (event) => {
    var dt = event.target;

    if (dt.id == 'StopFrom')
      this.setState({ StopDay: dt.value.substr(0, 2) });

    if (dt.id == 'StartFrom')
      this.setState({ StartDay: dt.value.substr(0, 2) });
  }

  HandleSaveCalender() {
    const that = this;

    //show loading
    that.setState({ SaveLoading: true });

    //get tiffin data
    const { props } = this;
    let bill = [];
    if (document.getElementById('BreakFast_StopStart').checked) {
      const amt = this.props.role === 'admin' ? document.getElementById('Amount_BreakFast_StopStart').value : this.props.breakFast ? this.props.breakFast.amount : '20';
      const qty = this.props.role === 'admin' ? document.getElementById('Quantity_BreakFast_StopStart').value : this.props.breakFast ? this.props.breakFast.qty : '1';

      bill.push({ tiffinType: '4', amount: amt, qty: qty, isActive: 1 })
    } else {
      bill.push({ tiffinType: '4', amount: 0, qty: 0, isActive: 0 })
    }
    if (document.getElementById('Launch_StopStart').checked) {
      const amt = this.props.role === 'admin' ? document.getElementById('Amount_Launch_StopStart').value : this.props.launch ? this.props.launch.amount : '45';
      const qty = this.props.role === 'admin' ? document.getElementById('Quantity_Launch_StopStart').value : this.props.launch ? this.props.launch.qty : '1';
      bill.push({ tiffinType: '1', amount: amt, qty: qty, isActive: 1 })
    } else {
      bill.push({ tiffinType: '1', amount: 0, qty: 0, isActive: 0 })
    }
    if (document.getElementById('Dinner_StopStart').checked) {
      const amt = this.props.role === 'admin' ? document.getElementById('Amount_Dinner_StopStart').value : this.props.dinner ? this.props.dinner.amount : '45';
      const qty = this.props.role === 'admin' ? document.getElementById('Quantity_Dinner_StopStart').value : this.props.dinner ? this.props.dinner.qty : '1';
      bill.push({ tiffinType: '2', amount: amt, qty: qty, isActive: 1 })
    } else {
      bill.push({ tiffinType: '2', amount: 0, qty: 0, isActive: 0 })
    }

    ////////////////////////////get array of days affected by startfrom & stopfrom///////
    //get indexes for loop
    let CalenderDays = [];
    var index1 = 0;
    var index2 = 0;
    if (that.state.StopDay == 0 && that.state.StartDay != 0) {
      index1 = that.state.StartDay;
      var startdt = document.getElementById('StartFrom').value;
      index2 = getDaysInMonth(startdt.substr(3, 2) - 1, startdt.substr(6));
    }
    if (that.state.StartDay == 0 && that.state.StopDay != 0) {
      index1 = that.state.StopDay;
      var stopdt = document.getElementById('StopFrom').value;
      index2 = getDaysInMonth(stopdt.substr(3, 2) - 1, stopdt.substr(6));
    }
    if (that.state.StartDay != 0 && that.state.StopDay != 0) {
      index1 = that.state.StopDay;
      index2 = that.state.StartDay - 1;
    }
    //for loop for each day
    for (let i = index1; i <= index2; i++) {
      CalenderDays.push(i);
    }
    console.log('index1:' + index1)
    console.log('index2:' + index2)
    console.log('StartDay:' + that.state.StartDay)
    console.log('StopDay:' + that.state.StopDay)
    console.log('startdt:' + document.getElementById('StartFrom').value)
    console.log('stopdt:' + document.getElementById('StopFrom').value)
    ////////////////////////////////////////////////////////////////////

    var obj = {
      customerId: props.customerInfo.id,
      //customerId: props.customerId,
      scheduleId: that.state.schedule[0].id,
      bill: bill,
      role: that.props.role,
      isActive: 1,
      CalenderDays: CalenderDays
    }

    console.log(obj)

    updateScheduleFrom(obj).then(function (data) {
      that.setSchedule(data);

      //hide loading
      that.setState({ SaveLoading: false });

      //reset
      that.setState({ Start_Stop_Click: 0 });
      that.setState({ StopDay: 0 });
      that.setState({ StartDay: 0 });
      document.getElementById('StartFrom').value = '';
      document.getElementById('StopFrom').value = '';
    });
  }

  render() {
    return (
      <Modal
        title="Manage Schedule"
        show={true}
        onHide={this.props.handleClose} >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
            Tiffin Calendar : {this.props.customerInfo.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>

          <div>
            <Row className="show-grid">
              <Col md={6} mdPush={6}>
                Stop From: <FormControl name='StopFrom' id='StopFrom' placeholder='Choose Date from Calender' onClick={this.HandleStartStopDates_onClick} onChange={this.HandleStartStopDates_onChange} />
              </Col>
              <Col md={6} mdpull={6}>
                Start From: <FormControl name='StartFrom' id='StartFrom' placeholder='Choose Date from Calender' onClick={this.HandleStartStopDates_onClick} onChange={this.HandleStartStopDates_onChange} />
              </Col>
            </Row>
          </div>

          {
            this.state.Start_Stop_Click != 0 &&
            <TiffinDropDown id="StopStart" check={this.HandleCheckTiffin} role={this.props.role} tiffin={{}} />
          }


        </Modal.Body>
        <LoadingOverlay active={this.state.SaveLoading} spinner text='Loading ..'>
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
          <tbody className="days">
            {this.createCalendar(getTodaysDate())}
          </tbody>
        </table>
        {
          (this.state.showDialog && this.state.Start_Stop_Click == 0) && <Schedule role='admin' index={this.state.index} _id={this.state.schedule[0].id} tiffin={this.state.tiffin} customerId={this.props.customerInfo.id} date={this.state.date} setSchedule={this.setSchedule} handleClose={() => this.handleClose()} />
        }
        <Modal.Footer>
          {this.state.Start_Stop_Click != 0 &&
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
export default Calender;