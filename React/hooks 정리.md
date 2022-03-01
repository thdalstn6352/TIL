# Hooks

## Hook의 규칙

- 반드시 리액트 컴포넌트 함수(Functional Component) 안에서 사용해야 한다.
- 컴포넌트 함수의 최상위에서만 사용 가능하다.

## useState

### State 사용하기

```javascript
const [state, setState] = useState(initialState);
```

### 콜백으로 초깃값 지정하기

초깃값을 계산하는 코드가 복잡한 경우에 활용한다.

```javascript
const [state, setState] = useState(() => {
  // ...
  return initialState;
});
```

### State 변경

#### 1. 이전 State 값을 참조하지 않고 변경

```javascript
setState(nextState);
```

#### 2. 이전 State를 참조해서 State 변경

비동기 함수에서 최신 State 값을 가져와서 새로운 State 값을 만들 때 사용

```javascript
setState((prevState) => {
  // ...
  return nextState;
});
```

## useEffect

컴포넌트 함수에서 사이드 이펙트(리액트 외부의 값이나 상태를 변경할 때)에 활용하는 함수

### 1. 처음 렌더링 후에 한 번만 실행

```javascript
useEffect(() => {
  // ...
}, []);
```

### 2. 렌더링 후에 특정 값이 바뀌었으면 실행

• 참고로 처음 렌더링 후에도 한 번 실행된다.

```javascript
useEffect(() => {
// ...
}, [dep1, dep2, dep3, ...]);
```

> dep1, dep2와 같이 [] 안에 들어있는 요소가 변경될 때마다 새로 렌더링 된다.

### 사이드 이펙트 정리(Cleanup)하기

```javascript
useEffect(() => {
// 사이드 이펙트

return () => {
// 정리
}
}, [dep1, dep2, dep3, ...]);
```

## useRef

생성하고 DOM 노드에 연결하기

```javascript
const ref = useRef();

// ...

return <div ref={ref}>안녕 리액트!</div>;
```

## DOM 노드 참조하기

```javascript
const node = ref.current;
if (node) {
  // node를 사용하는 코드
}
```

## useCallback

함수를 매번 새로 생성하는 것이 아니라 디펜던시 리스트가 변경될 때만 함수를 생성

```javascript
const handleLoad = useCallback((option) => {
// ...
}, [dep1, dep2, dep3, ...]);
```

> useCallback안에 작성한 콜백 함수에서 setState를 하게 되면, 이전 state값을 불러오지 못하는 현상이 일어날 수 있다. 따라서 setState를 할 경우 이전 state값을 참조하여 변경해야한다.

## Custom Hook

자주 사용하는 Hook 코드들을 모아서 함수로 만들 수 있다. 이때 useOOO 처럼 반드시 맨 앞에 use 라는 단어를 붙여서
다른 개발자들이 Hook이라는 걸 알 수 있게 해줘야 한다. useHooks 나 streamich/react-hooks 라는 사이트를 보면 다양한 Custom Hook이 소개되어 있다.
간단한 예시를 살펴보자

## useAsync

비동기 함수의 로딩, 에러 처리를 하는 데 사용할 수 있는 함수이다.
함수를 asyncFunction 이라는 파라미터로 추상화해서 wrappedFunction 이라는 함수를 만들어 사용하는 방식을 눈여겨보시면 좋을 것 같다.

```javascript
function useAsync(asyncFunction) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(null);

  const wrappedFunction = useCallback(
    async (...args) => {
      setPending(true);
      setError(null);
      try {
        return await asyncFunction(...args);
      } catch (error) {
        setError(error);
      } finally {
        setPending(false);
      }
    },
    [asyncFunction]
  );

  return [pending, error, wrappedFunction];
}
```

## useToggle

toggle 함수를 호출할 때마다 value 값이 참/거짓으로 번갈아가며 바뀐다.

```javascript
function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);
  const toggle = () => setValue((prevValue) => !prevValue);
  return [value, toggle];
}
```

## useTimer

start 를 실행하면 callback 이라는 파라미터로 넘겨 준 함수를 timeout 밀리초 마다 실행하고, stop 을 실행하면 멈춘다. setInterval의 경우 실행할 때마다 사이드 이펙트를 만들고, 사용하지 않으면 정리를 해줘야 한다.
따라서 정리 함수에 clearInterval 이라는 함수를 실행해서 사이드 이펙트를 정리하게 된다.

```javascript
function useTimer(callback, timeout) {
  const [isRunning, setIsRunning] = useState(false);

  const start = () => setIsRunning(true);

  const stop = () => setIsRunning(false);

  useEffect(() => {
    if (!isRunning) return;

    const timerId = setInterval(callback, timeout); // 사이드 이펙트 발생
    return () => {
      clearInterval(timerId); // 사이드 이펙트 정리
    };
  }, [isRunning, callback, timeout]);

  return [start, stop];
}
```
