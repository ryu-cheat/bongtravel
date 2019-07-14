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
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

import MapView, { Marker, Polyline } from 'react-native-maps';
import Controller, { navigator } from '../../plugins/controller'

export default class Index extends Component{
  state = {
    _loaded: false,
  }
  render(){
    let { _loaded } = this.state
    if (!_loaded) return (<View />) // 나중에 로딩 뷰 띄우기
  }
}

const style = StyleSheet.create({
  flex1: { flex: 1 },
  relative:{position:'relative'},
})