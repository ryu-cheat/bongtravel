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
  Animated,
} from 'react-native';

import LottieView from 'lottie-react-native';
import styled from 'styled-components/native';

const splashController = { close:()=>{ alert('초기화가 필요합니다.') } }

export default class Splash extends Component{
  remakeChildren = child => {
    return React.cloneElement(child, { splashController })
  }
  // render
  render(){
    return (
      <SplashWrapper>
        <SplashChildren>
          {React.Children.map(this.props.children, this.remakeChildren)}
        </SplashChildren>

        <SplashView />
      </SplashWrapper>
    )
  }
}

class SplashView extends Component{ // splash를 없애줄 때 state의 영향을 최소화 하기 위해 component를 분리해준다
  state = {
    show: true,
    opacity: new Animated.Value(1),
    progress: new Animated.Value(0),
  }

  loadedTimeMs = Date.now()

  constructor(p){
    super(p)
    splashController.close = this.close
  }
  close = () => {
    setTimeout(() => { // 최소 3초 뒤에 실행되도록 함
      Animated.timing(this.state.opacity, {
        duration: 300,
        toValue: 0,
      }).start(()=>{
        this.setState({ show: false })
      })
    }, Math.max( 0, 3000 - (Date.now() - this.loadedTimeMs) ))
  }

  render(){
    return this.state.show && (
      <SplashScreen style={{ opacity: this.state.opacity }}>
        <SplashAnimation loop progress={this.state.progress} />
      </SplashScreen>
    )
  }

  // life cycle
  componentDidMount(){
    Animated.timing(this.state.progress, {
      duration: 6300,
      toValue: 1,
    }).start()
  }
}

const SplashAnimation = styled(LottieView).attrs({ source: require('../static/animation/splash.json') })`
  width: 250;
  height: 250;
`

const SplashWrapper = styled.View`
  position: relative;
  flex: 1;
`
const SplashScreen = styled(Animated.View)`
  position: absolute;
  top:0; left:0; right:0; bottom:0;
  flex: 1;
  background-color: #ffffff;
  align-items: center;
  justify-content: center;
`
const SplashChildren = styled.View`
  position: absolute;
  top:0; left:0; right:0; bottom:0;
  background-color: #ffffff;
`
