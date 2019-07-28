
import React from 'react';
import {
     View,
     Text,
     StyleSheet,
     TouchableOpacity,
     FlatList,
     Image,
} from 'react-native';

import Controller from '../../plugins/controller'
import * as API from '../../api'
import TravelJournal from '../TravelJournal'

class Setting extends React.Component {
     state = {
          _loaded: false,
          journals: [],
     }

     lastId = ''

     constructor(p) {
          super(p)
          this.loadLatestJournals()
     }
     showJournal = (journalId) => {
          Controller.navigator.push(<TravelJournal journalId={journalId} />)
     }

     loading = false
     loadLatestJournals = () => {
          this.loading = true
          API.social.getLatest(this.lastId).then(rs => {
               this.loading = false
               if (rs.journals.length > 0) {
                    this.lastId = rs.journals[rs.journals.length - 1]._id
               }
               this.setState({
                    _loaded: true,
                    journals: this.state.journals.concat(rs.journals),
               })
          })
     }

     onScroll = (e) => {
          if (!!this.loading) return;

          let {
               contentSize: { height: scrollHeight },
               layoutMeasurement: { height: layoutHeight },
               contentOffset: { y: scrollTop },
          } = e.nativeEvent
          if (scrollHeight- 100 <= layoutHeight + scrollTop ) {
               this.loadLatestJournals()
          }
     }
     renderJournal = ({ item }) => {
          let D = new Date(item.date)
          let Dates = [D.getFullYear(), D.getMonth() + 1, D.getDate()].map(d => d < 10 ? '0' + d : '' + d)

          return (<TouchableOpacity style={style.journalWrapper} onPress={() => this.showJournal(item._id)}>
               <Image source={{ uri: item.picture.path }} style={style.journalPicture} resizeMode='cover' />
               <View style={{ width: 10, }} />
               <View style={{ flex: 1 }}>
                    <Text style={style.titleText}>{item.title}</Text>
                    <Text style={style.journalDateText}>{Dates.join('/')} {D.toLocaleTimeString()}</Text>
               </View>
               <View style={{ width: 10, }} />
          </TouchableOpacity>)
     }
     render() {
          let { _loaded, journals } = this.state
          if (!_loaded) return (<View />) // 나중에 로딩 뷰 띄우기

          return (<View style={style.wrapper}>
               <FlatList
               ListEmptyComponent={<View />}
                    onScroll={this.onScroll}
                    style={style.wrapper}
                    data={journals}
                    renderItem={this.renderJournal}
                    keyExtractor={item => item._id} />
          </View>)
     }
}

export default Setting

const style = StyleSheet.create({
     wrapper: {
          flex: 1,
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
          margin: 10,
     },

     journalDateText: {
          fontSize: 12,
          color: '#aaa'
     },
     titleText: {
          fontSize: 15,
          color: '#000'
     },
     journalPicture: {
          width: 60,
          height: 60,
     },
})