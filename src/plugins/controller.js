// storage랑 헷갈리니깐 controller는 동사를 앞에 써주자

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

class activityController {
     static main = {
          loadTravels: (): Promise => initPath('/src/activities/main.js'),
          loadTravelSelectedIdx: ():Promise<Number> => initPath('/src/activities/main.js'),
          manageTravel: () => initPath('/src/activities/main.js'),
     }
     // 여행일지쓰기 등
     static travel = {
          loadTemplateWrites: () => initPath('/src/activities/TravelMap/index.js'),
     }
     // 여행목록관리
     static travelManage = {
          loadTravels: () => initPath('/src/activities/TravelMap/TravelManage.js'),
     }
}

const writeTravel = { 
     loadInputTabs: () => initPath('/src/activities/TravelMap/WriteTravel.js'),
     addInputTabs: () => initPath('/src/activities/TravelMap/WriteTravel.js'),
}

const inputBlurFunction = () => initPath('/src/components/services/ForceInputBlur.js')

module.exports = {
     mainTab,
     splash,
     navigator,

     init,
     initPath,
     
     activityController,
     writeTravel,
     
     
     // 그냥 함수
     inputBlurFunction,
}