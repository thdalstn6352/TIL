# 1. Project Introduction

<img src="https://images.velog.io/images/thdalstn6352/post/4f45d2a5-75d6-410f-80a6-12118a0f1c3c/image.png" />

프로세스는 실행하며 CPU burst와 I/O burst의 사이클을 가지게 된다. 다른 표현으로는 CPU execution과 I/O waiting의 사이클을 가진다고도 한다. (CPU burst : CPU 할당 받아서 실제 처리되는 부분, I/O burst : I/O 작업 처리하는 시간)

위 사진처럼 모든 프로세스는 CPU burst로 시작하고, 그 뒤에는 I/O burst, 그 뒤에 다시 CPU burst의 순환을 갖고, 가장 마지막에 다시 CPU burst로 끝이 나게 된다.

만약 A 프로세스의 I/O 작업을 기다리는 상황에(wait for I/O) 다른 프로세스를 실행시키지 못한다면 분명 굉장한 시간 낭비가 될 것이다. 이처럼 어떤 프로세스의 I/O 작업을 기다리는 상황에서 다른 프로세스에게 올바른 기준에 의해 CPU를 할당하는 것이 CPU 스케줄링이다.

# 2. Project Goals

<img src="https://images.velog.io/images/thdalstn6352/post/66094e0b-fe47-41a4-b7ea-4068822d1b9c/image.png" />

이번 프로젝트는 Ready Queue에 있는 프로세스들 중 어떤 프로세스를 어떤 기준에 의해 CPU를 할당해야 하는지를 결정하는 것이다. 스케줄링이 필요한 이유는 CPU 이용율(CPU Utilization)을 최대화하기 위해서 이다. 만약 하나의 프로세스가 CPU를 점유하여 실행하다가

특정 I/O처리를 기다려야 한다면, 나머지 프로세스는 Ready Queue에 머무르게 되고 I/O처리를 하는 시간(I/O Burst)동안 CPU는 쉬게 될 것이다. 이는 CPU 이용률을 떨어뜨리게 된다. 따라서 적절한 스케줄링 방법을 사용하여 CPU Burst Time을 최대로 하는 것이 스케줄링의 목적이며 이번 프로젝트의 목적이다. 또한, 각종 스케줄링 정책을 활용하여 CPU burst와 I/O burst에 따른 성능 비교를 통해 프로세스 상태에 따른 효율적인 스케줄링 정책을 찾는 것 또한 목표로 한다.

# 3. Concepts used in CPU simulation

## 1) 스케줄링이란?

<img src="https://images.velog.io/images/thdalstn6352/post/4a1c30c0-2ebc-4ed7-b417-0c167c834b95/image.png" />

스케줄링이란 현재 실행 중인 프로세스로부터 다른 프로세스로 CPU를 넘겨주어야 할 때, 기다리고 있는 여러 프로세스 중에 OS가 누구를 선택해야 할지에 대한 방식이나 기준을 설정하는 것이다. 따라서 한정된 자원으로 최대한의 성능을 이끌어내기 위해서는 CPU를 적절하고 효율적으로 사용해야 한다. 따라서 OS는 실행 대기 중인 프로세스들에게 자원 배정을 적절히 하여 시스템의 성능을 끌어올리는 역할을 한다.

스케줄링은 다음과 같은 때에 일어난다.

⦁ Running → Waiting 상태 : ( ex. I/O 요청, 자식프로세스 종료 - wait() 요청을 통해 종료)
⦁ Running → Terminate 상태 : ( ex. 부모프로세스의 종료 )
⦁ Running → Ready 상태 : ( ex. 인터럽트 발생 )
⦁ Waiting → Ready 상태 : ( ex. I/O 완료 )

### 1-1) 스케줄링 단계

<img src ="https://images.velog.io/images/thdalstn6352/post/4550f7b1-60c0-4476-b5a5-3b11d85fe2de/image.png" />

▷ 장기 스케줄링

어느 작업을 커널에 등록시켜 프로세스로 만들어 줄 것 인가를 결정하는 단계로서 시분할 스케줄링의 경우 사용자의 접속 시도를 허용할지 말지 결정하는 것을 예로 들 수 있다. 장기 스케줄러의 경우 수행 횟수가 적으며, 대부분 FIFO(First in First out)형태로 사용하게 된다.

▷ 중기 스케줄링

보류 상태의 프로세스들 중에서 어느 프로세스에게 메모리를 할당해 줄 것인가를 결정한다. 어떤 프로세스를 다시 Swap in을 할 것인가를 결정하는 것으로 장기와 단기 사이의 중간단계에 속한다.

▷ 단기 스케줄링

준비상태에 있는 프로세스들 중에서 어느 프로세스에게 CPU를 할당할지를 결정하는 단계로서, 프로세스 스케줄러 또는 디스패처에 의해 수행된다.

인터럽트가 발생 혹은 실행 중인 프로세스에 의해 System Call이 발생하는 경우 수행되는 단계이다.

### 1-2) 스케줄링 정책

<img src ="https://images.velog.io/images/thdalstn6352/post/f9d69cd5-1492-4706-85f2-8cb73c82ffcf/image.png" />

멀티 프로세스 운영체제에서 하나의 CPU가 여러 프로세스를 실행하기 위해선 스케줄링 정책이 중요하다.

● Non-Preemptive Scheduling(비 선점 스케줄링) ( ex) FIFO, SJF, HRN )
비 선점형 OS는 현재 실행 중인 프로세스보다 높은 우선순위를 가지는 프로세스가 실행된다고 해서 실행 대상을 바로 변경하지 않는다.
새로 실행된 높은 우선순위의 프로세스가 실행되기 위해서는 현재 실행 중인 프로세스가 명시적으로 CPU를 양보할 때까지, 혹은 I/O 작업 등으로 block 상태가 될 때까지 기다려야만 한다.

● Preemptive Scheduling(선점 스케줄링) ( ex) RR, SRT, MFQ )
선점형 OS는 실행 중인 프로세스보다 높은 우선순위의 프로세스가 실행되면, 스케줄러에 의해 실행 순서가 적극 조정되는 OS를 뜻한다.
또한, 비 선점형 OS에 비해 훨씬 더 스케줄링이 복잡하게 처리가 되어 있는데, 우선순위가 같은 프로세스들 간 실행 배분에도 관여하기 때문이다.

● Priority Scheduling(우선순위 스케줄링)

각각의 프로세스마다 우선순위를 부여해서 우선순위가 높은 프로세스를 먼저 실행시키는 알고리즘이다.

### 1-3) 스케줄링 기법

#### 1. FIFO(First In First Out)

<img src="https://images.velog.io/images/thdalstn6352/post/97540d91-0edd-447c-822d-55f30d3499e4/image.png" />

FIFO 스케줄링은 프로세스들이 대기 큐에 도착한 순서에 따라 CPU를 할당받는 방식이다. FIFO 방식은 하나의 프로세스가 CPU를 할당받게 되면 프로세스가 모두 완료될 때까지 CPU를 점유하게 된다. 따라서 다른 스케줄링 방식에 비해 작업 완료 시간을 예측하기가 쉽다. 하지만 선점이 불가능하기 때문에 수행시간이 긴 프로세스가 할당받은 상태라면 수행시간이 짧은 프로그램이 오랜 시간 대기할 경우가 생기고 중요한 작업이 대기 하는 상황이 발생할 수 있다.

#### 2. SRT (Shortest Remaining Time)

<img src="https://images.velog.io/images/thdalstn6352/post/f8817bd5-5a93-4495-ad3a-0d57f19e8705/image.png" />

SRT 방식은 대기 큐에서 기다리는 작업 중 수행시간이 가장 짧다고 판단되는 것을 가장 먼저 수행하는 스케줄링 방법이다. FIFO방식 보다 평균대기 시간을 감소시키지만 큰 작업일수록 FIFO에 비해 예측이 어렵다. 긴 작업보다 짧은 작업 일 수록 오버헤드 면에서 볼 때 유리하다. 하지만 이 방법은 수행할 작업이 얼마나 긴지를 정확히 판단해서 수행해야 하는데 수행시간을 정확히 얻는 것이 어렵다.

#### 3. HRN(Highest Responce ratio Next)

<img src="https://images.velog.io/images/thdalstn6352/post/18ed1f11-b010-4bee-9d16-1ec8ad04b313/image.png" />

대기 시간과 실행 시간을 적절하게 혼합하여 어느 작업에 CPU를 먼저 할당할지 결정하는 방법 (HRN 값 = (대기 시간 + 실행 시간) / 실행 시간)

#### 4. Round-Robin (순환 처리)

<img src="https://images.velog.io/images/thdalstn6352/post/c2840e6e-7b47-40c0-885e-e0e5ee496a91/image.png" />

라운드 로빈 스케줄링은 FIFO 방식으로 각 프로세스는 같은 크기의 타임 퀀텀을 할당받는다.
만약 프로세스가 할당받은 시간 동안 작업을 완료하지 못하면 다음 프로세스로 넘어가고 실행 중이던 프로세스는 준비 완료 리스트의 가장 뒤로 보내진다.

#### 5. Multi-level-Queue (다단계 큐)

<img src="https://images.velog.io/images/thdalstn6352/post/7da08efe-4a8a-4b9b-ba68-f6e1edd0b8c5/image.png"/>

Multi Level Queue는 대기 큐가 여러 개 존재한다. 이때, 프로세스는 생성될 때 정해지는 우선순위에 따라 해당 우선순위에 해당하는 대기 큐에 등록된다. 각 큐는 별도의 스케줄링 알고리즘을 가지고 있으며 큐 사이에도 스케줄링이 존재한다. 즉, 각 큐는 절대적인 우선순위를 가진다. 우선순위가 높은 큐에 존재하는 프로세스부터 실행되며 상위 우선순위 큐가 비어야만 다음 우선순위의 대기 큐를 실행할 수 있다. 작업은 한 큐에서 다른 큐로 옮겨지지 않기 때문에 스케줄링 부담이 적지만 융통성이 떨어진다.

우선순위가 낮은 프로세스가 오랫동안 CPU 할당을 기다리는 기아현상이 발생할 수도 있다.

#### 6. Multi-level Feedback Queue (다단계 피드백 큐)

<img src="https://images.velog.io/images/thdalstn6352/post/8c970544-e01d-48bc-a2aa-7b12f33879e1/image.png"/>

Multi-level-Queue의 공평성 문제를 완화하기 위해 나온 알고리즘이다. 이 알고리즘에서는 우선순위가 변동되기 때문에 큐 사이의 이동이 가능하다. 즉, 여러 개의 ready queue를 사용하여 각 queue마다 priority(우선순위) 와 time quantum을 다르게 할당하고 프로세스가 들어오면 가장 상위 queue에 넣었다가, 해당 queue의 time quantum이 지나도 프로세스가 종료되지 않았다면 하위의 queue로 끌어내리는 스케줄링 방식이다. 일정 시간동안 수행되지 못하고 남아있는 프로세스(기아상태)는 다시 상위 큐로 끌어올려주는 에이징 기법을 사용하여 상위 큐로 끌어올리기도 한다.

### 1-4) 스케줄링의 목적

⦁ **No starvation** : 각각의 프로세스들이 오랜 시간동안 CPU를 할당받지 못하는 상황이 없도록 한다.

⦁ **Fairness** : 각각의 프로세스에 공평하게 CPU를 할당해준다.

⦁ **Balance** : Keeping all parts of the system busy

⦁ **Batch System** : 일에 대한 요청이 발생했을 때, 즉각적으로 처리하는 것이 아닌 일정기간 또는 일정량을 모아뒀다가 한 번에 처리하는 방식

⦁ **Throughput** : 시간당 최대의 작업량을 낸다.

⦁ **Turnaround time** : 프로세스의 생성부터 소멸까지의 시간을 최소화한다.

⦁ **CPU utilization** : CPU가 쉬는 시간이 없도록 한다.

⦁ **Interactive System** : 일에 대한 요청에 대해 즉각적으로 처리하여 응답을 받을 수 있는 시스템

⦁ **Response time** : 즉각적으로 처리해야하는 시스템이므로 요청에 대해 응답시간을 줄이는 게 중요하다.

⦁ **Time Sharing System** : 각 프로세스에 CPU에 대한 일정시간을 할당하여 주어진 시간동안 프로그램을 수행할 수 있게 하는 시스템

⦁ **Meeting deadlines** : 데이터의 손실을 피하며, 끝내야하는 시간 안에 도달해야한다.

⦁ **Predictability** : 멀티미디어 시스템에서의 품질이 저하되는 부분을 방지해야한다.

## 2) IPC(Inter Process Communication)

<img src="https://images.velog.io/images/thdalstn6352/post/0d4edbf0-d895-4243-b99b-7500ff2ec3b1/image.png" />

위 그림처럼 Process는 완전히 독립된 실행객체이다. 서로 독립되어 있다는 것은 다른 프로세스의 영향을 받지 않는다는 장점이 있다. 하지만 독립되어 있는 만큼 별도의 설비가 없이는 서로 간에 통신이 어렵다는 문제가 생긴다. 이를 위해서 커널 영역에서 IPC라는 내부 프로세스 간 통신(nter Process Communication)을 제공하게 되고, 프로세스는 커널이 제공하는 IPC설비를 이용해서 프로세스 간 통신을 할 수 있게 된다.

### 2-1) IPC의 종류

#### ① PIPE

<img src="https://images.velog.io/images/thdalstn6352/post/9557af09-28ab-45bf-9ef8-83f7e3e94b53/image.png" />
PIPE는 두 개의 프로세스만을 연결하게 되고, 하나의 프로세스는 데이터를 쓰기만, 다른 하나는 데이터를 읽기만 할 수 있다. 한쪽 방향으로만 통신이 가능한 파이프의 특징 때문에 Half-Duplex(반이중) 통신이라고 부르기도 한다.

PIPE와 같은 반이중 통신의 경우 하나의 통신선로는 읽기나 쓰기 중 하나만 가능하므로 읽기와 쓰기, 즉 양방향 송/수신을 원한다면 두개의 파이프를 만들어야만 가능해진다.

이때, PIPE는 매우 간단하게 사용할 수 있다는 장점이 있다. 만약 한쪽 프로세스가 단지 읽기만 하고 다른 쪽 프로세스는 단지 쓰기만 하는 데이터 흐름을 가진다면 PIPE를 사용하는 것이 편하다. 하지만 단점으로는 반이중 통신이라는 점으로 프로세스가 읽기와 쓰기 통신 모두를 해야 한다면 PIPE를 두개 만들어야 하는데, 구현이 꽤나 복잡해 질 수 있다. 만약 전이중 통신을 고려해야 될 상황이라면 PIPE는 좋은 선택이 아니라고 보여 진다.

#### ② Named PIPE(FIFO)

<img src="https://images.velog.io/images/thdalstn6352/post/f69e1e3e-6081-4e85-bb01-b99bafeeae3e/image.png" />

명명 파이프(Named Pipe)는 통신을 할 프로세스를 명확하게 알 수 있는 경우 사용한다. 예를 들어 자식과 부모 프로세스 간 통신의 경우에 사용될 수 있다. 또한, Named PIPE는 ①의 PIPE 단점 중 하나인 같은 PPID(같은 부모 프로세스)를 가지는 프로세스들 사이에서만 통신이 가능한 점을 보안한 PIPE의 확장이라고 할 수 있다. Named PIPE는 부모 프로세스와 무관하게 전혀 다른 모든 프로세스들 사이에서 통신이 가능한데 그 이유는 프로세스 통신을 위해 이름이 있는 파일을 사용하기 때문이다. Named PIPE의 생성은 mkfifo를 통해 이뤄지며, mkfifo가 성공하면 명명된 파일이 생성된다.

단점으로는, Named PIPE도 PIPE의 또 다른 단점인 읽기/쓰기가 동시에 가능하지 않으며, read-only, write-only만 가능합니다. 하지만 통신선로가 파일로 존재하므로 하나를 읽기 전용으로 열고 다른 하나를 쓰기전용으로 영어서 이러한 read/write문제를 해결 할 수 있습니다. 호스트 영역의 서버 클라이언트 간에 전이중 통신을 위해서는 결국 PIPE와 같이 두개의 FIFO파일이 필요하게 됩니다.

#### ③ Message Queue

<img src ="https://images.velog.io/images/thdalstn6352/post/87d31833-b651-4813-8e12-21c220f8458d/image.png" />

Queue는 선입선출의 자료구조를 가지는 통신설비로 커널에서 관리한다. 입출력 방식으로 보면 Named PIPE와 동일하다고 볼 수 있다. 하지만 Name PIPE가 데이터의 흐름이라면 메시지 큐는 메모리 공간이라는 점이 다르다. 파이프가 아닌, 어디에서나 물건을 꺼낼 수 있는 컨테이너 벨트라고 생각해도 좋다.

메시지 큐의 장점은 컨테이너 벨트가 가지는 장점을 그대로 가지게 된다. 컨테이너 벨트에 올라올 물건에 라벨을 붙이면 동시에 다양한 물건을 다룰 수 있는 것과 같이, 메시지 큐에 쓸 데이터에 번호를 붙임으로써 여러 개의 프로세스가 동시에 데이터를 쉽게 다룰 수 있다.

#### ④ Shared Memory(공유 메모리)

<img src="https://images.velog.io/images/thdalstn6352/post/1d6b6497-78f3-4f5e-abe2-5e2db5751f89/image.png" />

데이터를 공유하는 방법에는 크게 두 가지가 있다. 하나는 통신을 이용해서 데이터를 주고받는 것이고 다른 하나는 데이터를 아예 공유, 즉 함께 사용하는 것이다. PIPE, Named PIPE, Message Queue가 통신을 이용한 설비라면, Shared Memory는 공유메모리가 데이터 자체를 공유하도록 지원하는 설비이다.

프로세스는 자신만의 메모리 영역을 가지고 있다. 이 메모리 영역은 다른 프로세스가 접근해서 함부로 데이터를 읽거나 쓰지 못하도록 커널에 의해서 보호가 되는데, 만약 다른 프로세스의 메모리 영역을 침범하려고 하면 커널은 침범 프로세스에 SIGSEGV 시그널을 보내 보호한다.

다수의 프로세스가 동시에 작동하는 Linux 운영체제의 특성상 프로세스의 메모리 영역은 반드시 보호되어져야 한다. 하지만 메모리 영역에 있는 데이터를 다른 프로세스들도 사용할 수 있도록 해야 하는 경우도 발생할 수 있다. PIPE와 Message Queue등을 이용해서 데이터 통신을 이용하여 데이터를 전달하는 방법도 있지만, Thread에서처럼 메모리 영역을 공유한다면 더 편하게 데이터를 함께 사용할 수 있다.

따라서 Shared Memory는 프로세스 간에 메모리 영역을 공유하여 사용할 수 있도록 한다. 프로세스가 공유 메모리 할당을 커널에 요청하게 되면 커널은 해당 프로세스에 메모리 공간을 할당해주게 되고, 이후 어떤 프로세스이던 간에 해당 메모리영역에 접근할 수 있다. 공유메모리는 중개자가 없이 곧바로 메모리에 접근할 수 있기 때문에 다른 모든 IPC들 중에서 가장 빠르게 작동할 수 있다는 장점도 가지고 있다.

#### ⑤ Memory Map

<img src="https://images.velog.io/images/thdalstn6352/post/bb861ce2-dad8-40f1-aac4-10b031d1c8ea/image.png" />

Memory Map도 Shared Memory와 마찬가지로 메모리를 공유한다는 측면에 있어서는 비슷한 측면이 있다. 차이점으로는 Memory Map의 경우 열린 파일을 메모리에 Mapping시켜 공유한다는 점이다. 파일은 시스템의 모두 공유할 수 있는 자원이므로 서로 다른 프로세스들끼리 데이터를 공유하는데 문제가 없을 것임을 예상할 수 있다.

#### ⑥ Socket

<img src="https://images.velog.io/images/thdalstn6352/post/e473e091-e5c5-45f6-945b-d7f10a128785/image.png" />

Socket은 프로세스와 시스템의 basic한 부분으로, 프로세스 들 사이의 통신을 가능하게 한다. 소켓을 사용하기 위해서는 소켓을 생성해주고, 이름을 지정해주어야 한다. 또한 domain과 type, Protocol을 지정해 주어야 한다. 서버 부분에서는 bind, listen, accept를 해주어 소켓 연결을 위한 준비를 하고, 클라이언트 부분에서는 connect를 통해 서버에 요청하며, 연결이 수립 된 이후에는 Socket을 send함으로써 데이터를 주고받게 된다. 연결이 끝난 후에는 반드시 Socket을 close()해야 한다.

#### ⑦ Semaphore

<img src="https://images.velog.io/images/thdalstn6352/post/5015178e-264d-4459-a2c5-9ccce3a51bdc/image.png" />

Semaphore는 Named PIPE, PIPE, Message Queue와 같은 다른 IPC설비들이 대부분 프로세스 간 메시지 전송을 목적으로 하는데 반해, Semaphore는 프로세스 간 데이터를 동기화 하고 보호하는데 그 목적을 두게 된다. PIPE와 Message Queue와 같이 프로세스 간 메시지 전송을 하거나, Shared Memory를 통해서 특정 데이터를 공유하게 될 경우 공유된 자원에 여러 개의 프로세스가 동시에 접근하면 안 되며, 단지 한 번에 하나의 프로세스만 접근 가능하도록 만들어주는 것이 Semaphore이다.
