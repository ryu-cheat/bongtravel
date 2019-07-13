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
} from 'react-native';

import MapView, { Marker, Polyline } from 'react-native-maps';

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
        <MapView
          initialRegion={initialRegion}
          style={{
            width,
            height: width,
          }}>
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
      </View>
    )
  }
}

const style = StyleSheet.create({
  flex1: { flex: 1 },
  travelWrapper:{
    flex: 1,
  },
})


export default Index;
