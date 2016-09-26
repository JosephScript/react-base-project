import React from 'react'

export default class Greeting extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      name: ''
    }
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange (event) {
    this.setState({
      name: event.target.value
    })
  }

  render () {
    return (
      <div>
        <h1 className='greeting'>Hello, {this.state.name || this.props.name}!</h1>
        <input type='text' placeholder='Enter your name' onChange={this.handleChange} />
      </div>
    )
  }
}
