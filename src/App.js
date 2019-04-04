import React, { Component } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import 'bootstrap/dist/css/bootstrap.min.css';
import LoadingOverlay from 'react-loading-overlay';

import './App.css';
import Customer from './Customer/Customer';
import Print from './Print';
import { filterCustomer, CheckScheduleExist } from './httpClient';
import { getTodaysDate, getTodaysDateWithTime, getTodaysDateMMDDYYYY } from './Helper';
import { logout } from './Server/user';
import AddCustomer from './Customer/AddCustomer';
import EditCustomer from './Customer/EditCustomer';
import DialogBox from './Dialog'
import Calender from './Dialog/Calender';
import { Button, Collapse } from 'react-bootstrap'


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isDialogOpen: false,
      isPrint: false,
      lgShow: false,
      ShowAddCustomer: false,
      ShowEditCustomer: false,
      ShowSchedulerPref: false,
      ShowScheduleCalender: false,
      customerId: 0,
      customerName: '',
      CurrentCustomer: {},
      Action_Status: { IsLoading: false, LoadingText: '' },
      Filteropen: false,
      FilterLoading: false
    }
    this.setCustomers = this.setCustomers.bind(this);
    this.filterCustomer = this.filterCustomer.bind(this);
    this.print = this.print.bind(this);
    this.printDocument = this.printDocument.bind(this);
    this._CheckScheduleExist = this._CheckScheduleExist.bind(this);
    this.Set_label_loading = this.Set_label_loading.bind(this);
  }

  componentDidMount() {
    document.querySelector("#Date_Search").valueAsDate = new Date();
  }

  Set_label_loading(ISLoading, loadingText) {
    let mystate = { ... this.state.Action_Status };
    mystate.IsLoading = ISLoading;
    mystate.LoadingText = loadingText;
    this.setState({ Action_Status: mystate });
  }

  print() {
    this.setState({ isPrint: true, lgShow: true });
  }

  resetCustomer() {
    const customers = this.state.originalList.slice();
    this.setState({ customers: customers, originalList: customers });

    //reset components
    document.getElementById('Name_Search').value = '';
    document.getElementById('Gali_Sector_Search').value = '';
    document.getElementById('Area_Search').value = '';
    document.getElementById('Mobile_Search').value = '';
    document.getElementById('Email_Search').value = '';
    document.getElementById('BreakFast_Search').checked = false;
    document.getElementById('Launch_Search').checked = false;
    document.getElementById('Dinner_Search').checked = false;
    document.getElementById('Date_Search').valueAsDate = new Date();

  }

  setCustomers(customers) {
    this.setState({ customers: customers, originalList: customers })
  }

  getTiffinType() {
    if (document.getElementById('BreakFast_Search').checked && document.getElementById('Launch_Search').checked && document.getElementById('Dinner_Search')) {
      return 'BreakFast, Launch and Dinner';
    } else if (document.getElementById('Launch_Search').checked && document.getElementById('Dinner_Search').checked) {
      return 'Launch And Dinner';
    } else if (document.getElementById('Launch_Search').checked) {
      return 'Launch';
    } else if (document.getElementById('Dinner_Search').checked) {
      return 'Dinner';
    } else if (document.getElementById('BreakFast_Search').checked) {
      return 'BreakFast';
    }

    return 'BreakFast, Launch and Dinner'
  }

  filterCustomer() {
    const that = this;

    //get values of search controls
    const products = this.state.originalList.slice();
    const Name = document.getElementById('Name_Search').value;
    const Gali_Sector = document.getElementById('Gali_Sector_Search').value;
    const Area = document.getElementById('Area_Search').value;
    const Mobile = document.getElementById('Mobile_Search').value;
    const Email = document.getElementById('Email_Search').value;
    const breakfast = document.getElementById('BreakFast_Search').checked;
    const launch = document.getElementById('Launch_Search').checked;
    const dinner = document.getElementById('Dinner_Search').checked;
    const Date_on = document.getElementById('Date_Search').value;


    let tiffinType = '';
    if (launch && dinner && breakfast) {
      tiffinType = '1,2,4';
    } else if (launch && dinner) {
      tiffinType = '1,2';
    } else if (launch && breakfast) {
      tiffinType = '1,4';
    } else if (dinner && breakfast) {
      tiffinType = '2,4';
    } else if (launch) {
      tiffinType = '1';
    } else if (dinner) {
      tiffinType = '2';
    } else if (breakfast) {
      tiffinType = '4';
    } else {
      //if no checkbox of breakfast,luanch or dinner is selected
      tiffinType = '';
    }

    let newProducts = [];
    let insert = true;

    //if tiffintype is blank means no need to fetch from server
    if (tiffinType != '') {
      this.setState({ FilterLoading: true });
      filterCustomer(Date_on, tiffinType).then(function (data) {

        that.setState({ FilterLoading: false });

        let tempNewProducts = [];
        products.map(function (customer) {
          insert = true;
          if (Name !== '' && customer.name.toLowerCase().indexOf(Name.toLowerCase()) === -1) {
            insert = false;
          }
          if (Gali_Sector !== '' && customer.GaliSector.toLowerCase().indexOf(Gali_Sector.toLowerCase()) === -1) {
            insert = false;
          }
          if (Area !== '' && customer.Area.toLowerCase().indexOf(Area.toLowerCase()) === -1) {
            insert = false;
          }
          if (Mobile !== '' && customer.mobile.toLowerCase().indexOf(Mobile.toLowerCase()) === -1) {
            insert = false;
          }
          if (Email !== '' && customer.email.toLowerCase().indexOf(Email.toLowerCase()) === -1) {
            insert = false;
          }
          if (customer.TiffinType && tiffinType !== '' && customer.TiffinType.indexOf(tiffinType) === -1) {
            insert = false;
          }
          insert && tempNewProducts.push(customer);
        });

        tempNewProducts.map(function (customer) {
          insert = false;
          if (data && data.length > 0) {
            data.map(function (schedule) {
              if (customer._id === schedule._id) {
                insert = true;
              }
            });
            insert && newProducts.push(customer);
          }
        });

        that.setState({ customers: newProducts });

      });
    } else {
      products.map(function (customer) {
        insert = true;
        if (Name !== '' && customer.name.toLowerCase().indexOf(Name.toLowerCase()) === -1) {
          insert = false;
        }
        if (Gali_Sector !== '' && customer.GaliSector.toLowerCase().indexOf(Gali_Sector.toLowerCase()) === -1) {
          insert = false;
        }
        if (Area !== '' && customer.Area.toLowerCase().indexOf(Area.toLowerCase()) === -1) {
          insert = false;
        }
        if (Mobile !== '' && customer.mobile.toLowerCase().indexOf(Mobile.toLowerCase()) === -1) {
          insert = false;
        }
        if (Email !== '' && customer.email.toLowerCase().indexOf(Email.toLowerCase()) === -1) {
          insert = false;
        }
        insert && newProducts.push(customer)
      });
      this.setState({ customers: newProducts });
    }
  }

  _CheckScheduleExist(id) {

    const that = this;
    var date = getTodaysDate().format('YYYY-MM-DD');

    CheckScheduleExist({ customerId: id, date: date, role: 'admin' }).then(function (status) {
      if (status > 0) {
        that.setState({ ShowSchedulerPref: false, ShowScheduleCalender: true });
      } else {
        that.setState({ ShowSchedulerPref: true, ShowScheduleCalender: false });
        /*var date = new Date(); //gives today date 
        var startDay=new Date(date.getFullYear(), date.getMonth(),1);       
        var endDay=new Date(date.getFullYear(), date.getMonth() + 1, 0);
      
        if(document.querySelector("#StartDate")) document.querySelector("#StartDate").value =  moment(startDay).format('YYYY-MM-DD') ;
        if(document.querySelector("#EndDate")) document.querySelector("#EndDate").value = moment(endDay).format('YYYY-MM-DD') ;*/
      }
    });
  }

  openScheduleDialog = (customerInfo) => {
    this.setState({ CurrentCustomer: customerInfo });
    this._CheckScheduleExist(customerInfo.id);
  }

  handleScheduleClose = () => this.setState({ ShowSchedulerPref: false, ShowScheduleCalender: false })

  handelCloseAddCustomer = () => this.setState({ ShowAddCustomer: false })

  openEditCustDialog = (customerInfo) => this.setState({ ShowEditCustomer: true, CurrentCustomer: customerInfo })

  handelCloseEditCustomer = () => this.setState({ ShowEditCustomer: false })

  printDocument() {
    const that = this;
    const pdfsize = 'a4';
    const pdf = new jsPDF('p', 'mm', pdfsize);

    var table = document.getElementById('customerList').cloneNode(true);
    for (var i = 0; i < table.rows.length; i++) {
      table.rows[i].deleteCell(2); //delete the cell
      table.rows[i].deleteCell(4); //delete the cell
      table.rows[i].deleteCell(5); //delete the cell
    }
    const res = pdf.autoTableHtmlToJson(table);

    var totalPagesExp = pdf.internal.getNumberOfPages();

    var pageContent = function (data) {
      // HEADER
      pdf.setFontSize(12);
      pdf.setTextColor(40);
      pdf.setFontStyle('bold');
      pdf.text("Fudbocs", 105 - 7, 15)
      const listdate = document.getElementById('Date_Search').value;
      const headerrow2 = ("\nTiffin List of " + that.getTiffinType() + " for: " + listdate.substr(8, 2) + '-' + listdate.substr(5, 2) + '-' + listdate.substr(0, 4));
      pdf.text(headerrow2, (210 - headerrow2.length * 1.8) / 2, 15);

      // FOOTER
      var str = "Page " + data.pageCount;
      // Total page number plugin only available in jspdf v1.0+
      if (typeof pdf.putTotalPages === 'function') {
        str = str + " of " + totalPagesExp;
      }
      pdf.setFontSize(10);
      pdf.text(getTodaysDateWithTime(), data.settings.margin.left, pdf.internal.pageSize.height - 10);
      pdf.text(str, pdf.internal.pageSize.width - 30, pdf.internal.pageSize.height - 10);
    };


    pdf.autoTable({
      didDrawPage: pageContent,
      startY: 25,
      head: [['SrNo', 'Name', 'Address', 'Mobile', 'Remaks', 'Given', 'Taken']],
      body: res.data,
      didDrawCell: data => {
        if (data.section === 'head') {
          //draw header borders
          pdf.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, data.cell.styles.fillStyle);
        }
      },
      styles: {
        overflow: 'linebreak',
        fontSize: 10,
        tableWidth: 'auto',
        cellWidth: 'auto',
      },
      headStyles: {
        textColor: 100,
        fillColor: 230,
        halign: 'center'
      },
      columnStyles: {
        text: { cellWidth: 'wrap' },
        0: { cellWidth: 10, halign: 'center' },
        1: { cellWidth: 30 },
        2: { cellWidth: 60 },
        3: { cellWidth: 24, halign: 'center' },
        4: { cellWidth: 30 },
        5: { cellWidth: 10, halign: 'center' },
        6: { cellWidth: 10, halign: 'center' },
      },
      bodyStyles: { valign: 'middle' },
      theme: 'grid',
    });
    pdf.save("Customer_List_" + getTodaysDateMMDDYYYY() + ".pdf");
  }


  render() {
    let lgClose = () => this.setState({ lgShow: false });

    return [
      <div className="App">

        <LoadingOverlay
          active={this.state.FilterLoading}
          spinner
          text='Loading your content...'
        >
        </LoadingOverlay>

        <div className='header'>
          <div className='flex'>
            <div className='width90'><h3>Tiffin Management System</h3></div>
            <span><a href='#' onClick={logout}>LOGOUT</a></span>
          </div>

          <div>
            <div style={{ textAlign: 'left' }}>
              <label onClick={() => this.setState({ Filteropen: !this.state.Filteropen })} aria-controls="filter-collapse">
                <strong>Filter: </strong>
              </label>
            </div>

            <Collapse in={this.state.Filteropen}>
              <div id="filter-collapse">
                <div className='container' style={{ padding: '' }}>
                  <div className='row'>
                    <div className='col-xl-1'>
                      <label >Name:</label>
                    </div>
                    <div className='col-xl-2'>
                      <input className="form-control" type='text' id='Name_Search' autoComplete='off' onChange={() => this.filterCustomer()} />
                    </div>
                    <div className='col-md-1'>
                      <label>Gali/Sector :</label>
                    </div>
                    <div className='col-md-2'>
                      <input className="form-control" type='text' id='Gali_Sector_Search' autoComplete='off' onChange={() => this.filterCustomer()} />
                    </div>
                    <div className='col-md-1'>
                      <label>Area :</label>
                    </div>
                    <div className='col-md-2'>
                      <input className="form-control" type='text' id='Area_Search' autoComplete='off' onChange={() => this.filterCustomer()} />
                    </div>
                    <div className='col-md-1'>
                      <label>Mobile: </label>
                    </div>
                    <div className='col-md-2'>
                      <input className="form-control" type='text' id='Mobile_Search' autoComplete='off' onChange={() => this.filterCustomer()} />
                    </div>
                    <div className='col-md-1'>
                      <label>Email: </label>
                    </div>
                    <div className='col-md-2'>
                      <input className="form-control" type='text' id='Email_Search' autoComplete='off' onChange={() => this.filterCustomer()} />
                    </div>
                    <div className='col-md-3'>
                      <input className="checkbox-inline" type='checkbox' name='breakFast' id='BreakFast_Search' value='Break Fast' onChange={() => this.filterCustomer()} /> <label for='BreakFast_Search'>Break Fast</label> | &nbsp;
                      <input className="checkbox-inline" type='checkbox' name='launch' id='Launch_Search' value='Break Fast' onChange={() => this.filterCustomer()} /> <label for='Launch_Search'>Lunch</label> | &nbsp;
                      <input className="checkbox-inline" type='checkbox' name='dinner' id='Dinner_Search' value='Break Fast' onChange={() => this.filterCustomer()} /> <label for='Dinner_Search'>Dinner</label>
                    </div>

                    <div className='col-md-1'>
                      <label>Date: </label>
                    </div>
                    <div className='col-md-3'>
                      <input className="form-control" type='date' id='Date_Search' min="2018-11-30" onChange={() => this.filterCustomer()} />
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right', paddingTop: 15 }}>
                  <Button variant='primary' id='Search' onClick={() => this.filterCustomer()}>Search</Button>
                  &nbsp;&nbsp;&nbsp;
                  <Button className='secondary' id='reset' onClick={() => this.resetCustomer()}>Reset</Button>
                  &nbsp;&nbsp;&nbsp;
                  <Button variant='primary' id='Print' onClick={() => this.printDocument()}>Print</Button>
                  &nbsp;&nbsp;&nbsp;
                  </div>
              </div>
            </Collapse>
          </div>
        </div>


        <hr />
        <div style={{ textAlign: "left", paddingLeft: 10 }}>
          <a href='#' onClick={() => this.setState({ ShowAddCustomer: true })}>Add Customer</a>&nbsp;&nbsp;&nbsp;
              <span className={this.state.Action_Status.IsLoading ? 'statusLoading' : 'statusSuccess'}><label>{this.state.Action_Status.LoadingText}</label></span>
          {this.state.ShowAddCustomer && <AddCustomer Set_label_loading={this.Set_label_loading} setCustomers={this.setCustomers} handelCloseAddCustomer={this.handelCloseAddCustomer} role='admin' />}
        </div>
        <Customer setCustomers={this.setCustomers} customers={this.state.customers} openScheduleDialog={this.openScheduleDialog} openEditCustDialog={this.openEditCustDialog} role='admin' />
        {
          this.state.ShowEditCustomer &&
          <EditCustomer Set_label_loading={this.Set_label_loading} setCustomers={this.setCustomers} customerInfo={this.state.CurrentCustomer} handelCloseEditCustomer={this.handelCloseEditCustomer} role='admin' />
        }

        {
          this.state.ShowSchedulerPref &&
          <DialogBox Set_label_loading={this.Set_label_loading} handleClose={this.handleScheduleClose} customerInfo={this.state.CurrentCustomer} role='admin' />
        }
        {
          this.state.ShowScheduleCalender &&
          <Calender handleClose={this.handleScheduleClose} customerInfo={this.state.CurrentCustomer} role='admin' />

        }
      </div >
    ]
  }
}

export default App;
