# 즉시 실행 함수(IIFE)

## 일반적인 함수 특징

일반적으로 함수는 아래 코드와 같이 먼저 선언한 다음, 선언된 함수 이름 뒤에 소괄호를 붙여서 함수를 실행한다.

```javascript
function sayHello() {
  console.log("Hello!");
}

sayHello();
```

그런데 때로는 함수가 선언된 순간에 바로 실행을 할 수도 있다. 이것을 바로 즉시 실행 함수라 부른다.

## 즉시 실행 함수

```javascript
(function () {
  console.log("Hello!");
})();
```

위 코드처럼 함수가 선언되는 부분을 소괄호로 감싼 다음에 바로 뒤에 함수를 실행하는 소괄호를 한 번 더 붙여주게 되면 함수가 선언된 순간에 바로 해당 함수가 실행되게 된다.

이처럼 함수 선언과 동시에 즉시 실행되는 함수를 가리켜 즉시 실행 함수라고 부르며, 영어로는 Immediately Invoked Function Expression, 줄여서 IIFE라고 부른다.

```javascript
(function (x, y) {
  consoel.log(x + y);
})(1, 2);
```

즉시 실행 함수도 일반 함수처럼 파라미터를 작성하고, 함수를 호출할 때 아규먼트를 전달할 수도 있다. 이때, 한 가지 주의해야할 부분은 즉시 실행 함수는 함수에 이름을 지어주더라도 외부에서 재사용할 수 없다.

```javascript
(function sayHello() {
  console.log("Hello!");
})();

sayHello(); // ReferenceError
```

## 즉시 실행 함수의 활용

즉시 실행 함수는 말 그대로 선언과 동시에 실행이 이뤄지기 때문에 일반적으로 프로그램 초기화 기능에 많이 활용된다.

```javascript
(function init() {
  ...// 프로그램이 실행 될 때 기본적으로 동작하는 코드들..
})();
```

혹은 재사용이 필요 없는, 일회성 동작을 구성할 때 활용하기도 한다.

```javascript
const sayHello = "Hello";
const name = "minsoo";

const greeting = (function () {
  const message = `${sayHello} ${name}`;

  return message;
})();
```

이렇게 함수의 리턴 값을 바로 변수에 할당하고 싶을 때 활용할 수 있다.
