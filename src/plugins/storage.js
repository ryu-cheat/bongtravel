// controller랑 헷갈리니깐 storage는 명사를 앞에 써주자

const { useAsyncStorage } = require('@react-native-community/async-storage')

const createStorage = function ( key, { set, get } ) {
     const storage = useAsyncStorage('@bongtravel_v1:' + key)
     let functions = { set: (value): Promise<Object> => {}, get: (): Promise<Object> => {} } // vscode 자동완성을 위해 인터페이스 정의

     functions.set = set(storage.setItem)
     functions.get = get(storage.getItem)

     return functions
}

let travelSelectedIdx = createStorage('travelSelectedIdx', {
     set(setItem){
          return (value) => setItem(value+'').then(()=>value) // string으로 저장 // 저장된 값 반환
     },
     get(getItem){
          return async() => +(await getItem() || 0) // number로 변환
     },
})

class travelWrite {
     static InputTabs = createStorage('travelWriteInputTabs', {
          set(setItem){
               return (array) => setItem(JSON.stringify(array)).then(()=>array) // string으로 저장 // 저장된 값 반환
          },
          get(getItem){
               return async() => JSON.parse(await getItem() || '[]') // json으로 변환
          },
     })

     static Inputs = createStorage('travelWriteInputs', {
          set(setItem){
               return (array) => setItem(JSON.stringify(array)).then(()=>array) // string으로 저장 // 저장된 값 반환
          },
          get(getItem){
               return async() => JSON.parse(await getItem() || '[]') // json으로 변환
          },
     })
}

module.exports = {
     travelSelectedIdx,
     travelWrite,
}