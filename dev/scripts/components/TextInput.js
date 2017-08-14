import React from 'react';

class TextInput extends React.Component {
 constructor(props){
 	super(props);
 }

 	render(){
 		return (
 			<span className="display">
 			<label htmlFor={this.props.inputID}>{this.props.labelText}</label>
 			<input required="true" type='text' onChange={this.props.changeEvent} id={this.props.inputID} name={this.props.name}/>
 			</span>

 			)
 	}
 }

 export default TextInput;