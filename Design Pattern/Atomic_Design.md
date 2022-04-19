# Atomic Design Pattern
➡️ 디자인 요소들을 나누어 파악하고 이 요소들이 조합되는 과정을 통해서 디자인을 구성하는 방식

Atomic Design 에서는 5개의 구분된 단계가 존재한다.

1. Atoms
2. Molecules
3. Organisms
4. Templates
5. Pages

<img width="963" alt="atomic_design" src="https://user-images.githubusercontent.com/12326139/164019292-c7bcabe4-fb43-4311-aa64-ba1f66954ab6.png">


## ⚛️ Atoms
### ➡️ 하나의 구성 요소. 본인 자체의 스타일만 가지고 있으며 다른 곳에 영향을 미치는 스타일은 적용되지 않아야 한다. 원자는 form labels, inputs, buttons와 같은 basic html elements를 포함한다.

예시)

```javascript
// src/components/atoms/button/index.js
const Button = ({ type = 'button', children = '' }) => (
  <button type={type}>{children}</button>   // 가장 기본이 되는 html 태그
)
```
![atom](https://user-images.githubusercontent.com/12326139/164019687-ac5836ee-f8b9-4529-9402-12ec685adf51.png)

<br />

## ⚛️ Molecules
### ➡️ Atoms가 모여서 만들어지는 하나의 구성 요소

Atom 단위인 input label, input, buttons를 합쳐 새로운 의미있는 단위를 만들 수 있다. 실제로 어떠한 동작을 할 수 있게 된다.

<img width="923" alt="Molecules" src="https://user-images.githubusercontent.com/12326139/164019801-d50d09e8-c653-4323-8913-a5eea331d1d8.png">

<br />

## ⚛️ Organisms: 분자들의 모음
### ➡️ Organisms(유기체)는 분자들의 모음으로 비교적 복잡한 구조를 가지게 된다. Organisms(유기체)는 서로 동일하거나 다른 molecules(분자)로 구성될 수 있다.

유기체는 로고, 메인 내비게이션, 검색, 소셜 미디어 채널리스트와 같은 다양한 컴포넌트(molecules)로 구성될 수 있다.
<img width="1013" alt="Organisms" src="https://user-images.githubusercontent.com/12326139/164019816-2e5e7af5-64ba-400b-b1a4-319733252414.png">

<br />

## ⚛️ Templates
### ➡️ 유기체들을 모아 템플릿으로 생성, 스타일링에 집중한 단위
![Templates](https://user-images.githubusercontent.com/12326139/164019825-66f9f5c8-2ee1-47a8-9562-b707d0c973c8.png)

<br />

## ⚛️ Pages: 실제 페이지를 구성
### ➡️ 페이지는 실제 대표적인 콘텐츠가 배치된 UI의 모습을 보여주는 템플릿의 특정 인스턴스

Pages 단위에서 어플리케이션 상태 관리(리덕스, 모벡스 등등)가 이루어져야 합니다.
![Pages](https://user-images.githubusercontent.com/12326139/164019843-fd072d6a-aa7f-436a-9aa1-2ca7fa40b530.png)


<br />


## 🎨 Atomic Design Pattern 적용 예시

```
.
└── src
    ├── @types
    │   ├── dataTypes.ts
    │   └── handlerTypes.ts
    ├── App.tsx
    ├── Modal
    │   ├── atoms
    │   ├── molecules
    │   ├── organisms
    │   └── templates
    ├── _components
    │   ├── UI
    │   │   ├── atoms
    │   │   │   ├── Button
    │   │   │   │   ├── Button.style.ts
    │   │   │   │   └── index.tsx
    │   │   │   ├── Icon
    │   │   │   │   ├── Icon.style.ts
    │   │   │   │   └── index.tsx
    │   │   │   ├── Image
    │   │   │   │   ├── Image.style.ts
    │   │   │   │   └── index.tsx
    │   │   │   ├── Input
    │   │   │   │   ├── Input.style.ts
    │   │   │   │   └── index.tsx
    │   │   │   ├── Text
    │   │   │   │   ├── Test.style.ts
    │   │   │   │   └── index.tsx
    │   │   │   └── index.ts
    │   │   ├── molecules
    │   │   │   ├── Banner
    │   │   │   │   ├── Banner.style.ts
    │   │   │   │   └── index.tsx
    │   │   │   ├── ClassIntroduceContent
    │   │   │   │   ├── ClassIntroduceContent.style.ts
    │   │   │   │   └── index.tsx
    │   │   │   ├── ClassIntroduceTitle
    │   │   │   │   ├── ClassIntroduceTitle.style.ts
    │   │   │   │   └── index.tsx
    │   │   │   ├── ClassSimpleInforrmation
    │   │   │   │   ├── ClassSimpleInformation.style.ts
    │   │   │   │   └── index.tsx
    │   │   │   ├── CommentInput
    │   │   │   │   ├── CommentInput.style.ts
    │   │   │   │   └── index.tsx
    │   │   │   ├── CommunityTitle
    │   │   │   │   ├── CommunityTitle.style.ts
    │   │   │   │   └── index.tsx
    │   │   │   ├── CurriculumContentList
    │   │   │   │   ├── CurriculumContentList.style.ts
    │   │   │   │   └── index.tsx
    │   │   │   ├── CurriculumTitle
    │   │   │   │   ├── CurriculumTitle.style.ts
    │   │   │   │   └── index.tsx
    │   │   │   ├── FooterInformation
    │   │   │   │   ├── FooterInformation.style.ts
    │   │   │   │   └── index.tsx
    │   │   │   ├── KitIntroduceContent
    │   │   │   │   ├── KitIntroduceContent.style.ts
    │   │   │   │   └── index.tsx
    │   │   │   ├── KitIntroduceTitle
    │   │   │   │   ├── KitIntroduceTitle.style.ts
    │   │   │   │   └── index.tsx
    │   │   │   ├── RecommendInformation
    │   │   │   │   ├── RecommendInformation.style.ts
    │   │   │   │   └── index.tsx
    │   │   │   ├── RecommendPrice
    │   │   │   │   ├── RecommendPrice.style.ts
    │   │   │   │   └── index.tsx
    │   │   │   ├── ReviewGrid
    │   │   │   │   ├── ReviewGrid.style.ts
    │   │   │   │   └── index.tsx
    │   │   │   ├── ReviewList
    │   │   │   │   ├── ReviewList.style.ts
    │   │   │   │   └── index.tsx
    │   │   │   ├── SearchInput
    │   │   │   │   ├── SearchInput.style.ts
    │   │   │   │   └── index.tsx
    │   │   │   ├── SectionNavBar
    │   │   │   │   ├── SectionNavBar.style.ts
    │   │   │   │   └── index.tsx
    │   │   │   ├── SideNavBarButton
    │   │   │   │   ├── SideNavBarButton.style.ts
    │   │   │   │   └── index.tsx
    │   │   │   ├── SideNavBarOption
    │   │   │   │   ├── SideNavBarOption.style.ts
    │   │   │   │   └── index.tsx
    │   │   │   ├── SideNavBarPrice
    │   │   │   │   ├── SideNavBarPrice.style.ts
    │   │   │   │   └── index.tsx
    │   │   │   ├── SideNavbarTitle
    │   │   │   │   ├── SideNavbarTitle.style.ts
    │   │   │   │   └── index.tsx
    │   │   │   ├── UserInformation
    │   │   │   │   ├── UserInformation.style.ts
    │   │   │   │   └── index.tsx
    │   │   │   └── index.ts
    │   │   └── organisms
    │   │       ├── ClassIntroduceSection
    │   │       │   ├── ClassIntroduceSection.style.ts
    │   │       │   └── index.tsx
    │   │       ├── ClassKitIntroduceSection
    │   │       │   ├── ClassKitIntroductSection.style.ts
    │   │       │   └── index.tsx
    │   │       ├── CommentSection
    │   │       │   ├── CommentSection.style.ts
    │   │       │   └── index.tsx
    │   │       ├── CommunitySection
    │   │       │   ├── CommunitySection.style.ts
    │   │       │   └── index.tsx
    │   │       ├── CurriculumSection
    │   │       │   ├── CurriculumSection.style.ts
    │   │       │   └── index.tsx
    │   │       ├── Footer
    │   │       │   ├── Footer.style.ts
    │   │       │   └── index.tsx
    │   │       ├── Header
    │   │       │   ├── Header.style.ts
    │   │       │   └── index.tsx
    │   │       ├── RecommendSection
    │   │       │   ├── RecommendSection.style.ts
    │   │       │   └── index.tsx
    │   │       ├── SideNavBarSection
    │   │       │   ├── SideNavNarSection.style.ts
    │   │       │   └── index.tsx
    │   │       └── index.ts
    │   ├── pages
    │   │   ├── ClassDetail
    │   │   │   ├── ClassDetail.style.ts
    │   │   │   └── index.tsx
    │   │   └── index.tsx
    │   └── templates
    │       ├── ClassInformation
    │       │   └── index.tsx
    │       ├── Community
    │       │   └── index.tsx
    │       ├── SideNavBar
    │       │   └── index.tsx
    │       └── index.ts
    ├── api
    │   └── classInformation.ts
    ├── assets
    ├── data
    │   └── classInformation.json
    ├── globalStyle
    │   └── globalStyle.ts
    ├── index.tsx
    ├── react-app-env.d.ts
    └── store
        ├── reducers
        │   ├── ClassInformation.ts
        │   └── index.ts
        └── sagas
            ├── ClassInformation.ts
            └── index.ts

```