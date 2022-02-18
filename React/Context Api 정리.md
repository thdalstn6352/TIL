이번 레슨에선 리액트 Context를 다루는 법에 대해서 복습해볼게요.
리액트 Context
Context는 한국어로 맥락이라는 뜻입니다.a
쉽게 말해서 어떤 상황에 대한 정보를 의미하는데요.
앞에서 배운 예시처럼
'사용자가 한국어를 사용하는 상황', '사용자가 영어를 사용하는 상황' 같은 걸
여러 컴포넌트에 공유하고 싶을 때 사용합니다.
Props만으로 리액트 개발을 하다 보면
여러 곳에 쓰이는 데이터를 내려주고 싶을 때가 있는데요.
이때 컴포넌트의 단계가 많다면 여러 번 반복해서 Prop을 내려줘야 합니다.
이런 문제점을 프롭 드릴링(Prop Drilling)이라고 했죠?
Context는 프롭 드릴링을 해결하기 위해 사용하는 기능입니다.
Context 만들기
Context는 createContext 라는 함수를 통해 만들 수 있습니다.
import { createContext } from 'react';

const LocaleContext = createContext();
참고로 이때 아래처럼 기본값을 넣어줄 수도 있어요.
import { createContext } from 'react';

const LocaleContext = createContext('ko');
Context 적용하기
Context를 쓸 때는 반드시 값을 공유할 범위를 정하고 써야 하는데요,
이때 범위는 Context 객체에 있는 Provider 라는 컴포넌트로 정해줄 수 있습니다.
이때 Provider의 value prop으로 공유할 값을 내려주면 됩니다.
import { createContext } from 'react';

const LocaleContext = createContext('ko');

function App() {
return (
<div>
... 바깥의 컴포넌트에서는 LocaleContext 사용불가

       <LocaleContext.Provider value="en">
          ... Provider 안의 컴포넌트에서는 LocaleContext 사용가능
       </LocaleContext.Provider>
    </div>

);
}
Context 값 사용하기
useContext 라는 Hook을 사용하면 값을 가져와 사용할 수 있습니다.
이때 아규먼트로는 사용할 Context를 넘겨주면 됩니다.
import { createContext, useContext } from 'react';

const LocaleContext = createContext('ko');

function Board() {
const locale = useContext(LocaleContext);
return <div>언어: {locale}</div>;
}

function App() {
return (
<div>
<LocaleContext.Provider value="en">
<Board />
</LocaleContext.Provider>
</div>
);
}

State, Hook와 함께 활용하기
Provider 역할을 하는 컴포넌트를 하나 만들고,
여기서 State를 만들어서 value 로 넘겨줄 수 있습니다.
그리고 아래의 useLocale 같이
useContext 를 사용해서 값을 가져오는 커스텀 Hook을 만들 수도 있겠죠.
이렇게 하면 Context에서 사용하는 State 값은
반드시 우리가 만든 함수를 통해서만 쓸 수 있기 때문에
안전한 코드를 작성하는데 도움이 됩니다.
import { createContext, useContext, useState } from 'react';

const LocaleContext = createContext({});

export function LocaleProvider({ children }) {
const [locale, setLocale] = useState();
return (
<LocaleContext.Provider value={{ locale, setLocale }}>
{children}
</LocaleContext.Provider>
);
}

export function useLocale() {
const context = useContext(LocaleContext);

if (!context) {
throw new Error('반드시 LocaleProvider 안에서 사용해야 합니다');
}

const { locale } = context;
return locale;
}

export function useSetLocale() {
const context = useContext(LocaleContext);

if (!context) {
throw new Error('반드시 LocaleProvider 안에서 사용해야 합니다');
}

const { setLocale } = context;
return setLocale;
}
