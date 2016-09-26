import React from 'react'
import { mount, shallow } from 'enzyme'
import { expect } from 'chai'

import Greeting from './greeting'

describe('<Greeting/>', function () {
  it('should have an h1 to display a greeting', function () {
    const wrapper = shallow(<Greeting/>)
    expect(wrapper.find('h1')).to.have.length(1)
  })

  it('should have props for name', function () {
    const wrapper = shallow(<Greeting/>)
    expect(wrapper.props().name).to.be.defined
  })
})
