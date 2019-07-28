const request = require('./request')

export const naverLogin = (token: Object = {}): Promise => {
    return request.post({
        path: `/login/naver`,
        body: {
            token
        },
    })
}