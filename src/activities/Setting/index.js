
import React from 'react';
import {
     View,
     Text,
     StyleSheet,
     TouchableOpacity,
} from 'react-native';

import { passStateToProps } from 'react-lingost'
import { NaverLogin } from 'react-native-naver-login'
import * as LingostApi from '../../lingost/api'
import Storage from '../../plugins/storage'

class Setting extends React.Component {
     logout = async () => {
          await Storage.loginToken.set('')
          NaverLogin.logout()
          LingostApi.loginCheck()
     }
     render() {
          return (<View style={style.wrapper}>
               <View style={{ height: 10 }} />
               <View style={style.profileWrapper}>
                    <Text style={style.nickname}>{this.props.nickname}</Text>
                    <TouchableOpacity onPress={this.logout}>
                         <Text>로그아웃</Text>
                    </TouchableOpacity>
               </View>
               <View style={style.divider} />
               <View style={style.buttonWrapper}>
               </View>
          </View>)
     }
}

const stateToProps = ({ user: { info } }) => ({
     nickname: info.nickname,
})

export default passStateToProps(stateToProps)(Setting)

const style = StyleSheet.create({
     wrapper: {
          flex: 1,
     },
     profileWrapper: {
          flexDirection: 'row',
          paddingHorizontal: 10,
          alignItems: 'center',
          height: 50,
     },
     nickname: {
          flex: 1,
          fontSize: 16,
     },
     divider: {
          height: 1,
          backgroundColor: '#eee',
     },

     buttonWrapper: {
          marginHorizontal: 10,
     },
})