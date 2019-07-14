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
} from 'react-native';

import styled from 'styled-components/native'
import MapView, { Marker, Polyline } from 'react-native-maps';
import Controller, { navigator, writeTravel } from '../../plugins/controller'
import Storage, { travelWrite } from '../../plugins/storage'
import WriteTravelInput from './WriteTravelInput'

import Geolocation from '@react-native-community/geolocation'

export default class WriteTravel extends Component{
  state = {
    _loaded: false,
    myLatLng: null,
    inputTabs:[],
    selectedInputTabKey: null,
  }
  constructor(p){
    super(p)
    writeTravel.loadInputTabs = this.loadInputTabs
  }
  getMyLatLng = () => {
    const success = (position) => {
      const myLatLng = {
          lat: parseFloat(position.coords.latitude),
          lng: parseFloat(position.coords.longitude),
          latDelta: 0.03,
          lngDelta: 0.03,
      }

      this.setState({
        myLatLng,
        _loaded: true,
      });
    }

    const error = (err) => {
      console.warn('err',err)
      this.setState({
        myLatLng: {
          lat: 37.541,
          lng: 126.986,
          latDelta: 0.03,
          lngDelta: 0.03,
        },
        _loaded: true,
      })
    }

    const options = { }

    Geolocation.getCurrentPosition(success, error, options)
  }
  loadInputTabs = async() => { // 마지막으로 저장된 목록을 불러오고, 저장된게 없으면 새로 추가한다.
    let inputTabs = await travelWrite.InputTabs.get()
    if (inputTabs.length == 0) {
      this.addDefaultInputTabs()
    }else{
      let selectedInputTabKey = this.state.selectedInputTabKey
      if (inputTabs.filter(inputTab => inputTab.key == selectedInputTabKey).length == 0) {
        selectedInputTabKey =  inputTabs[0].key
      }

      this.setState({
        inputTabs,
        selectedInputTabKey,
      }, this.getMyLatLng)
    }
  }
  addDefaultInputTabs = (D = new Date()) => {
    let dateString = [ D.getFullYear(), D.getMonth()+1, D.getDate() ].map(d => (d+'').length == 1 ? '0'+d : d ).join('-')
    let timeString = [ D.getHours(), D.getMinutes() ].map(d => (d+'').length == 1 ? '0'+d : d ).join(':')

    let inputTabs = []
    let inputTabKey = Math.random()+''
    inputTabs.push({
      name: '나의 여행일지',
      date: dateString+' '+timeString,
      key: inputTabKey
    })

    this.setState({ inputTabs, selectedInputTabKey: inputTabKey }, this.getMyLatLng)
  }
  render(){
    let { _loaded, inputTabs, selectedInputTabKey, myLatLng } = this.state
    if (!_loaded) return (<View />) // 나중에 로딩 뷰 띄우기
    
    let inputTabViews = []
    let selectedInputTab = null
    for (let inputTab of inputTabs) {
      const onPress = () => this.setState({ selectedInputTabKey: inputTab.key })

      let active = inputTab.key == selectedInputTabKey
      if (active) {
        selectedInputTab = inputTab
      }
      inputTabViews.push(<InputTab active={active} style={style.inputTab} key={inputTab.key} onPress={onPress}>
        <InputTabText active={active} style={style.inputTabText}>{inputTab.name}</InputTabText>
      </InputTab>)
    }

    return (
      <View style={style.writeWrapper}>
        <View style={style.inputTabsScrollWrapper}>
          <ScrollView contentContainerStyle={style.inputTabsScroll} horizontal showsHorizontalScrollIndicator={false} >
            {inputTabViews}
          </ScrollView>
        </View>
        <View style={style.inputTabsScrollBottomLine}/>
        <WriteTravelInput key={selectedInputTabKey} inputTab={ selectedInputTab } myLatLng={myLatLng} />
      </View>
    )

  }
  componentDidMount(){
    this.loadInputTabs()
  }
}

const InputTab = styled.TouchableOpacity`
  ${props=>props.active && `
    backgroundColor: #fff;
  `}
`
const InputTabText = styled.Text`
  color: #777;
  ${props=>props.active && `
    color: #000;
    font-weight: bold;
  `}
`

const style = StyleSheet.create({
  writeWrapper:{
    flex: 1,
  },
  inputTabsScrollWrapper:{
    height: 50,
    backgroundColor:'#eee',
  },
  inputTabsScroll:{
    paddingLeft: 10,
  },
  inputTab:{
    marginRight: 10,
    marginTop: 10,
    alignItems:'center',
    justifyContent:'center',
    paddingHorizontal:10,
    borderTopRightRadius:5,
    borderTopLeftRadius:5,
  },
  inputTabText:{
    fontSize:12,
  },
  inputTabsScrollBottomLine:{
    height: 1,
    backgroundColor:'#ffffff',
  },
})