/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Image,
  FlatList,
} from 'react-native';

import Storage, { travelWrite } from '../../plugins/storage'
import Controller from '../../plugins/controller'
import TravelJournal from '../TravelJournal'
import WriteTravel from './WriteTravel'
import ItemAnimatedFlatList from '../../components/ItemAnimatedFlatList';

function getDistance({ from: { lat: lat1, lng: lng1 }, to: { lat: lat2, lng: lng2 } }) {
  var Lat = (lat2 - lat1) * Math.PI / 180
  var Lng = (lng2 - lng1) * Math.PI / 180

  let tmp = Math.sin(Lat / 2) * Math.sin(Lat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(Lng / 2) * Math.sin(Lng / 2)

  let m = Math.ceil(Math.atan2(Math.sqrt(tmp), Math.sqrt(1 - tmp)) * 2 * 6371 * 1000);
  if (m < 1000) {
    return `${m}m`
  } else {
    return `${Math.floor(m / 100) / 10}km`
  }
}

export default class TravelMap extends Component {
  state = {

  }
  renderItem = ({ item }) => {
    if (item.type == 'gap') {
      return (<View style={{ height: 20 }} />)
    } else if (item.type == 'distance') {
      return (<View style={style.distanceWrapper}>
        <View style={style.distanceLine} />
        <Text style={style.distanceText}>{item.distance}</Text>
        <View style={style.distanceLine} />
      </View>)
    } else {
      let journal = item.journal
      let travel = this.props.travel
      let D = new Date(journal.date)

      let Dates = [D.getFullYear(), D.getMonth() + 1, D.getDate()].map(d => d < 10 ? '0' + d : '' + d)

      let stayTime = ''
      if (journal.stayTime) {
        if (journal.stayTime < 60 * 60) {
          stayTime = `${Math.floor(journal.stayTime / 60 * 10) / 10} 분`
        } else if (journal.stayTime < 60 * 60 * 24) {
          stayTime = `${Math.floor(journal.stayTime / 60 / 60 * 10) / 10} 시간`
        } else if (journal.stayTime < 60 * 60 * 24 * 100) {
          stayTime = `${Math.floor(journal.stayTime / 60 / 60 / 24 * 10) / 10} 일`
        } else {
          stayTime = `${Math.floor(journal.stayTime / 60 / 60 / 24)} 일`
        }
      }

      const showJournal = () => {
        Controller.navigator.push(<TravelJournal journalId={journal._id} />)
      }

      const editJournal = async () => {
        let inputTabs = await travelWrite.InputTabs(travel._id).get()
        if (inputTabs.filter(inputTab => inputTab.key == journal._id).length == 0) {
          let dateString = [D.getFullYear(), D.getMonth() + 1, D.getDate()].map(d => (d + '').length == 1 ? '0' + d : d).join('-')
          let timeString = [D.getHours(), D.getMinutes()].map(d => (d + '').length == 1 ? '0' + d : d).join(':')

          let inputTab = {
            title: journal.title,
            date: dateString + ' ' + timeString,
            key: journal._id,
            edit: true,
          }
          inputTabs.push(inputTab)
          await travelWrite.InputTabs(travel._id).set(inputTabs)

          let inputs = await travelWrite.Inputs(this.props.travel._id).get()
          inputs.push({
            inputTabKey: journal._id,
            myLatLng: {
              lat: parseFloat(journal.latitude),
              lng: parseFloat(journal.longitude),
              latDelta: 0.03,
              lngDelta: 0.03,
            },
            description: journal.description || '',
            pictures: journal.pictures,
            date: D.getTime(),
          })

          await travelWrite.Inputs(travel._id).set(inputs)
        }

        Controller.navigator.push(<WriteTravel travel={travel} defaultTabKey={journal._id} />)
      }


      return (<TouchableOpacity style={style.journalWrapper} onPress={showJournal} onLongPress={editJournal}>
        <Image source={{ uri: journal.picture.path }} style={style.journalPicture} />
        <View style={{ width: 10, }} />
        <View style={{ flex: 1 }}>
          <Text style={style.titleText} numberOfLines={1}>{journal.title}</Text>
          <Text style={style.journalDateText}>{Dates.join('/')} {D.toLocaleTimeString()}</Text>
        </View>

        <View style={{ width: 10, }} />
        <Text style={style.stayTimeText}>{stayTime}</Text>
        <View style={{ width: 10, }} />

      </TouchableOpacity>)
    }
  }

  render() {

    let { journals } = this.props

    let newJournals = []
    newJournals.push({ type: 'gap', key: 'gap1' })
    for (let journalIdx in journals) {
      journalIdx = +journalIdx
      let journal = journals[journalIdx]

      let nextJournal = journals[journalIdx + 1]
      let distanceToNextJournal = 0

      newJournals.push({ flatlistAnimation: true, type: 'journal', journal, key: journal._id })

      if (!!nextJournal) {
        distanceToNextJournal = getDistance({
          from: {
            lat: journal.latitude,
            lng: journal.longitude,
          },
          to: {
            lat: nextJournal.latitude,
            lng: nextJournal.longitude,
          }
        })
        newJournals.push({ flatlistAnimation: true, type: 'distance', distance: distanceToNextJournal, key: journal._id + '/distance' })
      }
    }
    newJournals.push({ type: 'gap', key: 'gap2' })


    return (
      <ItemAnimatedFlatList
        defaultLoadedCount={2}
        style={style.wrapper}
        showsVerticalScrollIndicator={false}
        data={newJournals}
        renderItem={this.renderItem}
        keyExtractor={item => item.key}
      />
    )
  }
}

const style = StyleSheet.create({
  wrapper: {
    flex: 1
  },
  journalWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    height: 60,
    borderRadius: 60 / 2,
    overflow: 'hidden',
    borderColor: '#ddd',
    borderWidth: 1,
  },
  journalPicture: {
    width: 60,
    height: 60,
  },
  distanceLine: {
    width: 1,
    height: 10,
    backgroundColor: '#ddd',
  },
  distanceWrapper: {
    alignItems: 'center',
  },
  distanceText: {
    fontSize: 12,
    color: '#777',
  },
  journalDateText: {
    fontSize: 12,
    color: '#aaa'
  },
  titleText: {
    fontSize: 15,
    color: '#000'
  },
  stayTimeText: {
    fontSize: 12,
  },
})