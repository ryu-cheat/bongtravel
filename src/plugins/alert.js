import {
     Alert,
} from 'react-native'

const alert = (message) => new Promise(resolve=>{
     Alert.alert("BongTravel", message, [ {text:"확인", onPress: ()=>resolve(true)} ], { cancelable: false })
})

const confirm = (message) => new Promise(resolve=>{
     Alert.alert("BongTravel", message, [
		{text:"확인", onPress: ()=>resolve(true)},
		{text:"취소", onPress: ()=>resolve(false)}
	]);
})


module.exports = {
     alert,
     confirm,
}