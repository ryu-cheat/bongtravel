const request = require('./request')


export const writeTravelJournal = (travelId, body: Object = {}): Promise => {
     return request.post({
         path: `/travels/${travelId}/journals`,
         body,
     })
}

export const getTravels = (): Promise => {
    return request.get({
        path: `/travels`,
    })
}

export const deleteTravels = (travelId): Promise => {
    return request.delete({
        path: `/travels/${travelId}`,
    })
}
export const createTravels = (body): Promise => {
    return request.post({
        path: `/travels`,
        body,
    })
}
export const modifyTravels = (travelId, body): Promise => {
    return request.put({
        path: `/travels/${travelId}`,
        body,
    })
}