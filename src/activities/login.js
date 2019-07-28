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
  StyleSheet,
  Text,
  Image,
} from 'react-native';

import Controller, { navigator } from '../plugins/controller'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { NaverLogin, getProfile } from 'react-native-naver-login';
import Storage from '../plugins/storage'
import * as API from '../api'

const naverInitials = {
  kConsumerKey: 'nZk9BwuggjZYRneUilVP',
  kConsumerSecret: 'Iir4a3VHYu',
  kServiceAppName: 'lendland',
  kServiceAppUrlScheme: 'dooboolaburlscheme', // only for iOS
};

export default class Login extends Component {
  naverLogin = async () => {
    try {
      const result = await new Promise((resolve, reject) => {
        NaverLogin.login(naverInitials, (err, token) => err ? reject(err) : resolve(token))
      })

      const profileResult = await getProfile(result)
      if (!result || profileResult.resultcode === '024') {
        return alert('로그인 실패' + (profileResult || { message: '' }).message)
      } else {

        let loginResult = await API.login.naverLogin(result)
        if (loginResult.success) {
          await Storage.loginToken.set(loginResult.loginToken)
          
        }else{
          alert('로그인 실패\n\n네이버 아이디가 이상합니다.')
        }
      }
    } catch (err) {
      alert('로그인 실패\n\n' + err.toString())
    }
  }

  render() {
    return (<View style={style.wrapper}>
      <View style={{ flex: 1 }} />
      <View style={style.snsLoginButtonWrapper}>
        <TouchableOpacity style={[style.snsLoginButton, {}]} onPress={this.naverLogin}>
          <Image style={{ height: 55, }} source={require('../../static/image/naverlogin.png')} resizeMode='contain' />
        </TouchableOpacity>
      </View>

    </View>)
  }
  componentDidMount() {
    Controller.splash.close()
  }
}

const style = StyleSheet.create({
  wrapper: {
    flex: 1,
  },

  snsLoginButtonWrapper: {
    paddingHorizontal: 30,
    paddingVertical: 40,
  },
  snsLoginButton: {
    borderRadius: 5,
    overflow: 'hidden',
    alignItems: 'center',
  },

})