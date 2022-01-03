# Named Function Expression (기명 함수 표현식)

함수를 만들 때는 선언하는 함수에 이름을 붙여줄 수도 있다. 이렇게 함수 표현식으로 함수가 할당된 변수에는 자동으로 name이라는 프로퍼티를 가지게 된다.

아래의 코드처럼 이름이 없는 함수를 변수에 할당할 때는 변수의 name 프로퍼티는 변수 이름 그 자체를 문자열로 가지게 된다.

```javascript
const sayHello = function () {
  console.log("Hello");
};

console.log(sayHello.name); // sayHello
```

하지만 함수에 이름을 붙여주게 되면, name 속성은 함수 이름을 문자열로 갖게 된다.

```javascript
const sayHello = function printHello() {
  console.log("Hello");
};

console.log(sayHello.name); // printHello
```

이 함수 이름은 함수 내부에서 함수 자체를 가리킬 때 사용할 수 있고 함수를 외부에서 함수를 호출할 때는 사용할 수 없다.

```javascript
const sayHello = function printHello() {
  console.log("Hello");
};

printHello(); // ReferenceError
```

기명 함수 표현식은 일반적으로 함수 내부에서 함수 자체를 가리킬 때 사용된다. 아래 코드는 정상적으로 잘 작동하게 된다.

```javascript
let recursion = function (n) {
  console.log(n);

  if (n === 0) {
    console.log("Finish!");
  } else {
    recursion(n - 1);
  }
};

recursion(5);
```

하지만 만약 해당 함수를 복사하려고 다른 변수에 똑같이 담았다가, recursion 변수에 담긴 값이 변하게 되면 문제가 발생한다.

```javascript
let recursion = function (n) {
  console.log(n);
  if (n === 0) {
    console.log("Finish!");
  } else {
    recursion(n - 1);
  }
};

let myFunction = recursion;

recursion = null;

myFunction(5); // TypeError
```

마지막 줄에서 myFunction 함수를 호출했을 때, 함수가 실행되긴 하지만, 6번줄의 **recursion(n - 1)** 동작을 수행할 때 호출하려는 recursion 함수가 이미 null 값으로 변경되었기 때문에 함수가 아니라는 TypeError가 발생하게 된다.
<br/>
따라서 이런 상황을 방지하기 위해 함수 내부에서 함수 자신을 사용하려고 하면 함수표현식에서는 반드시 기명 함수 표현식을 사용하는 것이 좋다.

```javascript
let recursion = function printRecursion(n) {
  console.log(n);
  if (n === 0) {
    console.log("End!");
  } else {
    printRecursion(n - 1);
  }
};

let myFunction = recursion;

recursion = null;

myFunction(5); // 정상적으로 동작
```

함수 표현식을 작성할 때, 함수에 이름을 지정할 수 있다는 점과 특히 이렇게 함수 내에서 함수를 가리켜야 할 때는 꼭 함수 이름을 작성해주는 것이 안전하다는 점이 중요하다.
