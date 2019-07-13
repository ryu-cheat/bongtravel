/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {
  View,
  Text,
} from 'react-native';

import Login from './login'
import Main from './main'

class Index extends Component{
  render(){
    return (
      <Main />
    )
  }

  // life cycle
  componentDidMount(){
    this.props.splashController.close()
  }
}


export default Index;
