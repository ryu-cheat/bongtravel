const request = require('./request')


export const writeTravelJournal = (body: Object = {}): Promise => {
     return request.post({
         path: `/travel/journal`,
         body,
     })
}