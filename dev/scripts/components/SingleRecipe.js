import React from 'react';

const SingleRecipe = (props) => {
	// SingleRecipe doesn't have access to this so we use props to send em up to the render
	return(
		<div id="overlay">
		
		<div id="modal">		
		<h3>{props.name}</h3>	
		<a href={props.source} target="_blank">I'm Ready to Get Cooking</a>
		<span>
		<button onClick={props.exitModal}>Exit</button>	
		<button onClick={props.handlefirebaseClick}>Save For Later</button>
		</span>

		
		</div>
		
	</div>)

}

export default SingleRecipe;