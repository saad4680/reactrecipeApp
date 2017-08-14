import React from 'react';

class RadioInput extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			inputType: 'radio'
		};
	}

	render() {
		return(
			
				<div className="radioInputs">
					<input type={this.state.inputType} onChange={this.props.changeEvent} id={this.props.inputID} name={this.props.name} value={this.props.inputID} required="true"/>
					<label htmlFor={this.props.inputID}><img src={this.props.image} alt=""/>{this.props.labelText}</label>
				</div>

			
		)
	}
}
export default RadioInput;