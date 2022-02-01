# Props

JSX 문법에서 컴포넌트를 작성할 때 컴포넌트에도 속성을 지정할 수 있는데요. 리액트에서 이렇게 컴포넌트에 지정한 속성들을 Props라고 부릅니다.
Props는 Properties의 약자인데요. 컴포넌트에 속성을 지정해주면 각 속성이 하나의 객체로 모여서 컴포넌트를 정의한 함수의 첫 번째 파라미터로 전달됩니다.

> App.js

```javascript
import Dice from "./Dice";

function App() {
  return (
    <div>
      <Dice color="blue" />
    </div>
  );
}

export default App;
```

> Dice.js

```javascript
import diceBlue01 from "./assets/dice-blue-1.svg";

function Dice(props) {
  console.log(props);
  return <img src={diceBlue01} alt="주사위" />;
}

export default Dice;
```

위 코드들 처럼 App 함수에서 사용하는 Dice 컴포넌트에 color라는 속성을 blue로 지정해주고, Dice 함수 내부에서 props라는 파라미터를 하나 만들어 출력해보면 브라우저 콘솔에는 다음과 같은 출력 결과가 나타나게 됩니다.
{ color: "blue" }
그래서 컴포넌트를 활용할 때 속성값을 다양하게 전달하고 이 props 값을 활용하면, 똑같은 컴포넌트라도 전달된 속성값에 따라 서로 다른 모습을 그려낼 수도 있게 됩니다.
App.js
import Dice from './Dice';

function App() {
return (

<div>
<Dice color="red" num={2} />
</div>
);
}

export default App;
Dice.js
import diceBlue01 from './assets/dice-blue-1.svg';
import diceBlue02 from './assets/dice-blue-2.svg';
// ...
import diceRed01 from './assets/dice-red-1.svg';
import diceRed02 from './assets/dice-red-2.svg';
// ...

const DICE_IMAGES = {
blue: [diceBlue01, diceBlue02],
red: [diceRed01, diceRed02],
};

function Dice(props) {
const src = DICE_IMAGES[props.color][props.num - 1];
const alt = `${props.color} ${props.num}`;
return <img src={src} alt={alt} />;
}

export default Dice;
참고로, 이렇게 props가 객체 형태를 띠고 있으니 Destructuring 문법을 활용해서 조금 더 간결하게 코드를 작성할 수도 있겠죠?
import diceBlue01 from './assets/dice-blue-1.svg';
import diceBlue02 from './assets/dice-blue-2.svg';
// ...
import diceRed01 from './assets/dice-red-1.svg';
import diceRed02 from './assets/dice-red-2.svg';
// ...

const DICE_IMAGES = {
blue: [diceBlue01, diceBlue02],
red: [diceRed01, diceRed02],
};

function Dice({ color = 'blue', num = 1 }) {
const src = DICE_IMAGES[color][num - 1];
const alt = `${color} ${num}`;
return <img src={src} alt={alt} />;
}

export default Dice;
Children
props에는 children이라는 조금 특별한 프로퍼티(prop, 프롭)가 있습니다.
JSX 문법으로 컴포넌트를 작성할 때 컴포넌트를 단일 태그가 아니라 여는 태그와 닫는 태그의 형태로 작성하면, 그 안에 작성된 코드가 바로 이 children 값에 담기게 됩니다.
Button.js
function Button({ children }) {
return <button>{children}</button>;
}

export default Button;
App.js
import Button from './Button';
import Dice from './Dice';

function App() {
return (

<div>
<div>
<Button>던지기</Button>
<Button>처음부터</Button>
</div>
<Dice color="red" num={2} />
</div>
);
}

export default App;
그래서 JSX 문법으로 컴포넌트를 작성할 때 어떤 정보를 전달할 때는 일반적인 props의 속성값을 주로 활용하고, 화면에 보여질 모습을 조금 더 직관적인 코드로 작성하고자 할 때 children 값을 활용할 수가 있습니다.
참고로 이 children을 활용하면 단순히 텍스트만 작성하는 걸 넘어서 컴포넌트 안에 컴포넌트를 작성할 수도 있고, 컴포넌트 안에 복잡한 태그들을 더 작성할 수도 있으니깐 이 값을 어떻게 활용하면 좋을지 여러분도 한번 고민해 보시면 좋을 것 같습니다!
