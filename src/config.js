let production = {
  api: 'http://lend.land:9720/',
  picture: 'http://lend.land:9720/static/',
  naverInit: {
    kConsumerKey: 'nZk9BwuggjZYRneUilVP',
    kConsumerSecret: 'Iir4a3VHYu',
    kServiceAppName: 'lendland',
    kServiceAppUrlScheme: 'dooboolaburlscheme', // only for iOS
  },
}

// console.disableYellowBox=true
module.exports = {
  api: 'http://172.30.1.16:9720/',
  picture: 'http://172.30.1.16:9720/static/',
  naverInit: {
    kConsumerKey: 'nZk9BwuggjZYRneUilVP',
    kConsumerSecret: 'Iir4a3VHYu',
    kServiceAppName: 'lendland',
    kServiceAppUrlScheme: 'dooboolaburlscheme', // only for iOS
  },


  ...(!__DEV__ && production),
}