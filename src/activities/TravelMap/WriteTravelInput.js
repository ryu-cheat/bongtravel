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
  Image,
} from 'react-native';

import styled from 'styled-components/native'
import MapView, { Marker, Polyline, AnimatedRegion } from 'react-native-maps';
import Controller, { navigator, writeTravel } from '../../plugins/controller'
import Storage, { travelWrite } from '../../plugins/storage'
import ImagePicker from 'react-native-image-crop-picker';
import Converter from '../../plugins/converter'
import { alert, confirm } from '../../plugins/alert'
const FastMarker = Animated.createAnimatedComponent(Marker)



export default class WriteTravelInput extends Component{
  state = {
    _loaded: false,
  }
  imageScrollView: ScrollView = null
/************************* [[시작]] 앱종료해도 입력한거, 업로드중이던 사진 유지하기 *************************/
  input = {
    inputTabKey: this.props.inputTab.key,
    myLatLng: this.props.myLatLng,
    pictures: [],
    date: Date.now(),
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
      latitudeDelta: coordinate.latitudeDelta || this.input.myLatLng.latDelta,
      longitudeDelta: coordinate.longitudeDelta || this.input.myLatLng.lngDelta,
      delay: 0,
      duration :0,
    }).start()
  }
  onRegionChangeComplete = (coordinate) => { // (핀위치 [2])지도에 선택된 위치는 여기서 저장해준다
    this.onRegionChange(coordinate)
    
    this.input.myLatLng = {
      lat:coordinate.latitude,
      lng:coordinate.longitude,
      latDelta:coordinate.latitudeDelta || this.input.myLatLng.latDelta,
      lngDelta:coordinate.longitudeDelta || this.input.myLatLng.lngDelta,
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
      let _pictures = []
      for (let picture of pictures) {
        const onPress = () => {
          if (picture.latitude) {
            this.onRegionChangeComplete({ latitude: picture.latitude, longitude: picture.longitude })
          }
        }

        _pictures.push(<TouchableOpacity key={picture.path} style={{ marginRight:10 }} onPress={onPress}>
          <Image source={{ uri: picture.path }} style={{
            width: 80,
            height: 80,
          }}/>
        </TouchableOpacity>)
      }
      return (
        <ScrollView ref={ref=>this.imageScrollView=ref} horizontal showsHorizontalScrollIndicator={false} style={style.pictureScrollView}>
          {_pictures}
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
    }).then(async(pictures) => {
      let _pictures = []
      let _differentDatePictures = {}

      // 날짜는 아침 6시까지로 구분한다.
      let _data = this.input.pictures.filter(p=>p.date).length>0?new Date(this.input.date-60*60*6*1000).toLocaleDateString():null

      for (let picture of pictures) {
        let latitude = Converter.geolocation.gpsToGeoPoint(picture.exif.GPSLatitude)
        let longitude = Converter.geolocation.gpsToGeoPoint(picture.exif.GPSLongitude)
        let date = Converter.geolocation.date(picture.exif.DateTime, +picture.creationDate)
        let path = picture.path

        let pictureItem = { latitude, longitude, date, path }
        if (date) {
          let DateLocaleString = new Date(this.input.date-60*60*6*1000).toLocaleDateString()
          if (_data == null) {
            _data = DateLocaleString
          } else {
            if ( _data != DateLocaleString ) {
              if ( _differentDatePictures[DateLocaleString]) {
                _differentDatePictures[DateLocaleString] = []
              }
              _differentDatePictures[DateLocaleString].push(pictureItem)
            }
          }
        }

        _pictures.push(pictureItem)
      }
      
      // 다른날짜의 사진이 있는지 확인
      let _differentDatePictureKeys = Object.keys(_differentDatePictures)
      let _toRegionData = null

      if (_differentDatePictureKeys>0) {
        if (await confirm('날짜가 다른 사진이 포함되어 있습니다.\n\n날짜가 다른 사진들은 새 탭으로 분리할까요?')) {
          
          for (let key of _differentDatePictureKeys) {
            _pictures = _pictures.filter(p => _differentDatePictures[key].indexOf(p) == -1)

            //_differentDatePictures[key] 이 배열을 돌려서 탭을 늘려준다.(미완성:코드추가필요)
          }

        }else{
          // await alert('분리하지않습니다')
        }
      }

      /// 최종적으로 추가될 사진의 정보로 위치 재설정(완료)
      for (let picture of _pictures){
        let { date, latitude, longitude } = picture
        if (date && latitude && longitude) {
          if ( this.input.date > date.getTime() ) {
            this.input.date = date.getTime()
    
            _toRegionData = { latitude, longitude }
            this.onRegionChange(_toRegionData)
          }
        }
      }

      // 사진 배열 합치기
      this.input.pictures = this.input.pictures.concat(_pictures)


      // 마무리!! 다시 그려주기
      if (_toRegionData) {
        this.onRegionChangeComplete(_toRegionData)
      }
      this.setState({ },()=>{
        if (_pictures.length > 0) {
          setTimeout(()=>{
            this.imageScrollView&&this.imageScrollView.scrollToEnd()
          }, 100)
        }
      })
    }).catch(e=>console.warn(e));
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
        {this.renderPictures()}
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
    padding:10,
  },

})