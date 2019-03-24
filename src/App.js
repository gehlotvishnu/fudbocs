import React, { Component } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import 'bootstrap/dist/css/bootstrap.min.css';
import LoadingOverlay from 'react-loading-overlay';

import './App.css';
import Customer from './Customer/Customer';
import Print from './Print';
import { filterCustomer, CheckScheduleExist} from './httpClient';
import { getTodaysDate, getTodaysDateWithTime, getTodaysDateMMDDYYYY } from './Helper';
import { logout } from './Server/user';
import AddCustomer from './Customer/AddCustomer';
import EditCustomer from './Customer/EditCustomer';
import DialogBox from './Dialog'
import Calender from './Dialog/Calender';


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isDialogOpen: false,
      isPrint: false,
      lgShow: false,
      ShowAddCustomer:false,
      ShowEditCustomer:false,
      ShowSchedulerPref:false,
      ShowScheduleCalender:false,
      customerId:0,
      customerName:'',
      Action_Status:{IsLoading:false,LoadingText:''}
  }
    this.setCustomers = this.setCustomers.bind(this);
    this.filterCustomer = this.filterCustomer.bind(this);
    this.print = this.print.bind(this);
    this.printDocument = this.printDocument.bind(this);
    this._CheckScheduleExist=this._CheckScheduleExist.bind(this);
    this.Set_label_loading=this.Set_label_loading.bind(this);
  }
  
  componentDidMount() {
    document.querySelector("#Date_Search").valueAsDate = new Date();
  }

  Set_label_loading(ISLoading,loadingText){
    let mystate= {... this.state.Action_Status};
    mystate.IsLoading=ISLoading;
    mystate.LoadingText=loadingText;
    this.setState({Action_Status:mystate});
  }

  print() {
    this.setState({isPrint: true, lgShow: true});
  }

  resetCustomer() {
    const customers = this.state.originalList.slice();
    this.setState({customers: customers, originalList: customers})
  }

  setCustomers(customers) {
    this.setState({customers: customers, originalList: customers})
  }

  getTiffinType() {
    if(document.getElementById('BreakFast_Search').checked && document.getElementById('Launch_Search').checked && document.getElementById('Dinner_Search')) {
      return 'BreakFast, Launch and Dinner'; 
    } else if(document.getElementById('Launch_Search').checked && document.getElementById('Dinner_Search').checked) {
      return 'Launch And Dinner';
    } else if(document.getElementById('Launch_Search').checked) {
      return 'Launch';
    } else if(document.getElementById('Dinner_Search').checked) {
      return 'Dinner';
    } else if(document.getElementById('BreakFast_Search').checked) {
      return 'BreakFast';
    }

    return 'BreakFast, Launch and Dinner'
  }

  filterCustomer(isServer) {
    const that = this;

    const products = this.state.originalList.slice();
    const firstName = document.getElementById('FirstName_Search').value;
    // const lastName = document.getElementById('LastName_Search').value;
    const addressSearch = document.getElementById('Address_Search').value;
    let tiffinType;
    const date = document.getElementById('Date_Search').value;

    if(document.getElementById('Launch_Search').checked && document.getElementById('Dinner_Search').checked) {
      tiffinType = '1,2';
    } else if(document.getElementById('Launch_Search').checked) {
      tiffinType = '1';
    } else if(document.getElementById('Dinner_Search').checked) {
      tiffinType = '2';
    } else if(document.getElementById('BreakFast_Search').checked) {
      tiffinType = '4';
    } else {
      tiffinType = '1,2,3,4'
    }
    
    let newProducts = [];
    let insert = true;

    if(isServer) {
      this.setState({isLoading: true});

      filterCustomer(date, tiffinType).then(function(data) {
        that.setState({isLoading: false});

        let tempNewProducts = [];

        products.map(function(customer) {
          insert = true;
          
         
          if(firstName !== '' && customer.name.toLowerCase().indexOf(firstName.toLowerCase()) === -1) {
            insert = false;
            //console.log(firstName);
            //console.log(customer.name);
            //console.log(insert);
          }
    
          // if(lastName !== '' && customer.LastName.toLowerCase().indexOf(lastName.toLowerCase())  === -1) {
          //   insert = false;
          // }
  
          if(addressSearch !== '' && customer.address.toLowerCase().indexOf(addressSearch.toLowerCase())  === -1) {
            insert = false;
          }
    
          if(customer.TiffinType && tiffinType !== '' && customer.TiffinType.indexOf(tiffinType) === -1) {
            insert = false;
          }
  
          insert && tempNewProducts.push(customer);
    
        });

        tempNewProducts.map(function(customer) {
          insert = false;
     
            //console.log(customer.name);
            //console.log(insert);
          if(data && data.length > 0) {
            data.map(function(schedule) {
              if(customer._id === schedule._id) {
                insert = true;
              }
            });
           
            //console.log(customer.name);
            //console.log(insert);
            insert && newProducts.push(customer);
          }
        });
    
        that.setState({customers:newProducts});
        
      });
    } else {
      products.map(function(customer) {
        insert = true;
  
        if(firstName !== '' && customer.name.toLowerCase().indexOf(firstName.toLowerCase()) === -1) {
          insert = false;
        }
  
        // if(lastName !== '' && customer.LastName.toLowerCase().indexOf(lastName.toLowerCase())  === -1) {
        //   insert = false;
        // }

        if(addressSearch !== '' && customer.address.toLowerCase().indexOf(addressSearch.toLowerCase())  === -1) {
          insert = false;
        }
  
        if(customer.TiffinType && tiffinType !== '' && customer.TiffinType.indexOf(tiffinType) === -1) {
          insert = false;
        }

        insert && newProducts.push(customer);
  
      });
  
      this.setState({customers:newProducts});
    }
  }

  _CheckScheduleExist(id) {

    const that = this;
    var date = getTodaysDate().format('YYYY-MM-DD');
    
    CheckScheduleExist({customerId: id, date: date, role: 'admin'}).then(function(status) {
      if(status > 0) {
            that.setState({ShowSchedulerPref: false,ShowScheduleCalender:true});       
      } else {
            that.setState({ShowSchedulerPref: true,ShowScheduleCalender:false});
            /*var date = new Date(); //gives today date 
            var startDay=new Date(date.getFullYear(), date.getMonth(),1);       
            var endDay=new Date(date.getFullYear(), date.getMonth() + 1, 0);
          
            if(document.querySelector("#StartDate")) document.querySelector("#StartDate").value =  moment(startDay).format('YYYY-MM-DD') ;
            if(document.querySelector("#EndDate")) document.querySelector("#EndDate").value = moment(endDay).format('YYYY-MM-DD') ;*/
        }
    });
  }

  openScheduleDialog = (id, customerName) => {
    this.setState({customerId: id, customerName: customerName});    
    this._CheckScheduleExist(id); 
  }  
 
  handleScheduleClose = () => this.setState({ShowSchedulerPref:false, ShowScheduleCalender: false })

  handelCloseAddCustomer= () => this.setState({ ShowAddCustomer: false })

  openEditCustDialog = (id) => this.setState({ ShowEditCustomer: true, customerId: id })

  handelCloseEditCustomer= () => this.setState({ ShowEditCustomer: false })

  printDocument() {
    const that = this;
    const pdfsize = 'a4';
    const pdf = new jsPDF('l', 'pt', pdfsize);

    var table = document.getElementById('customerList').cloneNode(true);

    table.deleteRow(0);

     for (var i=0; i< table.rows.length; i++) {
        table.rows[i].deleteCell(2); //delete the cell
        table.rows[i].deleteCell(2); //delete the cell
        table.rows[i].deleteCell(5); //delete the cell
     }
    
    const res = pdf.autoTableHtmlToJson(table);

    var totalPagesExp = pdf.internal.getNumberOfPages();

    var pageContent = function (data) {
        // HEADER
        pdf.setFontSize(18);
        pdf.setTextColor(40);
        pdf.setFontStyle('normal');
   
        pdf.text("Customer Tiffin List for " + that.getTiffinType() + " at " + getTodaysDateWithTime(), data.settings.margin.left, 50);

        // FOOTER
        var str = "Page " + data.pageCount;
        // Total page number plugin only available in jspdf v1.0+
        if (typeof pdf.putTotalPages === 'function') {
            str = str; //+ " of " + totalPagesExp;
        }
        pdf.setFontSize(10);
        pdf.text(str, data.settings.margin.left, pdf.internal.pageSize.height - 10);
    };
  
    pdf.autoTable(res.columns, res.data, {
      didDrawPage: pageContent,
      // beforePageContent: header,
      startY: 60,
      drawHeaderRow: function(row, data) {
        row.height = 46;
      },
      drawHeaderCell: function(cell, data) {
        pdf.rect(cell.x, cell.y, cell.width, cell.height, cell.styles.fillStyle);
        pdf.setFillColor(230);
        pdf.rect(cell.x, cell.y + (cell.height / 2), cell.width, cell.height / 2, cell.styles.fillStyle);
        pdf.autoTableText(cell.text, cell.textPos.x, cell.textPos.y, {
          halign: cell.styles.halign,
          valign: cell.styles.valign
        });
        pdf.setTextColor(100);
        var text = data.table.rows[0].cells[data.column.dataKey].text;
        pdf.autoTableText(text, cell.textPos.x, cell.textPos.y + (cell.height / 2), {
          halign: cell.styles.halign,
          valign: cell.styles.valign
        });

        return false;
      },
      drawRow: function(row, data) {
        if (row.index === 0) return false;
      },
      margin: {
        top: 60
      },
      styles: {
        overflow: 'linebreak',
        fontSize: 10,
        tableWidth: 'auto',
        cellWidth: 'auto',
      },
      columnStyles: {
        text: {
          columnWidth: 'wrap'
        },
        columnName1: {
            columnWidth: 45,
            fontStyle: 'bold',
            textColor: 240                
        },
        description: {
            columnWidth: 107
        },
        columnName2: {
            columnWidth: 45
        },
        columnName3: {
            columnWidth: 45
        },
        columnName4: {
            columnWidth: 45
        }
      },
      bodyStyles: {valign: 'middle'},
      theme: 'grid',
    });
  
    pdf.save("Customer_List_" + getTodaysDateMMDDYYYY() + ".pdf");
  }
  

  render() {
    let lgClose = () => this.setState({ lgShow: false });

    return [
        <div className="App">

          <LoadingOverlay
            active={this.state.isLoading}
            spinner
            text='Loading your content...'
            >
          </LoadingOverlay>
         
         <div className='header'>
          <div className='flex'>
            <div className='width90'><h3>Tiffin Management System</h3></div>            
            <span><a href='#' onClick={logout}>LOGOUT</a></span>
          </div>

          <strong>Filter: </strong>
          Name: <input type='text' id='FirstName_Search' onChange={() => this.filterCustomer(true)} />
          {/* &nbsp; Last Name: <input type='text' id='LastName_Search' onChange={() => this.filterCustomer(true)} /> */}
          &nbsp; Address: <input type='text' id='Address_Search' onChange={() => this.filterCustomer(true)} />
          &nbsp; <input type='checkbox' name='breakFast' id='BreakFast_Search' value='Break Fast' /> <label for='BreakFast_Search'>Break Fast</label> |
          &nbsp; <input type='checkbox' name='launch' id='Launch_Search' value='Break Fast' /> <label for='Launch_Search'>Lunch</label> |
          &nbsp; <input type='checkbox' name='dinner' id='Dinner_Search' value='Break Fast' /> <label for='Dinner_Search'>Dinner</label> |
          &nbsp; Date: <input type='date' id='Date_Search' min="2018-11-30"/>
          &nbsp; <input className='btn cta sm' type='button' id='Search' value='Search' onClick={() => this.filterCustomer(true)}/>
          &nbsp; <input className='btn secondary sm' type='button' id="Reset" value='Reset' onClick={() => this.resetCustomer()} />
          &nbsp; <input className='btn cta sm' type='button' id='Print' value='Print' onClick={() => this.printDocument()} />
          </div>
          <hr />
          <div 	style={{textAlign:"left",paddingLeft:10}}>
              <a href='#' onClick={()=> this.setState({ShowAddCustomer:true})}>Add Customer</a>&nbsp;&nbsp;&nbsp;
              <span className={this.state.Action_Status.IsLoading ? 'statusLoading' : 'statusSuccess'}><label>{this.state.Action_Status.LoadingText}</label></span>
              {this.state.ShowAddCustomer && <AddCustomer setCustomers={this.setCustomers} handelCloseAddCustomer={this.handelCloseAddCustomer} role= 'admin'/>}
          </div>
          <Customer setCustomers={this.setCustomers} customers={this.state.customers} openScheduleDialog={this.openScheduleDialog} openEditCustDialog={this.openEditCustDialog} role= 'admin'/>
          {
            this.state.ShowEditCustomer && 
            <EditCustomer setCustomers={this.setCustomers} customerId={this.state.customerId} handelCloseEditCustomer={this.handelCloseEditCustomer} role= 'admin'/> }
          }
          {
            this.state.ShowSchedulerPref && 
            <DialogBox Set_label_loading={this.Set_label_loading} handleClose={this.handleScheduleClose} customerId={this.state.customerId} customerName={this.state.customerName} role= 'admin'/>
          }
          {
            this.state.ShowScheduleCalender && 
            <Calender handleClose={this.handleScheduleClose} customerId={this.state.customerId} customerName={this.state.customerName} role= 'admin'/>

          }
        </div>
    ]
  }
}

export default App;
