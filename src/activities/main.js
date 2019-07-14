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
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import styled from 'styled-components/native'
import Storage from '../plugins/storage'
import Controller, { activityController } from '../plugins/controller'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import TravelMap from './TravelMap'

const Tabs = [
  ['home','홈', TravelMap],
  ['social','소셜', View],
  ['setting','설정', View],
]

export default class Main extends Component{
  state = {
    _loaded: false,

    travels: [],
    travelSelectedIdx: -1,
  }
  constructor (p) {
    super(p)
    activityController.main.loadTravels = this.loadTravels
    activityController.main.loadTravels = this.loadTravels
    activityController.main.manageTravel = this.manageTravel
  }
  loadTravelSelectedIdx = async() => {
    let travelSelectedIdx  = await Storage.travelSelectedIdx.get(0)
    this.setState({ travelSelectedIdx }, this.loadingFinish)
  }
  loadTravels = async() => {
    // 추후 network통신으로 바꿀걸 대비하여 promise로 해두기
    let travels  = await new Promise(resolve => {
      resolve([
        { no: 1, name: '2019년 제주도여행' },
        { no: 2, name: '2019년 다낭여행' },
      ])
    })
    this.setState({ travels }, this.loadingFinish)
    return travels
  }
  loadingFinish = () => {
    let { _loaded, travels, travelSelectedIdx } = this.state
    if (!_loaded) {
      if (travels.length > 0 && travelSelectedIdx != -1) {
        this.setState({
          _loaded: true
        })
      }
    }
  }
  manageTravel = () => {
    let { travels, travelSelectedIdx } = this.state

  }

  render(){
    let { _loaded, travels, travelSelectedIdx } = this.state
    if (!_loaded) return (<View />) // 나중에 로딩 뷰 띄우기

    let travel = travels[ travelSelectedIdx ]

    return (
    <>
      <Header travel={ travel } />
      <ScrollableTabView
        style={style.flex1}
        tabBarPosition={'bottom'}
        renderTabBar={()=><RenderTabBar />}>
        
        {Tabs.map(( {2: TabComponent}, index ) => <TabComponent travels={ this.state.travels } key={index} />)}
        
      </ScrollableTabView>
    </>
    )
  }
  componentDidMount(){
    this.loadTravels()
    this.loadTravelSelectedIdx()
  }
}

// goToPage를 Controller에 넣어줍니다.
// activeTab이 변하면 Header를 이동시킵니다.
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
    return (<>
      <View style={style.horizontalDivider}/>
      <TabbarWrapper>
        {Tabs.map(( tab, index ) => <Tabbar active={index == activeTab} key={index} onPress={()=>Controller.mainTab.goToPage(index)}>
          <TabbarText active={index == activeTab}>{tab[1]}</TabbarText>
        </Tabbar>)}
      </TabbarWrapper>
    </>)
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
      let { travel } = this.props
      return (
        <View style={style.header_wrapper}>
          <Text style={style.header_title}>{travel.name}</Text>
          <TouchableOpacity style={style.header_button} onPress={activityController.main.manageTravel}>
            <Text style={style.header_button_text}>여행관리</Text>
          </TouchableOpacity>
        </View>
      )
    } else if ( this.state.tabId == 'social' ) {
      return (
        <View style={style.header_wrapper}>
          <Text style={style.header_title}>소셜</Text>
        </View>
      )
    } else if ( this.state.tabId == 'setting' ) {
      return (
        <View style={style.header_wrapper}>
          <Text style={style.header_title}>설정</Text>
        </View>
      )
    }

    return null
  }
}

const TabbarWrapper = styled.View`
  flex-direction: row;
`
const Tabbar = styled.TouchableOpacity`
  flex: 1;
  align-items: center;
  height: 50;
  justify-content: center;
`
const TabbarText = styled.Text`
  font-size: 13;
  ${props=>props.active?
    `
      color: #1d4a83;
      font-weight: bold;
    `:
    `color: #000;`};
`

const style = StyleSheet.create({
  flex1: { flex: 1 },
  header_title: { fontSize: 15, fontWeight: 'bold', color: '#000', flex: 1 },
  header_wrapper: { height: 55, paddingHorizontal: 15, alignItems:'center', flexDirection:'row', },
  header_button: {},
  header_button_text: { color: '#777', fontSize: 13 },

  horizontalDivider: { height: 1, backgroundColor:'#efefef', }
})

