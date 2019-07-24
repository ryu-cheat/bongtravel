
import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';

import { travel } from '../../api'
import Controller, { activityController } from '../../plugins/controller'
import Storage from '../../plugins/storage'
import { alert, confirm } from '../../plugins/alert'
import { TravelManageLoadFinishCheck } from '../../plugins/workpool'
import { travelManageStyle }  from './style'
import TravelManageForm from './TravelManageForm'
const style = travelManageStyle

const TravelManageController = { loadTravels: () => alert('초기화 안됨') }
export default class TravelManage extends Component{
     state = {
          _loaded: false,
          travelSelectedIdx: 0,
          travels: [],
     }
     constructor(p){
          super(p)
          
          TravelManageController.loadTravels = this.loadTravels

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
          const deleteTravel = async()=>{
               if (this.state.travels.length == 1) {
                    return alert('최소 하나의 여행은 남겨두어야합니다.\n\n제목을 수정하거나, 새로운 여행을 추가해주세요.');
               }
               if ( await confirm('이 여행을 삭제하시겠습니까?') ) {
                    if (active) {
                         await Storage.travelSelectedIdx.set(0)
                         await this.loadTravelSelectedIdx()
                    }
                    travel.deleteTravels(item._id).then(()=>{
                         this.loadTravels()
                         alert('삭제되었습니다.')
                    }).catch(()=>{
                         alert('오류가 발생했습니다.')
                    })
               }
          }
          const modifyTravel = async()=>{
               Controller.navigator.push(<TravelManageForm travel={item} />)
          }

          const active = index == this.state.travelSelectedIdx

          return (<View style={style.travelItem}>
               <View style={style.travelWrapper}>
                    <View style={style.checkWrapper}>
                         <Text style={{ fontSize:11, color:'#3772e9' }}>{active && '선택됨'}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                         <Text numberOfLines={1} style={style.travelTitleText}>{item.title}</Text>
                    </View>
                    <TouchableOpacity style={style.selectButton} onPress={changeTravel}>
                         <Text style={{ fontSize:11, color:'#999' }}>{'선택하기'}</Text>
                    </TouchableOpacity>
               </View>
               <View style={{ height: 1, backgroundColor:'#ddd', }}/>
               <View style={style.travelManageButtons}>
                    <TouchableOpacity style={style.travelManageButton} onPress={modifyTravel}>
                         <Text style={style.travelManageButtonText}>수정하기</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={style.travelManageButton} onPress={deleteTravel}>
                         <Text style={style.travelManageButtonText}>삭제하기</Text>
                    </TouchableOpacity>
               </View>
          </View>)
     }
     
     render(){
          let { _loaded, travels, travelSelectedIdx } = this.state
          if ( !_loaded ) return (<View />) // 나중에 로딩 뷰 띄우기

          return (
          <View style={style.wrapper}>
               <View style={style.title}>
                    <TouchableOpacity style={style.backButton} onPress={() => Controller.navigator.pop()}>
                         <Text>{'<'}</Text>
                    </TouchableOpacity>
                    <Text style={style.titleText}>일지를 관리할 여행을 선택해주세요</Text>
                    {/* title을 가운데정렬하기위해 오른쪽에도 공간을 채워준다 */}
                    <View style={style.backButton}/>
               </View>
               <View style={style.divider} />
               <FlatList
                    extraData={{ travelSelectedIdx }}
                    data={travels}
                    renderItem={this.renderTravels}
                    keyExtractor={ item => item._id }
                    style={{
                         backgroundColor: '#f1f1f1',
                    }}
               />
          </View>)
     }
}

