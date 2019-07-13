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


class Index extends Component{
  render(){
    return (
      <View>
        

        
      </View>
    )
  }

  // life cycle
  componentDidMount(){
    this.props.splashController.close()
  }
}


export default Index;
