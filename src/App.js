import React, { Component } from 'react';
import './App.css';
import Customer from './Customer';
import DialogBox from './Dialog'
import TiffinDropDown from './Common/tiffinDropDown';
import { filterCustomer } from './httpClient';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isDialogOpen: false
  }
    this.setCustomers = this.setCustomers.bind(this);
    this.filterCustomer = this.filterCustomer.bind(this);
  }
  
  componentDidMount() {
    document.querySelector("#Date_Search").valueAsDate = new Date();
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


  openDialog = (id) => this.setState({ isDialogOpen: true, customerId: id })
 
  handleClose = () => this.setState({ isDialogOpen: false })

  render() {
   
    console.log('customes.........', this.state.customers);
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
          <hr />
          <Customer setCustomers={this.setCustomers} customers={this.state.customers} openDialog={this.openDialog}/>
          {/* <Basic /> */}

          {/* <Application /> */}

            {/* <button type="button" onClick={this.openDialog}>Open Dialog</button> */}
                {
                    this.state.isDialogOpen &&
                    <DialogBox handleClose={this.handleClose} customerId={this.state.customerId}/>
                }
        </div>
    ]
  }
}

export default App;
