/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import { StyleSheet } from 'react-native';


const style = StyleSheet.create({
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

module.exports = {
  style,
}