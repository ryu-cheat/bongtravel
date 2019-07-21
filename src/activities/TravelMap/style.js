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
  },
  size:{
    width: 80,
    height: 80,
  },


})