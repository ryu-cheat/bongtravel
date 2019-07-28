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
import Login from './login'
import { passStateToProps } from 'react-lingost'
import * as LingostApi from '../lingost/api'

class Index extends Component{
  constructor(p) {
    super(p)
    LingostApi.loginCheck()
  }
  render(){
    return (this.props.isLogin ? <Main /> : <Login />)
  }
}

const stateToProps = ({ user }) => ({
  isLogin: user.isLogin,
})

export default passStateToProps(stateToProps)(Index);
