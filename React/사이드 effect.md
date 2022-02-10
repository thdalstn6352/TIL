사이드 이펙트(Side Effect)란?
사이드 이펙트는 한국어로는 '부작용'이라는 뜻입니다.
일상생활에서는 '약의 부작용'처럼 사용하는 단어인데요.
예를 들면 감기약을 먹었을 때
감기 증상은 없어졌지만 (작용)
피부가 붉게 올라오면 (부작용)
이 약에는 부작용이 있다고 할 수 있죠.
일상생활에서는 주로 안 좋은 것들을 부작용이라고 부르지만
프로그래밍에선 말 그대로 외부에 부수적인 작용을 하는 걸 말하는데요.
어떤 것인지 간단한 자바스크립트 함수를 예시로 알아봅시다.
let count = 0;

function add(a, b) {
const result = a + b;
count += 1; // 함수 외부의 값을 변경
return result;
}

const val1 = add(1, 2);
const val2 = add(-4, 5);
위 코드에서 add 함수를 봅시다.
이 함수는 a, b 를 파라미터로 받아서 더한 값을 리턴하는데요.
함수 코드 중에서 함수 바깥에 있는 count 라는 변수의 값을 변경하는 코드가 있죠?
add 함수는 실행하면서 함수 외부의 상태(count 변수)가 바뀌기 때문에,
이런 함수를 "사이드 이펙트가 있다"고 합니다.
우리에게 친숙한 예로는 console.log 함수가 있는데요.
console.log 함수를 사용하면 값을 계산해서 리턴하는 게 아니라
웹 브라우저 콘솔 창에 문자열을 출력하죠?
외부 상태를 변경해서 문자열을 출력하는 겁니다.
이렇게 함수 안에서 함수 바깥에 있는 값이나 상태를 변경하는 걸 '사이드 이펙트'라고 부릅니다.
사이드 이펙트와 useEffect
useEffect 는 리액트 컴포넌트 함수 안에서
사이드 이펙트를 실행하고 싶을 때 사용하는 함수입니다.
예를들면 DOM 노드를 직접 변경한다거나,
브라우저에 데이터를 저장하고,
네트워크 리퀘스트를 보내는 것처럼 말이죠.
주로 리액트 외부에 있는 데이터나 상태를 변경할 때 사용하는데요.
간단한 예시들을 보면서 어떤 식으로 활용할 수 있는지 가볍게 살펴봅시다.
페이지 정보 변경
useEffect(() => {
document.title = title; // 페이지 데이터를 변경
}, [title]);
네트워크 요청
useEffect(() => {
fetch('https://example.com/data') // 외부로 네트워크 리퀘스트
.then((response) => response.json())
.then((body) => setData(body));
}, [])
데이터 저장
useEffect(() => {
localStorage.setItem('theme', theme); // 로컬 스토리지에 테마 정보를 저장
}, [theme]);
참고: localStorage 는 웹 브라우저에서 데이터를 저장할 수 있는 기능입니다.
타이머
useEffect(() => {
const timerId = setInterval(() => {
setSecond((prevSecond) => prevSecond + 1);
}, 1000); // 1초마다 콜백 함수를 실행하는 타이머 시작

return () => {
clearInterval(timerId);
}
}, []);
참고: setInterval 이라는 함수를 쓰면 일정한 시간마다 콜백 함수를 실행할 수 있습니다.
useEffect를 쓰면 좋은 경우
여기서 한 가지 의문점이 들 수도 있습니다.
앞에서 우리는 데이터 불러오는 기능 만들 때
처음에는 onclick 이벤트 핸들러에서 네트워크 리퀘스트를 보냈고,
페이지가 열리자마자 데이터를 불러오기 위해서 useEffect 를 사용하는 걸로 바꿨습니다.
하지만 만약 둘 다 가능한 경우라면 핸들러 함수를 써야 하는 걸까요?
아니면 useEffect 를 써야 하는 걸까요?
여기에 정해진 규칙은 없습니다.
하지만 useEffect 는 쉽게 말해서 '동기화'에 쓰면 유용한 경우가 많은데요.
여기서 동기화는 컴포넌트 안에 데이터와 리액트 바깥에 있는 데이터를 일치시키는 걸 말합니다.
이게 어떤 의미인지 간단한 예시를 통해 살펴봅시다.
아래 App 컴포넌트는 인풋 입력에 따라 페이지 제목을 바꾸는 컴포넌트인데요.
핸들러 함수만 사용한 예시
import { useState } from 'react';

const INITIAL_TITLE = 'Untitled';

function App() {
const [title, setTitle] = useState(INITIAL_TITLE);

const handleChange = (e) => {
const nextTitle = e.target.value;
setTitle(nextTitle);
document.title = nextTitle;
};

const handleClearClick = () => {
const nextTitle = INITIAL_TITLE;
setTitle(nextTitle);
document.title = nextTitle;
};

return (
<div>
<input value={title} onChange={handleChange} />
<button onClick={handleClearClick}>초기화</button>
</div>
);
}

export default App;
handleChange 함수와 handleClearClick 함수가 있습니다.
모두 title 스테이트를 변경한 후에 document.title 도 함께 변경해주고 있는데요.
여기서 document.title 값을 바꾸는 건 외부의 상태를 변경하는 거니까 사이드 이펙트입니다.
만약 새로 함수를 만들어서 setTitle 을 사용하는 코드를 추가할 때마다
document.title 값도 변경해야 한다는 걸 기억해뒀다가 관련된 코드를 작성해야 한다는 점이 아쉽습니다.
동료 개발자가 나중에 컴포넌트를 수정하거나 1년 뒤의 내가 컴포넌트를 수정할 때 빠뜨리기 좋겠죠?
useEffect를 사용한 예시
import { useEffect, useState } from 'react';

const INITIAL_TITLE = 'Untitled';

function App() {
const [title, setTitle] = useState(INITIAL_TITLE);

const handleChange = (e) => {
const nextTitle = e.target.value;
setTitle(nextTitle);
};

const handleClearClick = () => {
setTitle(INITIAL_TITLE);
};

useEffect(() => {
document.title = title;
}, [title]);

return (
<div>
<input value={title} onChange={handleChange} />
<button onClick={handleClearClick}>초기화</button>
</div>
);
}

export default App;
useEffect 를 사용한 예시에서는 document 를 다루는 사이드 이펙트 부분만 따로 처리하고 있는데요.
이렇게 하니 setTitle 함수를 쓸 때마다 document.title 을 변경하는 코드를 신경 쓰지 않아도 되니까 편리합니다.
게다가 처음 렌더링 되었을 때 'Untitled'라고 페이지 제목을 변경하는 효과까지 낼 수 있죠.
그리고 이 코드를 본 사람이라면 누구든 이 컴포넌트는 title 스테이트 값을 가지고 항상 document.title 에 반영해줄 것이라고 쉽게 예측할 수 있는데요.
이렇게 useEffect 는 리액트 안과 밖의 데이터를 일치시키는데 활용하면 좋습니다.
useEffect 를 사용했을 때 반복되는 코드를 줄이고, 동작을 쉽게 예측할 수 있는 코드를 작성할 수 있기 때문이죠.
정리 함수 (Cleanup Function)
useEffect(() => {
// 사이드 이펙트

return () => {
// 사이드 이펙트에 대한 정리
}
}, [dep1, dep2, dep3, ...]);
useEffect 의 콜백 함수에서 사이드 이펙트를 만들면 정리가 필요한 경우가 있습니다.
이럴 때 콜백 함수에서 리턴 값으로 정리하는 함수를 리턴할 수 있었는데요.
리턴한 정리 함수에서는 사이드 이펙트에 대한 뒷정리를 합니다.
예를 들면 이미지 파일 미리보기를 구현할 때 Object URL을 만들어서 브라우저의 메모리를 할당(createObjectURL) 했는데요. 정리 함수에서는 이때 할당한 메모리를 다시 해제(revokeObjectURL)해줬었죠.
정리 함수가 실행되는 시점
쉽게 말해서 콜백을 한 번 실행했으면, 정리 함수도 반드시 한 번 실행된다고 생각하면 됩니다.
정확히는 새로운 콜백 함수가 호출되기 전에 실행되거나 (앞에서 실행한 콜백의 사이드 이펙트를 정리), 컴포넌트가 화면에서 사라지기 전에 실행됩니다 (맨 마지막으로 실행한 콜백의 사이드 이펙트를 정리).
예시: 타이머
import { useEffect, useState } from 'react';

function Timer() {
const [second, setSecond] = useState(0);

useEffect(() => {
const timerId = setInterval(() => {
console.log('타이머 실행중 ... ');
setSecond((prevSecond) => prevSecond + 1);
}, 1000);
console.log('타이머 시작 🏁');

    return () => {
      clearInterval(timerId);
      console.log('타이머 멈춤 ✋');
    };

}, []);

return <div>{second}</div>;
}

function App() {
const [show, setShow] = useState(false);

const handleShowClick = () => setShow(true);
const handleHideClick = () => setShow(false);

return (
<div>
{show && <Timer />}
<button onClick={handleShowClick}>보이기</button>
<button onClick={handleHideClick}>감추기</button>
</div>
);
}

export default App;
일정한 시간 간격마다 콜백 함수를 실행하는 setInterval 이라는 함수도 정리가 필요한 사이드 이펙트입니다.
매번 타이머를 시작하기만 하면 타이머가 엄청나게 많아지겠죠?
이 컴포넌트는 렌더링이 끝나면 타이머를 시작하고, 화면에서 사라지면 타이머를 멈춥니다.
코드를 보면서 동작을 살펴볼까요?
사용자가 '보이기' 버튼을 눌렀을 때 show 값이 참으로 바뀌면서 다시 렌더링 됩니다.
조건부 렌더링에 의해서 Timer 컴포넌트를 렌더링 하겠죠?
Timer 컴포넌트에서는 useEffect 에서 타이머를 시작하고, 정리 함수를 리턴합니다.
콘솔에는 '타이머 시작 🏁'이 출력됩니다.
다시 사용자가 '감추기' 버튼을 누르면 show 값이 거짓으로 바뀌면서 다시 렌더링 됩니다.
조건부 렌더링에 의해서 이제 Timer 컴포넌트를 렌더링 하지 않겠죠?
그럼 리액트에선 마지막으로 앞에서 기억해뒀던 정리 함수를 실행해줍니다.
타이머를 멈추고 콘솔에는 '타이머 멈춤 ✋'이 출력됩니다.
이런 식으로 정리 함수를 리턴하면 사이드 이펙트를 정리하고 안전하게 사용할 수 있다는 것.
꼭 기억해주세요!
