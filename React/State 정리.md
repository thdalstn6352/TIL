# State

state는 리액트에서 화면에 표현되는 데이터를 뜻한다. State는 '상태'라는 뜻이 있듯, 리액트에서 state의 상태가 바뀔 때마다 화면을 새롭게 그려내는 방식으로 동작한다.

리액트에서 state를 만들고, state를 바꾸기 위해서는 일단 useState라는 함수를 활용해야 한다.

```javascript
import { useState } from "react";

const Example = () => {
  const [num, setNum] = useState(1);
};
```

함수형 component에서는 state 값을 위처럼 Destructuring 문법으로 작성한다. 이때 첫 번째 요소가 state이고, 두 번째 요소가 이 state를 바꾸는 setter 함수이다.

> 참고로 위 코드와 같이 첫 번째 state 변수는 희망하는 이름으로 지어주고, 두 번째 변수에는 state 이름 앞에 set을 붙인 다음 카멜 케이스로 이름을 지어주는 것(setNum)이 일반적이다.

이때, state 값은 `state += 1`과 같이 state 변수에 새로운 값을 할당하는 방식으로 변경하는 것이 아니라 setter 함수를 활용해 값을 변경해야 한다. setter 함수는 호출할 때 전달하는 아규먼트 값으로 state 값을 변경해준다.

```javascript
import { useState } from "react";
import Button from "./Button";
import Dice from "./Dice";

function App() {
  const [num, setNum] = useState(1);

  const handleRollClick = () => {
    setNum(3); // num state를 3으로 변경!
  };

  const handleClearClick = () => {
    setNum(1); // num state를 1로 변경!
  };

  return (
    <div>
      <Button onClick={handleRollClick}>던지기</Button>
      <Button onClick={handleClearClick}>처음부터</Button>
      <Dice color="red" num={num} />
    </div>
  );
}

export default App;
```

위의 코드처럼 setter 함수를 활용해서 이벤트 핸들러를 등록해두면, 이벤트가 발생할 때마다 상태가 변하면서 화면을 새로 그려준다.

## 참조형 State

자바스크립트의 자료형은 크게 기본형(Primitive type)과 참조형(Reference type)로 나눌 수 있다.
특히 참조형 값들은 조금 독특한 특성을 가지고 있어서 변수로 다룰 때도 조금 주의해야 할 부분들이 있었는데요. state를 활용할 때도 마찬가지입니다!

```javascript
const [gameHistory, setGameHistory] = useState([]);

const handleRollClick = () => {
  const nextNum = random(6);
  gameHistory.push(nextNum);
  setGameHistory(gameHistory); // state가 제대로 변경되지 않는다!
};
```

위 코드에서 볼 수 있듯 배열 값을 가진 gameHistory에 push 메소드를 이용해서 배열의 값을 변경한 다음, 변경된 배열을 setter 함수로 state를 변경하려고 하면 코드가 제대로 동작하지 않는다.

왜냐면 gameHistory state는 배열 값 자체를 가지고 있는 게 아니라 그 배열의 주솟값을 참조하고 있기 때문이다.따라서 push 메소드로 배열 안에 요소를 변경했다고 하더라도 결과적으로 참조하는 배열의 주솟값은 변경된 것이 아니게 된다.

결과적으로 리액트 입장에서는 gameHistory state가 참조하는 주솟값은 여전히 똑같기 때문에 상태(state)가 바뀌었다고 판단하지 않는다
그래서 참조형 state를 활용할 때는 반드시 새로운 참조형 값을 만들어 state를 변경해야 한다.

```javascript
const [gameHistory, setGameHistory] = useState([]);

const handleRollClick = () => {
  const nextNum = random(6);
  setGameHistory([...gameHistory, nextNum]); // state가 제대로 변경된다!
};
```

> 참조형 state를 활용할 땐 반드시 새로운 참조형 값을 만들어서 state를 변경해야 한다!
