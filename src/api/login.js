const request = require('./request')

export const naverLogin = (token: String = ''): Promise => {
    return request.post({
        path: `/login/naver`,
        body: {
            token
        },
    })
}