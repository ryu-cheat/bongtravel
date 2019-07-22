const request = require('./request')


export const writeTravelJournal = (travelId, body: Object = {}): Promise => {
     return request.post({
         path: `/travels/${travelId}/journal`,
         body,
     })
}

export const getTravels = (): Promise => {
    return request.get({
        path: `/travels`,
    })
}