const request = require('./request')

export const getLatest = (lastId): Promise => {
    return request.get({
        path: `/socials/latest?lastId=${lastId}`,
    })
}

export const keywordSearch = (keyword, offset): Promise => {
    return request.get({
        path: `/socials/keywordSearch?keyword=${encodeURIComponent(keyword)}&offset=${offset}`,
    })
}