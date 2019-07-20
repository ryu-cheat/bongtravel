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

import { travelStyle } from './style'
const style = travelStyle

// WriteTravel에서 탭을 관리하고, 입력은 WriteTravelInput에서한다.
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
  // 내 위치를 받아온다. (사진에 메타데이터가 없을때 기본 지도위치는 내 위치로 해준다)
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

   // 마지막으로 저장된 목록을 불러오고, 저장된게 없으면 새로 추가한다.
  loadInputTabs = async() => {
    let inputTabs = await travelWrite.InputTabs.get()
    if (inputTabs.length == 0) {
      this.addDefaultInputTabs()
    }else{
      let selectedInputTabKey = this.state.selectedInputTabKey
      // 지금 선택한 탭이 지워졌다면 ..! 첫번째 탭 사용 !!
      if (inputTabs.filter(inputTab => inputTab.key == selectedInputTabKey).length == 0) {
        selectedInputTabKey =  inputTabs[0].key
      }

      this.setState({
        inputTabs,
        selectedInputTabKey,
      }, this.getMyLatLng)
    }
  }
  
  // 기본 입력 탭을 추가한다.
  addDefaultInputTabs = async( D = new Date() ) => {
    let inputTabs = await travelWrite.InputTabs.get()

    let dateString = [ D.getFullYear(), D.getMonth()+1, D.getDate() ].map(d => (d+'').length == 1 ? '0'+d : d ).join('-')
    let timeString = [ D.getHours(), D.getMinutes() ].map(d => (d+'').length == 1 ? '0'+d : d ).join(':')

    let inputTabKey = Math.random()+''

    let inputTab = {
      title: dateString+' 여행',
      date: dateString+' '+timeString,
      key: inputTabKey
    }
    inputTabs.push(inputTab)

    await travelWrite.InputTabs.set(inputTabs)

    // 새로운 탭이 추가되면 탭목록갱신 + 선택 탭을 이 탭으로
    this.setState({ inputTab, inputTabs, selectedInputTabKey: inputTabKey }, this.getMyLatLng)

    return { inputTab, inputTabKey, dateString, timeString }
  }

  // 사진 여러장을 첨부했을때, 날짜가 다른 사진이 있다면, 여행일지 작성 탭을 여러개로 늘려주는데 그 때
  // 기본탭추가 + 들어갈내용 입력 후 저장한다.
  addInputTabs = async(D = new Date(), newInput = {}) => { // 기본 입력값 + storage에 자동 저장

    let { inputTabKey, inputTab } = this.addDefaultInputTabs(D)

    let inputTabs = await travelWrite.InputTabs.get()
    let inputs = await travelWrite.Inputs.get()
    let existedInput = inputs.filter(input => input.inputTabKey == inputTabKey)[0]
    inputs = inputs.filter(input => input.inputTabKey != inputTabKey)

    newInput.inputTabKey = inputTabKey

    existedInput = {
      ...existedInput,
      ...newInput,
    }
    inputs.push(existedInput)

    inputTabs = inputTabs.filter(inputTab => inputTab.key != inputTabKey)
    inputTabs.push(inputTab)

    await travelWrite.InputTabs.set(inputTabs)
    await travelWrite.Inputs.set(inputs)

    this.loadInputTabs()
  }

  render(){
    let { _loaded, inputTabs, selectedInputTabKey, myLatLng } = this.state
    if (!_loaded) return (<View />) // 나중에 로딩 뷰 띄우기
    
    // 입력 탭을 만들어준다.
    let inputTabViews = []
    let selectedInputTab = null
    for (let inputTab of inputTabs) {
      const onPress = () => this.setState({ selectedInputTabKey: inputTab.key })

      let active = inputTab.key == selectedInputTabKey
      if (active) {
        selectedInputTab = inputTab
      }
      inputTabViews.push(<InputTab active={active} style={style.inputTab} key={inputTab.key} onPress={onPress}>
        <InputTabText active={active} style={style.inputTabText}>{inputTab.title}</InputTabText>
      </InputTab>)
    }

    // 탭을 만들어주고, 탭에맞는 입력폼(WriteTravelInput)을 띄워준다.
    return (
      <View style={style.writeWrapper}>
        <View style={style.inputTabsScrollWrapper}>
          <TouchableOpacity onPress={()=>Controller.navigator.pop()} style={style.backButton}>
            <Text>{'<'}</Text>
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} >
              {inputTabViews}
            </ScrollView>
          </View>
          <TouchableOpacity onPress={()=>this.addDefaultInputTabs()} style={style.backButton}>
            <Text>{'+'}</Text>
          </TouchableOpacity>
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
