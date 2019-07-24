
import React, {Component} from 'react';
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
import { travelManageFormStyle }  from './style'
const style = travelManageFormStyle

export default class TravelManageForm extends Component{
     state = {
          isEdit : !!this.props.travel,
          title  : this.props.travel.title,
     }
     constructor(p){
          super(p)
     }
     
     ok = () => {
          
     }
     
     render(){
          let { isEdit, title } = this.state
          return (
          <View style={style.wrapper}>
               <View style={style.title}>
                    <TouchableOpacity style={style.backButton} onPress={() => Controller.navigator.pop()}>
                         <Text>{'<'}</Text>
                    </TouchableOpacity>
                    <Text style={style.titleText}>{ isEdit ? '여행 제목을 수정해주세요' : '여행 제목을 입력해주세요'}</Text>
                    <View style={style.backButton}/>
               </View>
               <View style={style.divider} />
               <TextInput style={style.textInput} maxLength={20} onChangeText={title => this.setState({ title })} />
               <View style={style.divider} />
               <View style={{ height:5, }}/>
               <View style={style.maxLengthWrapper}>
                    <Text>{ title.length }/20</Text>
               </View>
               <View style={{ height:20, }}/>
               <TouchableOpacity style={style.okButton} onPress={this.submit}>
                    <Text style={style.okButtonText}>{isEdit?'수정하기':'추가하기'}</Text>
               </TouchableOpacity>

                              
          </View>)
     }
}

