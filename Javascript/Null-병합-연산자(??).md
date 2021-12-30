# Null 병합 연산자 ??

## 정의

물음표 두 개(??)를 사용해서 null 혹은 undefined 값을 가려내는 연산자

## ?? 연산자 사용 예시

```javascript
const example1 = null ?? "I";
const example2 = undefined ?? "love";
const example3 = "Chrome" ?? "IE";

console.log(example1, example2, example3);
```

example1과 2를 보면, null 병합 연산자인 **??** 왼편에 각각 null과 undefined가 선언되어 있다.
이처럼 ?? 연산자 왼편의 값이 null 이나 undefined라면 ?? 연산자 오른편의 값이 리턴되고, example3처럼 연산자 왼편의 값이 null 이나 undefined가 아니라면 연산자 왼편의 값이 리턴되는 원리로 동작한다.

따라서 결과적으로 마지막 줄에서 콘솔에 출력되는 값은 I love Chrome이 된다.

```javascript
const example1 = null ?? "I"; // I
const example2 = undefined ?? "love"; // love
const example3 = "Chrome" ?? "IE"; // Chrome

console.log(example1, example2, example3); // I love Chrome
```

## OR 연산자(||)와 비교

?? 연산자가 작동하는 방식을 보면 OR 연산자인 || 와 동작하는 방식이 비슷해 보인다.
실제로 다음과 같은 상황이라면 똑같이 동작을 하게 된다.

```javascript
const example1 = null || "minsoo";
const example2 = null ?? "minsoo";

console.log(example1); // minsoo
console.log(example2); // minsoo
```

하지만 null 병합 연산자(??)는 왼편의 값이 null이나 undefined인지 확인하고 OR 연산자(||)는 왼편의 값이 falsy인지를 확인한다는 부분에서 차이가 있다.
따라서 아래 코드와 같이 null이나 undefined가 아닌 falsy 값을 활용할 경우 서로 다른 결과가 나타나게 된다.

```javascript
// false와 0 은 null이나 undefined가 아닌 falsy인 값

const example1 = false || "minsoo";
const example2 = false ?? "minsoo";

console.log(example1); // minsoo
console.log(example2); // false

const example3 = 0 || 10000;
const example4 = 0 ?? 10000;

console.log(example3); // 10000
console.log(example4); // 0
```

0과 false는 null이나 undefined 값이 아닌 falsy값이 라는 점을 명심하자.
