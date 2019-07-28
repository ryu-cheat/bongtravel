const request = require('./request')

export const getLatest = (lastId): Promise => {
    return request.get({
        path: `/socials/latest?lastId=${lastId}`,
    })
}