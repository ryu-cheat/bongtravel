const config = require('../config')
const delay = require('../plugins/delay')
function request({
     path,
     method,
     body,
     header = {}
}) {
     path = path.replace(/^\//,'')
     
     // header 기본값 설정
     if (!header) header = {};
     if (!header.authorization) header.authorization = '';

     return fetch(config.api + path, {
          method,
          body,
          ...header,
     }).then(rs=>rs.json())
}

// get 은 단순 읽어오기이므로, 오류 시 세 번까지 다시 시도한다
async function getFunction({ path, body, header={} }){
     return new Promise(async(resolve, reject) => {
          let error = null
          for (let i = 0 ; i < 3 ; i ++) {
               try{
                    // 호출이 잘 됐으면 바로 완료처리 
                    let req = await request({
                         method: 'GET',
                         path,
                         header,
                    })
                    return resolve(req)
               }catch(e){
                    error = e
                    await delay(1000)
               }
               // 실패하면 세 번까지 시도한 후 reject으로 넘겨주기
               reject(error)
          }
     })
}

function postFunction({ path, body, header={} }){
     return request({
          method: 'POST',
          path,
          body,
          header,
     })
}

function deleteFunction({ path, body, header={} }){
     return request({
          method: 'DELETE',
          path,
          body,
          header,
     })
}

function putFunction({ path, body, header={} }){
     return request({
          method: 'PUT',
          path,
          body,
          header,
     })
}

module.exports = {
     'get': getFunction,
     'post': postFunction,
     'delete': deleteFunction,
     'put': putFunction,
}