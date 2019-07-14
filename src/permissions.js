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
  Animated,
  StyleSheet,
  Geolocation,
  Platform,
  PermissionsAndroid,
} from 'react-native';

import styled from 'styled-components/native';

import Controller from './plugins/controller'

export default class Splash extends Component{
  state = {
    _permitted: null,
  }
  permissionGranted = () => {
    Controller.splash.open()
    this.setState({ _permitted: true })
  }
  checkPermission = async() => {
    try {
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        this.permissionGranted()
      } else {
        const requestGrantedResult = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
        if (requestGrantedResult.match('never')) {
          this.permissionGranted()
        }else{
          Controller.splash.close()
          this.checkPermission()
        }
      }
    } catch (err) {
      this.permissionGranted()
    }
  }
  render(){
    let { _permitted } = this.state
    if (_permitted == null) {
      return (<View />)
    }else if (_permitted == true) {
      return (<>{this.props.children}</>)
    } else {
      return (
        <View style={style.permissionWrapper}>
          <Text>지금 뜨는 권한을 허용해주세요</Text>
        </View>
      )
    }

  }
  componentDidMount(){
    if (Platform.OS == 'android') {
      this.checkPermission()
    }
  }
}

const style = StyleSheet.create({
  permissionWrapper:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }
})