$ + '변수 이름' 
ex)$minsoo : person;

변수의 값으로는 모든 것이 올 수 있다. 
$minsoo : #000000;
$minsoo : block;
$minsoo : space-between; 등

Saas 변수 컨벤션
1. 소문자만
  소문자를 사용할경우 -를 활용하여 단어 연결 ( ex.$minsoo-good)
2. 대문자만
  대문자를 사용할경우 _를 활용하여 단어 연결 ( ex.$MINSOO_GOOD)


변수는 scope를 가진다.

$value : 1;

p {
  line-height: $value // line-height: 1
}

span {
  $value : 2;
  line-height: $value // line-height: 2
}

color 변수 설정법
1. pattern을 찾자 
  1) ex) gray-1, 2, 3, 4 => 번호에 따른 색상을 기억하기 쉽지 않음
  2) gray - (색상코드 hex값의 맨 앞자리) ex)#fefefe => $gray-f & #0f0f30 => $gray-0  ==> 색상코드의 앞자리가 중복될 경우 사용할 수 없음..

2. 각 색상별 사용되는 곳이 정해져있는 곳이 많음 
  사용처별 색상 변수명을 사용하는 것이 좋음(airbnb instagram 등에서 주로 사용)
  ex) 
  $black: #000000;
$dark: #191a20;
$primary: #3f4150;
$secondary: #8c8d96;
$tertiary: #b2b3b9;
$border: #e0e2e7;
$background: #f7f8fa;
$white: #ffffff;

$blue: #3da5f5;
$blue-dark: #3186c4;
$blue-light: #ecf6fe;

$red: #f86d7d;
$green: #22c58b;


Typography 설정법

font와 매칭되는 line-height 와 letter-spacing을 함께 고려하는 습관을 들이자!!

