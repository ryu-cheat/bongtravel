
// 여기선 인터페이스만 만들어준다
function init(){ alert('초기화가 필요합니다'); }
function initPath(path){ alert('초기화가 필요합니다.\n\n경로 : '+path); }

const mainTab = {
     goToPage: init,
}

const splash = {
     close: init,
     open: init,
}

const navigator = {
     push: (scene: React.ReactNode): void => initPath('/src/components/services/Navigator.js'),
     pop: (): void => initPath('/src/components/services/Navigator.js'),
     popToTop: (): void => initPath('/src/components/services/Navigator.js'),
}

module.exports = {
     mainTab,
     splash,
     navigator,

     init,
     initPath,
}