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
import WriteTravel from './WriteTravel'

class Index extends Component{
  state = {
    visits: [],
    myLatLng: {
      latlng:{
        latitude: 37.79825,
        longitude: -122.4324,
      },
      title:'123',
      description:'321',
    }
  }
  getDelta = (visits: Array, key: 'longitude' | 'latitude') => {
    if (visits.length <= 1) {
      return 0.1
    }else{
      let minValue = visits.reduce((prev, current)=> Math.min(prev, current.latlng[key]), visits[0].latlng[key])
      let maxValue = visits.reduce((prev, current)=> Math.max(prev, current.latlng[key]), visits[0].latlng[key])
      return (maxValue - minValue) * 3
    }
  }
  getInitialRegion = (visits: Array) => {
    let initialRegion = {}

    initialRegion.latitude = visits.reduce((prev, current)=> prev+current.latlng.latitude, 0)/visits.length
    initialRegion.longitude = visits.reduce((prev, current)=> prev+current.latlng.longitude, 0)/visits.length
    initialRegion.latitudeDelta = this.getDelta(visits, 'latitude')
    initialRegion.longitudeDelta = this.getDelta(visits, 'longitude')

    return initialRegion
  }
  render(){
    const { width } = Dimensions.get('window')
    
    let visits = this.state.visits.length > 0 ? this.state.visits : [ this.state.myLatLng ]
    
    // 첫 region은 이동한 경로를 한눈에 볼 수 있도록 보정합니다.
    let initialRegion = this.getInitialRegion(visits)

    return (
      <View style={style.travelWrapper}>
        <View style={style.relative}>
          <MapView
            initialRegion={initialRegion}
            style={{ width, height: width }}>
            {visits.map((visit, index) => (
              <Marker
                coordinate={visit.latlng}
                title={visit.title}
                description={visit.description}
                key={index}
              />
            ))}

            <Polyline
              coordinates={this.state.visits.map(m => m.latlng)}
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

  }

  constructor(p) {
    super(p)
  }

  write = () => {
    navigator.push(<WriteTravel travel={this.props.travel}/>)
  }

  render(){
    return (
    <TouchableOpacity style={style.writeTravelJournalButton} onPress={this.write}>
      <Text style={style.writeTravelJournalButtonText}>여행일지 작성하기</Text>
    </TouchableOpacity>
    )
  }
}

const style = StyleSheet.create({
  flex1: { flex: 1 },
  relative:{position:'relative'},
  travelWrapper:{
    flex: 1,
  },

  writeTravelJournalButton:{
    position:'absolute',
    right: 20,
    bottom: 20,
    
    paddingHorizontal:15,
    height: 40,
    alignItems:'center',
    flexDirection:'row',
    backgroundColor:'#fff',
    borderRadius: 20,
  },

  writeTravelJournalButtonText:{
    fontSize: 13,
    fontWeight:'bold',

  },
})


export default Index;
