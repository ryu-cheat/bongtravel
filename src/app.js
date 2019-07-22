/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  StatusBar,
} from 'react-native';

// 플러그인 초기화
import './plugins/controller'
import './plugins/lang'
import './plugins/workpool'
import './plugins/sockets'
import './plugins/workpool'

import Navigator from './components/services/Navigator'
import Splash from './splash'
import Permissions from './permissions'
import Activities from './activities/index'
import ForceInputBlur from './components/services/ForceInputBlur'

// 첫 구조에는 다른 컴포넌트들이 잘 끼어들 수 있도록 탭을 두번씩 넣어준다
const App = () => {
  return (
  <>
      <StatusBar backgroundColor='#ffffff' barStyle='dark-content'/>
      <SafeAreaView style={style.flex1}>
        {/* input focus를 강제로 blur시키기 위한 컴포넌트*/}
          <ForceInputBlur />
          <Splash>
              <Permissions>
                  <Navigator>
                      <Activities />
                  </Navigator>
              </Permissions>
          </Splash>

      </SafeAreaView>
  </>
  )
}

const style = StyleSheet.create({
  flex1: { flex: 1 }
})

export default App;
