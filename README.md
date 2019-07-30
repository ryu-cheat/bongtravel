<p align="center">
    <img src='https://github.com/lingobong/bongtravel/blob/develop/static/image/logo.png?raw=true'> 
</p>

# < 봉트래블 >

#### 순서
  - <a href="#개발-목표">개발 목표</a>
  - <a href="#팀원-소개">팀원 소개</a>
  - <a href="#자체-개발한-react-오픈소스">자체 개발한 React 오픈소스</a>
  - <a href="#자체-개발한-nodejs-오픈소스">자체 개발한 NodeJS 오픈소스</a>
  - <a href="#-봉트래블-의-핵심-기능">< 봉트래블 >의 핵심 기능</a>
  - <a href="#d2-구현-항목-점검">D2 구현 항목 점검</a>
  - <a href="#시연-영상">시연 영상</a>

# 개발 목표
#### 사용자가 편리하게 작성할 수 있는 '여행일지 SNS'를 개발하고자함
- 업로드 중이던 사진, 입력중이던 내용/탭이 여행 별로 구분되어 내에 자동 저장
    - 화면의 모든 데이터는 동기화 됨
- 여행 일지를 쉽게 찾을 수 있는 유사도 검색엔진 개발
    - 제목 100점, 내용 10점으로 저장
    - 검색 시 현재 키워드 100점으로 스코어 내어 검색
        - 이전 키워드 15점
        - 전전 키워드 10점
        - 전전전 키워드 5점
    - type을 두어 형태소 분석기를 쉽게 연동할 수 있는 형태로 개발했습니다.

#### 개발자가 편리한 개발을 할 수 있도록 돕는 코드나 컴포넌트는 '유연한' 오픈소스로 개발하기
- 자체 개발한 오픈 소스들
    - react-native-toastjs
    - react-g-lang, g-lang
    - react-lingost
    - work-pool
    - lingo-search-mongodb
    - react-native-lingradient

# 팀원 소개
이름|파트|학교
:-:|:-:|:-:
류재완|개발/기획|세종대학교 1학년(휴학)
신나라|PM/기획|인천대학교 2학년
이승진|영상/기획|한양대학교 3학년

# 자체 개발한 React 오픈소스
- react-native-toastjs
    - 순수 react 모듈
    - 커스텀 뷰 띄우기 가능
    - 어디서든 함수 형태로 호출 가능
    ```js
    import { Toast } from 'react-native-toastjs'
    let toast = Toast('Toast 테스트')
    toast.show()
    toast.hide()
    ```

- react-g-lang, g-lang
    - 다국어 앱 개발을 위한 모듈
    - 기존 오픈소스 모듈들은 다국어 함수를 props로 넘겨받아서 기준값을 넣어줘야했지만 react-g-lang은 코드 전역에서 아래 형태로 사용 가능
    ```js
    import {lang} from 'react-g-lang'
    lang.video.title
    ```
    - vscode에서 자동 완성이 된다
    ```js
    lang.video. 을 치면 title, description 등 다국어 키워드가 자동완성 된다.
    ```

- react-lingost
    - 외부에서 유지되는 react state
    - 전역에서 ~~~.setState({ }) 형태로 상태를 바꿔줄 수 있으며, 값을 참조된 컴포넌트 들만 업데이트 이벤트를 받고, 값이 업데이트 된 컴포넌트만 업데이트 된다.
    ```js
    function stateToProps({ user }) {
        return { nickname: user.followers[0] }
    }
    /*
    위 참조는 아래 코드를 실행하더라도 re-rendering되지 않는다.

    followers[1] = Math.random()
    user.setState({
        followers
    })

    lingost는 참조된 값이 변할 때에만 re-rendering한다
    */
    ```
    - <a target='_blank' href='https://github.com/lingobong/react-lingost'>https://github.com/lingobong/react-lingost</a> 참조
- react-native-lingradient
    - react-native에서 사용 가능한 그라데이션 애니메이션 컴포넌트
    - <a target='_blank' href='https://github.com/lingobong/react-native-lingradient'>https://github.com/lingobong/react-native-lingradient</a>


# 자체 개발한 NodeJS 오픈소스

- work-pool
    - 동시에 n개의 작업 풀을 만들고 빨리 끝난 작업의 자리에 다음 작업을 넣어서 처리하는 모듈
        - 이미지를 동시에 n개씩 끊어서 업로드 가능
        - React Native 앱에서 여러개의 http request를 날리게 된다면, 아래처럼 사용하여 '모든 요청이 완료 됐을 때' _loaded를 true로 바꿔서 화면을 보여줄 수 있다
        ```js
        let Pool = require('work-pool')(1) // 1개씩 처리

        Pool.work(next => (~~http request~~).then(next))
        Pool.work(next => (~~http request~~).then(next))

        Pool.finish(() => {
            this.setState({
                _loaded: true
            })
        })
        ```
- lingo-search-mongodb
    - 코드 4줄로 검색엔진을 구현할 수 있는 모듈.
    - 형태소 분석기 연동이 아주 쉽다.
    - mongodb를 기반으로 작동하는 스코어기반 검색엔진
    - 제목, 내용, 태그 등 종류가 다른 내용들을 각각 다른 스코어를 부여하여 저장할 수 있다.
    - 한 프로젝트에 여러개의 검색 채널을 둘 수 있다(여행가검색, 여행일지검색 등)
    - 기본적으로 10개 정도의 언어를 의미있는 텍스트로 판단. (특수 문자같은것들은 의미없는 텍스트로 판단)
    - '키워드 검색 + 나이/취향 등을 반영한 검색' 등 확장 기능 개발이 쉽다.

# < 봉트래블 >의 핵심 기능
- #### 가장 편리한 여행관리&일지 작성
    1. 앱을 종료하더라도 업로드 중이던 사진들, 작성중이던 내용, 추가된 탭들이 저장됩니다.(탭/내용은 여행 별로 관리됩니다)
    2. 한 여행에 여러개의 일지 동시작성가능(탭으로 분류)
    3. 여러개의 사진 첨부 시 날짜별로 자동 분류'가능'
    4. 위의 내용들은 여행 별로 분리되어 임시 보관됩니다.
    5. 일지를 수정하더라도 수정중인 내용이 임시 보관되어, 앱이 튕기더라도 이어서 적기 가능합니다.

- #### 스코어기반 검색엔진
1. 텍스트 분석으로 키워드에따라 일지에 스코어를 매긴다
2. 현재 검색어 100점. \
1번째 전 검색어 15점 \
2번째 전 검색어 10점 \
3번째 전 검색어 5점 \
\
예를들어) 이전에 <다낭여행> <베트남여행>이라는 키워드로 검색했고 현재<고기 맛집>이라는 키워드로 검색했다면
고기맛집이라는 결과 중 베트남, 다낭에 갔다온 여행일지에 스코어를 더 준다

# D2 구현 항목 점검
- <b style='color: #3772e9'>(완료)</b> image meta data(생성일, 위도 경도) 활용
    - 일지 작성 시 기본 날짜 = 오늘, 기본 위치 = 현재위치
    - 사진 첨부 시 날짜와 위도, 경도가 있다면 위치와 날짜를 사진의 메타데이터로 설정(사진이 여러장일 경우에는 가장 빨리찍은 사진의 메타데이터를 사용합니다.)
- <b style='color: #3772e9'>(완료)</b> naver maps API or google maps API를 활용하여 방문지 경로 제공
    - 메인페이지에 해당 여행의 일지들이 뜨고, 일지의 시간 순서대로 이동경로를 표시합니다.
    - 일지들은 다음 일지와의 거리를 표시합니다.
    - 일지의 오른 쪽에는 다음 일지와 시간 차를 계산하여 체류시간을 표시합니다.
- <b style='color: #3772e9'>(완료)</b> 오픈된 관광지 데이터를 DB에 저장, 위경도 기반의 관광지 정보 제공
    - '사용자 직접 쌓아가는 관광지 DB'라는 컨셉으로 개발했습니다.
    - 사용자가 일지를 등록하면 해당 좌표의 관광지가 등록됩니다.
    - 300m 범위 내에서 관광지명이 같은것이 있을 경우 그루핑(group)하여 현재 위치에서의 거리, 등록된 갯수로 스코어를 내어 <b>'이 좌표의 관광지'</b>와 '<b>근처 관광지(+거리)</b>'를 표시해줍니다.
- <b style='color: #3772e9'>(완료)</b> GIT 필수 사용
    - <a href='https://github.com/lingobong/bongtravel' target='_blank'>https://github.com/lingobong/bongtravel</a>
    - <a href='https://github.com/lingobong/bongtravelapi' target='_blank'>https://github.com/lingobong/bongtravelapi</a>
- <b style='color: #3772e9'>(완료)</b> open api를 사용해 네아로(네이버 아이디로 로그인) 연동
    - react-lingost 로 로그인 상태, 회원정보를 저장하며 로그인을 하지 않았을 경우에 네이버 아이디로 로그인해야합니다.
    - 등록된 데이터가 없을 경우 자동으로 가입된 후 로그인합니다.
- <b style='color: #3772e9'>(완료)</b> networking 기능 제공
    - 로그인, 일지쓰기, 일지 보기, 여행추가, 여행 삭제 등 많은 곳에서, 다른 사람의 여행일지 보기, 여행일지 검색 등 다양한 곳에서 사용했습니다
- <b style='color: #3772e9'>(완료)</b> custom UI component 개발
    - 현재 react-navigation은 이동할 화면은 무조건 다 등록하고, 대응되는 키를 외워서 사용해야하는 것 같아서 Component만으로도 navigation.push(<Component />) 형태로 사용 가능한 컴포넌트 등등
    - 평균 3군데 이상에서 재 사용될만한 것들/나눠야 디렉토리&파일을 찾아들어가기 쉬운 것들 등의 기준으로 컴포넌트를 분리하여 개발하였습니다.

# 시연 영상
- ## <a href='http://lend.land/bongtravel.php' target='_blank'>http://lend.land/bongtravel.php</a>
- 시연 영상 (2019년 7월 31일 23시 59분 쯤 업로드됩니다 !)
