

	import React, { Component } from 'react';

	export default class TiffinDropDown extends Component {
	constructor(props) {
			super(props);

			this.state = {
			isDialogOpen: false
		}
	}
  render() {
    return [
							<span>Tiffin Type:</span>,
							<select id={'TiffinType_' + this.props.id} >
								<option value="0">--Select--</option>
								<option class="launch" value="1">Launch</option>
								<option class="dinner" value="2">Dinner</option>
								<option class="both" value="3">Both</option>
							</select>
			]
  }
}