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
    markers: [
      {
        latlng:{
          latitude: 37.78825,
          longitude: -122.4324,
        },
        title:'123',
        description:'321',
      },
      {
        latlng:{
          latitude: 37.79825,
          longitude: -122.4324,
        },
        title:'123',
        description:'321',
      },
    ]
  }
  render(){
    const { width } = Dimensions.get('window')

    return (
      <View style={style.flex1}>
        <MapView
          initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          style={{
            width,
            height: width,
          }}>
          {this.state.markers.map((marker, index) => (
            <Marker
              coordinate={marker.latlng}
              title={marker.title}
              description={marker.description}
              key={index}
            />
          ))}

          <Polyline
            coordinates={this.state.markers.map(m => m.latlng)}
            strokeColor="#000"
            strokeWidth={6}
          />
        </MapView>
      </View>
    )
  }
}

const style = StyleSheet.create({
  flex1: { flex: 1 }
})


export default Index;
