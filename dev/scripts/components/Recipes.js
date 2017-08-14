import React from 'react';

const Recipes = (props) => {
		return(<div className="componentRecipe">
			<h3>{props.name}</h3>
			<p> by {props.source}</p>
			<img src={props.image} alt=""/>
			<button onClick={() => props.handleClick(props.data)}>View More Details</button>
		</div>);
}

export default Recipes;