# 사이드 이펙트(Side Effect)란?

사이드 이펙트는 한국어로는 '부작용'이라는 뜻이다. 예를 들어 약을 먹었을 때 증상은 없어졌지만 (작용) 피부가 붉게 올라오면 (부작용) 이 약에는 부작용이 있다고 말한다.
일상생활에서는 주로 안 좋은 것들을 부작용이라고 부르지만, 프로그래밍상에선 외부에 부수적인 작용을 하는 걸 말한다.

```javascript
let count = 0;

function add(a, b) {
  const result = a + b;
  count += 1; // 함수 외부의 값을 변경
  return result;
}

const val1 = add(1, 2);
const val2 = add(-4, 5);
```

위 코드에서 add 함수는 a, b 를 파라미터로 받아서 더한 값을 리턴하는 함수이다. 함수 안을 살펴보면 바깥에 있는 count 라는 변수의 값을 변경하는 코드(`count += 1`)가 있다. add 함수는 실행하면서 함수 외부의 상태(count 변수)가 바뀌기 때문에, 이런 함수를 "사이드 이펙트가 있다"고 한다.

코드를 작성하면서 쉽게 볼 수 있는 예로는 console.log 함수가 있다. console.log 함수를 사용하면 값을 계산해서 리턴하는 것이 아닌 웹 브라우저 콘솔 창에 문자열을 출력하게 된다. 이는 외부 상태를 변경해서 문자열을 출력하는 것이다.
이렇게 함수 안에서 함수 바깥에 있는 값이나 상태를 변경하는 걸 '사이드 이펙트'라고 부른다.

# 사이드 이펙트와 useEffect

`useEffect`는 리액트 컴포넌트 함수 안에서 사이드 이펙트를 실행하고 싶을 때 사용하는 함수이다.
예를들면 DOM 노드를 직접 변경한다거나, 브라우저에 데이터를 저장하고, 네트워크 리퀘스트를 보내는 것이 그 예이다.
주로 리액트 외부에 있는 데이터나 상태를 변경할 때 사용하게 된다.

## useEffect를 쓰면 좋은 경우

`useEffect`는 '동기화'에 쓰면 유용한 경우가 많다. 여기서 동기화란 컴포넌트 안에 데이터와 리액트 바깥에 있는 데이터를 일치시키는 걸 말한다.

아래 컴포넌트는 인풋 입력에 따라 페이지 제목을 바꾸는 컴포넌트이다.
아래 예시를 통해 useEffect의 장점을 알아보자.

### 1. 핸들러 함수만 사용한 예시

```javascript
import { useState } from "react";

const INITIAL_TITLE = "Untitled";

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
```

위 코드는 handleChange 함수와 handleClearClick 함수가 있다. 모두 title 스테이트를 변경한 후에 document.title 도 함께 변경해주고 있다. 여기서 document.title 값을 바꾸는 건 외부의 상태를 변경하므로 사이드 이펙트이다.
만약 새로 함수를 만들어서 setTitle을 사용하는 코드를 추가할 때마다 document.title 값도 변경해야 한다는 걸 기억해뒀다가 관련된 코드를 작성해야 한다는 것은 나중에 컴포넌트를 수정할 때 빠뜨리기 쉽다.
이때, useEffect를 사용해보자.

### 2. useEffect를 사용한 예시

```javascript
import { useEffect, useState } from "react";

const INITIAL_TITLE = "Untitled";

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
```

`useEffect`를 사용한 예시에서는 document를 다루는 사이드 이펙트 부분만 빼서 useEffect로 따로 처리하고 있다.
이로써 setTitle 함수를 쓸 때마다 document.title을 변경하는 코드를 신경 쓰지 않아도 되어 편리하게 느껴진다.

게다가 처음 렌더링 되었을 때 'Untitled'라고 페이지 제목을 변경하는 효과까지 낼 수 있다.
그리고 이 코드를 본 사람이라면 누구든 이 컴포넌트는 title 스테이트 값을 가지고 항상 document.title 에 반영해줄 것이라고 쉽게 예측할 수 있다.
이렇게 useEffect는 리액트 안과 밖의 데이터를 일치시키는데 활용하면 좋다. useEffect 를 사용했을 때 반복되는 코드를 줄이고, 동작을 쉽게 예측할 수 있는 코드를 작성할 수 있기 때문이다.

## 정리 함수 (Cleanup Function)

```javascript
useEffect(() => {
  // 사이드 이펙트

  return () => {
    // 사이드 이펙트에 대한 정리
  };
}, [...ex]);
```

`useEffect`의 콜백 함수에서 사이드 이펙트를 만들면 정리가 필요한 경우가 있다. 이때 콜백 함수에서 리턴 값으로 정리하는 함수를 리턴할 수 있다. 리턴한 정리 함수에서는 사이드 이펙트에 대한 뒷정리를 한다.

예를 들어 이미지 파일 미리보기를 구현할 때 Object URL을 만들어서 브라우저의 메모리를 할당(createObjectURL) 하고, 정리 함수에서는 이때 할당한 메모리를 다시 해제(revokeObjectURL)하는 것으로 사용될 수 있다.

### 정리 함수가 실행되는 시점

콜백을 한 번 실행했으면, 정리 함수도 반드시 한 번 실행된다. 정확히 말하자면 새로운 콜백 함수가 호출되기 전에 실행되거나 (앞에서 실행한 콜백의 사이드 이펙트를 정리), 컴포넌트가 화면에서 사라지기 전에 실행된다. (맨 마지막으로 실행한 콜백의 사이드 이펙트를 정리).

타이머를 예시로 보자.

```javascript
import { useEffect, useState } from "react";

function Timer() {
  const [second, setSecond] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      console.log("타이머 실행");
      setSecond((prev) => prev + 1);
    }, 1000);
    console.log("타이머 시작");

    return () => {
      clearInterval(timer);
      console.log("타이머 중지");
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
      <button onClick={handleShowClick}>타이머 보이기</button>
      <button onClick={handleHideClick}>타이머 감추기</button>
    </div>
  );
}

export default App;
```

일정한 시간 간격마다 콜백 함수를 실행하는 setInterval 이라는 함수도 정리가 필요한 사이드 이펙트이다.
매번 타이머를 시작하기만 하면 타이머가 여러개 존재하게 된다. 따라서 타이머 컴포넌트는 렌더링이 끝나면 타이머를 시작하고, 화면에서 사라지면 타이머를 멈춰야한다.

위 코드는 사용자가 '타이머 보이기' 버튼을 눌렀을 때 타이머 컴포넌트가 렌더링된다.
타이머 컴포넌트에서는 useEffect에 의해 타이머가 시작되고, 정리 함수를 리턴한다. 이때, 콘솔에는 '타이머 시작'이 출력된다.
이후 사용자가 '타이머 감추기' 버튼을 누르면 show 값이 거짓으로 바뀌며 다시 렌더링된다. 이때, 타이머 컴포넌트는 사라지게 된다.
이때, 리액트에서는 마지막으로 앞에서 기억해뒀던 콜백 즉, 정리 함수를 실행한다. 따라서 타이머를 멈추고 콘솔에는 '타이머 멈춤'이 출력된다.

이렇게 정리 함수를 리턴하면 사이드 이펙트를 정리하고 안전하게 사용할 수 있다.
