
import React from 'react';
import {
     View,
     Text,
     StyleSheet,
     TouchableOpacity,
     FlatList,
     Dimensions,
     Image,
} from 'react-native';

import Controller from '../../plugins/controller'
import * as API from '../../api'
import TravelJournal from '../TravelJournal'

const { width } = Dimensions.get('window')

class Social extends React.Component {
     state = {
          _loaded: false,
          journals: [],
     }

     lastId = '' // 최신순으로 불러올 때 필요
     offset = 0 // 키워드 검색 시 필요
     loadMore = () => { }

     constructor(p) {
          super(p)
          this.loadLatestJournals()

          Controller.Search.search = this.search
     }

     search = (query) => {
          if (!query) { // 검색어 없으면 초기화
               this.lastId = ''
               this.setState({
                    journals: [],
               }, this.loadLatestJournals)
          } else {
               this.offset = 0
               this.setState({
                    journals: [],
               }, () => {
                    this.keywordSearch(query)
               })
          }
     }

     keywordSearch = (query) => {
          this.loadMore = this.keywordSearch

          loading = true
          API.social.keywordSearch(query, this.offset).then(rs => {
               this.loading = false
               if (rs.journals.length > 0) {
                    this.offset += rs.journals.length
               } else {
                    // 검색할게 없으면 loadMore 초기화
                    this.loadMore = () => { }
               }
               this.setState({
                    _loaded: true,
                    journals: this.state.journals.concat(rs.journals),
               })
          })
     }

     showJournal = (journalId) => {
          Controller.navigator.push(<TravelJournal journalId={journalId} />)
     }

     loading = false
     loadLatestJournals = () => {
          this.loadMore = this.loadLatestJournals

          this.loading = true
          API.social.getLatest(this.lastId).then(rs => {
               this.loading = false
               if (rs.journals.length > 0) {
                    this.lastId = rs.journals[rs.journals.length - 1]._id
               } else {
                    // 검색할게 없으면 loadMore 초기화
                    this.loadMore = () => { }
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
          if (scrollHeight - 100 <= layoutHeight + scrollTop) {
               this.loadMore()
          }
     }
     renderJournal = ({ item }) => {
          let D = new Date(item.date)
          let Dates = [D.getFullYear(), D.getMonth() + 1, D.getDate()].map(d => d < 10 ? '0' + d : '' + d)
          let pictureSize = width - 20

          return (<TouchableOpacity style={style.journalWrapper} onPress={() => this.showJournal(item._id)}>
               <View>
                    <Image source={{ uri: item.picture.path }} style={style.journalPicture} resizeMode='cover' style={{ width: pictureSize, height: pictureSize }} />
               </View>
               <View style={style.journalContentWrapper}>
                    <View style={{ width: 10, }} />
                    <View style={{ flex: 1 }}>
                         <Text style={style.titleText}>{item.title}</Text>
                         <Text style={style.journalDateText}>{Dates.join('/')} {D.toLocaleTimeString()}</Text>
                    </View>
                    <View style={{ width: 10, }} />
               </View>
          </TouchableOpacity>)
     }
     render() {
          let { _loaded, journals } = this.state
          if (!_loaded) return (<View />) // 나중에 로딩 뷰 띄우기

          return (<View style={style.wrapper}>
               <FlatList
                    onScroll={this.onScroll}
                    style={style.wrapper}
                    data={journals}
                    renderItem={this.renderJournal}
                    keyExtractor={item => item._id} />
          </View>)
     }
}

export default Social

const style = StyleSheet.create({
     wrapper: {
          flex: 1,
     },
     journalWrapper: {
          marginHorizontal: 10,
          borderRadius: 10,
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
     journalContentWrapper: {
          flexDirection: 'row',
          paddingVertical: 10,
     },
})