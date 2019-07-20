/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import { TextInput } from 'react-native';

import Controller from '../../plugins/controller'


// 계속 유지되는 곳(app.js 등)에서 한 번만 호출한다.
class ForceInputBlur extends React.Component{
  constructor(p){
    super(p)
    Controller.inputBlurFunction = () => {
      let input: TextInput = this.refs.input
      input.focus()
      input.blur()
    }
  }
  render(){
    return (<TextInput ref='input' style={{ position:'absolute', top:-9999, left:-9999, width:0, height:0, }}/>);
  }
};


export default ForceInputBlur;
