/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import { StyleSheet } from 'react-native';


export const travelInputStyle = StyleSheet.create({
  writeWrapper:{
    flex: 1,
  },
  writeScroll:{
    flex: 1,
  },

  pictureWrapper:{
    height: 100,
    flexDirection: 'row',
  },

  pictureAdd:{
    minWidth: 100,
    padding:10,
  },
  pictureAddButton:{
    alignItems:'center',
    justifyContent:'center',
    borderColor:'#000',
    borderWidth:1,
    flex: 1,
  },

  // renderPictures
  pictureScrollView:{
    flex: 1,
    padding:10,
  },

  // travel date
  travelDateWrapper:{
    marginHorizontal: 10,
    flexDirection:'row',
  },
  travelDate:{
    flex: 1,
  },
  travelDescription:{
    marginTop: 5,
    borderColor: '#e6e6e6',
    borderWidth: 1,
    fontSize: 16,
    height: 200,
    textAlignVertical: 'top',
  },
  travelDateInput:{
    marginTop: 5,
    borderColor: '#e6e6e6',
    borderWidth: 1,
    fontSize: 16,
    alignItems: 'center',
    textAlign:'center',
  },

  travelTabTitleInputWrapper:{
    marginHorizontal: 10,
    marginTop:5,
  },

  buttonWrapper:{
    flexDirection:'row',
    padding:5,
  },
  button:{
    flex:1,
    padding:10,
    alignItems:'center',
  },
  buttonText:{
    fontSize: 13,
  },


})

export const travelStyle = StyleSheet.create({
  writeWrapper:{
    flex: 1,
  },
  inputTabsScrollWrapper:{
    height: 50,
    flexDirection:'row',
    backgroundColor:'#eee',
  },
  inputTabsScroll:{
    flex: 1,
    paddingLeft: 10,
  },
  inputTab:{
    marginRight: 10,
    marginTop: 10,
    alignItems:'center',
    justifyContent:'center',
    paddingHorizontal:10,
    borderTopRightRadius:5,
    borderTopLeftRadius:5,
  },
  inputTabText:{
    fontSize:12,
  },
  editingText:{
    fontSize:11,
    color:'#ff6395',
  },
  inputTabsScrollBottomLine:{
    height: 1,
    backgroundColor:'#ffffff',
  },

  backButton:{
    width:40,
    justifyContent:'center',
    alignItems:'center',
    borderRadius:5,
    backgroundColor:'#fff',
  },
})


export const imageViewWithUploadStyle = StyleSheet.create({
  wrapper:{
    width: 80,
    height: 80,
    position: 'relative',
    borderRadius: 5,
    overflow: 'hidden',
  },
  size:{
    width: 80,
    height: 80,
  },
  loading:{
    position:'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'rgba(0,0,0,.15)'
  }

})


export const TravelMapStyle = StyleSheet.create({
  flex1: { flex: 1 },
  relative:{position:'relative'},
  travelWrapper:{
    flex: 1,
  },
  markerBg:{
    width:16,
    height:16,
    alignItems:'center',
    justifyContent:'center',
    borderRadius: 16/2,
  },
  markerText:{
    fontSize:12,
    color:'#fff',
    fontWeight:'bold',
  },

  writeTravelJournalButton:{
    position:'absolute',
    right: 20,
    bottom: 20,
    
    paddingHorizontal:15,
    height: 40,
    alignItems:'center',
    flexDirection:'row',
    backgroundColor:'#fff',
    borderRadius: 20,
  },

  writeTravelJournalButtonText:{
    fontSize: 13,
    fontWeight:'bold',

  },
  writeTravelJournalTemplateText:{
    color:'rgb(180,50,80)'
  },
})

export const travelManageStyle = StyleSheet.create({

  wrapper: {
       flex: 1,
  },

  travelWrapper:{
       flexDirection: 1,
       alignItems: 'center',
       flexDirection: 'row',
       height: 55,
  },
  travelManageButtons:{
    flexDirection:'row',
  },
  travelManageButton:{
    flex:1,
    alignItems:'center',
    justifyContent:'center',
    paddingVertical:12,
    flexDirection:'row',
  },

  checkWrapper: {
       width: 55,
       alignSelf: 'stretch',
       alignItems:'center',
       justifyContent:'center',
  },
  selectButton: {
       width: 75,
       alignSelf: 'stretch',
       alignItems:'center',
       justifyContent:'center',
  },
  travelManageButtonText:{
    fontSize:12,
    color:'#999'
  },
  travelItem:{
    backgroundColor:'#fff',
    marginVertical:8,
    marginHorizontal:16,
    borderRadius:5,
    borderColor:'#ddd',
    borderWidth:1,
  },
  travelTitleText: {
       fontSize:15,
       color: '#000',
  },
  travelDateText: {
       fontSize: 11,
       color: '#777'
  },

  title:{
       height: 60,
       flexDirection: 'row',
       alignItems:'center',
  },
  titleText:{
       flex:1,
       textAlign:'center',
       fontSize: 16,
       color:'#000',
  },

  divider:{
       height: 1,
       backgroundColor:'#e1e1e1',
  },
  backButton:{
       width:50,
       alignSelf:'stretch',
       alignItems:'center',
       justifyContent:'center',
  },
  addTravelButton:{
    paddingVertical: 15,
    alignItems: 'center',
    backgroundColor: '#3772e9',
  },
  addTravelButtonText:{
    fontSize: 15,
    color: '#fff',
  },
})

export const travelManageFormStyle = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  title:{
    height: 60,
    flexDirection: 'row',
    alignItems:'center',
  },
  titleText:{
    flex:1,
    textAlign:'center',
    fontSize: 16,
    color:'#000',
  },
  divider:{
    height: 1,
    backgroundColor:'#e1e1e1',
  },
  backButton:{
    width:50,
    alignSelf:'stretch',
    alignItems:'center',
    justifyContent:'center',
  },
  textInput: {
    padding: 15,
    fontSize: 16,
  },
  maxLengthWrapper:{
    alignItems:'flex-end',
    paddingHorizontal:15,
  },
  okButton: {
    marginHorizontal: 15,
    borderRadius: 5,
    paddingVertical:15,
    alignItems:'center',
    backgroundColor:'#3772e9',
  },
  okButtonText: {
    fontSize: 15,
    color: '#fff',
    fontWeight: 'bold',
  },

})