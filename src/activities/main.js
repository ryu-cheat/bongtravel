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

import styled from 'styled-components/native'
import Controller from '../plugins/controller'
import ScrollableTabView from 'react-native-scrollable-tab-view'


// Controller.mainTab.goToPage = 
const Tabs = [
  ['home','홈'],
  ['social','소셜'],
  ['setting','설정'],
]

class Index extends Component{
  render(){
    return (
    <>
      <Header />
      <ScrollableTabView
        style={{ flex: 1 }}
        tabBarPosition={'bottom'}
        renderTabBar={()=><RenderTabBar />}>
        
        <Text key={1}>dwajiodaw</Text>
        <Text key={2}>dwajiodaw</Text>
        <Text key={3}>dwajiodaw</Text>

        
      </ScrollableTabView>
    </>
    )
  }
}


class RenderTabBar extends Component{
  constructor(p){
    super(p)

    Controller.mainTab.goToPage = this.props.goToPage
  }
  componentDidUpdate(prevProps){
    if (this.props.activeTab != prevProps.activeTab) {
      HeaderController.goToPage(this.props.activeTab)
    }
  }
  render(){
    let { activeTab } = this.props
    return (<TabbarWrapper>
      {Tabs.map(( tab, index ) => <Tabbar active={index == activeTab} key={index}>
        <Text>{tab[1]}</Text>
      </Tabbar>)}
    </TabbarWrapper>)
  }
}

const HeaderController = { goToPage: Controller.init }
class Header extends Component{
  state = {
    tabId: Tabs[0][0]
  }
  constructor (p) {
    super(p)

    HeaderController.goToPage = (i) => {
      this.setState({
        tabId: Tabs[i][0]
      })
    }
  }

  render(){
    if ( this.state.tabId == 'home' ) {
      return (
        <View>
          <Text>나의 여행 일지</Text>
        </View>
      )
    } else if ( this.state.tabId == 'social' ) {
      return (
        <View>
          <Text>소셜</Text>
        </View>
      )
    } else if ( this.state.tabId == 'setting' ) {
      return (
        <View>
          <Text>설정</Text>
        </View>
      )
    }

    return null
  }
}

const TabbarWrapper = styled.View`
  flex-direction: row;
`
const Tabbar = styled.View`
  flex: 1;
  align-items: center;
  background: ${props=>props.active?'red':'#ffffff'};
`


export default Index;
