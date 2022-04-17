@mixin 으로 생성

mixin 생성 법

@mixin minsoo() {
  color: red;
  . . .
}

mixin 사용 법

p {
  @include minsoo();
}