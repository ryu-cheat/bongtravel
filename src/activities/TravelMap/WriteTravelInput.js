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
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';

import styled from 'styled-components/native'
import MapView, { Marker, Polyline, AnimatedRegion } from 'react-native-maps';
import Controller, { navigator, writeTravel } from '../../plugins/controller'
import Storage, { travelWrite } from '../../plugins/storage'
const FastMarker = Animated.createAnimatedComponent(Marker)



export default class WriteTravelInput extends Component{
  state = {
    _loaded: false,
  }

  input = {
    inputTabKey: this.props.inputTab.key,
    myLatLng: this.props.myLatLng,
  }
  
  loadInputs = async() => {
    let { inputTab } = this.props
    let inputs = await travelWrite.Inputs.get()

    let input = await new Promise(resolve => {
      for (let input of inputs) {
        if (inputTab.key == input.inputTabKey) {
          return resolve(input)
        }
      }
      return resolve({ })
    })

    this.input = {
      ...this.input,
      ...input,
    }

    this.markerCoordinate = new AnimatedRegion({
      latitude: this.input.myLatLng.lat,
      longitude: this.input.myLatLng.lng,
      latitudeDelta: this.input.myLatLng.latDelta,
      longitudeDelta: this.input.myLatLng.lngDelta,
    })

    this.setState({ _loaded: true })
  }
  saveInput = async() => {
    let inputTabs = await travelWrite.InputTabs.get()
    let inputs = await travelWrite.Inputs.get()
    inputs = inputs.filter(input => input.inputTabKey != this.input.inputTabKey)
    inputs.push(this.input)

    inputTabs = inputTabs.filter(inputTab => inputTab.key != this.props.inputTab.key)
    inputTabs.push(this.props.inputTab)

    await travelWrite.InputTabs.set(inputTabs)
    await travelWrite.Inputs.set(inputs)

    writeTravel.loadInputTabs()
  }
  removeInput = async() => { // saveInput랑 코드 중복. 어떻게 확장될 지 모르니 일단 그대로 두자
    let inputTabs = await travelWrite.InputTabs.get()
    let inputs = await travelWrite.Inputs.get()

    inputs = inputs.filter(input => input.inputTabKey != this.input.inputTabKey)
    inputTabs = inputTabs.filter(inputTab => inputTab.key != this.props.inputTab.key)

    await travelWrite.InputTabs.set(inputTabs)
    await travelWrite.Inputs.set(inputs)

    writeTravel.loadInputTabs()
  }

  getRegion = () => {
    let { myLatLng } = this.input
    
    return {
      latitude: myLatLng.lat,
      longitude: myLatLng.lng,
      latitudeDelta: myLatLng.latDelta,
      longitudeDelta: myLatLng.lngDelta,
    }
  }

  onRegionChange = (coordinate) => { // (핀위치 [1])핀의 위치는 여기서 바꿔주고(계속호출됨)
    this.markerCoordinate.stopAnimation()
    this.markerCoordinate.timing({
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
      latitudeDelta: coordinate.latitudeDelta,
      longitudeDelta: coordinate.longitudeDelta,
      delay: 0,
      duration :0,
    }).start()
  }
  onRegionChangeComplete = (coordinate) => { // (핀위치 [2])지도에 선택된 위치는 여기서 저장해준다
    this.input.myLatLng = {
      lat:coordinate.latitude,
      lng:coordinate.longitude,
      latDelta:coordinate.latitudeDelta,
      lngDelta:coordinate.longitudeDelta,
    }
  }

  markerCoordinate = new AnimatedRegion()

  render(){
    let { _loaded } = this.state
    if (!_loaded) return (<View />) // 나중에 로딩 뷰 띄우기

    const { width } = Dimensions.get('window')

    let region = this.getRegion()

    return <View style={style.writeWrapper}>
      <MapView
        region={region}
        onRegionChange={this.onRegionChange}
        onRegionChangeComplete={this.onRegionChangeComplete}
        style={{ width, height: width }}>
        <FastMarker 
          coordinate={this.markerCoordinate}
          title={'여행 일지'}
          description={'이 곳에 방문했어요 !'}
        />
      </MapView>
    </View>
  }
  componentDidMount(){
    this.loadInputs()
  }
}


const style = StyleSheet.create({
  writeWrapper:{
    flex: 1,
  },
})