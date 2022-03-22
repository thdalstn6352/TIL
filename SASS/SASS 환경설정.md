sass로 작성한 파일을 css 파일로 변환해주어야함. 따라서
package.json 파일속 scripts json에 코드를 추가해야함.
->
"scripts": {
"node-sass" : "node-sass",
"sass": "node-sass src/style.scss dest/style.css"  
=> node-sass에게 src/style.scss를 dest/style.css로 변환해줘 라고 부탁하는 것 따라서 각자의 프로젝트에 맞게 해당부분을 변경해서 사용해야함.

파일이 변경될 때 마다 자동으로 css로 변환되려면 option을 설정해줘야함
=>"sass": "node-sass -w src/style.scss dest/style.css"

이때, 하나의 파일이 아닌 전체적인 scss 파일을 변환하려면 -r option을 주면 된다.
=>"sass": "node-sass -wr src/style.scss dest/style.css"  
}


lint 설정 => sass-lint 설치 & .sass-lint.yml 파일 작성 -> git의 gists 참고(https://gist.github.com/thdalstn6352/d14d43382d160ff9a7872ef38e8440a4)

sass => css preprocessor ->각종 문법을 사용하여 재사용가능한 css 작성가능
 
sass => syntactically awesome style sheeet
기존의 조건, 반복과 같은 문법이 불가능한 css =>가능하도록


icon 과 logo는 svg 형식을 추천

변수와 관련된 선언은 최상위로 올리는 편 @import 