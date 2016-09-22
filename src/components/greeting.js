import React from 'react'

export default class Greeting extends React.Component {
  constructor (props) {
    super(props)
    var name = 'Foo ' + props.name
    console.log(name)
  }

  render () {
    return (
      <h1 className='greeting'>Hello, {this.props.name}! a</h1>
    )
  }
}
