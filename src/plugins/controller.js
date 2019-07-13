// 여기선 인터페이스만 만들어준다
function init(){ alert('초기화가 필요합니다'); }

const mainTab = {
     goToPage: init,
}


module.exports = {
     mainTab,
     init,
}