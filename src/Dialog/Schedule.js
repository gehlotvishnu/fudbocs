

	import React, { Component } from 'react';
	import Dialog from 'react-dialog'

	import TiffinDropDown from '../Common/tiffinDropDown';

	import { updateSchedule } from '../httpClient';

	export default class Schedule extends Component {
	constructor(props) {
			super(props);

			this.state = {}
	}

	_updateSchedule() {
		const { props } = this;
		let bill = [];

		if(document.getElementById('BreakFast_Update').checked) {
			bill.push({tiffinType: '4', amount: document.getElementById('Amount_BreakFast_Update').value, qty: document.getElementById('Quantity_BreakFast_Update').value})
		  }
	
		  if(document.getElementById('Launch_Update').checked) {
			bill.push({tiffinType: '1', amount: document.getElementById('Amount_Launch_Update').value, qty: document.getElementById('Quantity_Launch_Update').value})
		  }
	
		  if(document.getElementById('Dinner_Update').checked) {
			bill.push({tiffinType: '2', amount: document.getElementById('Amount_Dinner_Update').value, qty: document.getElementById('Quantity_Dinner_Update').value})
		  }

		const obj = {
			_id: props._id,
			customerId: props.customerId,
			index: props.index,
			date: props.date,
			bill: bill
			// tiffinType: document.getElementById('TiffinType_Update').value,
		}

		updateSchedule(obj).then(function(data) {
			props.handleClose();
			props.setSchedule(data);
			console.log("updated.................", data);
		});
	}

  render() {
    return [
			<Dialog
				title="Update Schedule"
				modal={true}
				onClose={this.props.handleClose}
				buttons={
						[{
								text: "Close",
								onClick: () => this.props.handleClose()
						}]
			}>
				<h3>{this.props.date}</h3>
				<TiffinDropDown id="Update" tiffin={this.props.tiffin} />
				&nbsp;&nbsp;&nbsp; <br />
				<input type='button' name='updateSchedule' id='UpdateShedule' value='Update' onClick={() => this._updateSchedule()}/>

			</Dialog>
			]
  }
}