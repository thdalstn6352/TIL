앞에서 비동기로 useState 를 사용할 때 주의할 점을 배웠는데요.
그때 Setter 함수의 또 다른 사용법을 배웠죠?
이번 레슨에서는 초깃값을 지정하는 또 다른 방법에 대해서 소개하고,
여태까지 배운 useState 사용법을 총정리해보도록 하겠습니다.
초깃값 지정하기
const [state, setState] = useState(initialState);
useState 함수에 값을 전달하면 초깃값으로 지정할 수 있었습니다.
콜백으로 초깃값 지정하기
const [state, setState] = useState(() => {
// 초기값을 계산
return initialState;
});
이 방법은 여기서 처음 소개하는 내용인데요,
초깃값을 계산해서 넣는 경우 이렇게 콜백을 사용하면 좋습니다.
무슨 말인지 예시 코드로 한번 살펴볼게요.
function ReviewForm() {
const savedValues = getSavedValues(); // ReviewForm을 렌더링할 때마다 실행됨
const [values, setValues] = useState(savedValues);
// ...
}
getSavedValues 라는 함수를 통해서 컴퓨터에 저장된 초깃값을 가져온다고 해봅시다.
이 코드엔 한 가지 문제점이 있는데요. savedValues 라는 값은 처음 렌더링 한 번만 계산하면 되는데,
매 렌더링 때마다 불필요하게 getSavedValues 함수를 실행해서 저장된 값을 가져온다는 거죠.
function ReviewForm() {
const [values, setValues] = useState(() => {
const savedValues = getSavedValues(); // 처음 렌더링할 때만 실행됨
return savedValues
});
// ...
}
이럴 때는 이렇게 콜백 형태로 초깃값을 지정해주면
처음 렌더링 할 때 한 번만 콜백을 실행해서 초깃값을 만들고,
그 이후로는 콜백을 실행하지 않기 때문에 getSavedValues 를 불필요하게 실행하지 않습니다.
단, 이때 주의할 점은 이 콜백 함수가 리턴할 때까지 리액트가 렌더링하지 않고 기다린다는 점인데요.
콜백 함수의 실행이 오래 걸릴 수록 초기 렌더링이 늦어진다는 점에 주의하세요.
Setter 함수 사용하기
기본
const [state, setState] = useState(0);

const handleAddClick = () => {
setState(state + 1);
}
Setter 함수에다가 값을 전달하면, 해당하는 값으로 변경되었죠?
이때 주의할 점이 있었는데요,
배열이나 객체 같은 참조형은 반드시 새로운 값을 만들어서 전달해야 한다는 거였습니다.
참조형 State 사용의 잘못된 예
const [state, setState] = useState({ count: 0 });

const handleAddClick = () => {
state.count += 1; // 참조형 변수의 프로퍼티를 수정
setState(state); // 참조형이기 때문에 변수의 값(레퍼런스)는 변하지 않음
}
참조형 State 사용의 올바른 예
const [state, setState] = useState({ count: 0 });

const handleAddClick = () => {
setState({ ...state, count: state.count + 1 }); // 새로운 객체 생성
}
콜백으로 State 변경
setState((prevState) => {
// 다음 State 값을 계산
return nextState;
});
만약 이전 State 값을 참조하면서 State를 변경하는 경우,
비동기 함수에서 State를 변경하게 되면 최신 값이 아닌 State 값을 참조하는 문제가 있었습니다.
이럴 때는 콜백을 사용해서 처리할 수 있었는데요. 파라미터로 올바른 State 값을 가져와서 사용할 수 있습니다.
이전 State 값으로 새로운 State를 만드는 경우엔 항상 콜백 형태를 사용하는 습관을 들이면 좋겠죠?
콜백으로 State를 변경하는 예시
const [count, setCount] = useState(0);

const handleAddClick = async () => {
await addCount();
setCount((prevCount) => prevCount + 1);
}
