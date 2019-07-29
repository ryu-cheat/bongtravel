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
  TextInput,
  TouchableOpacity,
} from 'react-native';

import styled from 'styled-components/native'
import Storage from '../plugins/storage'
import Controller, { activityController } from '../plugins/controller'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import TravelMap from './TravelMap'
import TravelManage from './TravelMap/TravelManage'

import Setting from './Setting'
import Social from './Social'

import { TravelMainLoadFinishCheck } from '../plugins/workpool'
import { travel } from '../api'

const Tabs = [
  ['home','홈', TravelMap],
  ['social','소셜', Social],
  ['setting','설정', Setting],
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
    activityController.main.loadTravelSelectedIdx = this.loadTravelSelectedIdx
    activityController.main.manageTravel = this.manageTravel



    TravelMainLoadFinishCheck.work(this.loadTravels)
    TravelMainLoadFinishCheck.work(this.loadTravelSelectedIdx)
  }
  loadTravelSelectedIdx = async(next) => {
    let travelSelectedIdx  = await Storage.travelSelectedIdx.get()
    this.setState({ travelSelectedIdx }, next)
    return travelSelectedIdx
  }
  loadTravels = async(next) => {
    let { travels } = await travel.getTravels()
    this.setState({ travels }, next)
    return travels
  }

  manageTravel = () => {
    let { travels, travelSelectedIdx } = this.state
    Controller.navigator.push(<TravelManage />)
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
        
        {Tabs.map(( {0: tabId, 2: TabComponent}, index ) => <TabComponent travel={travel} key={index} />)}
        
      </ScrollableTabView>
    </>
    )
  }
  componentDidMount(){
    TravelMainLoadFinishCheck.finish(()=>{
      this.setState({
        _loaded: true
      }, ()=>{
        Controller.splash.close()
      })
    })
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
  // 검색부분
  searchQuery = ''
  search = () => {
    Controller.Search.search(this.searchQuery)
  }


  render(){
    if ( this.state.tabId == 'home' ) {
      let { travel } = this.props
      return (
        <View style={style.header_wrapper}>
          <Text style={style.header_title}>{travel.title}</Text>
          <TouchableOpacity style={style.header_button} onPress={activityController.main.manageTravel}>
            <Text style={style.header_button_text}>여행관리</Text>
          </TouchableOpacity>
        </View>
      )
    } else if ( this.state.tabId == 'social' ) {
      return (
        <View style={[style.header_wrapper, { borderBottomColor:'#ddd', borderBottomWidth: 1 }]}>
          <TextInput
            style={{
              flex: 1,
            }}
            placeholder='검색해주세요 !'
            onChangeText={query => this.searchQuery = query.trim()}
            onSubmitEditing={this.search}
          />
          <TouchableOpacity style={style.header_searchButton} onPress={this.search}>
            <Text style={style.header_searchButtonText}>검색</Text>
          </TouchableOpacity>
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
  header_searchButton: {
    padding: 10,
    borderRadius:5, 
    backgroundColor:'#3772e9',
  },
  header_searchButtonText: {
    color: '#fff',
  },

  horizontalDivider: { height: 1, backgroundColor:'#efefef', }
})

