

	import React, { Component } from 'react';
	import { Modal, Button } from 'react-bootstrap';

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
			<Modal
				title="Update Schedule"
				show={true}
				onHide={this.props.handleClose}
				>
				 <Modal.Header closeButton>
            <Modal.Title id="example-modal-sizes-title-lg">
              Schedule Tiffin
            </Modal.Title>
          </Modal.Header>
				<Modal.Body>
					<h4>{this.props.date}</h4>
					<hr />
					<TiffinDropDown id="Update" tiffin={this.props.tiffin} />
				</Modal.Body>
				<Modal.Footer>
					<input type='button' name='updateSchedule' id='UpdateShedule' value='Update' onClick={() => this._updateSchedule()}/>

					<Button variant="secondary" type="button" 
						style={{
							marginLeft: 30
						}}
						onClick={() => this.props.handleClose()}>
						Close
					</Button>
					</Modal.Footer>
			</Modal>
			]
  }
}