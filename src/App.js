import React, { Component } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import 'bootstrap/dist/css/bootstrap.min.css';
import LoadingOverlay from 'react-loading-overlay';

import './App.css';
import Customer from './Customer/Customer';
import Print from './Print';
import { filterCustomer, CheckScheduleExist, getScheduleQtyAmount, GenerateInvoice, saveSchedule, CheckScheduleforMonthExist, getAllInvoicesofMonth, getInvoiceDetails, getCustomersById, CheckInvoiceforMonthExist } from './httpClient';
import { getTodaysDate, getTodaysDateWithTime, getTodaysDateMMDDYYYY, getMonth } from './Helper';
import { logout } from './Server/user';
import AddCustomer from './Customer/AddCustomer';
import EditCustomer from './Customer/EditCustomer';
import DialogBox from './Dialog'
import Calender from './Dialog/Calender';
import { Button, Collapse } from 'react-bootstrap'
import moment from 'moment';
import * as pdfmake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';



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
    this.GenerateInvoice = this.GenerateInvoice.bind(this);
    this.GenerateMonthSchedule = this.GenerateMonthSchedule.bind(this);
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
              if (customer.id == schedule.id) {
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

    CheckScheduleExist({ customerId: id, role: 'admin' }).then(function (status) {
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

    //make data array for publishing in pdf
    var data = [];
    this.state.customers.map(function (customer, index) {
      var item = [];
      var address = customer.HouseNo + ',' + customer.GaliSector + ',' + customer.Area + ',' + customer.City + (customer.Landmark != '' ? 'LANDMARK:' + customer.Landmark : '');
      //check for tiffin type 
      var tiffinType;
      if (document.getElementById('BreakFast_Search').checked)
        tiffinType = '4';
      else if (document.getElementById('Launch_Search').checked)
        tiffinType = '1';
      else if (document.getElementById('Dinner_Search').checked)
        tiffinType = '2';
      //get details of tiffin given quantity given to cutomer
      var given;
      getScheduleQtyAmount({ customerId: customer.id, date: document.getElementById('Date_Search').value, tiffinType: tiffinType, role: 'admin' }).then(function (schedule) {
        if (schedule.length > 0) {
          given = schedule[0].qty;
          console.log(schedule[0])
          console.log(schedule[0].qty)
          console.log(given)
        }
      });
      console.log(given)
      item.push(index + 1, customer.name, address, customer.mobile, customer.remark, given);
      data.push(item);
    });
    //////////////////////////////////////////////////////////REST API ISSUE SEQuence
    console.log(data);

    /*
    var table = document.getElementById('customerList').cloneNode(true);
    for (var i = 0; i < table.rows.length; i++) {
      table.rows[i].deleteCell(2); //delete the cell
      table.rows[i].deleteCell(4); //delete the cell
      table.rows[i].deleteCell(5); //delete the cell
      var given = table.rows[i].insertCell(5);
      var customerId = table.rows[i].cells[0].children[0];
      console.log(customerId)
      given.innerHTML = customerId;
      //get details of tiffin given quantity given to cutomer
      getSchedule({ customerId: this.props.customerInfo.id, date: date, role: 'admin' }).then(function (schedule) {
        if (schedule.length > 0) {
 
        }
      })
    }
 
    const res = pdf.autoTableHtmlToJson(table);*/

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

    //console.log(res.data)
    pdf.autoTable({
      didDrawPage: pageContent,
      startY: 25,
      head: [['SrNo', 'Name', 'Address', 'Mobile', 'Remaks', 'Given', 'Taken']],
      body: data,
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

  async GenerateInvoice() {
    const that = this;
    //get date 
    var dt = document.getElementById('Date_Search').valueAsDate;
    var monthofInvoice = getMonth(dt.getMonth()) + '-' + dt.getFullYear();
    var body = [];
    const logo_image = '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';

    //check for schedule must exist for month
    await CheckScheduleforMonthExist({ month: dt.getMonth() + 1, year: dt.getFullYear(), role: 'admin' }).then(async function (status) {
      if (status == 0) {
        that.Set_label_loading(false, 'Schedule not exist for the Selected month');
      }
      else {
        //check for invoice already generated for this month
        await CheckInvoiceforMonthExist({ month: dt.getMonth() + 1, year: dt.getFullYear(), role: 'admin' }).then(async function (status) {
          if (status > 0) {
            that.Set_label_loading(false, 'Invoice(s) already generated for the Selected month');
          }
          else {
            //message
            that.Set_label_loading(true, 'Generating Invoice....');

            //Generate invoices for the month
            await GenerateInvoice({ month: dt.getMonth() + 1, year: dt.getFullYear(), role: that.props.role }).then(async function (data) {
              //get all the invoices      
              await getAllInvoicesofMonth({ month: dt.getMonth() + 1, year: dt.getFullYear(), role: that.props.role }).then(async function (invoices) {
                for (const invoice of invoices) {

                  //Add header info
                  body.push([{ columns: [{ image: 'data:image/png;base64,' + logo_image, width: 50, margin: [25, 5, 0, 0] }, { text: [{ text: 'Fudbocs\n', style: 'Header1Center' }, { text: '11/822, Chopasni Housing Board,Jodhpur-342008\n', style: 'Header2Center' }, { text: 'GSTIN/UIN: 08AFOPV4001M1Z0\nMobile : 9782152296\n', style: 'Header3Center' }] }], colSpan: 10 }, {}, {}, {}, {}, {}, {}, {}, {}, {}]);
                  body.push([{ text: 'Invoice No.: ' + invoice.invoiceNo, colSpan: 5, style: 'Common' }, {}, {}, {}, {}, { text: 'Invoice Date: ' + invoice.invoiceDate_ddmmyyyy, colSpan: 5, style: 'Common', alignment: 'right' }, {}, {}, {}, {}])

                  //Add customer details          
                  await getCustomersById(invoice.customerId).then((customer) => {
                    body.push([{ text: [customer.name + '\n', customer.HouseNo + ' ' + customer.GaliSector + '\n' + customer.Area + ' ' + customer.City + (customer.Landmark && '\nLandmark: ' + customer.Landmark), '\n' + 'Mobile: 9930350133\n'], colSpan: 10, style: 'Customer' }, {}, {}, {}, {}, {}, {}, {}, {}, {}])
                  })

                  //add Item Header
                  body.push([{ text: 'S.No.', style: 'ItemHeader', alignment: 'center' }, { text: 'Name of Product', style: 'ItemHeader', colSpan: 4 }, {}, {}, {}, { text: 'Quantity', style: 'ItemHeader', alignment: 'center', colSpan: 2 }, {}, { text: 'Rate', style: 'ItemHeader', alignment: 'center' }, { text: 'Total Amount(Rs.)', style: 'ItemHeader', colSpan: 2, alignment: 'center' }, {}])

                  //store monthly details becoz in pdf this info required later so store in temp and add it later on
                  var body_temp = [];
                  body_temp.push([{ text: 'Daywise delivery details of the month (' + monthofInvoice + '):\n', style: 'Common', colSpan: 10 }, {}, {}, {}, {}, {}, {}, {}, {}, {}]);

                  //get invoice details
                  await getInvoiceDetails({ invoiceNo: invoice.invoiceNo, role: that.props.role }).then(async function (invoice_details) {
                    var i = 1;
                    invoice_details.map(function (details) {
                      //Add Item Information
                      let tiffinType = '';
                      let tiffinType_short = '';
                      if (details.tiffintype == '1') {
                        tiffinType = 'Lunch(Code-1)';
                        tiffinType_short = 'Lunch';
                      } else if (details.tiffintype == '2') {
                        tiffinType = 'Dinner(Code-2)';
                        tiffinType_short = 'Dinner';
                      } else if (details.tiffintype == '4') {
                        tiffinType = 'Breakfast(Code-4)';
                        tiffinType_short = 'Breakfast';
                      }
                      body.push([{ text: i++, style: 'Common', alignment: 'center' }, { text: tiffinType, style: 'Common', colSpan: 4 }, {}, {}, {}, { text: details.totQty, style: 'Common', alignment: 'center', colSpan: 2 }, {}, { text: details.rate, style: 'Common', alignment: 'center' }, { text: details.totAmount, style: 'Common', colSpan: 2, alignment: 'right', margin: [0, 0, 10, 0] }, {}])
                      body_temp.push([{ text: tiffinType_short, colSpan: 2, style: 'Common' }, {}, { text: details.tiffinDayDetails, colSpan: 8, style: 'Common' }, {}, {}, {}, {}, {}, {}, {}]);
                    });
                  });

                  //Add Total
                  body.push([{ text: 'Total (Rs.)', colSpan: 8, margin: [260, 0, 0, 0], style: 'Common' }, {}, {}, {}, {}, {}, {}, {}, { text: invoice.amount, colSpan: 2, alignment: 'right', margin: [0, 0, 10, 0], style: 'Common' }, {}])
                  body.push([{ text: 'Deposit Amount (Rs.) ', colSpan: 8, margin: [260, 0, 0, 0], style: 'Common' }, {}, {}, {}, {}, {}, {}, {}, { text: '0', colSpan: 2, alignment: 'right', margin: [0, 0, 10, 0], style: 'Common' }, {}])
                  body.push([{ text: 'Due Amount (Rs.) ', colSpan: 8, margin: [260, 0, 0, 0], style: 'Common' }, {}, {}, {}, {}, {}, {}, {}, { text: invoice.amount, colSpan: 2, alignment: 'right', margin: [0, 0, 10, 0], style: 'Common' }, {}])


                  //Add daywise quantity details
                  for (const item of body_temp) {
                    body.push(item)
                  }

                  //Add Footer Like disclaimer/Bank Details

                  //Add Page Break for Next Invoice
                  body.push([{ text: '', pageBreak: 'before' }, {}, {}, {}, {}, {}, {}, {}, {}, {}])


                };
              });
            }).then(function () {

              //remove last page break(comes 1 extra page)
              body.pop();

              //create pdf
              pdfmake.vfs = pdfFonts.pdfMake.vfs;
              var dd = {
                content: [
                  // Header
                  {
                    table: {
                      headerRows: 0,
                      widths: ['10%', '10%', '10%', '10%', '10%', '10%', '10%', '10%', '10%', '10%'],
                      dontBreakRows: true,
                      body: body
                    }
                  }]
                ,
                styles: {
                  // Header
                  Header1Center: {
                    fontSize: 14,
                    alignment: 'center',
                  },
                  Header2Center: {
                    fontSize: 12,
                    alignment: 'center',
                  },
                  Header3Center: {
                    fontSize: 10,
                    alignment: 'center',
                  },
                  Customer: {
                    fontSize: 10,
                    alignment: 'left',
                    margin: [40, 5]
                  },
                  ItemHeader: {
                    fontSize: 10,
                    bold: true
                  },
                  Common: {
                    fontSize: 10,
                  }
                },
                pageSize: 'A5',
                pageOrientation: 'landscape',
                //pageMargins: [20, 20, 20, 20]
              }
              that.Set_label_loading(false, 'Invoice Generated successfully');
              pdfmake.createPdf(dd).download();
            })
          }
        });
      }
    });
  }
  GenerateMonthSchedule() {
    const that = this;
    const startDate = document.getElementById('Date_Search').valueAsDate;
    CheckScheduleforMonthExist({
      month: startDate.getMonth() + 1, year: startDate.getFullYear(), role: 'admin'
    }).then(function (status) {
      if (status == 0) {
        that.Set_label_loading(true, 'Saving data....');
        that.state.originalList.map(function (customer, index) {
          let bill = [];
          const firstdateMOnth = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
          const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
          const endDateFormatted = moment(endDate).format('YYYY-MM-DD');
          if (customer.breakfast) {
            bill.push({ tiffinType: '4', amount: customer.breakfast_amount, qty: customer.breakfast_qty })
          }
          if (customer.lunch) {
            bill.push({ tiffinType: '1', amount: customer.lunch_amount, qty: customer.lunch_qty })
          }
          if (customer.dinner) {
            bill.push({ tiffinType: '2', amount: customer.dinner_amount, qty: customer.dinner_qty })
          }
          const obj = {
            startDate: firstdateMOnth,
            endDate: endDateFormatted,
            customerId: customer.id,
            exclude_MON: customer.exclude_MON,
            exclude_TUE: customer.exclude_TUE,
            exclude_WED: customer.exclude_WED,
            exclude_THU: customer.exclude_THU,
            exclude_FRI: customer.exclude_FRI,
            exclude_SAT: customer.exclude_SAT,
            exclude_SUN: customer.exclude_SUN,
            createdBy: 'Admin',
            bill: bill,
            isActive: 1
          }
          //console.log(obj);
          saveSchedule(obj).then(function (schedule) { });
        });
        that.Set_label_loading(false, 'Bulk Schedule Successfully Saved.');;
      } else {
        that.Set_label_loading(false, 'Schedule already available for Month');
      }
    });

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
                  <Button variant='primary' id='Gen_invoice' onClick={() => this.GenerateInvoice()}>Generate Invoice</Button>
                  &nbsp;&nbsp;&nbsp;
                  <Button variant='primary' id='Gen_month_schedule' onClick={() => this.GenerateMonthSchedule()}>Generate Month Schedule</Button>
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
