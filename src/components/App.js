import React from 'react';
import '../App.css';
import Search from './Search'
import GoogleMap from './GoogleMap';
import ReviewForm from './ReviewForm';
import SignInButton from './SignInButton'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

class App extends React.Component {
  constructor() {
    super()
    this.state = {
      coordinates: {
        lat: null,
        lng: null
      },
      placeData: '',
      userLocation: { lat: 42.3601, lng: -71.0589}
    }
  }

  render() {
    return (
      
      <Router>
        
        
        <Route path='/'>
          <div className="App">

            <SignInButton />
            
            <Search setApp={this.setState.bind(this)}/>

            <GoogleMap
              initialCenter={this.state.userLocation}
              coordinates={this.state.coordinates}
              placeData={this.state.placeData}
            />

          </div>
        </Route>

        <Switch>
          <Route path='/auth' component={ReviewForm}/>
          <Route path='/new/:placeId' render={() => <ReviewForm />}/>
        </Switch>
        
        
      </Router>
      
      
    )
  }
}

export default App
