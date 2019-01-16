import React, { Component } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import './App.css';
import Customer from './Customer';
import Print from './Print';
import DialogBox from './Dialog'
import TiffinDropDown from './Common/tiffinDropDown';
import { filterCustomer } from './httpClient';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isDialogOpen: false,
      isPrint: false,
      lgShow: false
  }
    this.setCustomers = this.setCustomers.bind(this);
    this.filterCustomer = this.filterCustomer.bind(this);
    this.print = this.print.bind(this);
  }
  
  componentDidMount() {
    document.querySelector("#Date_Search").valueAsDate = new Date();
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

  filterCustomer(isServer) {
    const that = this;

    const products = this.state.originalList.slice();
    const firstName = document.getElementById('FirstName_Search').value;
    // const lastName = document.getElementById('LastName_Search').value;
    const addressSearch = document.getElementById('Address_Search').value;
    let tiffinType;
    const date = document.getElementById('Date_Search').value;

    if(document.getElementById('Launch_Search').checked && document.getElementById('Dinner_Search').checked) {
      tiffinType = '3';
    } else if(document.getElementById('Launch_Search').checked) {
      tiffinType = '1';
    } else if(document.getElementById('Dinner_Search').checked) {
      tiffinType = '2';
    } else if(document.getElementById('BreakFast_Search').checked) {
      tiffinType = '4';
    }
    
    let newProducts = [];
    let insert = true;

    if(isServer) {
      filterCustomer(date, tiffinType).then(function(data) {
        let tempNewProducts = [];

        products.map(function(customer) {
          insert = true;
    
          if(firstName !== '' && customer.FirstName.toLowerCase().indexOf(firstName.toLowerCase()) === -1) {
            insert = false;
          }
    
          // if(lastName !== '' && customer.LastName.toLowerCase().indexOf(lastName.toLowerCase())  === -1) {
          //   insert = false;
          // }
  
          if(addressSearch !== '' && customer.CityName.toLowerCase().indexOf(addressSearch.toLowerCase())  === -1) {
            insert = false;
          }
    
          if(customer.TiffinType && tiffinType !== '' && customer.TiffinType.indexOf(tiffinType) === -1) {
            insert = false;
          }
  
          insert && tempNewProducts.push(customer);
    
        });

        tempNewProducts.map(function(customer) {
          insert = false;
    
          if(data && data.length > 0) {
            data.map(function(schedule) {
              if(customer._id === schedule.CustomerId) {
                insert = true;
              }
            });
           
            insert && newProducts.push(customer);
          }
        });
    
        that.setState({customers:newProducts});
        
      });
    } else {
      products.map(function(customer) {
        insert = true;
  
        if(firstName !== '' && customer.FirstName.toLowerCase().indexOf(firstName.toLowerCase()) === -1) {
          insert = false;
        }
  
        // if(lastName !== '' && customer.LastName.toLowerCase().indexOf(lastName.toLowerCase())  === -1) {
        //   insert = false;
        // }

        if(addressSearch !== '' && customer.CityName.toLowerCase().indexOf(addressSearch.toLowerCase())  === -1) {
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

  openDialog = (id, customerName) => this.setState({ isDialogOpen: true, customerId: id, customerName: customerName })
 
  handleClose = () => this.setState({ isDialogOpen: false })

  printDocument() {
    const input = document.getElementById('divToPrint');
    html2canvas(input)
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        pdf.addImage(imgData, 'JPEG', 0, 0);
        // pdf.output('dataurlnewwindow');
        pdf.save("download.pdf");
      });
  }


  render() {
    let lgClose = () => this.setState({ lgShow: false });

    return [
        <div className="App">
          Welcome Admin <br /> <br />

          <strong>Filter: </strong>
          Name: <input type='text' id='FirstName_Search' onChange={() => this.filterCustomer(true)} />
          {/* &nbsp; Last Name: <input type='text' id='LastName_Search' onChange={() => this.filterCustomer(true)} /> */}
          &nbsp; Address: <input type='text' id='Address_Search' onChange={() => this.filterCustomer(true)} />
          &nbsp; <input type='checkbox' name='breakFast' id='BreakFast_Search' value='Break Fast' /> Break Fast |
          &nbsp; <input type='checkbox' name='launch' id='Launch_Search' value='Break Fast' /> Launch |
          &nbsp; <input type='checkbox' name='dinner' id='Dinner_Search' value='Break Fast' /> Dinner |
          &nbsp; Date: <input type='date' id='Date_Search' min="2018-11-30"/>
          &nbsp; <input type='button' id='Search' value='Search' onClick={() => this.filterCustomer(true)}/>
          &nbsp; <input type='button' id="Reset" value='Reset' onClick={() => this.resetCustomer()} />
          &nbsp; <input type='button' id='Print' value='Print' onClick={() => this.print()} />
          
          <hr />
          <Customer setCustomers={this.setCustomers} customers={this.state.customers} openDialog={this.openDialog}/>

          {
           
            <Modal
          size="lg"
          show={this.state.lgShow}
          onHide={lgClose}
          aria-labelledby="example-modal-sizes-title-lg"
        >
          <Modal.Header closeButton>
            <Modal.Title id="example-modal-sizes-title-lg">
              Print Customer List
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <div id="divToPrint">
            <div>
              <table className="table table-bordered table-customer">
                <thead>
                  <tr>
                    <th>
                      Sr. No.
                    </th>
                    <th>
                      Name
                    </th>
                    <th>
                      Area
                    </th>
                    <th>Mobile</th>
                    <th>
                      Remark
                    </th>
                  </tr>
                </thead>
                <tbody>
                {
                  this.state.customers && this.state.customers.map(function(customer, index) {
                  return <tr>
                          <td>
                            {index + 1}
                          </td>
                          <td>
                            <label type='text' name="firstName" id={`FirstName_${index}`}>{customer.FirstName}</label>
                          </td>
                          <td>
                            <label type='text' name="cityName" id={`CityName_${index}`}>{customer.CityName}</label>
                          </td>
                          <td>
                          <label type='text' name="mobile" id={`Mobile_${index}`}>{customer.Mobile}</label>
                          </td>
                          <td>
                            <label type='text' name="remark" id={`Remark_${index}`}>{customer.Remark}</label>
                          </td>
                        </tr>;
                  })
               }
                </tbody>
              </table>
            </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" type="button"
              onClick={this.printDocument}
              >
              Print
            </Button>
            <Button variant="secondary" type="button" 
              style={{
                marginLeft: 30
              }}
              onClick={() => this.setState({ lgShow: false })}>
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
          }
          {
              this.state.isDialogOpen &&
              <DialogBox handleClose={this.handleClose} customerId={this.state.customerId} customerName={this.state.customerName}/>
          }
        </div>
    ]
  }
}

export default App;
