

	import React, { Component } from 'react';

	export default class TiffinDropDown extends Component {
	constructor(props) {
			super(props);

			this.state = {
			isDialogOpen: false
		}
	}

	handleCheckboxClick(code, id) {

		if(code === 4){
			 if(document.getElementById('BreakFast_' + id).checked) {
				document.getElementById('Amount_BreakFast_' + id).value = '20';
				document.getElementById('Quantity_BreakFast_' + id).value = '1';
			 }  else {
				document.getElementById('Amount_BreakFast_' + id).value = '';
				document.getElementById('Quantity_BreakFast_' + id).value = '';
			}
		}

		if(code === 1) {
			if(document.getElementById('Launch_' + id).checked) {
				document.getElementById('Amount_Launch_' + id).value = '40';
				document.getElementById('Quantity_Launch_' + id).value = '1';
			} else {
				document.getElementById('Amount_Launch_' + id).value = '';
				document.getElementById('Quantity_Launch_' + id).value = '';
			}
		}

		if(code === 2)
		  if(document.getElementById('Dinner_' + id).checked) {
				document.getElementById('Amount_Dinner_' + id).value = '40';
				document.getElementById('Quantity_Dinner_' + id).value = '1';
			}else {
				document.getElementById('Amount_Dinner_' + id).value = '';
				document.getElementById('Quantity_Dinner_' + id).value = '';
			}
	}

  render() {
    return <div>
							<span>Break Fast:</span>
							<input type='checkbox' name='breakFast' id={'BreakFast_' + this.props.id} value='Break Fast' defaultChecked={this.props.tiffin.breakFast ? 'checked' : ''} onClick={() => this.handleCheckboxClick(4, this.props.id)}/>
							<input type='text' name='amount' id={'Amount_BreakFast_' + this.props.id} defaultValue={this.props.tiffin.breakFast ? this.props.tiffin.breakFast.amount : ''} size='5'/> &nbsp;
							<input type='text' name='quantity' id={'Quantity_BreakFast_' + this.props.id} defaultValue={this.props.tiffin.breakFast ? this.props.tiffin.breakFast.qty : '1'} size='5'/> &nbsp;

							<span>Launch:</span>
							<input type='checkbox' name='launch' id={'Launch_' + this.props.id} value='Launch' defaultChecked={this.props.tiffin.launch ? 'checked' : ''} onClick={() => this.handleCheckboxClick(1, this.props.id)}/>
							<input type='text' name='amount' id={'Amount_Launch_' + this.props.id} defaultValue={this.props.tiffin.launch ? this.props.tiffin.launch.amount : ''} size='5'/> &nbsp;
							<input type='text' name='quantity' id={'Quantity_Launch_' + this.props.id} defaultValue={this.props.tiffin.launch ? this.props.tiffin.launch.qty : '1'} size='5'/> &nbsp;

							<span>Dinner:</span>
							<input type='checkbox' name='dinner' id={'Dinner_' + this.props.id} value='Dinner' defaultChecked={this.props.tiffin.dinner ? 'checked' : ''} onClick={() => this.handleCheckboxClick(2, this.props.id)}/>
							<input type='text' name='amount' id={'Amount_Dinner_' + this.props.id} defaultValue={this.props.tiffin.dinner ? this.props.tiffin.dinner.amount : ''} size='5'/> &nbsp;
							<input type='text' name='quantity' id={'Quantity_Dinner_' + this.props.id} defaultValue={this.props.tiffin.dinner ? this.props.tiffin.dinner.qty : '1'} size='5'/> &nbsp;

						</div>
  }
}

	// <select id={'TiffinType_' + this.props.id} >
							// 	<option value="0">--Select--</option>
							// 	<option class="launch" value="1">Launch</option>
							// 	<option class="dinner" value="2">Dinner</option>
							// 	<option class="both" value="3">Both</option>
							// </select>