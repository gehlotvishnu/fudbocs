

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

		const obj = {
			_id: props._id,
			customerId: props.customerId,
			index: props.index,
			date: props.date,
			tiffinType: document.getElementById('TiffinType_Update').value,
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
				<TiffinDropDown id="Update"/>
				&nbsp;&nbsp;&nbsp;
				<input type='button' name='updateSchedule' id='UpdateShedule' value='Update' onClick={() => this._updateSchedule()}/>

			</Dialog>
			]
  }
}