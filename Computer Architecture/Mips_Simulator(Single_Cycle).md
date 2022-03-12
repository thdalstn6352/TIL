# 1. Project Introduction

이번 프로젝트에서는 MIPS 시뮬레이터를 구현하였다. MIPS 시뮬레이터를 통해 주어진 Binary파일(.bin)을 읽어와 올바른 값을 도출하는 것을 목표로 한다.

MIPS Green Sheet에 의하면 각 instruction은 I, R, J 유형으로 분류되며 32개의 범용 레지스터를 지닌다. 각 유형에 맞추어 instruction을 통해 opcode, rs, rt rd, imm, func, address 등의 값을 뽑아내고 Data Path에 의해 순차적으로 연산을 시작한다. 연산은 pc값에 의해 시작되게 되는데, 초기 pc는 0x0으로 시작하며 매 instruction을 수행할 때마다 + 4가 더해지게 된다. 단, Jump나 Conditional Jump인 Branch 연산의 경우 pc값은 정해진 규칙에 의해 변한다. 즉, 매 사이클을 돌 때마다 Architectural State가 변경될 뿐만 아니라 pc의 값을 변경해주어 최종적으로 pc값이 0xFFFF:FFFF 이 될 경우 종료된다.

각 사이클은 6개의 Phases들에 의해 수행된다.
**1. Fetch 2. Decode 3. Evaluate Address 4. Fetch Operands 5. Execute 6. Store Result** 순이다.
단, 모든 instruction이 6개의 phases들을 요구하진 않는다. 매 사이클마다 phases를 지나며 pc가 0xFFFF:FFFF가 되어 사이클이 종료될 경우 최종 결과는 Register의 2번에 저장된다.
결과적으로, 우리는 시뮬레이터를 구현하여 bin파일을 불러와 각 instruction을 올바르게 해독하여, 해독 결과에 따라 해당하는 연산과 메모리 접근등을 통해 Architectural State를 변경해주는 것이다.

# 2. Project Goals

이번 프로젝트는 다음 기능들이 가능하도록 Architecture를 구축하는 것을 목표로 한다.

– **Arithmetic**: add, sub, addi, slt ..

– **Memory references**: lw, sw ..

– **Branches**: jump, beq ..

또한, Single Cycle이 작동하는 방식과 Single Cycle과 Multi Cycle의 차이점을 파악하고, Data Path를 기반으로 하며 MIPS Green Sheet를 활용하여 체계적으로 코드를 구현해 주어진 bin파일을 실행시켜 올바른 Architectural State를 도출한다. 이를 통해 MIPS-32ISA 구조를 이해하며 cycle의 수와 시간이 cpu에 미치는 영향에 대해 알 수 있다.

# 3. Concepts used in CPU simulation

## A. ISA(Instruction Set Architecture) - MIPS 정리

### (1) ISA란?

ISA란 하드웨어와 사용자가 어떻게 지시하고 명령을 수행을 할 것인지에 대한 규약이다. 이때, 명령어의 수행 내용, 시스템의 형태, 명령어에 따라 시스템 상태의 변화 등을 정의하게 된다.
뿐만 아니라 레지스터의 수와 상태, 명령어의 형식과 내용, 메모리 모델과 Input/Output등 많은 것들에 대한 규약이 있다. 이 규약은 하나로 정해져 있는 것이 아니라 CPU에 따라 다른 여러 규약이 존재한다.

### (2) MIPS-32 ISA

MIPS(Microprocessor without Interlocked Pipeline Stages)는 밉스 테크놀로지에서 개발한 RISC ISA로 초소형 마이크로 컨트롤러에서부터 고급 네트워킹 장비에 이르는 수십억 가지 전자 제품의 핵심 부분인 고성능의 업계 표준 아키텍처이다. 탄탄한 instruction과 32 비트에서 64 비트까지의 확장성, 광범위한 소프트웨어 개발 도구 등 사용자에게 폭 넓은 지원을 제공한다.
<img src = "https://images.velog.io/images/thdalstn6352/post/d13769a5-9547-485f-8b10-eeed5d5b6779/%E1%84%83%E1%85%A1%E1%84%8B%E1%85%AE%E1%86%AB%E1%84%85%E1%85%A9%E1%84%83%E1%85%B3.png" />

각 명령은 4-byte word 크기의 2진수로 표현되어 있고, 이들은 각각 하나의 연산을 수행한다.

-MIPS-32 ISA의 명령어 형식은 아래와 같이 나눌 수 있다.

◎ R-type

<img src ="https://images.velog.io/images/thdalstn6352/post/657d58a1-a0be-43b9-ab01-159af8012537/%E1%84%83%E1%85%A1%E1%84%8B%E1%85%AE%E1%86%AB%E1%84%85%E1%85%A9%E1%84%83%E1%85%B3%20(1).png"/>
<img src = "https://images.velog.io/images/thdalstn6352/post/d9b47c72-4f40-4c68-a000-50fdac8ce857/%E1%84%83%E1%85%A1%E1%84%8B%E1%85%AE%E1%86%AB%E1%84%85%E1%85%A9%E1%84%83%E1%85%B3%20(2).png"/>

◎ I-type

<img src ="https://images.velog.io/images/thdalstn6352/post/9161dbfe-79c0-4a22-afbb-4cb432a7968a/%E1%84%83%E1%85%A1%E1%84%8B%E1%85%AE%E1%86%AB%E1%84%85%E1%85%A9%E1%84%83%E1%85%B3%20(3).png"/> 
<img src ="https://images.velog.io/images/thdalstn6352/post/d6958b7e-a439-42f6-af8e-72e2df81cba7/%E1%84%83%E1%85%A1%E1%84%8B%E1%85%AE%E1%86%AB%E1%84%85%E1%85%A9%E1%84%83%E1%85%B3%20(4).png" />

◎ J-type

<img src ="https://images.velog.io/images/thdalstn6352/post/18739056-86bf-4865-af7f-d5fbb81e708f/%E1%84%83%E1%85%A1%E1%84%8B%E1%85%AE%E1%86%AB%E1%84%85%E1%85%A9%E1%84%83%E1%85%B3%20(5).png" />
<img src ="https://images.velog.io/images/thdalstn6352/post/e4ee5589-0fef-40b5-9ae6-63d40f9ad9b0/%E1%84%83%E1%85%A1%E1%84%8B%E1%85%AE%E1%86%AB%E1%84%85%E1%85%A9%E1%84%83%E1%85%B3%20(6).png" />

## B. Endian

컴퓨터의 메모리와 같은 1차원의 공간에 여러 개의 연속된 대상을 배열하는 방법을 뜻한다. Endian은 큰 단위가 앞에 나오는 빅 엔디언(Big-endian)과 작은 단위가 앞에 나오는 리틀 엔디언(Little-endian)으로 나눌 수 있다. <img src ="https://images.velog.io/images/thdalstn6352/post/208ef161-ddb0-4809-b9d5-0a9684c49fc8/image.png" />

두 방법은 서로 다른 여러 아키텍처에서 서로 공존하고 있다. 그러나 x86 아키텍처가 리틀 엔디언을 쓰기 때문에, 오늘날 x86 아키텍처를 사용하는 대부분의 데스크톱 컴퓨터는 리틀 엔디언을 쓰며 이를 ‘인텔 포맷’이라 한다. 이번 프로젝트에서 리틀 엔디언으로 표현된 instruction을 빅 엔디언으로 바꾸는 연산을 수행하였다.

## c. Data Path

<img src ="https://images.velog.io/images/thdalstn6352/post/0b2f770f-c5a9-4a77-a542-f05fd703f45a/image.png"/>
= 연산들을 수행하기 위한 여려 유닛들의 구조로 MIPS연산은 크게 5개로 나눌 수 있다.

**(1) Instruction Fetch(IF)** : PC에 있는 명령어(instruction)을 가져온다.

**(2) Instruction decode and register operand fetch (ID/RF)** : 명령어를 해석하고 필요한 레지스터 값을 읽는다.

**(3) Execute/Evaluate memory address (EX/AG)** :　명령에 필요한 연산을 수행하고 필요할 경우 메모리 주소를 계산한다.

**(4) Memory operand fetch (MEM)** : 메모리 주소를 가져와 값을 저장하거나 읽어오는 연산을 수행한다.

**(5) Store/writeback result (WB)** : 필요한 경우 최종 연산 결과를 레지스터에 저장한다.

<br />

### (a) R_Type Data_Path

<img src="https://images.velog.io/images/thdalstn6352/post/2156b7ab-dd1b-45bd-866e-1b01b8f39339/image.png"/>

**(1) Instruction Fetch(IF)** : PC에 있는 명령어(instruction)을 가져온다.

**(2) Instruction decode and register operand fetch (ID/RF)** : 명령어를 해석하고 rs와 rt 레지스터 값을 읽는다.

**(3) Execute/Evaluate memory address (EX/AG)** :　 rs와 rt를 이용하여 올바른 연산을 수행한다.

**(4) Memory operand fetch (MEM)** : 데이터 메모리에 접근하지 않는다.

**(5) Store/writeback result (WB)** : 연산의 결과를 레지스터 rd에 작성한다.

<br />

### (b) LW Data_Path

<img src="https://images.velog.io/images/thdalstn6352/post/485b9e58-20a2-4be6-b3d1-bc867da48043/image.png" />

**(1) Instruction Fetch(IF)** : PC에 있는 명령어(instruction)을 가져온다.

**(2) Instruction decode and register operand fetch (ID/RF)** : 명령어를 해석하고 rs레지스터 값을 읽고 16비트의 imm을 32비트로 바꾸어주는 SignExtimm연산을 수행한다.

**(3) Execute/Evaluate memory address (EX/AG)** :　 rs와 Extimm을 이용하여 덧셈 연산을 수행한다.

**(4) Memory operand fetch (MEM)** : 연산 결과를 메모리의 주소로 가져와 해당하는 메모리의 값을 읽어온다.

**(5) Store/writeback result (WB)** : 연산의 결과를 레지스터 rt에 작성한다.

<br />

### (C) SW Data_Path

<img src="https://images.velog.io/images/thdalstn6352/post/8a6dd247-1436-4a70-b715-61fa4abea52e/image.png"/>

**(1) Instruction Fetch(IF)** : PC에 있는 명령어(instruction)을 가져온다.

**(2) Instruction decode and register operand fetch (ID/RF)** : 명령어를 해석하고 rs레지스터 값을 읽고 16비트의 imm을 32비트로 바꾸어주는 SignExtimm연산을 수행한다.

**(3) Execute/Evaluate memory address (EX/AG)** :　 rs와 Extimm을 이용하여 덧셈 연산을 수행한다.

**(4) Memory operand fetch (MEM)** : 연산 결과를 메모리의 주소로 가져와 해당하는 메모리에 rt의 값을 작성한다.

**(5) Store/writeback result (WB)** : 결과를 레지스터에 저장하지 않는다.

<br />

### (D) Branch Data_Path

<img src="https://images.velog.io/images/thdalstn6352/post/e14df0ce-64dc-4c9e-8c60-3dd09e0fcf27/image.png" />

(1) Instruction Fetch(IF) : PC에 있는 명령어(instruction)을 가져온다.

(2) Instruction decode and register operand fetch (ID/RF) : 명령어를 해석하고 rs와 rt의 레지스터 값을 읽는다.

(3) Execute/Evaluate memory address (EX/AG) :　 rs의 값과 rt의 값을 비교하여 beq와 bne의 조건에 만족할 경우 pc값에 4를 더하고 BranchAddress를 더한다.

(4) Memory operand fetch (MEM) : 메모리에 접근하지 않는다.

(5) Store/writeback result (WB) : 결과를 레지스터에 저장하지 않는다.

<br/>

### (E) Jump Data_Path

<img src ="https://images.velog.io/images/thdalstn6352/post/7bde4bc7-b1f3-4304-a437-ebd847b616e9/image.png"  />

(1) Instruction Fetch(IF) : PC에 있는 명령어(instruction)을 가져온다.

(2) Instruction decode and register operand fetch (ID/RF) : 명령어를 해석하여 Jump target address을 읽어 pc를 바꾸어준다.

(3) Execute/Evaluate memory address (EX/AG) : 연산을 하지 않는다.

(4) Memory operand fetch (MEM) : 메모리에 접근하지 않는다.

(5) Store/writeback result (WB) : 결과를 레지스터에 저장하지 않는다.

<hr />

코드 참조 : https://github.com/thdalstn6352/Computer_Architecture/tree/master/Computer_Architecture/single_cycle
