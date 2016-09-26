import React from 'react'
import { mount, shallow } from 'enzyme'
import { expect } from 'chai'

import Greeting from './greeting'

describe('<Greeting/>', function () {
  it('should have an `h1` to display a greeting', function () {
    const wrapper = shallow(<Greeting />)
    expect(wrapper.find('h1')).to.have.length(1)
  })

  it('should have no `props` for name', function () {
    const wrapper = shallow(<Greeting />)
    expect(wrapper.props().name).to.be.undefined
  })

  it('should have `props` for name', function () {
    const wrapper = mount(<Greeting name='World' />)
    expect(wrapper.props().name).to.equal('World')
  })

  it('typing in box should update state', function () {
    const wrapper = shallow(<Greeting />)
    wrapper.find('input').simulate('change', {target: {value: 'Bilbo'}})
    expect(wrapper.state('name')).to.equal('Bilbo')
  })
})
