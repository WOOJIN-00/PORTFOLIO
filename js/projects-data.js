/* ==========================================================================
   프로젝트 상세 페이지 데이터 (project.html?id=<id> 가 이 파일을 읽어 그립니다)
   - 이미지·파일은 assets/projects/<id>/ 에 넣고 경로만 적습니다.
   - 본문 안의 `백틱`은 코드 글씨로 표시됩니다.
   - 블록 종류: text · image · gallery · table · highlights · steps · code · callout · file
   ========================================================================== */
window.PROJECTS = {

  /* ======================= 01 · Overwrite (메인 화면 PC 아이콘) ======================= */
  "overwrite-ctf": {
    no: "01",
    title: "Overwrite",
    subtitle: "의료 미스터리 추리 웹게임형 boot2root CTF 제작",
    period: "2026.10",
    tags: ["CTF 제작", "Game UI", "Privilege Escalation", "Port Knocking", "QA"],
    summary:
      "직접 '푸는' CTF가 아니라 '출제한' CTF입니다. 의료사고를 소재로 한 추리 드라마에 포트 노킹 · 웹 권한 상승 · 3분할 비밀번호 복원을 엮은 " +
      "boot2root 문제(Ubuntu 22.04 OVA)를 4인 팀으로 설계·구현했습니다. 공격자가 아니라 출제자·방어자 관점에서 취약점을 '의도적으로 설계'하고, " +
      "난이도와 단서 흐름을 조율한 경험입니다.",
    stats: [
      { label: "침투 단계", value: "5" },
      { label: "권한 경계", value: "4" },
      { label: "플래그", value: "2" },
      { label: "팀", value: "4인" }
    ],
    meta: [
      { k: "기간", v: "2026.10" },
      { k: "팀", v: "kload · 4인" },
      { k: "내 역할", v: "게임 메인 페이지 디자인·제작(기능 구현) · root flag 기획 · 반복 플레이 흐름 점검 · 워크스루 제작 · 비의도 풀이 점검" },
      { k: "대상", v: "Ubuntu Server 22.04 OVA · 브리지(DHCP)" },
      { k: "기술", v: "knockd(포트 노킹) · nginx · PHP-FPM · SQLite · EXIF/steghide · base58" }
    ],
    blocks: [
      {
        type: "text",
        title: "프로젝트 개요",
        body:
          "\"의료사고로 딸을 잃은 아버지에게 병원이 내민 수술기록은 수정본이었다\"는 설정에서 출발하는 추리 드라마형 CTF입니다. " +
          "플레이어는 조사관을 돕는 익명 협력자가 되어, 병원 외부 시스템에서 시작해 내부망 서버의 root까지 내려가며 '덮어쓰기 전 원본'을 찾습니다. " +
          "권한 단계(외부인 → guest → 서비스 계정 → director → root)가 이야기의 '진실의 깊이'와 맞물리도록 설계한 것이 핵심입니다. " +
          "실제 플래그·비밀번호·토큰 값은 모두 `<...>` 자리표시로 가렸습니다."
      },
      {
        type: "image",
        src: "assets/projects/overwrite-ctf/showcase.png",
        caption: "구현한 화면 모음 — 병원 홈페이지, Overwrite 타이틀, 익명 우편, 인물 소개 UI (팀 kload)"
      },
      {
        type: "callout",
        title: "내가 맡은 부분",
        body:
          "① 게임 메인 페이지 디자인 구성 및 제작 — 화면 디자인과 기능 구현까지 맡았습니다. " +
          "② root flag 기획 — root 비밀번호를 세 조각으로 나눠 서로 다른 방식으로 숨기고, 이를 모아 root로 올라가는 최종 관문을 설계했습니다. " +
          "③ 검증 — CTF를 여러 번 직접 처음부터 풀며 흐름을 점검하고, 비의도 풀이(의도하지 않은 지름길)를 점검했으며, 공식 워크스루를 작성했습니다."
      },
      {
        type: "highlights",
        title: "출제 의도",
        items: [
          { h: "연쇄 취약점", p: "작은 정보 노출과 접근통제 실수가 다섯 단계로 연쇄되면 내부망 최고 권한까지 탈취될 수 있음을 체감하도록 설계했습니다." },
          { h: "서사 = 권한", p: "권한을 한 단계 올릴 때마다 병원이 숨긴 사실이 한 겹씩 드러나도록 기술 단계와 스토리 전개를 맞췄습니다." },
          { h: "단서의 현실성", p: "모든 단서를 의무기록·출입명단·공지·게시글처럼 실제 병원에 있을 법한 문서 형태로 배치했습니다." },
          { h: "안전한 범위", p: "머신은 외부로 스스로 접속하지 않고, 유일한 아웃바운드는 플레이어가 직접 트리거하는 리버스 셸(목적지는 플레이어 Kali뿐)로 한정했습니다." }
        ]
      },
      {
        type: "text",
        title: "전체 공격 체인",
        body: "출제자는 '풀리는 경로가 하나로 수렴하도록' 단서를 거꾸로 배치합니다. 각 단계의 단서 → 기법 → 획득 권한을 아래와 같이 설계했습니다."
      },
      {
        type: "table",
        head: ["단계", "단서 / 기법", "획득 권한"],
        rows: [
          ["프롤로그", "수술기록 vs 진료비 내역서의 모순(출혈 없음 ↔ 수혈 청구) 찾기", "— (동기 부여)"],
          ["1장 정찰", "EXIF · HTML 주석 · stego로 숫자 3개 → 포트 노킹 → 숨은 서비스(8080) 개방", "외부인"],
          ["2장 열거", "guest 로그인 → 403 벽 → 파일 퍼징 → Base64 옛 비번(함정)", "guest"],
          ["3장 초기 침투", "숨은 공지 주석의 임시 비번 → `.phtml` 업로드 우회 → 리버스 셸", "서비스 계정 → user flag"],
          ["4장 횡적 이동", "웹루트 밖 설정 백업(평문 자격증명) 재사용 → director로 이동", "director"],
          ["5장 권한 상승", "root 비번 3조각(zip · strings · base58) 복원 → 결합 → `su root`", "root → root flag"]
        ]
      },
      {
        type: "text",
        title: "게임 화면",
        body: "손으로 그린 듯한 서류·사무실 톤으로 화면을 통일해, 플레이어가 '사건 파일을 들여다보는 조사관'이 된 듯한 분위기를 만들었습니다. 아래는 실제 구동 화면을 녹화한 GIF입니다."
      },
      {
        type: "gallery",
        images: [
          { src: "assets/projects/overwrite-ctf/ui-start.gif", caption: "시작 화면 — 타이틀 'Overwrite'가 사건 파일처럼 떠오르는 인트로" },
          { src: "assets/projects/overwrite-ctf/ui-characters.gif", caption: "인물 소개 — 조사관·유족·교수·전공의 4인의 파일 카드" },
          { src: "assets/projects/overwrite-ctf/ui-prologue.gif", caption: "프롤로그 — 조사관의 사무실에서 사건 브리핑이 전개됨" },
          { src: "assets/projects/overwrite-ctf/ui-main.gif", caption: "게임 메인 — 사건 기록부 · 단서 입력 · 수사 메모" }
        ]
      },
      {
        type: "text",
        title: "root flag 기획 — 최종 관문 설계",
        body:
          "root 비밀번호를 그대로 두지 않고 세 조각으로 쪼갠 뒤, 세 명의 책임자(병원장·법무실장·전산실장)가 각각 다른 방식으로 보관한다는 " +
          "'3인 공동 봉인' 서사로 포장했습니다. 한 조각이라도 빠지면 복원할 수 없으므로 서로 다른 세 가지 해독 기법을 모두 요구합니다."
      },
      {
        type: "steps",
        items: [
          { h: "조각 1/3 — 압축", p: "director 홈의 zip에 보관. 비밀번호 힌트는 '병원 대표번호 뒷자리'로, 홈페이지 푸터의 전화번호에서 유도되게 연결했습니다." },
          { h: "조각 2/3 — 바이너리", p: "ELF 바이너리 내부 문자열에 숨겨 `strings`로 추출하도록 설계했습니다." },
          { h: "조각 3/3 — 로컬 서비스", p: "127.0.0.1:9000 로컬 전용 서비스가 토큰 헤더를 요구하고, 응답을 base58로 인코딩해 반환합니다(base64 오인 유도)." },
          { h: "결합 → root", p: "세 조각을 라벨 순서대로 이어 붙이면 root 비밀번호가 완성되고 `su root`로 최종 플래그에 도달합니다." }
        ]
      },
      {
        type: "code",
        title: "root 비번 3조각 복원 — 플레이어가 수행하는 흐름 (값은 자리표시)",
        code:
`# [1/3] zip — 비번 힌트: 홈페이지 대표번호 뒷자리
unzip -P <zip_pw> ~/vault/archive.zip && cat piece1.txt     # → [1/3] <part1>

# [2/3] 바이너리 내부 문자열
strings ~/vault/recapprove | grep -F '[2/3]'                # → [2/3] <part2>

# [3/3] 로컬 서비스(9000) — 토큰 헤더 필요, 응답은 base58
curl -s -H "X-Key-Token: <token>" http://127.0.0.1:9000/share   # → <base58>

# 라벨 순서대로 결합 → root 비밀번호
su root && cat /root/root.txt                               # → FLAG{<...>}`
      },
      {
        type: "callout",
        title: "난이도 조율 포인트",
        body:
          "세 조각을 전부 다른 기법으로 나눈 이유는, 한 가지 도구만 익숙한 플레이어가 마지막에서 막히지 않도록 기법을 분산시키면서도 " +
          "'하나라도 빠지면 못 푼다'는 긴장을 주기 위해서입니다. base58은 base64로 착각하기 쉬워, 응답 문자셋(0·O·I·l 없음)을 단서로 남겨 과도한 벽이 되지 않게 조절했습니다."
      },
      {
        type: "highlights",
        title: "검증 · 워크스루",
        items: [
          { h: "반복 플레이 흐름 점검", p: "CTF를 여러 번 직접 처음부터 풀며 단서가 다음 단계로 자연스럽게 이어지는지, 막히는 구간은 없는지 확인했습니다." },
          { h: "비의도 풀이 점검", p: "의도한 경로 외에 더 쉬운 지름길이나 예상 밖의 우회가 없는지 점검해 난이도와 풀이 경로가 설계대로 유지되게 했습니다." },
          { h: "워크스루 제작", p: "정찰부터 root flag까지 전 단계를 재현해 공식 풀이를 작성했습니다. (실제 값·플래그가 담겨 있어 비공개)" }
        ]
      },
      {
        type: "text",
        title: "배운 점",
        body:
          "문제를 '푸는' 것과 '내는' 것은 전혀 다른 일이었습니다. root flag 관문을 기획할 때는 너무 쉽거나 어렵지 않은지, " +
          "의도한 경로 말고 다른 길로 뚫리지 않는지를 끊임없이 역으로 검토해야 했습니다. 출제자·방어자 관점에서 침투 시나리오를 설계해 본 것이 가장 큰 수확입니다."
      }
    ]
  },

  /* ======================= 02 · Network Lab (메인 화면 와이파이 아이콘) ======================= */
  "network-lab": {
    no: "02",
    title: "Network Security Lab",
    subtitle: "SKT 본사·지사 통합 네트워크 구축 — 라우팅 · ACL · VPN · HSRP",
    period: "2026.08",
    tags: ["Cisco Packet Tracer", "EIGRP", "OSPF", "VLAN", "ACL", "VPN", "HSRP", "NAT"],
    summary:
      "Cisco Packet Tracer로 SKT 본사와 지사, 그리고 외부 구간을 잇는 네트워크를 구축했습니다. 모든 노드에 IP를 할당하고 라우팅을 구성해 " +
      "전 구간이 통신되도록 만든 뒤, ACL로 '원하는 통신만' 허용했습니다. 본사와 지사 사이는 VPN으로 보안성 있는 통신 경로를 만들고, " +
      "HSRP로 게이트웨이를 이중화해 라우터 한쪽에 장애가 생겨도 다른 경로로 통신이 이어지도록 설계했습니다.",
    stats: [
      { label: "라우팅 프로토콜", value: "2" },
      { label: "VLAN", value: "3" },
      { label: "ACL 차단 규칙", value: "3" },
      { label: "팀", value: "3인" }
    ],
    meta: [
      { k: "기간", v: "2026.08" },
      { k: "팀", v: "3인 팀 프로젝트" },
      { k: "내 역할", v: "전체 토폴로지 구성 · 종단 간 통신 테스트(G·D) · ACL 설정 확인 및 검증" },
      { k: "도구", v: "Cisco Packet Tracer" },
      { k: "기술", v: "EIGRP AS 100 · OSPF Area 0 · GRE 터널(VPN) · VLAN 10/20/30 · HSRP · ACL 110 · DHCP · Static NAT" }
    ],
    blocks: [
      {
        type: "text",
        title: "프로젝트 개요",
        body:
          "가상의 기업 SKT의 본사(192.168.200.0/24)와 지사(172.30.100.0/24), 그리고 외부 사용자 구간을 하나의 네트워크로 연결하는 실습입니다. " +
          "목표는 세 가지였습니다. ① 모든 구간이 서로 통신될 것, ② 그중 '허용한 통신만' 지나갈 것, ③ 장비 하나가 멈춰도 통신이 끊기지 않을 것. " +
          "설정을 마친 뒤에는 ping · WEB · FTP를 직접 실행해, 설정값과 실제 결과가 일치하는지 하나씩 대조했습니다."
      },
      {
        type: "image",
        src: "assets/projects/network-lab/topology.png",
        caption: "전체 토폴로지 — 왼쪽 EIGRP AS 100 구간(HSRP 이중화) / 오른쪽 OSPF Area 0 구간(SKT 본사 VLAN · SKT 지사 NAT)"
      },
      {
        type: "highlights",
        title: "핵심 작업",
        items: [
          { h: "IP 할당 · 라우팅", p: "모든 노드와 인터페이스에 IP를 할당하고, 왼쪽 구간은 EIGRP AS 100, 오른쪽 구간은 OSPF Area 0으로 라우팅을 구성해 전 구간이 통신되게 했습니다. 본사는 VLAN 10/20/30으로 부서를 나눴습니다." },
          { h: "ACL — 원하는 통신만", p: "ACL 110에 출발지 · 목적지 · 서비스 기준의 차단 규칙(외부 FTP · 외부 WEB · 특정 ICMP)을 만들고, 마지막에 나머지 트래픽을 허용해 '꼭 막아야 할 것만 막는' 정책을 구성했습니다." },
          { h: "VPN — 본사 ↔ 지사", p: "본사와 지사 사이에 GRE 터널 기반 VPN을 구성해, 공용 구간을 거치더라도 두 사이트가 하나의 사설망처럼 안전하게 통신하도록 했습니다." },
          { h: "HSRP — 게이트웨이 이중화", p: "192.168.100.0/24 구간의 두 라우터(A1 · A2)가 가상 게이트웨이 IP를 공유하게 해, Active 라우터에 장애가 생기면 Standby 라우터가 즉시 경로를 이어받도록 했습니다." },
          { h: "NAT · DHCP", p: "지사 라우터에서 DHCP로 단말 주소를 자동 할당하고, 지사 서버(C-S)를 Static NAT로 외부 주소 5.5.5.5에 매핑해 외부에서 접근할 수 있게 했습니다." }
        ]
      },
      {
        type: "table",
        title: "구간별 구성",
        head: ["구간", "대역", "구성"],
        rows: [
          ["외부 사용자 (G)", "192.168.50.0/24", "L3 스위치 · EIGRP AS 100"],
          ["서버 구간 (A · A-S)", "192.168.100.0/24", "HSRP 이중화 (A1 · A2, VIP 192.168.100.254)"],
          ["SKT 본사", "192.168.200.0/24", "VLAN 10 · 20 · 30 · OSPF Area 0"],
          ["SKT 지사", "172.30.100.0/24", "DHCP · NAT (C-S → 5.5.5.5 Static NAT)"],
          ["라우터 간 연결", "1.1.1.0 ~ 6.6.6.0 /24", "Serial · GigabitEthernet 링크"]
        ]
      },
      {
        type: "text",
        title: "ACL 110 — 서비스별 선택 차단",
        body:
          "ACL은 '전부 막고 일부 허용'이 아니라, 반드시 막아야 할 흐름만 골라 차단하고 나머지는 허용하는 구조로 설계했습니다. " +
          "규칙마다 '어떤 결과가 나와야 정상인지'를 먼저 정해 두고, 실제 실행 결과와 대조했습니다."
      },
      {
        type: "table",
        head: ["출발지", "목적지 · 서비스", "설정 의도", "실제 결과"],
        rows: [
          ["A · 192.168.100.10", "5.5.5.5 · FTP", "외부 FTP 차단", "Timed out → 차단 확인"],
          ["G · 192.168.50.10", "5.5.5.5 · WEB", "외부 WEB 차단", "Request Timeout → 차단 확인"],
          ["D · 192.168.200.67", "172.30.100.11 · ICMP echo", "D → F ping 차단", "100% loss → 차단 확인"],
          ["그 외", "ip any any", "나머지 트래픽 허용", "G → C-S ping 4/4 성공"]
        ]
      },
      {
        type: "table",
        title: "HSRP — 게이트웨이 이중화 상태",
        head: ["장비", "Priority", "State", "Virtual IP"],
        rows: [
          ["A1 · Gig0/0", "105", "Active", "192.168.100.254"],
          ["A2 · Gig0/0", "100", "Standby", "192.168.100.254"]
        ]
      },
      {
        type: "callout",
        title: "HSRP를 넣은 이유",
        body:
          "게이트웨이가 라우터 한 대뿐이면, 그 라우터가 멈추는 순간 구간 전체의 통신이 끊깁니다. 두 라우터가 같은 가상 IP(192.168.100.254)를 " +
          "게이트웨이로 공유하고, priority가 높은 A1(105)이 평소에 트래픽을 처리하며 A2(100)가 대기하도록 구성했습니다. " +
          "단말은 가상 IP만 바라보므로, A1에 장애가 생겨도 설정을 바꾸지 않고 A2를 통해 그대로 통신할 수 있습니다. 양쪽 `show standby brief` 결과로 역할과 VIP 공유를 확인했습니다."
      },
      {
        type: "table",
        title: "검증 결과",
        head: ["테스트", "기대 결과", "실제 결과", "판정"],
        rows: [
          ["G → C-S (5.5.5.5) ping", "통신 가능", "Sent 4 / Received 4 · 0% loss", "정상"],
          ["D → F (172.30.100.11) ping", "ICMP 차단", "Destination host unreachable · 100% loss", "정책과 일치"],
          ["G → 5.5.5.5 WEB", "차단", "Request Timeout", "정책과 일치"],
          ["A → 5.5.5.5 FTP", "차단", "Error opening ftp · Timed out", "정책과 일치"],
          ["A → A-S (192.168.100.20) FTP", "허용", "Connected · 220 배너", "정상"],
          ["HSRP 상태", "A1 Active / A2 Standby", "show standby brief 양쪽 일치", "정상"]
        ]
      },
      {
        type: "text",
        title: "정리",
        body:
          "라우팅으로 '통하게' 만드는 것과 ACL로 '필요한 것만 통하게' 만드는 것은 별개의 일이었습니다. 차단 규칙을 넣을 때마다 허용되어야 할 경로가 " +
          "함께 막히지 않았는지 G → C-S 같은 허용 경로를 다시 시험했고, 설정 화면 · 설정값 · 실행 결과를 한 줄로 이어 검증을 마무리했습니다."
      },
      {
        type: "file",
        title: "Network Security Lab 결과보고서 (PDF)",
        desc: "역할별 구성 · 검증 결과 보고서 (6쪽, 증빙 캡처 포함)",
        href: "assets/projects/network-lab/network-lab-report.pdf"
      }
    ]
  },

  /* ======================= 03 · Full-Security Labs (메인 화면 자물쇠 아이콘) ======================= */
  "full-security-lab": {
    no: "03",
    title: "Full-Security Labs",
    subtitle: "통합 보안 인프라 구축 및 침투 테스트 — 방화벽 · NIDS · SIEM · 모니터링 · VPN · CTF",
    period: "2026.09",
    tags: ["GNS3", "VLAN", "ASAv", "Suricata", "Wazuh", "Zabbix", "pfSense VPN", "CTF"],
    summary:
      "GNS3로 내부망 · 외부망 · VLAN · 라우팅 · 방화벽을 구성하고, VirtualBox에 서비스 · 보안관제 서버들을 올려 " +
      "방화벽(ASAv) 정책과 NIDS(Suricata) 탐지 룰을 실제 트래픽으로 검증한 통합 보안 랩입니다. SIEM(Wazuh) · 모니터링(Zabbix · PMM) · " +
      "중앙 로그(Log Analyzer) · 원격 접속 VPN(pfSense)을 구축하고, 취약 VM(Earth)으로 침투까지 수행했습니다. 전 과정을 혼자 진행한 개인 프로젝트입니다.",
    stats: [
      { label: "구축 서버", value: "9" },
      { label: "방화벽 룰", value: "5" },
      { label: "NIDS 룰", value: "3" },
      { label: "VLAN", value: "3" }
    ],
    meta: [
      { k: "기간", v: "2026.09" },
      { k: "형태", v: "개인 프로젝트 · 전 과정 단독 수행" },
      { k: "환경", v: "GNS3 · VirtualBox · Ubuntu Server · FreeBSD(pfSense) · Kali" },
      { k: "도구", v: "Cisco ASAv · Suricata · Wazuh · OSSEC · Zabbix · PMM · pfSense/OpenVPN · rsyslog/LogAnalyzer · BIND9" },
      { k: "네트워크", v: "내부망 192.168.16.0/24 · 외부망 10.10.10.0/24 · VPN 터널 172.16.0.0/24" }
    ],
    blocks: [
      {
        type: "text",
        title: "프로젝트 개요",
        body:
          "그동안 배운 기술(VLAN · 라우팅 · 서버 · VPN · IDS · 방화벽 · SIEM · 로그 분석 · CTF)을 하나의 랩으로 통합했습니다. " +
          "\"구성 → 트래픽 발생 → 로그/캡처로 검증\"을 원칙으로, 방화벽 차단 · NIDS 탐지 · 에이전트 연동 · VPN 접속을 모두 실제 결과로 확인했습니다."
      },
      {
        type: "image",
        src: "assets/projects/full-security-lab/topology.png",
        caption: "전체 토폴로지 — 내부망(서비스 · 보안관제 서버) / 외부망(공격자 VLAN 10 · 20 · 30) / ASAv-FW · NIDS"
      },
      {
        type: "table",
        head: ["서버 / 장비", "IP", "역할"],
        rows: [
          ["DNS (BIND9)", "192.168.16.91", "정·역방향 도메인 해석 (+ OSSEC · Zabbix 에이전트)"],
          ["Web-DB", "192.168.16.137", "Apache + PHP + MariaDB (+ Wazuh agent · PMM client · Log Analyzer)"],
          ["Wazuh", "192.168.16.221", "SIEM / HIDS 매니저"],
          ["NMS-Zabbix", "192.168.16.139", "서버 · 시스템 통합 모니터링"],
          ["PMM", "192.168.16.201", "DB 성능 · 쿼리 모니터링 (Docker)"],
          ["NIDS-Suricata", "192.168.16.202", "통과 트래픽 탐지 (alert 전용)"],
          ["pfSense", "LAN 10.10.10.254", "Remote Access VPN (OpenVPN)"],
          ["Kali-Attacker", "192.168.16.71", "침투 테스트 · 트래픽 발생"],
          ["Earth VM", "192.168.16.48", "CTF 침투 대상"]
        ]
      },
      {
        type: "text",
        title: "01 · Cisco ASAv 방화벽 정책",
        body:
          "외부망 → 내부망 경계에 ASAv를 두고, 서비스 공개는 최소 포트만 허용하고 나머지는 차단 + 로그하는 5개 룰을 설계했습니다. " +
          "각 룰은 `packet-tracer`로 ALLOW/DROP을 확인하고, 관리망(VLAN 10) 룰은 실제 ping으로 교차 검증했습니다."
      },
      {
        type: "table",
        head: ["#", "방향", "정책", "검증 결과"],
        rows: [
          ["1", "outside → inside", "Web-DB TCP 80 허용", "ALLOW"],
          ["2", "outside → inside", "DNS UDP 53 허용", "ALLOW (DNS inspect)"],
          ["3", "outside → dmz", "pfSense UDP 1194 허용", "ALLOW"],
          ["4", "outside → inside", "VLAN 10만 ICMP 허용, 그 외 차단 + 로그", "Kali 성공 / Attacker-D 차단"],
          ["5", "dmz → inside", "Wazuh 에이전트 포트만 허용", "1514-1515 ALLOW / 80 DROP"]
        ]
      },
      {
        type: "text",
        title: "02 · Suricata NIDS 탐지 룰",
        body:
          "Suricata VM을 ASAv ↔ R3 구간에 투명 브리지로 두어 통과 트래픽을 감시하도록 구성했습니다. " +
          "차단(drop) 없이 `alert`만 사용하는 탐지 전용으로 운영하고, 실제 트래픽으로 탐지를 확인했습니다."
      },
      {
        type: "code",
        title: "/etc/suricata/rules/local.rules (HOME_NET = 192.168.16.0/24)",
        code:
`alert icmp any any -> $HOME_NET any (msg:"LAB ICMP Echo Request to internal network"; itype:8; sid:1000001; rev:1;)
alert tcp  any any -> 192.168.16.91 22 (msg:"LAB SSH connection attempt to DNS server"; flow:to_server; flags:S; sid:1000002; rev:1;)
alert http any any -> $HOME_NET any (msg:"LAB HTTP request to dbtest.php"; flow:established,to_server; http.uri; content:"/dbtest.php"; sid:1000003; rev:1;)`
      },
      {
        type: "gallery",
        images: [
          { src: "assets/projects/full-security-lab/suricata-detect-icmp.png", caption: "SID 1000001 — 내부망 향 ICMP(ping) 탐지 (fast.log)" },
          { src: "assets/projects/full-security-lab/suricata-detect-http.png", caption: "SID 1000003 — Web-DB dbtest.php 접근 탐지" }
        ]
      },
      {
        type: "text",
        title: "03 · Wazuh SIEM · Zabbix · PMM",
        body:
          "Wazuh(SIEM/HIDS) 매니저를 중심으로 모니터링 에이전트를 대상 서버에 직접 배치했습니다. " +
          "Wazuh agent · PMM client는 Web-DB에, OSSEC · Zabbix agent는 DNS에 설치해 로그와 지표를 각 매니저로 보냈습니다."
      },
      {
        type: "table",
        head: ["에이전트", "설치 위치", "보고 대상"],
        rows: [
          ["Wazuh agent", "Web-DB (192.168.16.137)", "Wazuh 매니저 192.168.16.221"],
          ["OSSEC (HIDS) agent", "DNS (192.168.16.91)", "Wazuh 매니저 192.168.16.221"],
          ["Zabbix agent", "DNS (192.168.16.91)", "Zabbix 서버 192.168.16.139"],
          ["PMM client", "Web-DB (192.168.16.137)", "PMM 서버 192.168.16.201"]
        ]
      },
      {
        type: "gallery",
        images: [
          { src: "assets/projects/full-security-lab/wazuh-agents.png", caption: "Wazuh 매니저 — 에이전트 등록 · Active 현황" },
          { src: "assets/projects/full-security-lab/ossec-connected.png", caption: "OSSEC(DNS) — 매니저 연동 확인" }
        ]
      },
      {
        type: "text",
        title: "04 · 중앙 로그 수집 (Log Analyzer)",
        body:
          "rsyslog가 514 포트로 로그를 받아 MariaDB에 저장하고, LogAnalyzer 웹 화면에서 조회하도록 구성했습니다. " +
          "Web-DB · PMM · Wazuh의 로그가 한 곳으로 모입니다."
      },
      {
        type: "image",
        src: "assets/projects/full-security-lab/loganalyzer.png",
        caption: "LogAnalyzer — Web-DB · PMM · Wazuh 로그를 한 화면에서 조회"
      },
      {
        type: "text",
        title: "05 · Web-DB 서비스 · pfSense VPN",
        body:
          "Apache + PHP + MariaDB로 웹/DB 서비스를 구축하고 `dbtest.php`로 웹 ↔ DB 연동을 확인했습니다. " +
          "pfSense에는 내부 CA → 서버 인증서 → VPN 사용자 순으로 OpenVPN을 구성해(UDP 1194, 터널 172.16.0.0/24), 원격 PC에서 접속해 내부망 서버까지 도달하는 것을 확인했습니다."
      },
      {
        type: "gallery",
        images: [
          { src: "assets/projects/full-security-lab/webdb-dbtest.png", caption: "dbtest.php — 'DB 연결 성공' 확인" },
          { src: "assets/projects/full-security-lab/pfsense-vpn-status.png", caption: "pfSense OpenVPN — 클라이언트 세션(터널 IP 172.16.0.2, AES-256-GCM) 연결" }
        ]
      },
      {
        type: "text",
        title: "06 · CTF — Earth VM 침투",
        body: "정찰부터 권한 상승까지 전체 공격 체인을 수행한 뒤, 단계별 취약점에 대한 방어 개선안을 정리했습니다."
      },
      {
        type: "steps",
        items: [
          { h: "정찰", p: "nmap 전체 포트 스캔 → 22/80/443, Apache 2.4.51. 인증서 SAN에서 earth.local · terratest.earth.local 발견" },
          { h: "웹 열거", p: "robots.txt의 /testingnotes.* → 암호 방식(XOR) · 키 파일 · 관리자 계정 단서, gobuster로 /admin 포털 확인" },
          { h: "암호 분석", p: "반복키 XOR + 알려진 평문 취약점으로 키를 역산해 관리자 자격증명 복원" },
          { h: "초기 침투", p: "관리자 패널의 명령 실행 기능으로 인증 후 RCE, 아웃바운드 차단을 우회해 셸 확보 → user flag" },
          { h: "권한 상승", p: "SUID 바이너리를 strings · ltrace로 분석해 트리거 조건을 만족시켜 root 비밀번호 재설정 → root flag" }
        ]
      },
      {
        type: "image",
        src: "assets/projects/full-security-lab/ctf-root-flag.png",
        caption: "root 권한 획득 및 root flag"
      },
      {
        type: "table",
        title: "방어 개선안",
        head: ["단계", "취약점", "방어 개선안"],
        rows: [
          ["정보 노출", "인증서 SAN · robots.txt로 호스트 · 파일 노출", "민감 정보 노출 최소화, 관리 페이지 접근 통제(IP 제한 · MFA)"],
          ["암호 취약", "반복키 XOR + 알려진 평문", "검증된 표준 암호 사용, 키 재사용 금지"],
          ["초기 침투", "인증 후 임의 명령 실행(RCE)", "사용자 입력의 명령 실행 차단(화이트리스트)"],
          ["권한 상승", "SUID 바이너리 로직 악용", "SUID 최소화, 트리거 조건 검증 강화"]
        ]
      },
      {
        type: "file",
        title: "Full-Security Labs 결과보고서 (PDF)",
        desc: "전체 구축 · 검증 · 침투 결과 보고서 (증거 캡처 포함)",
        href: "assets/projects/full-security-lab/Full-Security-Labs_결과보고서_최종.pdf"
      }
    ]
  }
};
