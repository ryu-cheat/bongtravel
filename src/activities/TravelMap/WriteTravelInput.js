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
  ScrollView,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Animated,
  Image,
} from 'react-native';

import styled from 'styled-components/native'
import MapView, { Marker, Polyline, AnimatedRegion } from 'react-native-maps';
import Controller, { navigator, writeTravel } from '../../plugins/controller'
import Storage, { travelWrite } from '../../plugins/storage'
import ImagePicker from 'react-native-image-crop-picker';
import Converter from '../../plugins/converter'
import { alert, confirm } from '../../plugins/alert'
import { travel } from '../../api'
import ImageViewWithUpload from './ImageViewWithUpload'
import { travelInputStyle } from './style'
const style = travelInputStyle

const FastMarker = Animated.createAnimatedComponent(Marker)


// WriteTravel에서 탭을 관리하고, 입력은 WriteTravelInput에서한다.
export default class WriteTravelInput extends Component{
  state = {
    dateKey: 0, //date에 이상한 값이 입력되었을 경우 초기화
    _loaded: false,
  }
  pictureScrollView: ScrollView = null
/************************* [[시작]] 앱종료해도 입력한거, 업로드중이던 사진 유지하기 *************************/
  input = {
    inputTabKey: this.props.inputTab.key,
    myLatLng: this.props.myLatLng,
    description: '',
    pictures: [],
    date: Date.now(),
  }
  
  loadInputs = async() => {
    let { inputTab } = this.props
    let inputs = await travelWrite.Inputs(this.props.travel._id).get()

    let input = await new Promise(resolve => {
      for (let input of inputs) {
        if (inputTab.key == input.inputTabKey) {
          return resolve(input)
        }
      }
      return resolve({ })
    })

    this.input = {
      ...this.input,
      ...input,
    }

    this.markerCoordinate = new AnimatedRegion({
      latitude: this.input.myLatLng.lat,
      longitude: this.input.myLatLng.lng,
      latitudeDelta: this.input.myLatLng.latDelta,
      longitudeDelta: this.input.myLatLng.lngDelta,
    })

    this.setState({ _loaded: true })
  }
  saveInput = async(type = 'input'|'tab'|'all') => {
    let defaultInputTabs = await travelWrite.InputTabs(this.props.travel._id).get()
    let inputTabIndex = defaultInputTabs.findIndex(inputTab => inputTab.key == this.props.inputTab.key)
    // 삭제됐을때는 저장하면 안되기때문에, inedx 찾아보고 있으면 저장
    if (inputTabIndex == -1) return;

    if (type == 'all' || type == 'input') {
      let defaultInputs = await travelWrite.Inputs(this.props.travel._id).get()
      let inputs = defaultInputs.filter(input => input.inputTabKey != this.input.inputTabKey)
      inputs.push(this.input)
      await travelWrite.Inputs(this.props.travel._id).set(inputs)
    }

    if (type == 'all' || type == 'tab') {
      defaultInputTabs[inputTabIndex] = this.props.inputTab
      await travelWrite.InputTabs(this.props.travel._id).set(defaultInputTabs)
      await Controller.activityController.travel.loadTemplateWrites()
    }
  }
  removeInput = async() => { // saveInput랑 코드 중복. 어떻게 확장될 지 모르니 일단 그대로 두자
    let inputTabs = await travelWrite.InputTabs(this.props.travel._id).get()
    let inputs = await travelWrite.Inputs(this.props.travel._id).get()

    inputs = inputs.filter(input => input.inputTabKey != this.input.inputTabKey)
    inputTabs = inputTabs.filter(inputTab => inputTab.key != this.props.inputTab.key)

    await travelWrite.InputTabs(this.props.travel._id).set(inputTabs)
    await travelWrite.Inputs(this.props.travel._id).set(inputs)

    await writeTravel.loadInputTabs()
  }
/************************* [[끝]] 앱종료해도 입력한거, 업로드중이던 사진 유지하기 *************************/

/************************* [[시작]] 사진 메타데이터 기반 + 현재위치 참조하여 지도 위치 설정해주기 *************************/
  getRegion = () => {
    let { myLatLng } = this.input
    return {
      latitude: myLatLng.lat,
      longitude: myLatLng.lng,
      latitudeDelta: myLatLng.latDelta,
      longitudeDelta: myLatLng.lngDelta,
    }
  }

  onRegionChange = (coordinate) => { // (핀위치 [1])핀의 위치는 여기서 바꿔주고(계속호출됨)
    this.markerCoordinate.stopAnimation()
    this.markerCoordinate.timing({
      latitude: coordinate.latitude || this.input.myLatLng.lat,
      longitude: coordinate.longitude || this.input.myLatLng.lng,
      latitudeDelta: coordinate.latitudeDelta || this.input.myLatLng.latDelta,
      longitudeDelta: coordinate.longitudeDelta || this.input.myLatLng.lngDelta,
      delay: 0,
      duration :0,
    }).start()
  }
  onRegionChangeComplete = (coordinate) => { // (핀위치 [2])지도에 선택된 위치는 여기서 저장해준다
    this.onRegionChange(coordinate)
    
    this.input.myLatLng = {
      lat:coordinate.latitude || this.input.myLatLng.lat,
      lng:coordinate.longitude || this.input.myLatLng.lng,
      latDelta:coordinate.latitudeDelta || this.input.myLatLng.latDelta,
      lngDelta:coordinate.longitudeDelta || this.input.myLatLng.lngDelta,
    }
  }

  markerCoordinate = new AnimatedRegion()
/************************* [[끝]] 사진 메타데이터 기반 + 현재위치 참조하여 지도 위치 설정해주기 *************************/
/************************* [[시작]] 여행 사진 *************************/
  // 사진 그려주기
  renderPictures = () => {
    // 중복된 이미지가 올라가지 않도록 필터
    // path가 같으면 동일 사진으로 보고, path가 같은것의 첫번째 순서와 filter((picture))의 picture의 순서가 같은것만 남긴다
    this.input.pictures = this.input.pictures.filter((picture, idx) => idx == this.input.pictures.findIndex(p=>p.path == picture.path))

    let { pictures } = this.input
    if (pictures.length == 0) {
      return null
    }else{
      let _pictures = []
      for (let picture of pictures) {
        // 사진 한 번 누르면 지도 위치를 사진위치로 변경
        const onPress = () => {
          if (picture.latitude) {
            this.onRegionChangeComplete({ latitude: picture.latitude, longitude: picture.longitude })
            this.setState({})
          }
        }
        // 사진을 길게 누르면 삭제할건지 띄우기
        const onLongPress = async() => {
          let result = await confirm('사진을 삭제하시겠습니까?')
          if (result) {
            this.input.pictures = this.input.pictures.filter(p => p != picture)
            this.saveInput('input')
            this.setState({})
          }
        }
        const Save = async() => {
          this.saveInput('input')
          this.setState({ })
        }

        // 업로드 기능이 내장된 컴포넌트를 만들어서 사용한다(미완)
        _pictures.push(<TouchableOpacity key={picture.path} style={{ marginRight:10 }} onPress={onPress} onLongPress={onLongPress}>
          <ImageViewWithUpload save={Save} picture={ picture } />
        </TouchableOpacity>)
      }
      return (
        <ScrollView ref={ref=>this.pictureScrollView=ref} horizontal showsHorizontalScrollIndicator={false} style={style.pictureScrollView}>
          {_pictures}
        </ScrollView>
      )
    }
  }
  // 사진추가하기
  addPicture = () => {
    ImagePicker.openPicker({
      compressImageMaxWidth: 400,
      compressImageMaxHeight: 400,
      includeExif: true,
      multiple: true,
    }).then(async(pictures) => {
      // 사진을 그냥 추가하는게아니라, 날짜 다른 사진이 있는지 확인해야되기 때문에, 임시저장 -> 비교 -> 필터 -> 저장 한다
      let _pictures = []
      let _differentDatePictures = {}

      // 날짜는 아침 6시까지로 구분한다.
      let _date = this.input.pictures.filter(p=>p.date).length>0?new Date(this.input.date-60*60*6*1000).toLocaleDateString():null

      for (let picture of pictures) {
        let latitude = Converter.geolocation.gpsToGeoPoint(picture.exif.GPSLatitude)
        let longitude = Converter.geolocation.gpsToGeoPoint(picture.exif.GPSLongitude)
        let date = Converter.geolocation.date(picture.exif.DateTime, +picture.creationDate)
        let path = picture.path

        let pictureItem = { latitude, longitude, date, path }
        if (date) {
          let DateLocaleString = new Date(date-60*60*6*1000).toLocaleDateString()
          if (_date == null) {
            _date = DateLocaleString
          } else {
            if ( _date != DateLocaleString ) {
              if ( !_differentDatePictures[DateLocaleString]) {
                _differentDatePictures[DateLocaleString] = []
              }
              _differentDatePictures[DateLocaleString].push(pictureItem)
            }
          }
        }

        _pictures.push(pictureItem)
      }
      

      // 다른날짜의 사진이 있는지 확인
      let _differentDatePictureKeys = Object.keys(_differentDatePictures)
      let _toRegionData = null
      
      if (_differentDatePictureKeys.length>0 && await confirm('날짜가 다른 사진이 포함되어 있습니다.\n\n날짜가 다른 사진들은 새 탭으로 분리할까요?')) {
        // 다른 날짜로 분류된 사진들을 날짜별 새 탭에 넣어준다.
        for (let key of _differentDatePictureKeys) {
          _pictures = _pictures.filter(p => _differentDatePictures[key].indexOf(p) == -1)
          
          let differentDatePictures = _differentDatePictures[key]
          let minDate = null
          for (let picture of differentDatePictures){
            minDate = minDate == null ? picture.date : Math.min(picture.date, minDate)
          }

          await writeTravel.addInputTabs(new Date(minDate), { pictures: differentDatePictures, date: minDate })
        }
      }

      /// 최종적으로 추가될 사진의 정보로 위치 재설정(완료)
      for (let picture of _pictures){
        let { date, latitude, longitude } = picture
        if (date && latitude && longitude) {
          if ( this.input.date > date.getTime() ) {
            this.input.date = date.getTime()
    
            _toRegionData = { latitude, longitude }
            this.onRegionChange(_toRegionData)
          }
        }
      }

      // 사진 배열 합치기
      this.input.pictures = this.input.pictures.concat(_pictures)

      // 저장하기 !!
      this.saveInput('input')

      // 마무리!! 다시 그려주기
      if (_toRegionData) {
        this.onRegionChangeComplete(_toRegionData)
      }
      await alert('중복된 사진을 제외한 모든 파일들이 추가되었습니다.\n\n사진을 길게 누르면 삭제할 수 있습니다.')
      this.setState({ },()=>{
        if (_pictures.length > 0) {
          setTimeout(()=>{
            this.pictureScrollView&&this.pictureScrollView.scrollToEnd()
          }, 100)
        }
      })

    }).catch(e=>{  });
  }

/************************* [[끝]] 여행 사진 *************************/


  // 여행일지제목 바꿔주기
  onTravelTabTitleChange = async() => {
    await this.saveInput('tab')
    writeTravel.loadInputTabs()
  }
  // 여행일지 삭제하기(나중에 추가된 코드라.. 구조바꾸기(deleteTravelJournal를 밖으로 빼는거)보단 함수 오버로딩하여 오류없이 실행되도록 함
  deleteTravelJournal = () => {}
  // 버튼 그려주기
  renderButtons = () => {
    

    // 입력버튼 활성화 하기 위한 조건
    let writeActive = true
    let { pictures } = this.input
    let { inputTab } = this.props

    let notUploadedPictures = pictures.filter(p => !p.uploaded)

    if (pictures.length == 0) {
      writeActive = false
    }else if (notUploadedPictures.length > 0) {
      writeActive = false
    }else if (inputTab.title.length == 0) {
      writeActive = false
    }

    const edit = inputTab.edit

    // 작성하기 or 수정하기
    const WriteTravelJournal = async() => {
      if (notUploadedPictures.length > 0){
        return alert('아직 업로드가 완료되지 않은 사진이 있습니다.\n\n해당 사진을 삭제하거나 업로드 완료 후 다시 시도해주세요.'+JSON.stringify(notUploadedPictures))
      }
      if (!writeActive) return;
      Controller.inputBlurFunction()
      if (await confirm(edit ? '수정 완료하시겠습니까?' : '작성하시겠습니까?')) {
        // 로딩 화면으로 바꾼 후 요청
        this.setState({ _loaded: false },()=>{
          travel.writeTravelJournal(this.props.travel._id, {
            inputTab: inputTab,
            input: this.input,
          }).then(rs => {
            if ( rs.success ) {
              this.deleteTravelJournal(true)
              Controller.activityController.travel.loadJournals()
              alert('완료되었습니다')
            } else {
              this.setState({ _loaded: true })
              alert('작성 중 오류가 발생했습니다.')
            }
          })
        })
      }
    };

    // 삭제하기
    const DeleteTravelJournal = async(force = false) => {
      Controller.inputBlurFunction()
      if (force || await confirm(edit ? '이 일지를 삭제하시겠습니까?':'입력중인 일지를 삭제하시겠습니까?')) {
        let inputs = await travelWrite.Inputs(this.props.travel._id).get()
        inputs = inputs.filter(input => input.inputTabKey != inputTab.key)
        await travelWrite.Inputs(this.props.travel._id).set(inputs)

        let inputTabs = await travelWrite.InputTabs(this.props.travel._id).get()
        inputTabs = inputTabs.filter(_inputTab => _inputTab.key != inputTab.key)
        await travelWrite.InputTabs(this.props.travel._id).set(inputTabs)

        if (inputTabs.length > 0) {
          await writeTravel.loadInputTabs()
        }else{
          await Controller.activityController.travel.loadTemplateWrites()
          Controller.navigator.pop()
        }
      }
    };
    this.deleteTravelJournal = DeleteTravelJournal

    // view
    return (<View style={style.buttonWrapper}>
      <TouchableOpacity style={[style.button, { backgroundColor:writeActive?'#3772e9':'#e1e1e1' }]} onPress={WriteTravelJournal}>
        <Text style={[style.buttonText, { color:writeActive?'#fff':'#000' }]}>{edit ? '수정 완료' : '작성 완료'}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[style.button, { backgroundColor:'#e1e1e1' }]} onPress={()=>DeleteTravelJournal()}>
        <Text style={[style.buttonText, { color:'#000' }]}>{edit ? '일지 삭제' : '입력중인 일지 삭제'}</Text>
      </TouchableOpacity>
    </View>)
  }

  render(){
    let { _loaded, dateKey } = this.state
    if (!_loaded) return (<View />) // 나중에 로딩 뷰 띄우기

    // 지도
    const { width } = Dimensions.get('window')
    let region = this.getRegion()

    // 여행날짜
    let D = new Date(this.input.date)
    let travelDateString = [D.getFullYear(),D.getMonth()+1,D.getDate()].map(d=>d<10?'0'+d:''+d).join('/')
    let travelDateTimeString = [D.getHours(),D.getMinutes(),D.getSeconds()].map(d=>d<10?'0'+d:''+d).join(':')
    
    // 여행날짜를 날짜답게 뜨게하기
    // travelDateString, travelDateTimeString 같이 뭔가 계산이 들어가는것들은 render안에서 같이 쓰게해준다.
    // this.onTravelDateChange으로 분리해버리면 travelDateString코드를 한번 더 써야되는데, 이 코드를 정확하게 모르는 다른사람이 한쪽에서만 
    // map(d=>d<10?'0'+d:''+d).join('/') 이걸 바꿔버리면 오류가 나기때문에
    const onTravelDateChange = async(text: String, type: 'date'|'time') => {
      let separator = type == 'date' ? '/' : ':'
      let _text = text.replace(/[^0-9\-\:\/]/g,'')
      if (text != _text) {
        await alert('날짜/시간을 제대로 입력해주세요 !')
        return this.setState({ dateKey: Math.random() })
      }

      let splited = text.split(separator)
      
      let D = new Date(this.input.date)
      let nowDates = [D.getFullYear(),D.getMonth()+1,D.getDate()].map(d=>(d+'').padStart(2,'0'))
      let nowTimes = [D.getHours(),D.getMinutes(),D.getSeconds()].map(d=>(d+'').padStart(2,'0'))

      let newDate = null
      if ( type == 'date' ) {
        newDate = new Date(+splited[0],+splited[1]-1,+splited[2],+nowTimes[0],+nowTimes[1],+nowTimes[2]).getTime()
      }else{
        newDate = new Date(+nowDates[0],+nowDates[1]-1,+nowDates[2],+splited[0],+splited[1],+splited[2]).getTime()
      }

      if ( newDate ) {
        this.input.date = newDate
      }else{
        this.setState({ dateKey: Math.random() })
      } 
    }

    return (
    <View style={style.writeWrapper}>
      <ScrollView style={style.writeScroll} showsVerticalScrollIndicator={false}>
        {/* 지도를 그려줍니다 */}
        <MapView
          region={region}
          onRegionChange={this.onRegionChange}
          onRegionChangeComplete={this.onRegionChangeComplete}
          style={{ width, height: width }}>
          <FastMarker 
            coordinate={this.markerCoordinate}
            title={'여행 일지'}
            description={'이 곳에 방문했어요 !'}
          />
        </MapView>

        {/* 사진을 추가해줍니다/추가된 사진을 보여줍니다 */}
        <View style={style.pictureWrapper}>
          {this.renderPictures()}
          <View style={[style.pictureAdd, this.input.pictures.length == 0 && { flex: 1 }]}>
            <TouchableOpacity style={style.pictureAddButton} onPress={this.addPicture}>
              <Text style={style.pictureAddButtonText}>{'+'}</Text>
              <Text style={style.pictureAddButtonText}>사진 추가</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 여행날짜/시간 */}
        <View style={style.travelDateWrapper}>
          <View style={style.travelDate}>
            <Text style={style.tavelDateTitle}>여행 날짜</Text>
            <TextInput
              defaultValue={travelDateString}
              key={dateKey}
              style={style.travelDateInput}
              onChangeText={text => onTravelDateChange(text,'date')}
              onBlur={()=>this.saveInput('input')}
            />
          </View>
          <View style={{ width: 10, }}/>
          <View style={style.travelDate}>
            <Text style={style.tavelDateTitle}>여행 시간</Text>
            <TextInput
              defaultValue={travelDateTimeString}
              key={dateKey}
              style={style.travelDateInput}
              onChangeText={text => onTravelDateChange(text,'time')}
              onBlur={()=>this.saveInput('input')}
            />
          </View>
        </View>
        <View style={style.travelTabTitleInputWrapper}>
          <Text>여행일지 제목</Text>
          <TextInput
            defaultValue={this.props.inputTab.title}
            key={dateKey}
            style={style.travelDateInput}
            onChangeText={text => this.props.inputTab.title = text.trim()}
            onBlur={() => this.onTravelTabTitleChange()}
          />
        </View>
        <View style={style.travelTabTitleInputWrapper}>
          <Text>일지 내용</Text>
          <TextInput
            maxLength={5000}
            defaultValue={this.input.description}
            key={dateKey}
            style={style.travelDescription}
            onChangeText={text => this.input.description = text.trim()}
            onBlur={() => this.onTravelTabTitleChange()}
          />
        </View>
      </ScrollView>
      {this.renderButtons()}
    </View>)
  }
  componentDidMount(){
    this.loadInputs()
  }
}