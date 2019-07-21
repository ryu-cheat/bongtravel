// delay(ms)동안 지연한다
module.exports = (delay) => new Promise(resolve => setTimeout(resolve, delay))