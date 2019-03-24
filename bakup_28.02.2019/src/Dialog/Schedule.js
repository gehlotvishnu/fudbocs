

	import React, { Component } from 'react';
	import { Modal, Button, ButtonToolbar } from 'react-bootstrap';
	import moment from 'moment';

	import TiffinDropDown from '../Common/tiffinDropDown';
	import { updateSchedule } from '../httpClient';
	import { convertDate } from '../Helper';

	export default class Schedule extends Component {
	constructor(props) {
			super(props);

			this.state = {}
	}

	_updateSchedule() {
		const { props } = this;
		let bill = [];

		if(document.getElementById('BreakFast_Update').checked) {
			const amt = this.props.role === 'admin' ? document.getElementById('Amount_BreakFast_Update').value : this.props.breakFast ? this.props.breakFast.amount : '20';
			const qty = this.props.role === 'admin' ? document.getElementById('Quantity_BreakFast_Update').value : this.props.breakFast ? this.props.breakFast.qty : '1';

			bill.push({tiffinType: '4', amount: amt, qty: qty, isActive: 1})
		} else {
			this.props.tiffin.breakFast && bill.push({tiffinType: '4', amount: 0, qty: 0, isActive: 0})
		}

		if(document.getElementById('Launch_Update').checked) {
			const amt = this.props.role === 'admin' ? document.getElementById('Amount_Launch_Update').value : this.props.launch ? this.props.launch.amount : '45';
			const qty = this.props.role === 'admin' ? document.getElementById('Quantity_Launch_Update').value : this.props.launch ? this.props.launch.qty : '1';
			bill.push({tiffinType: '1', amount: amt, qty: qty, isActive: 1})
		} else {
			this.props.tiffin.launch && bill.push({tiffinType: '1', amount: 0, qty: 0, isActive: 0})
		}

		if(document.getElementById('Dinner_Update').checked) {
			const amt = this.props.role === 'admin' ?  document.getElementById('Amount_Dinner_Update').value : this.props.dinner ? this.props.dinner.amount : '45';
			const qty = this.props.role === 'admin' ?  document.getElementById('Quantity_Dinner_Update').value : this.props.dinner ? this.props.dinner.qty : '1';
			bill.push({tiffinType: '2', amount: amt, qty: qty, isActive: 1})
		} else {
			this.props.tiffin.dinner && bill.push({tiffinType: '2', amount: 0, qty: 0, isActive: 0})
		}

		const obj = {
			_id: props._id,
			customerId: props.customerId,
			index: props.index,
			date: props.date,
			bill: bill,
			role: props.role,
			isActive: 1
			// tiffinType: document.getElementById('TiffinType_Update').value,
		}

		updateSchedule(obj).then(function(data) {
			props.handleClose();
			props.setSchedule(data);
		});
	}
	
	check(role, date, time) {
		if(role === 'user') {
			if(moment().isAfter(moment(date))) {
				if(moment().diff(date, 'days') === 0) {
					if(moment().isAfter(moment(time, "HH:mm a"))) {
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

  render() {
	const { role, date, tiffin } = this.props;
    return [
			<Modal
				title="Update Schedule"
				show={true}
				onHide={this.props.handleClose}
				>
				 <Modal.Header closeButton>
            <Modal.Title id="example-modal-sizes-title-lg">
              Schedule Tiffin - {convertDate(date)}
            </Modal.Title>
          </Modal.Header>
				<Modal.Body>
					<TiffinDropDown check={this.check} role={role} id="Update" tiffin={tiffin} date={date}/>
				</Modal.Body>
				<Modal.Footer>
					<ButtonToolbar>
						{
							this.check(role, date, '23:59 pm') ?
							<Button variant="primary"name='updateSchedule' id='UpdateShedule' value='Update' onClick={() => this._updateSchedule()}>
								Update
							</Button>
							:
							<Button disabled variant="primary"name='updateSchedule' id='UpdateShedule' value='Update'>
								Update
							</Button>
						}
					
						<Button variant="secondary"
							style={{
								marginLeft: 30
							}}
							onClick={() => this.props.handleClose()}>
							Close
						</Button>
					</ButtonToolbar>

					</Modal.Footer>
			</Modal>
			]
  }
}