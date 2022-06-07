## 웹 폰트의 문제점
1. FOUT(Flash of Unstyled Text)
=> 기본 text를 보여줬다가 font 다운이 완료되면 해당 font로 변경시켜주는 것
2. FOIT(Flash of Invisible Text)
=> font가 다운되기 전엔 text를 보여주지 않다가, 다운이 완료되면 폰트 적용


브라우저에 따라 다르게 적용된다.
FOUT -> IE, Edge
FOIT -> Chrome, safari

즉, 폰트 최적화라는것은 FOUT 와 FOIT 현상을 최소화하는것.


## 웹 폰트 최적화 방법
1. 폰트 적용 시점 컨트롤하기
2. 폰트 사이즈 줄이기

- 폰트 적용 시점 컨트롤하기
=> font-display라는 css 사용
1. auto : 브라우저 기본 동작 (브라우저에 따른 FOIT, FOUT 기본 설정)
2. block : FOIT(timeout = 3s) 적용  * timeout : 최소 시간 즉, 최소 3초는 기다렸다가 그래도 다운이 안되면 기본 text를 보여준다. 
3. swap : FOUT 적용
4. fallback : FOIT(timeout = 0.1s) => 0.1초 후에 기본 폰트를 보여주는데 3초 후에도 불러오지 못했을 시, 기본 폰트 유지 즉, 폰트 적용x (이미 다운로드 된 폰트는 캐시를 해놓았다가 다음 렌더시 폰트를 빠르게 적용)
5. optional : FOIT(timeout = 0.1s) => 네트워크 상태에 따라 기본폰트 유지할지 웹폰트를 적용할지 결정. => 구글에서 권장


폰트가 적용될 때 깜빡이는 현상을 줄이기 위해 fade-in, out animation 적용.
=> js를 활용해 폰트가 다운되는 시점을 파악을 하여 animation 적용.
-> font face observer 모듈을 사용하여 font 다운로드 시점을 캐치.

- 폰트 사이즈 줄이기
1. 웹폰트 포멧 사용
2. local 폰트사용
3. subset 사용
4. unicode range 적용
5. data-uri 적용

<br />

1. 폰트 포맷
파일 크기 :
TTF/OTF(2mb 이상) > WOFF(1.3mb 이하) > WOFF2(KB)
하지만 브라우저에 따라 지원하지 않는 포맷이 있을 수 도 있기때문에 모든 포맷에 대한 선언
transfonter.org 에서 폰트 포맷 변경 가능

2. local 폰ß트 사용ß
로컬 pc에 해당 폰트가 있을 경우 다운로드를 받지 않고, 해당 로컬에 존재하는 폰트를 사용해서 폰트 적용
local('폰트 이름') css 적용

3. subset
한글 폰트 기준 : 가 각 갸 걋 갻 과 같은 한글로 표현 가능한 모든 글자를 unicode 형태로 저장되어있음.
만약, 해당 폰트를 사용하는 글자가 정해져있다면, 해당하는 글자만 subset하여 사용한다.

4. unicode
subset방식과 비슷하게 특정 필요한 글자의 unicode를 range로 설정하여 최적화

5. data-uri
data-uri 형식(base64)으로 폰트 설정하기. 음 이건 별로인듯

## 폰트 preload

폰트가 사용되는 시점 이전에 load해서 사용?
```javascript
<link rel="preload" href="폰트이름.woff2" as="font" type="font/woff2" crossorigin>
```
설정해준다.
이때, 폰트 이름에 해당하는 값은 그냥 font.woff2가 아닌 빌드 시에 static에 생성되는 폰트 + hash값을 넣어 설정해줘야한다.

기존의 폰트 설정은 style.css가 로드가 된 이후에 폰트에 대한 설정이 이루어지는데 위처럼 설정하면 가장 먼저 로드한다.

매번 빌드할때마다 font + hash값을 변경하는 것이 말이 안됨. 따라서 webpack을 통해 preload 설정을 할 수 있다.

=> react app rewired 라이브러리를 사용해서  package.json 수정 (기존 react-scripts -> react-app-rewired로 변경)
위 설정을 통해 webpack 설정을 수정할 수 있다.

이후 config-overrides.js 에 설정

preload-webpack-plugin을 install하여 config 파일에 적용시킨다. 
정말 너무 어렵다.... 이렇게 까지 해서 최적화를 해야하나 싶다.ㅎ