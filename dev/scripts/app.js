import React from 'react';
import ReactDOM from 'react-dom';
import {ajax} from 'jquery';
import $ from 'jquery';

// $(document).ready(function(){
// 	// Select all links with hashes
// 	$('a[href*="#"]')
// 	  // Remove links that don't actually link to anything
// 	  .not('[href="#"]')
// 	  .not('[href="#0"]')
// 	  .click(function(event) {
// 	    // On-page links
// 	    if (
// 	      location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') 
// 	      && 
// 	      location.hostname == this.hostname
// 	    ) {
// 	      // Figure out element to scroll to
// 	      var target = $(this.hash);
// 	      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
// 	      // Does a scroll target exist?
// 	      if (target.length) {
// 	        // Only prevent default if animation is actually gonna happen
// 	        event.preventDefault();
// 	        $('html, body').animate({
// 	          scrollTop: target.offset().top
// 	        }, 1000, function() {
// 	          // Callback after animation
// 	          // Must change focus!
// 	          var $target = $(target);
// 	          $target.focus();
// 	          if ($target.is(":focus")) { // Checking if the target was focused
// 	            return false;
// 	          } else {
// 	            $target.attr('tabindex','-1'); // Adding tabindex for elements not focusable
// 	            $target.focus(); // Set focus again
// 	          };
// 	        });
// 	      }
// 	    }
// 	  });
// });




const apiKey = 'c6a456b06c87490207e4863b23095a4a';
const apiId = '34cb1a7b';

var config = {
  apiKey: "AIzaSyCKa-KDlGxgoGs7XEmybT3leQMrQPAFsoE",
  authDomain: "saadsproject6.firebaseapp.com",
  databaseURL: "https://saadsproject6.firebaseio.com",
  projectId: "saadsproject6",
  storageBucket: "saadsproject6.appspot.com",
  messagingSenderId: "875095036025"
};


firebase.initializeApp(config);
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();


class App extends React.Component {
	constructor(){
		super();
		this.state = {
			min: undefined,
			max: undefined,
			cuisines: '',
			recipes: [],
			fireRecipes:[],
			singleRecipeName: '',
			singleRecipeSource: '',
			loggedIn: false,
			user: null

		}
		this.exitModal = this.exitModal.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleClick = this.handleClick.bind(this);
		this.handlenewclick = this.handlenewclick.bind(this);
		this.handlefirebaseClick = this.handlefirebaseClick.bind(this);
		this.login= this.login.bind(this);
		this.logout= this.logout.bind(this);
	}

	componentDidMount(){
		auth.onAuthStateChanged((user) => {
			if (user) {

				this.setState({
					user: user,
					loggedIn:true
				});
				const userId = user.uid;
				const userRef = firebase.database().ref(userId);
			
				userRef.on('value', (snapshot) => {
					let firerecipes = snapshot.val();
		
					let newState = [];
					for (let recipe in firerecipes) {
						newState.push({
							id: recipe,
							title: firerecipes[recipe].title,
							source:firerecipes[recipe].source
						})
					};
					this.setState({
						fireRecipes: newState
					});		
				});	
			} else {
				this.setState({
					user:null,
					loggedIn: false
				})
			}
		});
		
	}
	
	removeItem(key){

		const recipesRef = firebase.database().ref(`${firebase.auth().currentUser.uid}/${key}`);
		recipesRef.remove();
	}
	handleSubmit(e){
		e.preventDefault();
		ajax({
			url: "https://api.yummly.com/v1/api/recipes",
			method: 'GET',
			dataType: 'jsonp',
			data: {
				_app_key: apiKey,
				_app_id: apiId,
				requirePictures:true,
				'nutrition.ENERC_KCAL.min': this.state.min,
				'nutrition.ENERC_KCAL.max': this.state.max,
				'allowedCuisine[]': 'cuisine^cuisine-'+ this.state.cuisines

			}

		}).then((rec) => {
			let recData = rec.matches;

			this.setState({
				recipes: recData
			})
			
			 $('html, body').animate({
                scrollTop: $("#hi").offset().top
            }, 1000);

		})
	}
	exitModal() {
			 var x = document.getElementById('overlay');
        	x.classList.remove("show");


	}
	handlefirebaseClick(){
		const userId =  this.state.user.uid;
		const userRef = firebase.database().ref(userId);
		  const recipe = {
		    title: this.state.singleRecipeName,
		    source: this.state.singleRecipeSource
		  }
		  userRef.push(recipe).then(() => {
		  		var x = document.getElementById('overlay');
        	x.classList.remove("show");
        	 $('html, body').animate({
                scrollTop: $("#saved").offset().top
            }, 1000);
		  })

	
	}
	handlenewclick(){
		 $('html, body').animate({
                scrollTop: $("#saved").offset().top
            }, 1000);
	}

	login(){
		auth.signInWithPopup(provider).then((result) => {
			const user = result.user;

			this.setState({
				user: user,
				loggedIn: true
			})


		})

	}
	logout(){
		auth.signOut().then(() => {
			this.setState({
				user: null,
				loggedIn: false
			});
		});
	}

	handleChange(e){
		this.setState({
			[e.target.name]:e.target.value
		})
	}

	handleClick(data){
		
		ajax({
		url: `https://api.yummly.com/v1/api/recipe/${data}`,
		method: 'GET',
		dataType: 'jsonp',
		data: {
			_app_key: apiKey,
			_app_id: apiId
		}
	}).then((singleRec) => {

		this.setState({
			singleRecipeName: singleRec.name,
			singleRecipeSource: singleRec.attribution.url
			
		})

        var x = document.getElementById('overlay');
        x.classList.toggle("show");


	})



	}

    render() {

    	const showPins = () => {
    		if (this.state.loggedIn === true) {
    			return(
    		<div>
    		
    		<form action="" onSubmit={this.handleSubmit}>
    			<div className="topbar">
          		<p> Hey, {this.state.user.displayName}!</p>
          		<a onClick={this.handlenewclick}>View Saved Recipes</a>
    			</div>
    		

          	<div className="calorieInput">
          		<img src={this.state.user.photoURL} alt=""/>
          		<p>Please enter the range of calories you want to eat for your next meal.</p>

	          	<TextInput changeEvent={this.handleChange} inputID="min" name="min" labelText=""/>

	          	<TextInput changeEvent={this.handleChange} inputID="max" labelText=" - " name="max"/>

	          	<p className="picker">Please pick a cuisine.</p>
	          	

          	</div>
          	<div className="cuisineInput">


          		<RadioInput changeEvent={this.handleChange} image="/assets/french.png" inputID="french" labelText="French" name="cuisines"/>

          		<RadioInput changeEvent={this.handleChange} image="/assets/american.png" inputID="american" labelText="American" name="cuisines"/>

          		<RadioInput changeEvent={this.handleChange} image="/assets/mediterranian.png" inputID="mediterranean" labelText="Mediterranean" name="cuisines"/>

          		<RadioInput changeEvent={this.handleChange} inputID="mexican" image="/assets/mexican.png" labelText="Mexican" name="cuisines"/>

          		<RadioInput changeEvent={this.handleChange} inputID="asian" image="/assets/asian.png" labelText="Asian" name="cuisines"/>


          	</div>

          	<input id="hello" className="submitInput" type="submit" value="Find And Save Recipes"/>

          </form>
          
          <div id="hi" className="recipeGrid">
          		{this.state.recipes.map((recipe) => {
          				recipe.smallImageUrls=recipe.smallImageUrls.toString().replace('=s90','=s300');
          			return(

          			<Recipes 
          				data={recipe.id}
          				name={recipe.recipeName} 
          				source={recipe.sourceDisplayName} 
          				image={recipe.smallImageUrls}
          				key={recipe.id} handleClick={this.handleClick}/>
          			);
          		})}
          		
        		
          	</div>

          	<div>
          		<div className="overlay"></div>
          		
	          	<SingleRecipe 

	          		exitModal = {this.exitModal}
	          		handlefirebaseClick={this.handlefirebaseClick}
	          		name={this.state.singleRecipeName} 
	          		source={this.state.singleRecipeSource}/>

          	</div>

          	<section className="pinnedItems">
          		<h1 id="saved">Your Saved Recipes</h1>
          		<ul className="pinnedItem">
          		{this.state.fireRecipes.map((firerec) => {
          			return(<li key={firerec.id}>
 						<h3>{firerec.title}</h3>
 						<a href={firerec.source} target="_blank">Lets get Cooking!</a>
 						<button onClick={() => this.removeItem(firerec.id)}>Remove Recipe</button>

 					</li>  
 					)
          		})
 				}
          		</ul>
          		<div className='logoutContainer'>
          		<button className="logout" onClick={this.logout}>Logout</button>
          		</div>
          	</section>
         
          		
          	
          	
          	</div>
    				)
    		}
    		else {
    			return( 
    				<div className="googleLogin">
    				
    					<h1>Meal Time</h1>
    					<p>Recipes Inspired By You</p>
    					<button className= "loginBtn loginBtn--google" onClick={this.login}>Login with Google</button>
    				</div>

    				)

    		}
    	}
      return (
        <main>
          
          {showPins()}	          	        
        </main>
      )
    }
}

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

const Recipes = (props) => {
		return(<div className="componentRecipe">
			<h3>{props.name}</h3>
			<p> by {props.source}</p>
			<img src={props.image} alt=""/>
			<button onClick={() => props.handleClick(props.data)}>View More Details</button>
		</div>);
}


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



class TextInput extends React.Component {
 constructor(props){
 	super(props);
 	this.state = {
 		inputType: 'text'
 	}
 }

 	render(){
 		return (
 			<span className="display">
 			<label htmlFor={this.props.inputID}>{this.props.labelText}</label>
 			<input required="true" type={this.state.text} onChange={this.props.changeEvent} id={this.props.inputID} name={this.props.name}/>
 			</span>

 			)
 	}
 }









ReactDOM.render(<App/>, document.getElementById('app'));