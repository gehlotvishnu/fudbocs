//Data
import React, { Component } from 'react';

const BreakDownContent = [
    {
      "text" : "Amount:",
      "main" : "$20,000.00",
      "icon" : "fa fa-money"
    },
    {
      "text" : "Shipping Address:",
      "main" : "123 Los Olas Blvd, Ste. 101, Fort Lauderdale, FL 33301 USA",
      "icon" : "fa fa-map-marker"
    },
    {
      "text" : "Issuer:",
      "main" : "Allied Steel Buildings",
      "icon" : "fa fa-star-o"
    },
    {
      "text" : "Confirmation No:",
      "main" : "878NJDBW8Y9",
      "icon" : "fa fa-list-alt"
    }
  ]
  
  // App
  
  export default class Receipt extends React.Component {
    constructor() {
      super();
      
      this.state = {
        breakdown : {}
      }

      this.printBill = this.printBill.bind(this);
    }

    printBill = () => {
        window.print();
    }
    
    componentWillMount() {
      this.setState({
        breakdown: BreakDownContent
      });
    }
  
    render() {
      return (
        <div className="receipt">
					<table className="receipt-table" cellspacing="0" rowspacing="0">
						<thead>
							<tr>
								<th className="left-section head">
								</th>
								<th className="right-section">
									<div>
										<div className="float-left"><strong className="recipt-logo">FudBocs</strong> <br /> 11/517 <br /> Chopasani Housing Board <br /> Jodhpur, Rajasthan 342008 <br /> India</div>
										<div className="float-right"><img src="./images/foodbox_public_boot_images_logo.png" className="height-115"/> 
                    <div className="reciept-tag">Accha Khao Accha Khilao</div></div>
									</div> 
									
								</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td className="left-section receipt-row-border-left">

								</td>
								<td className="right-section receipt-row-border-right">
								<div>
										<div className="float-left"><strong>To,</strong></div>
										<div className="float-right"></div>
									</div> 
								</td>
							</tr>
							<tr>
								<td className="left-section receipt-row-border-left">
									
								</td>
								<td className="right-section receipt-row-border-right">
									<div>
										<div className="float-left">Mukesh Purohit</div>
										<div className="float-right"><strong>Currency:</strong> INR</div>
									</div> 
								</td>
							</tr>
							<tr>
								<td className="left-section receipt-row-border-left">
									
								</td>
								<td className="right-section receipt-row-border-right">
									<div>
										<div className="float-left">Jodhpur, Rani Station </div>
										<div className="float-right"><strong>Issue Date:</strong> 23/23/2323</div>
									</div> 
								</td>
							</tr>
							<tr>
								<td className="left-section receipt-row-border-left">
									
								</td>
								<td className="right-section receipt-row-border-right">
									<div>
										<div className="float-left">  asdkfasldf, asdfasdf</div>
										<div className="float-right"><strong>Due Date:</strong> 12/12/1212</div>
									</div> 
								</td>
							</tr>
							<tr>
								<td className="left-section receipt-row-border-left">

								</td>
								<td className="right-section receipt-row-border-right">
								  <div>
										<div className="float-left">234213123</div>
										<div className="float-right"> </div>
									</div> 
								</td>
							</tr>
							<tr><td className="left-section receipt-row-border-left"></td><td className="right-section receipt-row-border-right"></td></tr>
							<tr><td className="left-section receipt-row-border-left"></td><td className="right-section receipt-row-border-right"></td></tr>
							<tr>
								<td className="left-section receipt-row-border-left">

								</td>
								<td className="right-section receipt-row-border-right">
									<strong className="reciept-invoice-font">INVOICE #100</strong>
								</td>
							</tr>
							<tr><td className="left-section receipt-row-border-left"></td><td className="right-section receipt-row-border-right"></td></tr>
							<tr><td className="left-section receipt-row-border-left"></td><td className="right-section receipt-row-border-right"></td></tr>
							<tr>
								<td className="left-section receipt-row-border-left"></td>
								<td className="right-section receipt-row-border-right receipt-row-border-bottom">
									<table>
										<th>
											<td className="width-160">Item</td>
											<td className="width-400">Quantity</td>
											<td className="width-160">Price</td>
											<td className="width-160">Total</td>
										</th>
									</table>
								</td>
							</tr>
							<tr><td className="left-section receipt-row-border-left">1.</td>
								<td className="right-section receipt-row-border-right">
									<table>
										<tr>
											<td className="width-160">Tiffin</td>
											<td className="width-400">13</td>
											<td className="width-160">$50.00</td>
											<td className="width-160">$500.00</td>
										</tr>
									</table>
							</td></tr>
              <tr><td className="left-section receipt-row-border-left"></td>
                <td className="right-section receipt-row-border-right receipt-row-border-top"></td>
              </tr>
              <tr>
								<td className="left-section receipt-row-border-left">

								</td>
								<td className="right-section receipt-row-border-right">
                  <div>
										<div className="float-left"></div>
										<div className="float-right"> <strong>TOTAL:</strong> $1231.03</div>
									</div> 
								</td>
							</tr>
              <tr>
								<td className="left-section receipt-row-border-left">

								</td>
								<td className="right-section receipt-row-border-right receipt-row-border-bottom">
                  <div>
										<div className="float-left"></div>
										<div className="float-right"> <strong>PAID:</strong> $0.00</div>
									</div> 
								</td>
							</tr>
              <tr>
								<td className="left-section receipt-row-border-left">

								</td>
								<td className="right-section receipt-row-border-right receipt-row-border-bottom-red">
                  <div>
										<div className="float-left"></div>
										<div className="float-right"> <strong>AMOUNT DUE:</strong> $12312.22</div>
									</div> 
								</td>
							</tr>
              <tr>
								<td className="left-section receipt-row-border-left">

								</td>
								<td className="right-section receipt-row-border-right">
								</td>
							</tr>
              <tr>
								<td className="left-section receipt-row-border-left">

								</td>
								<td className="right-section receipt-row-border-right">
								</td>
							</tr>
						</tbody>
					</table>
        </div>
        )
    }
  }
  
  //@TODO Get state into here
  class Breakdown extends React.Component {
    render() {
      return <div className="receipt-breakdown">
        <div className="receipt-breakdown--header">
            <p>Receipt for</p>

          <h2>John Smith</h2>
        </div>
        <ul>  
            {
              Object
              .keys(this.state.breakdown)
              .map(key => <BreakDownEntry key={key} index={key} details={this.state.breakdown[key]}/>)
            }
        </ul>
      </div>
    }
  }
  
  class BreakDownEntry extends React.Component {
    render() {
      const { details } = this.props;
      return <li>
            <span className={details.icon}>
            </span>
            <div className="list-content">
                <p>{details.text}
                  <span className="list-bold">{details.main}</span>  
                </p>
            </div>
       </li>
    }
  }
  
  class Overview extends React.Component {
    render() {
      return <div className="receipt-overview">
        <OverviewHeader logo={'http://www.alliedbuildings.com/wp-content/uploads/2016/11/Allied-Black-Logo.png'}/>
        <OverviewBody {...this.props} />
        <OverviewFooter {...this.props} />
      </div>
    }
  }
  
  class OverviewHeader extends React.Component {
    render() {
      return <div className="overview-header">
        <img className="logo" src={this.props.logo}/>
        
        <div className="timestamp">
          <span>20 Deccember, 2016</span>
          <span>08:30:57 EST</span>
        </div>
        
        <hr />
      </div>
    }
  }
  
  class PurchaseOverview extends React.Component {
    render() {
      return <div className="purchase-overview"> 
        <h3>{this.props.product}</h3>
      </div>
    }
  }
  
  class OverviewBody extends React.Component {
    render() {
      return <div className="overview-body">
        <PurchaseOverview {...this.props} />
        <div className="user-info">
          <p className="user-info-name"> Hello {this.props.name},</p>
          <p className="user-info-text"> You sent a payment of <span>{this.props.value}</span> to {this.props.merchant}. (<a href="mailto: info@alliedbuildings.com">{this.props.merchantEmail}</a>).  One of our experienced project managers will be in touch with you shortly to review your building specifications.</p>
          <p>Thank you for choosing Allied.</p>
          <p className="salutation"><img src="https://ec2-52-40-174-59.us-west-2.compute.amazonaws.com/banners/about_us_pic.png"/></p>
        </div>
        
        <div className="descriptor">
          <p>It may take a few moments for this transaction to appear in your account</p>
        </div>
      </div>
    }
  }
  
  
  class OverviewFooter extends React.Component {
    render() {
      return <footer className="overview-footer">
          <span className="site">
            <a href="http://www.alliedbuildings.com/contact-us/" target="_blank">www.allied.build/help</a>
          </span>
          <span className="invoice-id">
            +1.877.94 STEEL
          </span>
      </footer>
    }
  }
  
  