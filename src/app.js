import './styles.css'
import React from 'react'
import ReactDOM from 'react-dom'
import Greeting from './components/greeting'

var root = document.getElementById('react-root')

ReactDOM.render(
  <Greeting name='World' />,
  root
)
