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
      
      const permissionRequestResult = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.CAMERA,
      ])

      let granted = true
      for ( let permission of Object.keys(permissionRequestResult) ) {
        if ( permissionRequestResult[permission] == 'granted' ) {
        }else if ( permissionRequestResult[permission] == 'never_ask_again' ) {
          alert('현재 ['+permission+'] 권한이 다시보지 않기로 되어있습니다.\n\n일부 기능이 제한될 수 있습니다.')
        }else {
          granted = false
          break
        }
      }
      if (granted) {
        this.permissionGranted()
      }else{
        this.checkPermission()
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
      Controller.splash.close()
      this.checkPermission()
    }else{
      this.permissionGranted()
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