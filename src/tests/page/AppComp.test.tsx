import React from 'react';
import { shallow } from 'enzyme';
import { AppComp } from '../../components/page/AppComp'; 

test('renders the component', () => {
    const component = shallow(<AppComp />);
    expect(component).toMatchSnapshot();
});