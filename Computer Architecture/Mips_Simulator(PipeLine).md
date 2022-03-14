# 1. Project Introduction

이번 프로젝트에서는 이전에 구현한 Single Cycle 방식의 MIPS 시뮬레이터를 향상 시킬 것이다. 기존의 Single cycle은 1 cycle에 1 instruction을 끝내기 위한 과정으로 순차적인 실행 방식을 취해 결과적으로 모든 instruction의 수행 시간은 수행시간이 가장 긴 instruction에 맞춰 똑같이 정렬된다. 하지만 Pipeline의 경우 IF, ID, EX, MEM, WB다섯 단계로 이루어져 있는 multi cycle의 구조를 띄고 있어 하나의 instruction이 완료되기 까지 5사이클이 요구 되어 하나의 instruction이 명령을 수행하는 중간에 다음 instruction은 쉬고 있는 것이 아닌 앞선 명령어가 하나의 단계를 마치고 다음 단계로 넘어갈 때, 해당 단계를 수행하도록 하는 것이 pipeline의 구조라고 말 할 수 있다. 즉, 아래 그림과 같이 여러 Instruction이 동시에 처리시켜 전체 instruction이 처리되는 속도를 높이는 것이 pipeline의 목적임을 알 수 있다.

<img src="https://images.velog.io/images/thdalstn6352/post/efd98533-3e38-4ad0-8f96-eb52e5271892/image.png" />

이때, 각 단계는 특정 명령을 수행하게 된다. IF단계에서는 pc를 증가시키며 올바른 instruction을 추출하며, ID단계에서는 IF단계에서 추출한 명령어를 decode하고 레지스터 값을 읽어오며, EX단계에서는 ALU에 의해 특정 연산을 수행하며 MEM단계에서는 메모리에 접근하여 필요한 경우 메모리에 저장, 값을 읽어오는 명령을 수행한다. 마지막으로 WB단계에서도 필요한 경우 레지스터에 값을 저장시키는 명령을 수행한다.

결과적으로, 우리는 시뮬레이터를 구현하여 한 번에 처리할 수 있는 instruction의 수를 늘려 instruction들을 동시에 실행시킴으로써 하드웨어 활용도를 극대화시킬 수 있다.

# 2. Project Goals

이번 프로젝트에서도 다음 기능들이 가능하도록 Architecture를 구축하는 것을 목표로 한다.

⦁ Arithmetic: add, sub, addi, slt ..

⦁ Memory references: lw, sw ..

⦁ Branches: jump, beq ..

또한, pipeline으로 구현하는 경우 발생하는 hazard에 대해 알아보며 이를 해결 하는 방법에 대해 자세히 알아보고 이를 토대로 구현하는 것을 목표로 한다. 뿐만 아니라, branch prediction이라는 분기예측을 통해 기존의 pipeline보다도 더욱 clock cycle을 줄일 수 있는 방법에 대해 고안하여 구현하는 것도 이번 프로젝트의 목표이다.

# 3. Concepts used in CPU simulation

## A. Pipeline Hazard

Pipeline을 하는 이유는 multi cycle을 기반으로 instruction들이 동시에 명령을 수행하도록 하여 전체적으로 single cycle보다 처리 시간을 줄이고자 하는 것이 목적이다. 하지만 모든 기술 구현에는 trade-off가 존재하듯, Pipeline을 구현하는데 있어서도 처리시간을 줄이는 장점을 가져올 수 있긴 하지만 이에 따른 문제가 발생한다. 이를 Hazard라고 한다.

hazard란 다음 Instruction이 다음 clock cycle에서 정상적으로 수행되지 못하는 것을 나타낸다. 보통 Instruction과 Cycle간의 비율을 CPI( Cycle Per Instruction)이라고 하고, 이상적인 Pipeline은 바로 한 개의 Instruction이 처리되는데 걸리는 Cycle이 1인 구조를 취한다. 하지만 위와 같이 hazard가 발생해버리면 CPI가 1보다 높아지는 경우가 발생할 수도 있는 것이고, 심각한 경우에는 원치 않는 답까지 얻게 될 수도 있는 것이다.

hazard의 종류에는 크게 3가지가 있다.

⦁ Structural Hazarden

⦁ Data Hazard

⦁ Control Hazard

◎ Structural Hazard는 말 그대로 pipeline 구조로 인한 문제이다.

◎ Data Hazard는 Data에 대한 Read/Write Sequence가 엇갈리면서 발생하는 문제이다. 즉, 현재 instruction의 결과가 이전 instruction들의 결과에 dependent 하기 때문에 발생하는 문제인 것이다. 이에 따른 경우 3가지를 들 수 있다.

① Read After Write(RAW) ② Write After Write(WAW) ③ Write After Read(WAR)

<img src="https://images.velog.io/images/thdalstn6352/post/652d9ec8-eafb-4e00-aef0-09c3f424a066/image.png" />

따라서 위 3가지의 문제가 발생할 경우 일종의 결과가 지나갈 길을 만들자는 뜻에서 Forwarding (bypassing)을 사용하여 올바른 값을 넘겨주어 문제를 해결 할 수 있다.

◎ Control Hazard는 보통 Fetch단계에서 pc의 값에 4를 더해주어 다음 instruction이 오게 하지만 예외적으로 Jump나 Branch instruction이 들어올 경우 다음 instruction의 pc값은 이전 instruction의 pc값에 4를 더해준 값이 아닌 다른 pc의 값으로 들어가게 된다. 하지만 각 단계의 역할에 따라 빠르면 Decode 늦으면 Execution 단계에서 다음 pc의 값을 알 수 있게 된다. 따라서 Fetch 단계로 instruction이 잘못 들어와 최종 연산에 문제가 생기는 현상을 Control Hazard라 한다. 따라서 이를 해결하기 위해 잘못 들어온 instruction을 없애주는 stall을 사용하여 문제를 해결할 수 있다. 하지만 계속해서 stall을 사용하여 control hazard를 해결할 경우 많은 cycle낭비가 될 수 있다.

따라서 branch prediction이라는 분기예측을 통해 조금의 cycle낭비를 줄이는 것이다.

## B. Branch prediction

Branch prediction이란 다음 실행될 조건문이 어떤 곳으로 분기할 것인지를 확실히 알게 되기 전에 미리 추측하는 CPU 기술이다. 만약 파이프라인이 조건 값의 계산이 끝날 때까지 대기한다면, 이전 명령어가 전체 파이프라인을 통과할 때까지 다음 명령어는 파이프라인에서 수행되지 못하고 대기하게 될 것이다. Branch prediction은 이런 낭비를 막기 위해 단순한 알고리즘에 따라 다음 명령을 미리 추론한 후 미리 실행시킨다. 만약 분기 예측기의 예측이 맞으면 파이프라인은 낭비 없이 계속 수행되며, 예측이 틀릴 경우 미리 실행되던 명령이 stall되고 올바른 명령이 다시 실행된다.

그런데 사실 이 예측에도 한계가 존재한다. pipeline의 특성상 multi cycle형식으로 구성되어 있어서 여러 instruction을 동시에 실행시키게끔 되어 있다. 하지만 앞에서 예측이 잘못되었을 때에는 stall을 사용하여 해결하면 된다고 언급하였지만 instruction의 수가 커지게 되면 이런 penalty로 인한 손실이 굉장히 커질 것이다. 따라서 여기서 고민하는 것은 instruction을 늘리면서도 어떻게 하면 penalty로 인한 손실을 줄일 수 있느냐는 것이다. 지금 발생하는 mispredict를 빠르게 판단하고 그에 맞는 대처 방안을 줄 수 있으면 그만큼 penalty를 줄일 수 있지 않는가 하는 접근 방식은 다음과 같다.

| Compile time (static)                     | Run time (dynamic)                      |
| ----------------------------------------- | --------------------------------------- |
| Always not taken                          | Last time prediction (single-bit)       |
| Always taken                              | Two-bit counter based prediction        |
| BTFN (Backward taken, forward not taken)  | Two-level prediction (global vs. local) |
| Profile based (likely direction)          | Hybrid                                  |
| Program analysis based (likely direction) |

Branch Prediction의 static prediction 수행방식은 Always-Not-Taken이나 Always-Taken을 수행하되, 만약 mispredict가 일어나면 해당 instruction을 flush 시키고 다시 retry하는 구조로 되어 있다. 하지만 Prediction의 결과물이 20개의 instruction으로 이뤄져 있는데 마지막에 Prediction이 잘못 되었다는 것이 판별되면 20개의 instruction이 모두 waste되는 비효율적인 결과를 낳는 것이다. 따라서 runtime 내에 mispredict가 일어나면 유동적으로 수행 절차를 바꿀 수 있는 방식이 Dynamic Prediction 방식이다. 그래서 보통 이걸 수행하기 위해서는 Branch Target Buffer가 구조 내에 포함된다.

먼저 static scheme중 하나인 always not-taken의 경우에는 다음과 같다

### 1. Always not-taken

단순히 들어오는 branch instruction들에 대해 모두 거짓이라 가정하고 nextPC= PC + 4로 계산하는 방법이다. 하지만 이 경우 branch가 참인 경우 모두 틀리기 때문에 정확도가 낮다.

<img src="https://images.velog.io/images/thdalstn6352/post/2eef09b4-93d3-46b5-a762-14fb49c39a2b/image.png" />

Inst(h)가 branch instruction이라 가정하면 t2때 Execution단계에서 target address가 계산된다. 따라서 t2에서 branch가 참인지 거짓인지 실제로 알게 된다. 참이라는 결과가 나올 경우 t3에서는 MEM단계 앞의 stage들을 모두 flush하고 IF단계에는 올바르게 계산된 instruction이 fetch된다.

### 2. Branch Target Buffer(BTB)

BTB는 branch가 참인 경우도 예측하기 위해 고안되었다.

<img src="https://images.velog.io/images/thdalstn6352/post/3fca44c6-47c9-4ad6-9d39-e1b2501dfffb/image.png" />

처음에 BTB history에는 아무것도 없는 상태이다. 여기서 branch instruction이 들어오는 경우 history에 아무것도 없으므로 예측이 불가능하다. 따라서 target address가 Execution 단계에서 실제로 계산된 후 BTB history에 tag(pc)와 target address가 저장된다.

branch instruction이 history에 update된 후 같은 PC의 branch instruction이 들어오면 update된 결과 값에 따라서 예측을 하게 된다. 예측이 계속 맞다가 어느 순간 틀리게 되면 틀린 경우에만 그 branch instruction에 대해 tag과 target address을 BTB history에 다시 update한다.(last state)

이때, non-branch instruction이 들어올 경우에는 항상 다음 pc는 pc+4가 저장된다.

Dynamic Prediction 방식은 다음과 같이 나타낼 수 있다.

<img src="https://images.velog.io/images/thdalstn6352/post/9eb9e677-988e-48fb-9a83-71fa07827337/image.png" />

for문이나 while문을 생각해보면 loop를 계속 돌다가 어느 순간 탈출하게 된다. 계속 도는 경우에는 조건문의 방향이 정해지게 된다. 따라서 이전 branch의 결과를 저장하는 table을 작성하여 방향성을 알 수 있다.

### 3. Gshare branch predictor

Gshare란 BTB에서 BHSR(Branch Histroy Shift Register)를 추가한 version이다. branch들의 taken(1), not-taken(0)들을 BHSR에 기록한다. Shift register이기 때문에 이전 결과 값들이 왼쪽으로 한 칸씩 밀려 저장된다.

이때, taken과 not-taken의 패턴을 저장해주는 pattern table을 추가로 만들어 저장을 해주어 구현할 수 있다. 위 그림과 같이 Global branch history와 pc를 xor을 취해 해당 값을 pattern table의 index역할을 해주어 패턴을 뽑아내며, BTB에 현재의 Branch가 들어있는지를 판단하여 target address를 정한다. 최종적으로 taken하며 BTB에 target address가 들어 있을 경우 pc의 값을 target address로 바꿔주어 분기예측을 실행한다.

코드 참조: https://github.com/thdalstn6352/Computer_Architecture/tree/master/Computer_Architecture/pipeline
