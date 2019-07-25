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

import Controller, { navigator } from '../plugins/controller'
import Main from './main'

class Index extends Component{
  render(){
    return (
      <Main />
    )
  }
}

export default Index;
