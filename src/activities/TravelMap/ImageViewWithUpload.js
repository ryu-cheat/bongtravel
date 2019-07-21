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
} from 'react-native';

import md5 from 'md5'

import { ImageUpload } from '../../plugins/workpool'
import { imageViewWithUploadStyle } from './style'

import { upload } from '../../api'

const config = require('../../config')
const style = imageViewWithUploadStyle


export default class ImageViewWithUpload extends Component{

  filename = md5(this.props.picture.path)
  path = config.picture + this.filename + '.jpg'

  state = {
    _loaded: false,
    path: this.path,
  }

  onImageError = () => {
    // 처음 들어오면 주소가 http~~~~로 설정된다.
    // 사진이 없으면 일단 디바이스에 있는 사진 주소로 바꿔주고
    // 업로드를 시작한다.
    if ( /^http(s)?:\/\//.test(this.state.path) ) {
      this.setState({ path: this.props.picture.path })
      
      // ImageUpload.work 는 this.upload함수를 동시에 3개씩 처리해준다.
      // 3개 중 가장먼저끝난 작업을 지우고, 뒤의 작업을 실행하게된다.
      ImageUpload.work(this.upload)
    }
  }
  
  componentWillUnmount(){
    this.uploadNext && this.uploadNext()
  }
  uploadNext = null
  upload = (next) => {
    uploadNext = next
    upload.uploadTravelPicture(this.filename, this.props.picture.path).then(rs=>{
      if (rs.success) {
        this.setState({
          path: this.path,
        })
        this.uploadNext && this.uploadNext()
        this.uploadNext = null
      }
    }).catch(rs=>{
      alert('오류 발생\n\n앱을 다시 실행해주세요'+rs.toString())
    })
  }

  render(){
    return (<View style={style.wrapper}>
      <Image
        key={this.state.path}
        source={{ uri: this.state.path }}
        style={style.size}
        onError={this.onImageError}
      />
    </View>)
  }
}