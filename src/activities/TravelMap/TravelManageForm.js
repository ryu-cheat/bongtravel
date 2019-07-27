
import React, { Component } from 'react';
import {
     View,
     Text,
     StyleSheet,
     TouchableOpacity,
     FlatList,
     TextInput,
} from 'react-native';

import { travel } from '../../api'
import Controller, { activityController } from '../../plugins/controller'
import Storage from '../../plugins/storage'
import { alert, confirm } from '../../plugins/alert'
import { travelManageFormStyle } from './style'
const style = travelManageFormStyle

export default class TravelManageForm extends Component {
     state = {
          isEdit: !!this.props.travel,
          title: (this.props.travel || {title:''}).title,
     }

     createTravel = async() => {
          let { title } = this.state
          if (await confirm('여행을 추가하시겠습니까?')){
               travel.createTravels({ title }).then(async(rs) => {
                    if (rs.success) {
                         await Controller.activityController.travelManage.loadTravels()
                         await alert('추가되었습니다.')
                         await Controller.navigator.pop()
                    } else {
                         await alert('이미 존재하는 제목입니다.\n\n다른 제목을 입력해주세요')
                    }
               }).catch(e => { alert('오류가 발생했습니다.\n\n다시 시도해주세요') })
          }
     }

     modifyTravel = async() => {
          let { title } = this.state
          if (await confirm('여행을 수정하시겠습니까?')){
               travel.modifyTravels(this.props.travel._id, { title }).then(async(rs) => {
                    if (rs.success) {
                         await Controller.activityController.travelManage.loadTravels()
                         await activityController.main.loadTravels()
                         await alert('수정되었습니다.')
                         await Controller.navigator.pop()
                    } else{
                         alert('오류가 발생했습니다')
                    }
               }).catch(e => { alert('오류가 발생했습니다.\n\n다시 시도해주세요') })
          }
     }

     render() {
          let { isEdit, title } = this.state
          return (
               <View style={style.wrapper}>
                    <View style={style.title}>
                         <TouchableOpacity style={style.backButton} onPress={() => Controller.navigator.pop()}>
                              <Text>{'<'}</Text>
                         </TouchableOpacity>
                         <Text style={style.titleText}>{isEdit ? '여행 제목을 수정해주세요' : '여행 제목을 입력해주세요'}</Text>
                         <View style={style.backButton} />
                    </View>
                    <View style={style.divider} />
                    <TextInput value={title} style={style.textInput} maxLength={20} onChangeText={title => this.setState({ title })} />
                    <View style={style.divider} />
                    <View style={{ height: 5, }} />
                    <View style={style.maxLengthWrapper}>
                         <Text>{title.length}/20</Text>
                    </View>
                    <View style={{ height: 20, }} />
                    <TouchableOpacity style={style.okButton} onPress={isEdit?this.modifyTravel:this.createTravel}>
                         <Text style={style.okButtonText}>{isEdit ? '수정하기' : '추가하기'}</Text>
                    </TouchableOpacity>


               </View>)
     }
}

