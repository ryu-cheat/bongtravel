let production = {
  api: 'http://172.30.1.18:9720/',
}

module.exports = {
  api: 'http://192.168.43.124:9720/',
  picture: 'http://192.168.43.124:9720/static/',


  ...(!__DEV__ && production),
}