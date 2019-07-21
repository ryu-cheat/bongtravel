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
  Image,
  ActivityIndicator,
} from 'react-native';

import md5 from 'md5'

import { ImageUpload } from '../../plugins/workpool'
import { imageViewWithUploadStyle } from './style'

import { upload } from '../../api'

const config = require('../../config')
const style = imageViewWithUploadStyle


export default class ImageViewWithUpload extends Component{
  state = {
    path: this.props.picture.path
  }
  
  componentWillUnmount(){
    this.uploadNext && this.uploadNext()
  }

  uploadNext = null
  upload = (next) => {
    this.uploadNext = next
    upload.uploadTravelPicture(this.state.path).then(rs=>{
      if (rs.success) {
        this.props.picture.path = config.picture+'/'+rs.path
        this.props.picture.uploaded = true

        this.setState({ path: this.props.picture.path })
        this.props.save()

        this.uploadNext && this.uploadNext()
        this.uploadNext = null
      }
    }).catch(rs=>{
      alert('오류 발생\n\n앱을 다시 실행해주세요')
      this.uploadNext && this.uploadNext()
      this.uploadNext = null
    })
  }

  render(){
    let uploaded = this.props.picture.uploaded
    
    return (<View style={style.wrapper}>
      <Image
        source={{ uri: this.state.path }}
        style={style.size}
      />
      {!uploaded && <View style={style.loading}>
        <ActivityIndicator size='small' color='#fff'/>
      </View>}
    </View>)
  }

  componentDidMount(){
    // 사진 주소가 http나 https가 아니면 업로드를 시작한다.
    if ( !/^http(s)?:\/\//.test(this.state.path) ) {
      // ImageUpload.work 는 this.upload함수를 동시에 3개씩 처리해준다.
      // 3개 중 가장먼저끝난 작업을 지우고, 뒤의 작업을 실행하게된다.
      ImageUpload.work(this.upload)
    }
  }
}