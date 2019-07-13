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
    // 실행 전에 상위 컴포넌트(스플래시) 에서 초기화 돼야 한다
    Controller.splash.close()
  }
}

export default Index;
