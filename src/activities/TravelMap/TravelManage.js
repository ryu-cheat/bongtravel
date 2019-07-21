
import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';

import { travel } from '../../api'
import { activityController } from '../../plugins/controller'
import Storage from '../../plugins/storage'
import { alert, confirm } from '../../plugins/alert'
import { TravelManageLoadFinishCheck } from '../../plugins/workpool'
import { travelManageStyle }  from './style'
const style = travelManageStyle
export default class TravelManage extends Component{
     state = {
          _loaded: false,
          travelSelectedIdx: 0,
          travels: [],
     }
     constructor(p){
          super(p)
          TravelManageLoadFinishCheck.work(this.loadTravels)
          TravelManageLoadFinishCheck.work(this.loadTravelSelectedIdx)
          TravelManageLoadFinishCheck.finish(()=>{
               this.setState({
                    _loaded: true
               })
          })
     }
     // 여행 목록과 선택된 목록 가져옵니다
     loadTravels = async(next) => {
          let { travels } = await travel.getTravels()
          this.setState({ travels }, next)
     }
     loadTravelSelectedIdx = async(next) => {
          let travelSelectedIdx  = await activityController.main.loadTravelSelectedIdx()
          this.setState({ travelSelectedIdx }, next)
     }


     // 여행목록 배열의 아이템별로 view를 그려줍니다
     renderTravels = ({ item, index }) => {
          let D = new Date(item.createdAt)
          let dates = [
               D.getFullYear(),
               D.getMonth()+1,
               D.getDate(),
               D.getHours(),
               D.getMinutes(),
          ].map(d => d < 10 ? '0'+d : '' + d)

          const changeTravel = async() => {
               if ( await confirm('이 여행을 선택하시겠습니까?') ) {
                    await Storage.travelSelectedIdx.set(index)
                    await this.loadTravelSelectedIdx()
               }
          }
          const active = index == this.state.travelSelectedIdx

          return (<TouchableOpacity style={style.travelWrapper} onPress={changeTravel}>
               <View style={style.checkWrapper}>
                    <Text style={{ fontSize:11 }}>{active && '선택됨'}</Text>
               </View>
               <View style={{ flex: 1 }}>
                    <Text numberOfLines={1} style={style.travelTitleText}>{item.title}</Text>
                    {/* <Text style={style.travelDateText}>{dates[0]+'/'+dates[1]+'/'+dates[2]} {dates[3]+':'+dates[4]}</Text> */}
               </View>
          </TouchableOpacity>)
     }
     
     render(){
          let { _loaded, travels, travelSelectedIdx } = this.state
          if ( !_loaded ) return (<View />) // 나중에 로딩 뷰 띄우기

          return (
          <View style={style.wrapper}>
               <View style={style.title}>
                    <TouchableOpacity style={style.backButton}>
                         <Text>{'<'}</Text>
                    </TouchableOpacity>
                    <Text style={style.titleText}>일지를 관리할 여행을 선택해주세요</Text>
               </View>
               <View style={style.divider} />
               <FlatList
                    extraData={{ travelSelectedIdx }}
                    data={travels}
                    renderItem={this.renderTravels}
                    keyExtractor={ item => item._id }
               />
          </View>)
     }
}

