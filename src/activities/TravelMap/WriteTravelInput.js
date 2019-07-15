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
import ImagePicker from 'react-native-image-crop-picker';
import Converter from '../../plugins/converter'
const FastMarker = Animated.createAnimatedComponent(Marker)



export default class WriteTravelInput extends Component{
  state = {
    _loaded: false,
  }

/************************* [[시작]] 앱종료해도 입력한거, 업로드중이던 사진 유지하기 *************************/
  input = {
    inputTabKey: this.props.inputTab.key,
    myLatLng: this.props.myLatLng,
    pictures:[],
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
/************************* [[끝]] 앱종료해도 입력한거, 업로드중이던 사진 유지하기 *************************/

/************************* [[시작]] 사진 메타데이터 기반 + 현재위치 참조하여 지도 위치 설정해주기 *************************/
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
/************************* [[끝]] 사진 메타데이터 기반 + 현재위치 참조하여 지도 위치 설정해주기 *************************/
/************************* [[시작]] 여행 사진 *************************/
  
  renderPictures = () => {
    let { pictures } = this.input
    if (pictures.length == 0) {
      return null
    }else{
      return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={style.pictureScrollView}>
          <View>
            <Text>이미지</Text>
          </View>
        </ScrollView>
      )
    }
  }
  addPicture = () => {
    ImagePicker.openPicker({
      width: 400,
      height: 400,
      includeExif: true,
      multiple: true,
      cropping: true,

    }).then(image => {
      console.warn(image);
      console.warn(Converter.geolocation.gpsToGeoPoint(image[0].exif.GPSLatitude))
      console.warn(Converter.geolocation.gpsToGeoPoint(image[0].exif.GPSLongitude))
    });
  }

/************************* [[시작]] 여행 사진 *************************/

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
      <View style={style.pictureWrapper}>
        {this.renderpictures}
        <View style={[style.pictureAdd, this.input.pictures.length == 0 && { flex: 1 }]}>
          <TouchableOpacity style={style.pictureAddButton} onPress={this.addPicture}>
            <Text style={style.pictureAddButtonText}>{'+'}</Text>
            <Text style={style.pictureAddButtonText}>사진 추가</Text>
          </TouchableOpacity>
        </View>
      </View>
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

  pictureWrapper:{
    height: 100,
    flexDirection: 'row',
  },

  pictureAdd:{
    minWidth: 100,
    padding:10,
  },
  pictureAddButton:{
    alignItems:'center',
    justifyContent:'center',
    borderColor:'#000',
    borderWidth:1,
    flex: 1,
  },

  // renderPictures
  pictureScrollView:{
    flex: 1,
  },

})