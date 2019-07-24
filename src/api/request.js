const config = require('../config')
const delay = require('../plugins/delay')
function request({
     path,
     method,
     body,
     headers = {}
}) {
     path = path.replace(/^\//,'')
     
     // header 기본값 설정
     if (!headers) headers = {};
     if (!headers.authorization) headers.authorization = '';

     headers['Accept'] = 'application/json'
     headers['Content-Type'] = 'application/json'

     return fetch(config.api + path, {
          method,
          body,
          headers,
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

function postFunction({ path, body, headers={} }){
     return request({
          method: 'POST',
          path,
          body: JSON.stringify(body),
          headers,
     })
}

function deleteFunction({ path, body, headers={} }){
     return request({
          method: 'DELETE',
          path,
          body: JSON.stringify(body),
          headers,
     })
}

function putFunction({ path, body, headers={} }){
     return request({
          method: 'PUT',
          path,
          body: JSON.stringify(body),
          headers,
     })
}

module.exports = {
     'get': getFunction,
     'post': postFunction,
     'delete': deleteFunction,
     'put': putFunction,
}