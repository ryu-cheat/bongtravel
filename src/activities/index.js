/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {
  View,
  Text,
} from 'react-native';

import Controller from '../plugins/controller'
import Login from './login'
import Main from './main'
import { createAppContainer, createStackNavigator,  } from 'react-navigation'


class Index extends Component{
  render(){
    return (
      <Main />
    )
  }

  // life cycle
  componentDidMount(){
    // 실행 전에 상위 컴포넌트(스플래시) 에서 초기화 돼야 한다
    Controller.splash.close()
  }
}

const Index2 = () => <View><Text>daw</Text></View>;

const Navigator = createStackNavigator(
  {
    'Index': { screen: Index, navigationOptions: { gesturesEnabled: true } },
    'Index2': { screen: Index2, navigationOptions: { gesturesEnabled: true } }
  },
  {
  initialRouteName:'Index',
  headerMode:'none',
  
  transitionConfig: () => ({
    screenInterpolator: sceneProps => {
      const { layout, position, scene } = sceneProps;
      const { index } = scene;
      const width = layout.initWidth;

      return {
        opacity: position.interpolate({
          inputRange: [index - 1, index, index + 1],
          outputRange: [ 0, 1, 0],
        }),
        transform: [{
          translateX: position.interpolate({
            inputRange: [index - 1, index, index + 1],
            outputRange: [width, 0, -width],
          }),
        }]
      };
    }
  }),

});

export default createAppContainer(Navigator);
