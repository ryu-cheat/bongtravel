const { user } = require('./')
const request = require('../api/request')

export const loginCheck = () => {
     request.get({
          path: `/users`,
     }).then(rs => {
          user.setState({
               isLogin: rs.success,
               info: rs.info,
          })
     })
}