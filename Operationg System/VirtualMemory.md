# 1. Project Introduction

<img src ="https://images.velog.io/images/thdalstn6352/post/46720088-dbcb-444f-a4a3-0b2de9d6371d/image.png"/>

본 프로젝트는 실제 메모리의 크기에 비해 프로그램들의 메모리 요구량이 더욱 크기 때문에 프로그램 수행 시 모든 명령어와 데이터가 메모리에 할당될 수 없기 때문에 메모리 상황에 따라 필요한 부분만 메모리에 할당해서 수행해야 한다. 이를 가능하게 해주는 개념이 가상 메모리 (Virtual Memory)이다.

따라서 이번 프로젝트에서는 라운드로빈 스케줄링을 기반으로 하여 프로세스가 10개의 가상메모리 주소(Virtual address)를 할당받아 MMU(Memory Management Unit)을 통해 실제 메모리의 주소로 변환해서 매핑 및 데이터에 접근한다. 이때, 메인 메모리는 하드디스크의 Cache 역할을 수행하게 된다.

모든 프로그램은 프로세서에서 제공하는 최대 주소 공간만큼의 논리적 가상 메모리가 있고 프로그램이 전체 메모리를 다 사용 할 수 있다고 가정한다. (32bit 주소 => 4 GB 메모리)

# 2. Project Goals

이번 프로젝트에서는 가상메모리를 사용하는 이유에 대해 알아보고, 가상 접근 주소로부터 물리 메모리를 매핑 하는 방법에 대해 살펴보는 것을 목표로 한다.

또한, 각종 페이징 기법의 개념을 이해하고, 직접 물리 메모리 주소를 계산하고 매핑 함으로써 올바른 값을 도출하는지를 확인한다. 마지막으로 페이징 기법에 따른 전체 flow와 구조를 파악하여 Logic에 맞게 프로젝트를 구현하는 것이 본 프로젝트의 목적이다.

# 3. Concepts used in CPU simulation

## 1) 가상메모리(Virtual Memory)

### 1-1) 가상메모리란?

<img src="https://images.velog.io/images/thdalstn6352/post/a4728e60-0208-4044-917d-b8a725c862c8/image.png"/>
모든 프로세스는 자신만의 가상 주소 공간을 가진다. 32비트/64비트 프로세스는 각 비트 수에 맞게 최대 4GB/16GB의 주소 공간을 가진다. 따라서 특정 프로세스 내에서 쓰레드가 수행될 때 해당 쓰레드는 프로세스가 소유하고 있는 메모리에 대해서만 접근이 가능하다. 즉, 가상 메모리는 프로세스의 logical memory와 physical memory를 분리하기 위해 생겨난 것이라 할 수 있다. 이를 이용하여, logical memory가 physical memory보다 커지는 것을 가능하도록 할 수 있다.

### 1-2) 왜 가상메모리를 사용할까?

<img src="https://images.velog.io/images/thdalstn6352/post/2649f8eb-b002-44d5-9047-eb8df233af21/image.png"/>

### 1-3) 프로세스 가상 주소 공간의 분할

각 프로세스의 가상 주소 공간은 분할되어 있으며, 각각의 분할 공간을 파티션(partition) 이라 한다. 32비트 프로세스는 4GB의 가상 주소 공간을 가질 수 있다.

하지만, 사용자는 가상의 주소 공간 4GB를 모두 사용할 수 있는 것은 아니고, 약 2GB밖에 사용하지 못 한다.

이유는 32비트 주소 공간이 다음과 같이 분할되어 있기 때문이다.

 Null 포인터 할당 파티션 : 0x00000000 ~ 0x0000FFFF

 유저 모드 파티션 : 0x00010000 ~ 0x7FFEFFFF

 64KB 접근 금지 파티션 : 0x7FFF0000 ~ 0x7FFFFFF

 커널 모드 파티션 : 0x80000000 ~ 0xFFFFFFFF

- Null 포인터 할당 파티션
  프로그래머가 NULL 포인터 할당 연산을 수행할 경우를 대비하기 위해 준비된 영역이다. 만일 프로세스의 특정 쓰레드가 이 파티션에 대해 읽거나 쓰기를 시도하게 되면 접근 위반(access violation)이 발생한다.

- 유저모드 파티션
  프로세스의 주소 공간 내에서 유일하게 자유롭게 활용될 수 있는 파티션이다.
  0x00010000 ~ 0x7FFEFFFF의 범위이므로, 2047MB의 크기이다.

## 2) 페이지 테이블과 엔트리(Page table & Entry)

### 2-1) 페이지 테이블(Page Table)

가상 메모리를 사용하는 운영 체제에서 개별 프로세스는 자신만의 가상 주소 공간을 가지고 있다. 32비트 프로세스는 0x0000:0000에서 0xFFFF:FFFF까지 표현될 수 있기에 4GB 크기의 주소 공간을, 각 프로세스들의 가상 메모리는 물리 메모리의 각기 다른 영역에 분산되어 로드되거나, page-out 되어 disk에만 저장될 수 있다.

프로세스가 특정 메모리에 접근하기 위해서 OS는 프로세스의 가상 주소를 시스템의 물리 메모리 주소로 변환해 주어야 한다. 페이지 테이블은 가상 주소와 물리 메모리 주소의 매핑 테이블이며, 개별 매핑 데이터는 Page-Table-Entry(PTE)라 한다.

페이지 테이블은 프로세스마다 하나씩 존재하게 되며, 메인 메모리 (RAM)에 상주하게 된다. 즉, 많은 프로세스가 구동될수록, 페이지 테이블로 인한 메인 메모리 사용이 커짐을 의미한다.

### 2-2) 페이지 테이블 엔트리(Page Table Entry)

프레임 테이블은 어느 프레임이 매핑 되어 있는지에 대한 정보를 들고 있다.

페이지 테이블의 엔트리는 가상 주소의 페이지와 물리 메모리 프레임간의 매핑 정보를 들고 있다. 다음과 같은 부가 정보들을 포함한다.

 valid bit (present bit)

 access bit

 dirty bit (modified bit)

 process ID information

**① Valid bit**

Page 단위의 메모리는 페이징 파일(디스크 파일)에서 물리 메모리로 page-in 될 수 있고, 물리 메모리로부터 페이징 파일(디스크 파일)로 page-out 될 수 있다.
위 페이지 테이블의 정보 중 valid bit는 이 page가 물리 메모리에 있는지 여부를 나타내는데 사용된다.

**② Access bit**

Page replacement alogorithm에 사용되며, 해당 페이지에 대한 접근이 있었는지에 대해 기록한다.

**③ Dirty bit**

Dirty bit는 가상 메모리 관리 시스템의 성능을 향상시키는 데 중요한 역할을 수행한다. 어떤 page가 물리 메모리로 page-in 된 이후, 내용이 전혀 달라진 게 없다면 이 page가 추후 paging file로 page-out 될 때, 달라진 게 없으므로 내용을 다시 복사하지 않아도 되게 된다. 그와 반대로 page-in 된 이후 내용이 달라진 것이 있다면, page-out 될 때 반드시 해당 내용을 paging file에 써야 할 것이다. 이 과정에서 page-out 되기까지 해당 page의 내용이 변경 되었는지를 기록하는 것이 dirty bit 이다. 만약, 이 dirty bit 이 없었다면, 모든 page-out 과정에서 page data copy가 발생할 것이고, 이는 불필요한 성능 하락을 발생시킨다.

**④ Process ID information**

가상 메모리 관리 시스템은 어떤 페이지가 어느 프로세스와 연관이 있는지 알고 있어야 한다. 가상 주소는 프로세스별로 독립적이므로, 주소가 같다고 해서 같은 메모리를 가리키는 것은 아니다.
페이지 테이블은 여러 프로세스가 요청한 가상 메모리 주소에 대해 정보를 각기 저장시킬 수 있어야 한다.

### 2-3) 페이지 테이블 종류

페이지 테이블은 다음과 같은 종류가 있다.

 Inverted

 Multi-level

 Virtualized

 Nested

이 중 x86 이 사용하는 것은 Multi-level 방식이라고 한다. 만약 Single-level 즉, 하나의 page table로 4GB의 주소 공간을 표현하기 위해선 2 ^ 20개의 Page Table Entry(PTE)가 필요하다. (4GB / 4KB(1 page size) = 2 ^ 32 / 2 ^ 12 = 2 ^ 20)

2 ^ 20개면 1024 \* 1024개의 PTE 정보를 가져야 하는데, 이 때의 페이지 테이블의 크기가 너무 커져서, 2 or 3 level paging을 하게 된다.

### 2-4) 페이지 테이블 구조(Page Table Structure)

 Hierarchical paging

 Hash Page Tables

 Inverted Page Table

**① 계층적 페이징(Hierarchical paging)**

- 32비트 컴퓨터에선 페이지 테이블은 4MB정도로 크다.
- 페이지 테이블을 작은 조각으로 나눈다. 페이지 테이블 자체가 다시 페이지 화 되는 것.
  <img src ="https://images.velog.io/images/thdalstn6352/post/056943b0-8fbb-49eb-81e8-190e3ca1d34e/image.png"/>
- p1은 Outer Page Table의 Index, p2는 Inner Page Table의 변위, d는 페이지의 Offeset
  <img src ="https://images.velog.io/images/thdalstn6352/post/a6426083-0f21-47fe-8cd3-bd6d9a036371/image.png"/>
- 페이지의 접근 시간이 늘어나는 단점이 있다.

**② 해시 페이지 테이블(Hash Page Tables)**

<img src="https://images.velog.io/images/thdalstn6352/post/17bb3fa1-9739-441a-ba3c-bc033394b80b/image.png"/>
해시 테이블에 각 항목은 연결리스트를 가지고 있으며, 충돌을 일으켜서 이곳으로 해시되는 원소들이 연결된다. 각 원소는 가상 페이지번호, 사상되는 페이지 프레임 번호, 연결 리스트 상의 다음 원소 포인터를 가진다.

> 알고리즘 : 가상 주소 공간에서 페이지 번호가 오면 그것을 해싱함수에 의해 해싱 한다.
> -> 페이지 테이블에서 연결리스트를 따라가며 첫 번째 원소와 가상 페이지 번호를 비교 한다.
> -> 일치하면 그에 대응하는 페이지 프레임 번호를 가져와 물리주소를 얻고, 일치하지 않으면 다음 원소로 이동하여 반복.

**③ 역 페이지 테이블(Inverted Page Table)**

<img src="https://images.velog.io/images/thdalstn6352/post/2e9cc544-ef99-4a0d-88f5-9483db8c7aa7/image.png"/>

- 보통 프로세스 마다 각자 하나씩 페이지 테이블을 가짐 -> 프로세스 전체가 공통으로 사용하는 페이지 테이블, 가상 주소에는 프로세스ID와 페이지 주소를 가지고 있다.
- 메모리공간을 작게 사용한다.
- 주소변환 시간이 더 오래 걸린다.

## 3) 페이징과 세그먼트(Paging and Segment)

### 3-1) 페이징 (Paging)

<img src = "https://images.velog.io/images/thdalstn6352/post/98131841-b73e-48af-8498-a78f7e2fb41f/image.png" />

프로세스가 사용하는 주소 공간을 여러 개로 분할하여 비연속적인 물리 메모리 공간에 할당, 가상 메모리를 모두 같은 크기의 블록으로 나누어 메모리를 관리하는 방식.

**단위**
 프레임 : 실제 메모리 공간 (4KB)
 페이지 : 프로세스의 메모리 공간 (4KB)
 프레임 사이즈 = 페이지 사이즈

★ 페이지 테이블 내에 프레임과 페이지가 서로 매핑이 되어 있어서 페이지 테이블을 참조하여 실제 메모리에 접근하게 된다.

★ 문제 : 매번 메모리의 페이지 테이블을 먼저 읽어야 하므로 메모리 접근 시간이 두 배가 된다. => 페이지 테이블의 캐시 사용

### 3-2) 세그먼테이션 (Segmentation)

<img src="https://images.velog.io/images/thdalstn6352/post/d92a16fc-746b-4280-bfc2-87b2b574131d/image.png"/>

프로세스가 필요로 하는 메모리 공간을 분할하여 비연속적인 물리 메모리 공간에 할당하는 방식. 즉, 각 영역들의 기능, 권한, 필요한 공간의 크기가 모두 다르기에 세그먼테이션 기술로 각각 다른 크기로 분할하여 효율적인 메모리 관리가 가능하도록 한 것이다.

 단위 : 세그먼트(서로 다른 크기)

 페이징과의 차이
논리적 의미에 부합하도록 세그먼트들의 크기가 서로 다름.
크기가 다 다르기 때문에 메모리를 페이징 기법에서처럼 미리 분할해 둘 수 없고, 메모리에 적재될 때 빈 공간을 찾아 할당.

 논리 주소 공간을 세그먼트 집합으로 정의.

 세그먼트 테이블

사용자가 정의한 주소를 실제 주소로 맵핑하는 정보를 저장.
개별 세그먼트는 항목별로 Base(세그먼트 시작 주소) + Limit(세그먼트 길이)의 정보를 갖는다.

### 3-3) 요구 페이징 (Demand Paging)

<img src="https://images.velog.io/images/thdalstn6352/post/7abc9a71-b2f9-4807-a6e2-47389ca5d276/image.png"/>

-> Demanding-page는 실제로 필요한 page만 물리 메모리로 가져오는 방식을 말한다. 필요 page에 접근하기 위해선 가상 메모리 주소에 대응하는 물리 메모리 주소를 찾아내야 한다. 이 때 필요한 것이 페이지 테이블(page table)이다.
페이지 테이블에 valid bit를 두고, 해당 page가 물리 메모리에 있으면 1, 그렇지 않으면 0로 설정한다.
ex) Page fault의 경우

1. 페이징 하드웨어는 page table entry의 valid bit를 보고 invalid인 것을 확인한 후 OS에게 trap으로 알린다.
2. OS는 정말로 메모리에 없는 것인지 아니면 잘못된 접근인지 확인한 후 잘못된 접근이었으면 종료시킨다.
3. Empty frame (free page)을 얻는다.
4. Page를 frame으로 swap한다.
5. 프로세스의 page table과 TLB를 page-in/page-out 된 것을 토대로 재설정한다.
6. Page fault를 야기했던 인스트럭션부터 다시 수행한다.

=> 3) 과정에서 empty frame(free page)을 얻어 와야 하는 상황에서 물리 메모리가 모두 사용 중이라면, 사용 중인 frame 중 하나를 선택해서 page-out (disk로 이동) 시키고, 그 frame을 사용해야 한다.
이처럼 victim frame을 선택하는 과정에서 Page Replacement Algorithm을 사용한다.

### 3-4) 페이지 교체 정책 (Page Replacement Algorithm)

<img src="https://images.velog.io/images/thdalstn6352/post/6aebe439-d559-4a7b-a841-8c50cf8f046a/image.png"/>

메모리 공간이 부족하면 특정 페이지를 스왑 하여 교체한다.

**※교체 알고리즘**

**◎ FIFO (First-In-First-Out)**

- 메모리에 적재된 시간이 가장 오래된 페이지를 교체 (프레임 개수가 많아지면 페이지 부재 율이 높아지는 현상, Belady의 모순이 된다.)

**◎ Optimal Page Replace**

- 앞으로 가장 오래 사용되지 않을 페이지를 교체, 들어온 데이터를 쭉 읽어서 앞으로 사용하지 않을 걸 교체
- 다른 모든 알고리즘보다 페이지 부재 율이 낮으면서 Belady의 모순이 발생하지 않는 페이지 교체 알고리즘
- 실제 구현이 불가능하다 : 미래의 페이지 참조를 미리 알아야 함.
- 제안된 알고리즘의 성능을 비교하기 위한 목적으로 사용

**◎ LRU (Least-Recent-Used)**

- 가장 오랫동안 사용되지 않은 페이지를 교체.
- 최적 페이지 교체 알고리즘에 근사하는 방법, 과거 참조를 기반으로 미래 참조 형태의 근사치를 결정
- 거의 최적 알고리즘에 가까움
- linked-list로 관리
- 고려사항
  - 하드웨어의 지원이 필요 : 모든 메모리 참조에 대해 참조 정보를 갱신
  - 페이지들을 최근에 사용한 시간 순서대로 나열할 수 있어야 함

**◎ LFU (Least-Frequently-Used)**

- 참조 횟수가 가장 적은 페이지를 교체
- 참조 횟수가 적은건 앞으로도 안쓸것이다.
- 참조 빈도와 참조 시간은 정확히 일치하지 않습니다.

**◎ MFU (Most-Frequently-Used)**

- 참조 횟수가 가장 많은 페이지를 교체
- 최근에 참조가 된 페이지는 앞으로 덜 쓸것이다.
- 참조 횟수가 적은 페이지는 최근에 적재되었고 앞으로 참조될 가능성이 높을 것이라는 직관에 의존

※ 자세히 설명하자면 Demand Paging을 가능하게 하는 것은 Locality의 개념이다.

Temporal Locality는 시간적 지역성이라 하며 최근에 접근된 것이 다시 접근되는 것을 말하며, Spatial Locality는 공간적 지역성이며 최근에 접근된 것에 가까운 것이 접근되는 것을 말한다. 따라서 Locality에 의하면 접근되었던 것은 접근될 가능성이 크므로 메모리에 남아있게 되고 그것이 Demand paging의 근본이 된다.

위의 3-3)에서 Page Fault 처리 과정에서 empty frame(free page)을 얻는다고 되어 있다.
물론 empty frame이 있으면 그냥 얻으면 되겠지만 멀티프로세싱 환경에서 실행하다 보면 메모리가 꽉 차있을 경우가 있을 것이다.
이 경우에 앞서 말했듯 어떠한 기준에 의해 페이지 하나를 swap out하고 그 프레임을 할당할 것인지를 정하는 것이 Paging Replacement Algorithm이다.

첫째로 FIFO(First in First out)알고리즘은 가장 오래된 페이지를 없애는 기법으로 공평하기는 하지만 locality가 적용되지 않은 방법이므로 비효율적이다.

다음으로 Optimal 알고리즘이다. 가장 오랫동안 사용되지 않을 것을 victim으로 선정하는 것이 당연히도 가장 합리적이며 효율적이다. 하지만 가장 오랫동안 사용되지 않을 것을 정하는 것은 불가능하므로 이론적인 알고리즘이라 볼 수 있다.

그래서 Optimal 알고리즘과 원리는 유사하지만 반대로 생각한 것이 LRU 알고리즘이다. 가장 오랫동안 사용되지 않았던 페이지는 앞으로도 사용되지 않을 것이라는 가정 하에 victim으로 선정한다.

LRU 방식에는 첫째로 counter를 두어 구현할 수 있다. 카운터에 접근횟수를 기록하는 것이다.
둘째로 더블 링크드 리스트의 스택으로 구현한 뒤 어떠한 페이지가 접근되면 그 페이지를 top으로 올린다. 그리고 만약 victim을 선정해야 하면 bottom에 있는 페이지를 victim으로 선정하게 된다.

하지만 이러한 방식을 쓰면 많은 페이지 엔트리가 존재하는 페이지 테이블에서는 연산이 많아지고 각 엔트리마다 두개의 링크만큼의 공간을 필요로 하므로 비효율적이다.

따라서 Page Table에서는 LRU-approximation 알고리즘을 사용한다. 이 알고리즘은 하드웨어의 도움을 받아 하나의 bit를 두고 이용한다.

페이지들을 queue형태로 나타내고 만약 reference가 일어나면 이 bit를 set한다. 그리고 victim 페이지를 선정할 때는 하나씩 접근하여 bit를 확인한다. 만약 bit가 clear하면 그 페이지를 victim으로 선정하며, set 되어 있으면 그 bit를 clear시키고 다음 페이지를 확인한다. 해당 페이지에 Second-chance를 주는 것이므로 Second-chance algorithm이라고도 한다.

그리고 카운팅을 기반으로 한 MFU, LFU알고리즘이 있다.(설명은 위 참조)

이렇게 Virtual Memory를 사용하면 실제 존재하는 물리적 메모리 공간보다 논리적 메모리 공간이 큰 것처럼 사용될 수 있기 때문에 효율적이다. 그런데 효율적이라는 이유로 멀티프로세싱의 degree를 계속 늘리다 보면 실제 실행하는 시간보다 page replacement를 하는 시간이 더 많아지는 순간이 오게 된다. 이는 CPU Utilization을 떨어뜨리는 원인이 된다.

만약 CPU는 CPU사용률만 보고 이것을 올리기 위하여 멀티프로세싱의 degree를 더 증가시키고 이에 따라서 효율은 극악으로 나빠지게 되는데 이때, 실행 시간보다 페이지 교체 시간이 많아지는 현상을 Thrashing이라 한다.

<img src="https://images.velog.io/images/thdalstn6352/post/aaa5ff7e-76a3-434d-8023-6274715b40ba/image.png" />
 
Thrashing이 발생하는 이유는 locality크기의 합이 실제 메모리의 크기보다 커졌기 때문이다. 따라서 이 Thrashing을 해결하기 위해 Working set model을 적용한다.
Working set model은 locality를 approximate한 것으로 페이지 넘버로 관리한다.
그러다 working set의 크기가 실제 메모리보다 커지면 하나의 프로세스를 종료하는 방식으로 Thrashing이 생기지 않도록 조절할 수 있다.

따라서 Thrashing이 생겼다는 것은 즉 Page Fault가 많아졌다는 것이기 때문에 그것의 정도를 지정하고 Page Fault의 횟수가 어느 한계점을 넘어가면 프로세스를 종료하는 방식으로 구현한다.

<working set model 특징>

| 구분 | 설명                                                                                                    | 특징                                                              |
| ---- | ------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| 원리 | 지역성 가정을 기반으로 동작                                                                             | 지역성 기반                                                       |
| 특징 | 과도기, 안정기가 주기적 반복                                                                            | 프로세스 변화                                                     |
| 장점 | 1. Multi-Programming 정도 높임 <br /> 2. CPU 활용률 최적화                                              | 1. Page Hit rate증가 <br /> 2. 임계치 극대화                      |
| 단점 | 1. Working Set 추적관리 복잡 <br /> 2. Window 사이즈 설정이 모호함 <br /> 3. 참조 페이지 Queue 유지관리 | 1. 크기/구성 변화 <br /> 2. 최적값 모름 <br /> 3. 메모리관리 복잡 |

Virtual Memory를 사용하게 되면 생기는 부가적인 장점으로 공유 메모리 사용, Copy on write 메커니즘, Memory mapped file이 있다.
여러 프로세스간의 communication의 한 가지 방법으로 공유 메모리를 사용할 수 있는데 demand paging 기법을 사용할 경우 다른 프로세스의 각각의 페이지가 같은 프레임을 가리키도록 하면 공유 메모리를 사용할 수 있다.

또한 COW(Copy-On-Write) 메커니즘은 부모 프로세스를 clone하여 자식 프로세스를 생성하였을 때 처음에는 같은 메모리를 사용하도록 하다가 그곳에 Write가 발생하였을 때 메모리를 copy하는 것으로 이것 또한 공유 메모리처럼 같은 프레임을 가리키도록 하였다가 복사가 되었을때 새로운 프레임을 할당하면 된다.

그리고 Memory mapped file은 file을 접근하는 것을 메모리 접근하듯이 페이지를 할당하여 할 수 있도록 하는 것이며 메모리 접근 속도가 더 빠르므로 효율적이다.

Paging은 동일한 크기를 가지는 page 단위로 메모리를 나누는 것이라 하였다.
반면에 Segmentation은 가변 크기의 단위인 segment로 메모리 영역을 나눈다. 이것은 사용자가 바라보는 관점에서 메모리를 나눈 것이며 일반적인 사용자는 페이지 단위로 메모리를 바라보지 않고 큰 단위단위로 바라보게 된다.
따라서 최근의 컴퓨터는 세그멘테이션 기법과 페이징 기법을 동시에 적용하여 메모리를 접근하게 된다.

## 4) 가상 메모리의 부가 장점

가상 메모리를 사용하면서 생기는 부가 장점으로 다음과 같은 것들이 있다.

º 공유 메모리 사용

º Copy-on-write 메커니즘

º Memory mapped file

### 4-1) 공유 메모리 사용

여러 프로세스 간의 communication의 한 가지 방법으로 공유 메모리를 사용할 수 있는데, demand-paging 기법을 사용할 경우 다른 프로세스의 각각의 페이지가 같은 프레임을 가리키도록 하면 공유 메모리를 사용할 수 있다.

윈도우의 dll이나 리눅스의 so 역시 이 방식으로 물리 메모리 프레임을 같이 가리키게 하여, 전체 메모리를 절약하게 된다. 아래 그림에서 프로세스 A의 1번 페이지, 프로세스 B의 7번 페이지가 물리 메모리 5번 프레임을 같이 가리키는 것을 볼 수 있다.

<img src="https://images.velog.io/images/thdalstn6352/post/1691226a-3321-473e-82a3-9bf4ab012f59/image.png" />

### 4-2) Copy-on-write 메커니즘

부모 프로세스를 clone하여 자식 프로세스를 생성하였을 때, 처음에는 같은 메모리를 사용하도록 하다가 그곳에 Write가 발생하였을 때 메모리를 copy하는 것으로 이것 또한 공유 메모리처럼 같은 프레임을 가리키도록 하였다가 복사가 되었을 때 새로운 프레임을 할당하면 된다.

Linux에서는 자식 프로세스(child process)를 생성(fork)하면 같은 메모리 공간을 공유하게 된다. 그런데 부모 프로세스가 데이터를 새로 넣거나, 수정하거나, 지우게 되면 같은 메모리 공간을 공유할 수 없게 된다. 따라서 부모 프로세스는 해당 페이지를 복사한 다음 수정한다. 이것을 Copy-on-Write(COW)라고 한다. 만약 자식 프로세스가 없었다면 페이지를 복사하지 않고 바로 수정했을 것이다. 따라서 자식 프로세스가 생성되어 작업을 하는 동안 데이터 입력/수정/삭제가 발생하면 해당 메모리 페이지를 복사해야 되기 때문에 평소보다 더 많은 메모리가 필요해진다.

> <img src= "https://images.velog.io/images/thdalstn6352/post/94c3ec03-a606-4a8f-8570-953b8936a478/image.png" />
> <자식 프로세스를 생성(fork)한 직후 프로세스와 메모리 모습>

> <img src="https://images.velog.io/images/thdalstn6352/post/215a2335-f80e-49e3-bda0-65479e0fbfbe/image.png" />
> < 부모 프로세스가  Page C 를 수정한 후 프로세스와 메모리 모습 >

## 5) MMU(Memory Management Unit)

### 5-1) MMU란?

**가. MMU(Memory Management Unit)의 개념**

CPU와 Cache 사이 불연속적 메모리 주소를 논리적 연속된 가상 주소로 Mapping 관리 장치

**나. MMU 역할**

| 주요 기능   | 설명                                  |
| ----------- | ------------------------------------- |
| 주소 변환   | 실제 메모리와 가상 메모리의 주소 변환 |
| 메모리 보호 | 각 영역 간 읽기/쓰기 침범 차단 역할   |

### 5-2) MMU 주요 기능 및 주소 변환 과정

**가. MMU 주요 기능**

| 주요 기능     | 설명                                    |
| ------------- | --------------------------------------- |
| 주소 변환     | 가상메모리 주소를 물리 주소로 변환      |
| 특권 통제     | 사용자 프로그램에서 커널 영역 침범 차단 |
| 캐시 통제     | 캐시 가능 영역과 불가 영역 설정         |
| 읽기/쓰기보호 | Read / Write 불가 영역 생성 기능        |
| 메모리 보호   | 각 프로세스 별 영역만 접근하도록 통제   |

**나. MMU 주소 변환 과정**

| Memory Mapping 절차                                                                                  | 절차 설명                                                                                                                         |
| ---------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| ![](https://images.velog.io/images/thdalstn6352/post/91f4fddb-c0a4-4c51-abb9-b3a88eaac5fa/image.png) | ① MMU에 가상주소 전달 <br/> ② Page Table 탐색 <br/> ③ 물리주소 MMU에 전달 <br/> ④ 주소신호(RAS,CAS)발생 <br/> ⑤ Data를 CPU에 전달 |

## 6) TLB (Translation Look-aside Buffer)

### 6-1) TLB란?

**가. TLB(Translation Look-aside Buffer)의 정의**
자주 참조되는 가상 메모리 주소를 실제 메모리 주소로 매핑 시 성능 개선 위해 MMU(Memory Management Unit)에서 사용하는 고속 캐시.

**나. TLB의 특징**

| 특징             | 설명                                                                   |
| ---------------- | ---------------------------------------------------------------------- |
| 변환 결과 테이블 | 매번 주소를 변환하는 대신 변환 결과를 테이블에 저장하여 사용           |
| 특수 고속 캐시   | 페이지 테이블 항목에 대한 특수 고속 캐시 사용하여 메모리 참조시간 단축 |

### 6-2) TLB의 개념도 및 동작원리

**가. TLB의 개념도**

<img src="https://images.velog.io/images/thdalstn6352/post/7c85f99c-4256-4f1b-b774-046459590b67/image.png" />

**나. TLB의 동작원리**

| 방안         | 상태                                     | TLB 동작                                  |
| ------------ | ---------------------------------------- | ----------------------------------------- |
| TLB Hit      | 가상주소에 해당 항목이 TLB에 있음        | CPU가 TLB 통해 즉시 물리주소 생성         |
| TLB Miss     | 가상주소에 해당 항목이 TLB에 없음        | 주기억장치 페이지테이블 참조, TLB 갱신    |
| 페이지 Fault | 가상주소에 해당 항목이 주기억장치에 없음 | 디스크에서 페이지 반입, 페이지테이블 갱신 |

**다. 직접사상 방식과 TLB의 비교**

| 항목               | 직접 사상의 주소 변환                    | TLB에 의한 주소 변환                            |
| ------------------ | ---------------------------------------- | ----------------------------------------------- |
| 사상 방식          | Direct Mapping                           | Association Mapping                             |
| 페이지 테이블 위치 | 주기억장치 내                            | 고속의 특수 캐시 내 (TLB)                       |
| 장단점             | 데이터 접근시 주기억장치 두 번 접근 필요 | 1. TLB 병렬 고속탐색 <br/> 2. 고비용, 적용 한계 |

### 6-3) TLB 성능 개선 위한 고려사항

| 고려사항         | 상세 내용                             |
| ---------------- | ------------------------------------- |
| Entry 수 증가    | TLB 참조 증가, 많은 전력 사용         |
| 페이지 크기 증대 | 사상 적용 증가, 내부 단편화 증가      |
| 다중 페이지 지원 | 적은 내부 단편화, 큰 페이지 사용 가능 |