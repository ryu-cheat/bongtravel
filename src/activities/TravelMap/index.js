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
import Controller, { navigator, activityController } from '../../plugins/controller'
import WriteTravel from './WriteTravel'
import {TravelMapStyle} from './style'
import { travelWrite } from '../../plugins/storage'

const style = TravelMapStyle

export default TravelMapLoader = (props) => <TravelMap key={props.travel._id} {...props}/>

class TravelMap extends Component{
  state = {
    journals: [],
    myLatLng: {
      latlng:{
        latitude: 37.79825,
        longitude: -122.4324,
      },
    }
  }
  getDelta = (journals: Array, key: 'longitude' | 'latitude') => {
    if (journals.length <= 1) {
      return 0.1
    }else{
      let minValue = journals.reduce((prev, current)=> Math.min(prev, current.latlng[key]), journals[0].latlng[key])
      let maxValue = journals.reduce((prev, current)=> Math.max(prev, current.latlng[key]), journals[0].latlng[key])
      return (maxValue - minValue) * 3
    }
  }
  getInitialRegion = (journals: Array) => {
    let initialRegion = {}

    initialRegion.latitude = journals.reduce((prev, current)=> prev+current.latlng.latitude, 0)/journals.length
    initialRegion.longitude = journals.reduce((prev, current)=> prev+current.latlng.longitude, 0)/journals.length
    initialRegion.latitudeDelta = this.getDelta(journals, 'latitude')
    initialRegion.longitudeDelta = this.getDelta(journals, 'longitude')

    return initialRegion
  }
  render(){
    const { width } = Dimensions.get('window')
    
    let journals = this.state.journals.length > 0 ? this.state.journals : [ this.state.myLatLng ]
    
    // 첫 region은 이동한 경로를 한눈에 볼 수 있도록 보정합니다.
    let initialRegion = this.getInitialRegion(journals)

    return (
      <View style={style.travelWrapper}>
        <View style={style.relative}>
          <MapView
            initialRegion={initialRegion}
            style={{ width, height: width }}>
            {journals.map((visit, index) => (
              <Marker
                coordinate={visit.latlng}
                title={visit.title}
                description={visit.description}
                key={index}
              />
            ))}

            <Polyline
              coordinates={this.state.journals.map(m => m.latlng)}
              strokeColor="#000"
              strokeWidth={6}
            />
          </MapView>
          <WriteTravelButton travel={this.props.travel} />
        </View>
      </View>
    )
  }
}

// 작성중인 일지가 있는지 계속 확인해야하므로 컴포넌트를 분리한다
class WriteTravelButton extends Component{
  state = {
    templateCount: 0,
  }

  constructor(p) {
    super(p)

    activityController.travel.loadTemplateWrites = this.loadTemplateWrites
  }

  loadTemplateWrites = async() => {
    let travelTabs = await travelWrite.InputTabs(this.props.travel._id).get()
    this.setState({
      templateCount: travelTabs.length,
    })
  }

  write = () => {
    navigator.push(<WriteTravel travel={this.props.travel}/>)
  }

  render(){
    let { templateCount } = this.state

    return (
    <TouchableOpacity style={style.writeTravelJournalButton} onPress={this.write}>
      <Text style={style.writeTravelJournalButtonText}>여행일지 작성하기</Text>
      {templateCount>0 && <Text style={style.writeTravelJournalTemplateText}>(작성중 {templateCount}개)</Text>}
    </TouchableOpacity>
    )
  }

  componentDidMount(){
    this.loadTemplateWrites()
  }
}

