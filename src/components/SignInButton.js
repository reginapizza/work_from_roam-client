import React from 'react'
import { BrowserRouter as Router, Link, withRouter } from 'react-router-dom'
import './SignInButton.css'


class SignInButton extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            test: true
        }
    }

    // render button for sign-in

    render() {
        return (
            <Router>
                <Link to={`/auth`}>
                    <button className='sign-in-button'>Sign In</button>
                </Link>
            </Router>
            
            
        )
    }
}

export default withRouter(SignInButton)