import React, { Component } from 'react';
import './App.css';
import Customer from './Customer';
import DialogBox from './Dialog'
import TiffinDropDown from './Common/tiffinDropDown';

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
    const that = this;
  }

  setCustomers(customers) {
    this.setState({customers: customers, originalList: customers})
  }

  filterCustomer() {
    const products = this.state.originalList.slice();
    const firstName = document.getElementById('FirstName_Search').value;
    const lastName = document.getElementById('LastName_Search').value;
    const tiffinType = document.getElementById('TiffinType_Search').value;
    const date = document.getElementById('Date_Search').value;

    let newProducts = [];
    let insert = true;

    products.map(function(customer) {
      insert = true;

      if(firstName !== '' && customer.FirstName.toLowerCase().indexOf(firstName.toLowerCase()) === -1) {
        insert = false;
      }

      if(lastName !== '' && customer.LastName.toLowerCase().indexOf(lastName.toLowerCase())  === -1) {
        insert = false;
      }

      if(customer.TiffinType && tiffinType !== '' && customer.TiffinType.indexOf(tiffinType) === -1) {
        insert = false;
      }

      insert && newProducts.push(customer);

    });

    this.setState({customers:newProducts});
  }


  openDialog = (id) => this.setState({ isDialogOpen: true, customerId: id })
 
  handleClose = () => this.setState({ isDialogOpen: false })

  render() {
   
    console.log('customes.........', this.state.customers);
    return [
        <div className="App">
          Welcome Admin <br /> <br />

          Search Customer: 
          First Name: <input type='text' id='FirstName_Search' onChange={this.filterCustomer} />
          &nbsp; Last Name: <input type='text' id='LastName_Search' onChange={this.filterCustomer} />
          &nbsp; <TiffinDropDown id="Search"/> 
          &nbsp; Date: <input type='date' id='Date_Search' />
          &nbsp; <input type='button' id='Search' value='Search'/>
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
