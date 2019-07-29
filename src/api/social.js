const request = require('./request')

export const getLatest = (lastId): Promise => {
    return request.get({
        path: `/socials/latest?lastId=${lastId}`,
    })
}

export const keywordSearch = (keyword: String, offset: Number, lastKeywords: Array): Promise => {
    lastKeywords = encodeURIComponent(JSON.stringify(lastKeywords)) // 키워드에 반점이 포함돼있을수도있으니 그냥 JSON.stringify해서 넘기자
    return request.get({
        path: `/socials/keywordSearch?keyword=${encodeURIComponent(keyword)}&offset=${offset}&lastKeywords=${lastKeywords}`,
    })
}