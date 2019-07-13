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


import { createAppContainer, createStackNavigator,  } from 'react-navigation'
import Controller from '../../plugins/controller'

// Controller.navigator.push( <Component ~~ /> ) 구현을 위한 컴포넌트
// /src/app.js에서 한 번만 사용한다.
class Navigator extends Component{
  constructor(p){
    super(p)
    if (this.props.navigation) {
      Controller.navigator.push = this.push
      Controller.navigator.pop = this.pop
      Controller.navigator.popToTop = this.popToTop
    }
  }

  push = (scene) => {
    let { navigation } = this.props
    navigation.push('Navigator', { scene })
  }

  pop = () => {
    let { navigation } = this.props
    navigation.pop()
  }

  popToTop = () => {
    let { navigation } = this.props
    navigation.popToTop()
  }

  render(){
    if (this.props.screenProps) {
      let scene = this.props.navigation.getParam('scene')
      if (scene) { // 넘어온 scene이 있을 때
        let params = this.props.navigation.getParam('params')
        let toRenderScene = React.cloneElement(scene, { params })
        return (<>{toRenderScene}</>)
      } else { // 처음에는 scene이 없다
        return (<>{this.props.screenProps.children}</>)
      }
    }

    let Container = createAppContainer(StackNavigator)
    return (<Container screenProps={{ children: this.props.children }} />)
  }
}

const StackNavigator = createStackNavigator(
  { 'Navigator': { screen: Navigator, navigationOptions: { gesturesEnabled: true } } }, // 모든 페이지는 Navigator 컴포넌트에서 관리한다
  {
    initialRouteName:'Navigator',
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
  }
);

export default Navigator;