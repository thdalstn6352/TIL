타입스크립트란?

마이크로소프트사에서 2012년 10월경 등장
자바스크립트가 동작하는 어느 곳에서 모두 사용가능

타입스크립트 안에 자바스크립트

기존의 자바스크립트는 프로토타입 베이스드 에 기초되어 객체지향을 구현했다. 하지만 타입스크립트가 등장함으로써 class interface generics types 등을 다양하게 활용할 수 있어 더 막강한 객체 지향 코드를 구현할 수 있다.

타입스크립트는 CSL SSL 모두 가능

타입스크립트를 자바스크립트로 변환 => 바벨or컴파일러

모든 브라우저 모든 os에서 사용가능한 언어

왜 타입스크립트를 사용하는가?

자바스크립트는 프로그램이 동작할때 타입이 결정됨, but 타입스크립트는 코딩할 때 바로 타입을 결정할 수 있음. 따라서 에러도 빠르게 찾을 수 있음.

type이 언제 결정되느냐에 따라 언어가 나뉘어진다.
dynamically typed : python ruby php js
statically typed : ts java kotlin c go

컴파일러에서 타입이 결정 ? statically
runtime ? dynamically

dynamic
let age = 10
age = 'hello'

statically
let age : number = 10;
age = 'hello' => error

더 쉽고, 유연하고 ,빠르다고해서 좋은게 아니다.

js는 가독성이 떨어짐(어떤 인자, 어떤 변수, 어떤 타입인지를 몰라용) => 에러를 바로 확인할 수 없어 힘들다.

ts는 바로바로 에러를 확인할 수 있고, 안정적이며, 확장이 쉬움

ts는 객체지향 프로그래밍이 가능
and
oop => modularity 모듈성, reusability, extensible, maintainability 높다

생산성 높이고, 높은 퀄리티, 협업시 빠르게 가능(코드 가독성이 좋으므로)

타입스크립트 설정

=> vscode에서 설정창 -> strict null 체크

타입 : any나 unknown, object등 은 가급적으로 사용하지 않는 것이 좋다 -> 너무 추상적이므로

optional parameter => ?를 사용하여 파라미터가 있을 경우에는 해당 파라미터로, 없을 경우 undefined가 된다.
ex)
function printName(firstName: string, lastName?: string) {
console.log(firstName);
console.log(lastName); // undefined
}
printName('Steve', 'Jobs');
printName('Ellie');
printName('Anna');

default parameter => 기본 값 설정 -> 파라미터가 있을 경우에는 해당 파라미터로, 없을 경우 default 값이 된다.

rest parameter =>
ex) ...numbers: number[]

readonly => 배열 변경 불가 (push or pop 불가능) -> Array<> 의 경우 readonly 아직 허용 x
const fruits: string[] = ['🍅', '🍌'];
const scroes: Array<number> = [1, 3, 4];
function printArray(fruits: readonly string[]) {}

Type Aliases => 타입을 사용자가 원하는대로 만들 수 있다.

type Custom = string;
const naeme: Custom = 'minsoo';
