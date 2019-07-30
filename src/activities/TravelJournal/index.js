import React from 'react'
import {
     View,
     StyleSheet,
     Text,
     ScrollView,
     Image,
     Dimensions,
     TouchableOpacity,
} from 'react-native'

import MapView, { Marker } from 'react-native-maps';

import * as API from '../../api'
import Carousel from 'react-native-snap-carousel';
import Controller from '../../plugins/controller'

let { width } = Dimensions.get('window')

export default class TravelJournal extends React.Component {
     state = {
          _loaded: false,
          journal: {},
     }
     constructor(p) {
          super(p)
          this.loadJournal(this.props.journalId)
     }
     renderPictures = ({ item }) => {
          return (<View key={item.path}>
               <Image source={{ uri: item.path }} style={[{ width: width - 80, height: width - 80 }, style.picture]} />
          </View>)
     }
     render() {
          let { _loaded, journal } = this.state
          if (!_loaded) return (<View />) // 나중에 로딩 뷰 띄우기

          let D = new Date(journal.date)
          let dateString = [D.getFullYear(), D.getMonth() + 1, D.getDate()].map(d => d < 10 ? '0' + d : '' + d).join('/')
          let { width } = Dimensions.get('window')

          let region = {
               latitude: journal.latitude,
               longitude: journal.longitude,
               latitudeDelta: 0.0922,
               longitudeDelta: 0.0421,
          }


          return (<>
               <TouchableOpacity onPress={() => Controller.navigator.pop()} style={style.backButton}>
                    <Text style={style.backButtonText}>뒤로</Text>
               </TouchableOpacity>
               <View style={style.divider} />
               <ScrollView style={style.wrapper} showsVerticalScrollIndicator={false}>
                    <View style={{ height: 10, }} />
                    <View style={style.oneLineContent}>
                         <Text style={style.titleText}>여행제목</Text>
                         <View style={style.divider} />
                         <Text style={style.oneLineContentDescriptionText} numberOfLines={1}>{journal.title}</Text>
                    </View>
                    <View style={{ height: 10, }} />
                    <View style={style.oneLineContent}>
                         <Text style={style.titleText}>여행날짜</Text>
                         <View style={style.divider} />
                         <Text style={style.oneLineContentDescriptionText} numberOfLines={1}>{dateString} {D.toLocaleTimeString()}</Text>
                    </View>
                    <View style={{ height: 10, }} />
                    <View>
                         <Text style={style.titleText}>위치</Text>
                         <View style={style.divider} />
                         <View style={style.mapview}>
                              <MapView
                                   initialRegion={region}
                                   style={{ width: width - 20, height: width - 20 }}
                              >
                                   <Marker coordinate={region} />
                              </MapView>
                              {/* <View style={style.mapviewLock} /> */}
                         </View>
                    </View>
                    <View style={{ height: 10, }} />
                    <View>
                         <Text style={style.titleText}>사진들</Text>
                         <Carousel
                              ref={'carousel'}
                              data={journal.pictures}
                              renderItem={this.renderPictures}
                              sliderWidth={width - 20}
                              itemWidth={width - 80}
                         />
                    </View>
                    <View style={{ height: 10, }} />
                    {!!journal.description && <View>
                         <Text style={style.titleText}>내용</Text>
                         <View style={style.divider} />
                         <Text style={style.description}>{journal.description}</Text>
                    </View>}
                    <View style={{ height: 10, }} />

               </ScrollView>
          </>)
     }

     loadJournal = (journalId) => {
          API.travel.getJournals(journalId).then(rs => {
               this.setState({
                    journal: rs.journal,
                    tourlistAttractions: rs.tourlistAttractions,
                    _loaded: true,
               })
          })
     }
}

const style = StyleSheet.create({
     divider: {
          height: 1,
          backgroundColor: '#ddd',
     },
     wrapper: {
          flex: 1,
          paddingHorizontal: 10,
     },
     oneLineContent: {
          flexDirection: 'row',
          alignItems: 'center',
     },
     titleText: {
          marginBottom: 5,
          width: 80,
          fontSize: 15,
     },
     oneLineContentDescriptionText: {
          fontSize: 15,
          flex: 1,
          color: '#000',
     },
     description: {
          marginTop: 5,
          fontSize: 15,
          color: '#000',
     },
     picture: {
          borderRadius: 10,
          marginVertical: 10,
          borderColor: '#ddd',
          borderWidth: 1,
     },

     mapview: {
          marginTop: 5,
          position: 'relative',
          borderRadius: 5,
          overflow: 'hidden',
     },
     mapviewLock: {
          position: 'absolute',
          top: 0, right: 0,
          left: 0, bottom: 0,
          zIndex: 1,
     },
     backButton: {
          height: 50,
          justifyContent: 'center',
          paddingHorizontal: 10,
     },
     backButtonText: {
          fontSize: 14,
          fontWeight: 'bold',
     },
})