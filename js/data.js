/* ==========================================================================
   포트폴리오 데이터 파일
   - 새 작업을 추가할 때는 PROJECTS 배열 "맨 앞"에 객체를 하나 추가하면 됩니다.
   - 이미지·파일은 assets/projects/<프로젝트-id>/ 폴더에 넣고 경로만 적습니다.
   - 자세한 방법은 ADDING.md 참고.
   ========================================================================== */

const PROFILE = {
  name: "송우진",
  role: "Security Engineer",               // TODO: 지원 직무
  tagline: "서버를 직접 구축하고, 공격과 방어를 모두 검증합니다.",
  intro:
    "Rocky Linux·Ubuntu 서버를 하드닝하고, 방화벽과 IDS/IPS(Suricata·Snort)로 탐지·차단 정책을 구성한 뒤 " +
    "Kali에서 직접 공격해 결과를 로그로 확인하는 방식으로 학습합니다.",
  email: "uginsongugin@gmail.com",
  github: "",                              // 예: "https://github.com/아이디"
  blog: "",                                // 예: "https://블로그주소"
  updated: "2026-09-28"
};

const SKILLS = [
  {
    group: "System Hardening",
    items: ["SSH root 접속 차단", "PAM 패스워드 정책", "SetUID 점검", "SELinux 상태 확인"]
  },
  {
    group: "Network Security",
    items: ["firewalld Rich Rule", "iptables", "Suricata (IPS)", "Snort 3 (IDS)"]
  },
  {
    group: "Assessment",
    items: ["KISA 기반 점검 스크립트", "Bash Shell Script", "nmap · gobuster · nikto", "CTF 정찰·열거"]
  }
];

/* 걸어온 길 — 교육·자격증 이력. 상태가 바뀌면 status만 고치면 됩니다 (예: "준비 중" → "합격"). */
const PATH = [
  {
    label: "ALEPH 과정",
    desc: "네트워크·리눅스 서버·보안 장비 구축과 CTF 실습 중심의 교육 과정",
    status: "수료 중"
  },
  {
    label: "네트워크관리사 2급 · 필기",
    desc: "네트워크 이론과 TCP/IP·라우팅 기초 학습",
    status: "준비 중"
  },
  {
    label: "리눅스마스터 2급 · 1차",
    desc: "리눅스 시스템 관리와 명령어 이론 학습",
    status: "준비 중"
  }
];

const PROJECTS = [
  /* ↓ 새 프로젝트는 여기(배열 맨 앞)에 추가하세요. 최신 작업이 먼저 보입니다. */
  {
    id: "full-security-lab",
    title: "Full-Security Labs",
    subtitle: "통합 보안 인프라 구축 — VLAN·라우팅·방화벽·NIDS·SIEM/모니터링·VPN·Log Analyzer·CTF",
    period: "2026.09",
    tags: ["GNS3", "VLAN", "Firewall", "NIDS", "SIEM", "Monitoring", "VPN", "CTF"],
    status: "완료",
    cover: "assets/projects/full-security-lab/topology.png",
    summary:
      "GNS3로 내부망·외부망·VLAN·라우팅·방화벽을 구성하고, VirtualBox에 서비스·보안관제 서버 9종을 올려 " +
      "방화벽(ASAv) 정책과 NIDS(Suricata) 탐지 룰을 실제 트래픽으로 검증한 통합 보안 랩입니다. " +
      "SIEM(WAZUH)·모니터링(Zabbix·PMM)·중앙 로그(Log Analyzer)·원격접속 VPN(pfSense)을 구축하고, 취약 VM(Earth)으로 CTF 침투까지 수행했습니다.",
    stats: [
      { label: "구축 서버", value: "9" },
      { label: "방화벽 룰(ASAv)", value: "5" },
      { label: "NIDS 룰(Suricata)", value: "3" },
      { label: "VLAN", value: "3" }
    ],
    meta: [
      { k: "기간", v: "2026.09" },
      { k: "환경", v: "GNS3 · VirtualBox · Ubuntu Server · FreeBSD(pfSense) · Kali" },
      { k: "도구", v: "Cisco ASAv · Suricata · WAZUH · OSSEC · Zabbix · PMM · pfSense/OpenVPN · rsyslog/LogAnalyzer · BIND9" },
      { k: "네트워크", v: "내부망 192.168.16.0/24 · 외부망 10.10.10.0/24 · VPN 터널 172.16.0.0/24" }
    ],
    blocks: [
      {
        type: "text",
        title: "프로젝트 개요",
        body:
          "상반기 학습 기술(VLAN·라우팅·서버·VPN·IDS·방화벽·SIEM·로그분석·CTF)을 하나의 랩으로 통합했습니다. " +
          "GNS3에서 스위치·라우터·방화벽으로 내부망/외부망과 VLAN을 구성하고, 그 위에 VirtualBox 서버들을 연결했습니다. " +
          "\"구성 → 트래픽 발생 → 로그/캡처로 검증\"을 원칙으로, 방화벽 차단·NIDS 탐지·에이전트 연동·VPN 접속을 모두 실제 결과로 확인했습니다."
      },
      {
        type: "image",
        src: "assets/projects/full-security-lab/topology.png",
        caption: "전체 토폴로지 — 내부망(서비스·보안관제 서버) / 외부망(공격자 VLAN 10·20·30) / ASAv-FW · Suricata(투명 브리지)"
      },
      {
        type: "table",
        head: ["서버 / 장비", "IP", "역할"],
        rows: [
          ["DNS (BIND9)", "192.168.16.91", "정·역방향 도메인 해석 (+ OSSEC·Zabbix 에이전트 호스트)"],
          ["Web-DB", "192.168.16.137", "Apache+PHP+MariaDB (+ WAZUH agent · PMM client · Log Analyzer)"],
          ["WAZUH", "192.168.16.221", "SIEM / HIDS 매니저"],
          ["NMS-Zabbix", "192.168.16.139", "서버·시스템 통합 모니터링"],
          ["PMM", "192.168.16.201", "DB 성능/쿼리 모니터링 (Docker)"],
          ["NIDS-Suricata", "192.168.16.202", "통과 트래픽 탐지(alert 전용)"],
          ["pfSense", "WAN DHCP / LAN 10.10.10.254", "Remote Access VPN (OpenVPN)"],
          ["Kali-Attacker", "192.168.16.71", "침투 테스트 · 트래픽 발생"],
          ["Earth VM", "192.168.16.48", "CTF 침투 대상"]
        ]
      },
      {
        type: "highlights",
        title: "핵심 작업",
        items: [
          { h: "네트워크 · 방화벽", p: "GNS3에서 VLAN 10/20/30, 라우팅, Cisco ASAv 방화벽을 구성하고 허용/차단 룰 5개를 packet-tracer와 실트래픽으로 검증했습니다." },
          { h: "NIDS 탐지", p: "Suricata를 ASAv↔R3 구간에 투명 브리지로 배치하고(탐지 전용), ICMP·SSH·HTTP(dbtest.php) 탐지 룰 3개를 작성해 fast.log로 확인했습니다." },
          { h: "SIEM · 모니터링", p: "WAZUH(SIEM/HIDS) 매니저에 Web-DB·DNS 에이전트를 연동하고, Zabbix·PMM으로 서버/DB를 모니터링했습니다. 에이전트는 대상 서버에 직접 배치했습니다." },
          { h: "VPN · 중앙 로그", p: "pfSense OpenVPN으로 원격 접속(터널 172.16.0.0/24)을 구성하고, rsyslog+LogAnalyzer로 Web-DB·PMM·WAZUH 로그를 한 화면에 모았습니다." },
          { h: "공격자 관점(CTF)", p: "Earth VM을 정찰→XOR 암호 분석→인증 후 RCE→SUID 권한상승으로 침투해 user·root 플래그를 획득하고 방어 개선안을 도출했습니다." }
        ]
      },

      /* ------------------------------ 01 방화벽 ------------------------------ */
      {
        type: "text",
        nav: "01 방화벽(ASAv)",
        title: "01 · Cisco ASAv 방화벽 정책",
        body:
          "외부망→내부망 경계에 Cisco ASAv를 두고, 서비스 공개는 최소 포트만 허용하고 나머지는 차단+로그하는 5개 룰을 설계했습니다. " +
          "각 룰은 `packet-tracer`로 ALLOW/DROP을 확인하고, 관리망(VLAN10) 룰은 실제 ping으로 교차 검증했습니다."
      },
      {
        type: "table",
        head: ["#", "방향", "정책", "검증 결과"],
        rows: [
          ["1", "outside → inside", "Web-DB TCP 80 허용", "ALLOW"],
          ["2", "outside → inside", "DNS UDP 53 허용", "ALLOW (DNS inspect)"],
          ["3", "outside → dmz", "pfSense UDP 1194 허용", "ALLOW"],
          ["4", "outside → inside", "VLAN10만 ICMP 허용, 그 외 차단+로그", "Kali 성공 / Attacker-D 차단"],
          ["5", "dmz → inside", "WAZUH 에이전트 포트만 허용, 내부 접근 차단", "1514-1515 ALLOW / 80 DROP"]
        ]
      },

      /* ------------------------------ 02 NIDS ------------------------------ */
      {
        type: "text",
        nav: "02 NIDS(Suricata)",
        title: "02 · Suricata NIDS 탐지 룰",
        body:
          "Suricata VM에 NIC 3개(관리 1 + 브리지 2)를 붙여 ASAv↔R3 구간을 투명하게 통과시키며 감시하도록 구성했습니다. " +
          "차단(drop) 없이 `alert`만 사용하는 탐지 전용(NIDS)으로 운영하고, 실제 트래픽으로 탐지를 확인했습니다."
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
        type: "image",
        src: "assets/projects/full-security-lab/suricata-rules.png",
        caption: "작성한 Suricata 탐지 룰 3개 (ICMP / DNS 서버 SSH / dbtest.php 접근)"
      },
      {
        type: "gallery",
        columns: 2,
        images: [
          { src: "assets/projects/full-security-lab/suricata-detect-icmp.png", caption: "SID 1000001 — 내부망 향 ICMP(ping) 탐지 (fast.log)" },
          { src: "assets/projects/full-security-lab/suricata-detect-http.png", caption: "SID 1000003 — Web-DB dbtest.php 접근 탐지" }
        ]
      },

      /* ------------------------------ 03 SIEM/모니터링 ------------------------------ */
      {
        type: "text",
        nav: "03 SIEM · 모니터링",
        title: "03 · WAZUH SIEM · Zabbix · PMM",
        body:
          "WAZUH(SIEM/HIDS) 매니저를 중심으로, 모니터링 에이전트를 대상 서버에 직접 배치했습니다. " +
          "WAZUH agent·PMM client는 Web-DB에, OSSEC(HIDS)·Zabbix agent는 DNS에 설치해 로그·메트릭을 각 매니저로 전송했습니다."
      },
      {
        type: "table",
        head: ["에이전트", "설치 위치", "리포트 대상"],
        rows: [
          ["WAZUH agent", "Web-DB (192.168.16.137)", "WAZUH 매니저 192.168.16.221"],
          ["OSSEC(HIDS) agent", "DNS (192.168.16.91)", "WAZUH 매니저 192.168.16.221"],
          ["Zabbix agent", "DNS (192.168.16.91)", "Zabbix 서버 192.168.16.139"],
          ["PMM client", "Web-DB (192.168.16.137)", "PMM 서버 192.168.16.201"]
        ]
      },
      {
        type: "gallery",
        columns: 2,
        images: [
          { src: "assets/projects/full-security-lab/wazuh-agents.png", caption: "WAZUH 매니저 — 에이전트 등록/Active 현황" },
          { src: "assets/projects/full-security-lab/ossec-connected.png", caption: "OSSEC(DNS) — 매니저 연동 확인" }
        ]
      },

      /* ------------------------------ 04 Log Analyzer ------------------------------ */
      {
        type: "text",
        nav: "04 Log Analyzer",
        title: "04 · 중앙 로그 수집 (Log Analyzer)",
        body:
          "Web-DB의 LAMP를 재사용해 중앙 로그 수집기를 구성했습니다. rsyslog가 514 포트로 로그를 받아 MariaDB(Syslog)에 저장하고, " +
          "Adiscon LogAnalyzer 웹 UI에서 조회합니다. Web-DB·PMM·WAZUH의 rsyslog가 수집기로 전달하며, WAZUH는 alerts.log도 함께 보냅니다."
      },
      {
        type: "image",
        src: "assets/projects/full-security-lab/loganalyzer.png",
        caption: "LogAnalyzer 웹 UI — Web-DB·PMM·WAZUH 로그를 한 화면에서 조회"
      },

      /* ------------------------------ 05 Web-DB ------------------------------ */
      {
        type: "text",
        nav: "05 Web-DB 서비스",
        title: "05 · Web-DB 서비스 · DB 연동",
        body:
          "Apache + PHP + MariaDB로 웹/DB 서비스를 구축하고, 방화벽·IDS 테스트용 페이지와 홈페이지를 배포했습니다. " +
          "`dbtest.php`로 웹↔DB 연동이 정상 동작하는지 확인했습니다."
      },
      {
        type: "gallery",
        columns: 2,
        images: [
          { src: "assets/projects/full-security-lab/webdb-home.png", caption: "Web-DB 홈페이지(index.html)" },
          { src: "assets/projects/full-security-lab/webdb-dbtest.png", caption: "dbtest.php — ‘DB 연결 성공’ 확인" }
        ]
      },

      /* ------------------------------ 06 pfSense VPN ------------------------------ */
      {
        type: "text",
        nav: "06 pfSense VPN",
        title: "06 · pfSense Remote Access VPN",
        body:
          "pfSense(FreeBSD)에 WAN(브리지)·LAN(내부네트워크) 어댑터를 두고, 내부 CA→서버 인증서→VPN 사용자 순으로 OpenVPN을 구성했습니다. " +
          "UDP 1194 / 터널 172.16.0.0/24 / 접근 내부망 192.168.16.0/24로 설정하고, Windows 호스트에서 접속해 내부망 서버 도달을 확인했습니다."
      },
      {
        type: "image",
        src: "assets/projects/full-security-lab/pfsense-vpn-status.png",
        caption: "pfSense Status > OpenVPN — 클라이언트 세션(터널 IP 172.16.0.2, AES-256-GCM) 연결 확인"
      },

      /* ------------------------------ 07 CTF ------------------------------ */
      {
        type: "text",
        nav: "07 CTF (Earth)",
        title: "07 · CTF — Earth VM 침투",
        body:
          "정찰부터 권한상승까지 전체 체인을 수행했습니다. 전체 포트 스캔으로 서비스·인증서 정보를 수집하고, " +
          "이름 기반 가상호스팅과 노출 파일을 열거해 취약 암호를 분석한 뒤, 관리자 패널의 명령 실행 취약점으로 침투했습니다."
      },
      {
        type: "steps",
        items: [
          { h: "정찰", p: "nmap 전체 포트 스캔 → 22/80/443, Apache 2.4.51(Fedora). 인증서 SAN에서 earth.local·terratest.earth.local 발견" },
          { h: "웹 열거", p: "robots.txt의 /testingnotes.* → 암호방식(XOR)·키파일(testdata.txt)·관리자(terra), gobuster로 /admin 포털 확인" },
          { h: "암호 분석", p: "반복키 XOR + 알려진 평문(known-plaintext) 취약으로 키 역산 → 관리자 자격증명 복원" },
          { h: "초기 침투(RCE)", p: "관리자 패널의 명령 실행 기능으로 인증 후 RCE(whoami=apache), 아웃바운드 차단 우회로 셸 확보 → user flag" },
          { h: "권한 상승(root)", p: "SUID /usr/bin/reset_root를 strings·ltrace로 분석해 트리거 파일 생성 → root 비번 재설정 → root flag" }
        ]
      },
      {
        type: "image",
        src: "assets/projects/full-security-lab/ctf-root-flag.png",
        caption: "root 권한 획득 및 root flag"
      },
      {
        type: "table",
        head: ["단계", "취약점", "방어 개선안"],
        rows: [
          ["정보 노출", "인증서 SAN · robots.txt로 호스트/파일 노출", "민감 정보 노출 최소화, 관리 페이지 접근 통제(IP 제한·MFA)"],
          ["암호 취약", "반복키 XOR + known-plaintext", "표준 검증 암호 사용, 키 재사용 금지"],
          ["초기 침투", "인증 후 임의 명령 실행(RCE)", "사용자 입력의 명령 실행 차단(파라미터화·화이트리스트)"],
          ["권한 상승", "SUID 바이너리 로직 악용", "SUID 최소화, 트리거 조건 검증 강화"]
        ]
      },
      {
        type: "callout",
        title: "방어 체계 연계",
        body:
          "CTF에서 나온 정찰·침투 트래픽을 NIDS(Suricata) alert와 WAZUH SIEM 이벤트로 탐지·상관분석하도록 룰/대시보드에 반영하는 것을 후속 과제로 정리했습니다."
      },
      {
        type: "file",
        title: "Full-Security Labs 결과보고서 (PDF)",
        desc: "전체 구축·검증·침투 결과 보고서 내려받기 (증거 캡처 포함)",
        href: "assets/projects/full-security-lab/Full-Security-Labs_결과보고서_최종.pdf"
      }
    ]
  },
  {
    id: "system-security-lab",
    title: "System Security Lab",
    subtitle: "리눅스 서버 하드닝 · 방화벽 · IDS/IPS · 취약점 점검 스크립트 · CTF",
    period: "2026.09",
    tags: ["Linux", "Hardening", "IDS/IPS", "Firewall", "Shell Script", "CTF"],
    status: "진행 중",
    cover: "assets/projects/system-security-lab/architecture.png",
    summary:
      "Kali(공격자)와 Rocky Linux·Ubuntu(피해 서버)로 구성한 실습망에서, 서버 보안 설정 → 방화벽 정책 → " +
      "Suricata/Snort 탐지·차단 룰 → KISA 기반 취약점 점검 스크립트 → CTF 침투 순으로 방어와 공격을 모두 수행했습니다.",
    stats: [
      { label: "KISA 점검 항목", value: "34" },
      { label: "Firewalld Rich Rule", value: "6" },
      { label: "IDS/IPS 룰", value: "7" },
      { label: "IDS/IPS 엔진", value: "2" }
    ],
    meta: [
      { k: "기간", v: "2026.09 ~" },
      { k: "환경", v: "VirtualBox · Kali Linux · Rocky Linux · Ubuntu 24.04" },
      { k: "도구", v: "firewalld · iptables · Suricata · Snort 3 · nmap · gobuster · nikto" },
      { k: "방식", v: "Kali 외 모든 VM을 삭제한 뒤 처음부터 재구축" }
    ],
    blocks: [
      {
        type: "text",
        title: "프로젝트 개요",
        body:
          "공격자(Kali) 한 대와 여러 대의 피해 서버를 두고, 서버마다 서로 다른 방어 수단을 적용한 뒤 " +
          "Kali에서 접속·스캔·공격을 시도해 차단과 탐지가 실제로 동작하는지 로그로 확인했습니다. " +
          "\"설정 → 공격 → 로그 확인\"을 한 사이클로 반복하는 것을 원칙으로 삼았습니다."
      },
      {
        type: "image",
        src: "assets/projects/system-security-lab/architecture.png",
        caption: "System Security Lab 구성도 — Attacker(Kali) / Victim(Rocky · Https Log · CTF) / IDS·IPS(Suricata · Snort)"
      },
      {
        type: "table",
        head: ["VM", "역할", "적용 내용"],
        rows: [
          ["Kali Linux", "공격자 · 테스트 클라이언트", "ssh / curl / ping / nmap / gobuster / nikto로 차단·탐지 검증"],
          ["Rocky Linux", "하드닝 대상 서버", "root SSH 차단, 패스워드 정책, firewalld Rich Rule, SetUID 점검"],
          ["Rocky Linux (IPS)", "Suricata 인라인 IPS", "NIC 2개 브리징, alert / drop 룰"],
          ["Rocky Linux (weblog)", "취약한 HTTPS Log 웹서버", "자체서명 HTTPS, 의도적 취약 설정, firewalld · iptables 정책"],
          ["Ubuntu 24.04", "Snort 3 IDS · 점검 대상", "Snort 소스 빌드, KISA 기반 점검 스크립트"],
          ["Earth VM", "CTF 침투 대상", "정찰 · 웹 열거 · XOR 암호 분석"]
        ]
      },
      {
        type: "highlights",
        title: "핵심 작업",
        items: [
          { h: "서버 하드닝", p: "root 원격 접속 차단, 패스워드 복잡도(8자 이상·대소문자·숫자·특수문자)와 90일 만료, firewalld Rich Rule로 Kali의 SSH/HTTP/HTTPS를 차단하고 로그를 남겼습니다." },
          { h: "IDS/IPS 구성", p: "Suricata를 인라인(IPS) 모드로 구성해 Telnet·SSH·HTTPS를 drop 하고, Snort 3는 소스 빌드하여 ICMP·/etc/passwd 요청·SSH 시도를 탐지하는 룰을 작성했습니다." },
          { h: "취약점 점검 자동화", p: "KISA 기술적 취약점 가이드 기반의 Ubuntu 점검 Bash 스크립트(34개 항목)를 작성했습니다. (팀 과제 · Ubuntu 담당)" },
          { h: "공격자 관점 검증", p: "nmap 전체 포트 스캔과 가상호스트 열거, robots.txt·gobuster 분석으로 CTF 대상(Earth VM)의 공격 경로를 정리했습니다." }
        ]
      },

      /* ------------------------------ 01 ------------------------------ */
      {
        type: "text",
        nav: "01 서버 하드닝",
        title: "01 · Rocky Linux 서버 하드닝",
        body:
          "먼저 `cat /etc/rocky-release`, `ip a`, `getenforce`로 버전·네트워크·SELinux 상태를 확인하고, " +
          "SSH, 패스워드, 방화벽, 권한 상승 경로 순으로 보안 설정을 적용했습니다."
      },
      {
        type: "text",
        title: "root 원격 SSH 접속 차단",
        body:
          "설정 전에 sudo 가능한 일반 계정(wheel 그룹)을 먼저 만들었습니다. 계정이 없으면 원격 관리 수단이 사라지기 때문입니다. " +
          "`sshd_config`를 직접 고치지 않고 드롭인 파일로 분리하고, `sshd -t`로 문법을 검사한 뒤 적용했습니다."
      },
      {
        type: "code",
        title: "root 로그인 차단 (drop-in)",
        code:
`# 백업
cp /etc/ssh/sshd_config /etc/ssh/sshd_config.bak

# 드롭인 파일로 설정
cat > /etc/ssh/sshd_config.d/10-disable-root.conf <<EOF
PermitRootLogin no
EOF

# 문법 검사 후 적용
sshd -t
systemctl restart sshd

# 검증 (Kali 등 다른 호스트에서)
ssh root@<서버 IP>     # → Permission denied`
      },
      {
        type: "text",
        title: "패스워드 복잡도 · 만료 정책",
        body:
          "`pwquality`로 최소 8자 + 대문자·소문자·숫자·특수문자 각 1자 이상을 강제하고, " +
          "`pam_pwquality`에 `enforce_for_root`를 추가해 root에도 동일하게 적용했습니다. 만료일은 90일로 설정했습니다."
      },
      {
        type: "code",
        title: "/etc/security/pwquality.conf · chage",
        code:
`cat >> /etc/security/pwquality.conf <<EOF
minlen = 8
ucredit = -1
lcredit = -1
dcredit = -1
ocredit = -1
EOF

sed -i 's/pam_pwquality.so local_users_only/pam_pwquality.so local_users_only enforce_for_root/' /etc/pam.d/system-auth

# 기존 계정 90일 만료, 신규 계정 기본값도 90일
chage -M 90 <user>
sed -i 's/^PASS_MAX_DAYS.*/PASS_MAX_DAYS   90/' /etc/login.defs

# 검증: 소문자만 8자 → 거부, 대소문자+숫자+특수문자 8자 → 성공
passwd <user>`
      },
      {
        type: "text",
        title: "firewalld Rich Rule 3개 (차단 + 로그)",
        body:
          "Kali(공격자 IP)에서 오는 SSH(22), HTTP(80), HTTPS(443)를 `reject` 하면서 규칙마다 로그 프리픽스를 붙였습니다. " +
          "차단 여부는 Kali에서 직접 접속해 보고, 서버에서는 `journalctl -k`로 프리픽스가 찍히는지 확인했습니다."
      },
      {
        type: "code",
        title: "Rich Rule 예시 (SSH)",
        code:
`firewall-cmd --permanent --add-rich-rule='rule family="ipv4" source address="<Kali IP>" \\
  port protocol="tcp" port="22" log prefix="KALI-SSH-BLOCK" level="info" reject'

firewall-cmd --reload
firewall-cmd --list-rich-rules

# 서버: 실시간 커널 로그
journalctl -k -f | grep -i "KALI-"

# Kali: 차단 확인
ssh root@<서버 IP>
curl -m 5 http://<서버 IP>
curl -m 5 -k https://<서버 IP>`
      },
      {
        type: "text",
        title: "SetUID 권한 상승 경로 점검",
        body:
          "SetUID 비트가 걸린 파일은 실행자가 누구든 파일 소유자(root) 권한으로 동작하므로 권한 상승의 대표 경로가 됩니다. " +
          "시스템 전체의 SetUID 파일을 조사하고, root 소유 bash 복사본에 SetUID를 부여해 일반 사용자가 root 권한(euid=0)을 얻는 과정을 재현했습니다."
      },
      {
        type: "code",
        title: "SetUID 전수 조사 · 권한 상승 재현",
        code:
`# 시스템 내 SetUID 파일 전수 조사
find / -perm -4000 -type f 2>/dev/null

# 재현: root 소유 bash 복사본에 SetUID 부여
cp /bin/bash /tmp/rootbash
chmod u+s /tmp/rootbash

# 일반 사용자로 전환 후 -p(권한 유지)로 실행 → euid=0 확인
su - <user>
/tmp/rootbash -p
id

# 정리
rm -f /tmp/rootbash`
      },

      /* ------------------------------ 02 ------------------------------ */
      {
        type: "text",
        nav: "02 KISA 점검 스크립트",
        title: "02 · KISA 기반 Ubuntu 취약점 점검 스크립트",
        body:
          "\"주요정보통신기반시설 기술적 취약점 분석·평가 방법 상세가이드\"의 UNIX 서버 항목 코드(U-01 ~ U-67)를 그대로 사용해 " +
          "Ubuntu 서버를 자동 점검하는 Bash 스크립트를 작성했습니다. 팀 과제에서 Ubuntu 파트를 담당했습니다."
      },
      {
        type: "table",
        head: ["영역", "항목 수", "대표 점검 내용"],
        rows: [
          ["계정 관리", "12", "root 원격 접속, 패스워드 정책, 계정 잠금(faillock), UID 0 중복, su 제한, 세션 TMOUT, 암호화 알고리즘"],
          ["파일·디렉터리 관리", "10", "/etc/passwd · shadow 권한, SUID/SGID, world-writable, 소유자 없는 파일, UFW"],
          ["서비스 관리", "8", "Telnet · r계열 · tftp · echo 계열 비활성화, SSH 로그인 배너, sudoers 권한"],
          ["패치 관리", "1", "업그레이드 가능한 패키지 확인"],
          ["로그 관리", "3", "시각 동기화(NTP), rsyslog 동작, /var/log 권한"]
        ]
      },
      {
        type: "highlights",
        items: [
          { h: "판정 4단계", p: "각 항목을 [양호] · [취약] · [확인필요] · [해당없음]으로 구분하고, 위험도(상/중/하)를 항목 이름에 함께 표기했습니다." },
          { h: "결과 요약", p: "종료 시 양호/취약/확인필요 개수와 취약 항목 코드 목록(예: U-01, U-06)을 한눈에 정리해 출력합니다." },
          { h: "로그 자동 저장", p: "모든 출력은 /var/log/kisa_check_<날짜_시간>.log 에 함께 기록되어 증적으로 남습니다." },
          { h: "안전한 실행", p: "root 권한이 아니면 즉시 종료하고, 점검만 수행할 뿐 시스템 설정은 변경하지 않습니다." }
        ]
      },
      {
        type: "code",
        title: "kisa_ubuntu_check.sh (발췌)",
        lang: "bash",
        code:
`pass() { PASS=$((PASS+1)); log "\${GREEN}[양호]\${NC} $1"; }
fail() { FAIL=$((FAIL+1)); FAIL_CODES+=("$CURRENT_CODE"); log "\${RED}[취약]\${NC} $1"; }
info() { INFO=$((INFO+1)); INFO_CODES+=("$CURRENT_CODE"); log "\${YELLOW}[확인필요]\${NC} $1"; }

item "U-01 (상) root 계정 원격 접속 제한"
PRL=$(sshd -T 2>/dev/null | grep -i "^permitrootlogin" | awk '{print $2}')
[[ "$PRL" == "no" ]] && pass "PermitRootLogin=no" \\
                     || fail "PermitRootLogin=$PRL (원격 root 접속 허용 상태)"

# 실행
chmod +x kisa_ubuntu_check.sh
sudo bash kisa_ubuntu_check.sh`
      },
      {
        type: "file",
        title: "kisa_ubuntu_check.sh",
        desc: "전체 스크립트 내려받기 (Bash · 34개 점검 항목)",
        href: "assets/projects/system-security-lab/kisa_ubuntu_check.sh"
      },

      /* ------------------------------ 03 ------------------------------ */
      {
        type: "text",
        nav: "03 Suricata IPS",
        title: "03 · Suricata 인라인 IPS",
        body:
          "Rocky Linux에 NIC 두 개(어댑터 1 NAT, 어댑터 2 내부망)를 연결하고, Suricata를 인라인(IPS) 모드로 구성했습니다. " +
          "`af-packet`으로 두 인터페이스를 서로 브리징(`copy-mode: ips`)하고 IP 포워딩을 켜 트래픽이 Suricata를 거쳐 지나가도록 했습니다."
      },
      {
        type: "steps",
        items: [
          { h: "NIC 준비", p: "내부망 NIC(enp0s8)에 고정 IP를 부여하고 promisc 모드를 켠 뒤 tcpdump로 패킷이 보이는지 먼저 확인" },
          { h: "설치", p: "EPEL 저장소 추가 후 dnf로 Suricata 설치, suricata -V로 확인" },
          { h: "기본 설정", p: "suricata.yaml의 HOME_NET(192.168.16.0/24)과 af-packet 인터페이스, /etc/sysconfig/suricata 옵션 수정" },
          { h: "룰 업데이트", p: "suricata-update로 et/open 룰셋을 받아 룰 파일 경고 해소" },
          { h: "커스텀 룰", p: "local.rules 작성 후 rule-files에 등록, suricata -T 로 설정 검증" },
          { h: "인라인 전환", p: "copy-mode: ips, inline: yes, ip_forward=1 설정 후 재시작" },
          { h: "동작 확인", p: "fast.log를 실시간으로 보며 Kali에서 SSH·ping 시도 → drop / alert 여부 확인" }
        ]
      },
      {
        type: "code",
        title: "/etc/suricata/rules/local.rules",
        code:
`# 탐지(alert) — 차단하지 않고 기록만
alert icmp any any -> $HOME_NET any (msg:"ICMP Ping Detected"; sid:1000001; rev:1;)

# 차단(drop) — 인라인 IPS에서 패킷 폐기
drop tcp any any -> $HOME_NET 23  (msg:"Block Telnet Attempt"; sid:1000002; rev:1;)
drop tcp any any -> $HOME_NET 22  (msg:"Block SSH Attempt";    sid:1000003; rev:1;)
drop tcp any any -> $HOME_NET 443 (msg:"Block HTTPS Attempt";  sid:1000004; rev:1;)`
      },
      {
        type: "code",
        title: "suricata.yaml — af-packet 인라인 브리징",
        lang: "yaml",
        code:
`af-packet:
  - interface: enp0s8
    threads: auto
    cluster-id: 99
    cluster-type: cluster_flow
    defrag: yes
    copy-mode: ips
    copy-iface: enp0s3

  - interface: enp0s3
    threads: auto
    cluster-id: 100
    cluster-type: cluster_flow
    defrag: yes
    copy-mode: ips
    copy-iface: enp0s8`
      },
      {
        type: "callout",
        title: "검증 습관 · 재시작 전 설정 테스트",
        body:
          "인라인 모드에서는 설정 오류가 곧 네트워크 단절로 이어질 수 있어, 서비스 재시작 전에 항상 " +
          "`suricata -T -c /etc/suricata/suricata.yaml -v`로 검증하고 통과했을 때만 재시작했습니다."
      },

      /* ------------------------------ 04 ------------------------------ */
      {
        type: "text",
        nav: "04 Https Log 서버",
        title: "04 · Https Log 서버 — 취약한 웹서버 구축과 방어",
        body:
          "Rocky Linux에 Apache + mod_ssl로 HTTPS 웹서버(weblog)를 만들고, 일부러 취약하게 설정한 뒤 " +
          "방화벽(firewalld → iptables)으로 접근을 통제하며 접속 로그를 분석했습니다."
      },
      {
        type: "highlights",
        title: "의도적으로 적용한 취약점 (실습용)",
        items: [
          { h: "버전 정보 노출", p: "ServerTokens Full / ServerSignature On 으로 응답 헤더에 서버 버전이 그대로 노출" },
          { h: "TRACE 메서드 허용", p: "원래는 비활성화해야 하는 HTTP 메서드를 TraceEnable On 으로 허용" },
          { h: "디렉터리 리스팅 · 민감 파일", p: "index 파일이 없는 /files/ 에 더미 자격증명 파일을 두어 목록과 내용이 노출되도록 구성" }
        ]
      },
      {
        type: "text",
        title: "firewalld Rich Rule 3개",
        body:
          "Kali의 HTTP(80)는 거부 + 로그, Kali의 ping(echo-request)은 차단, 같은 대역의 HTTPS는 허용하되 분당 5회로 제한하며 접속 로그를 남기도록 했습니다. " +
          "Kali에서 `curl http://…`과 `ping`은 실패, `curl -k https://…`는 성공해야 정상이며, 서버에서는 `journalctl -k | grep FW_`로 규칙별 로그를 확인했습니다."
      },
      {
        type: "text",
        title: "iptables — Host의 SSH · HTTP 차단",
        body:
          "firewalld를 끄고 iptables로 전환해, 관리 PC(Host)에서 오는 SSH(22)와 HTTP(80)는 LOG 후 DROP, " +
          "나머지(Kali 실습, HTTPS)는 허용하고 마지막에 기본 DROP을 두었습니다. 규칙을 적용하면 Host의 SSH 세션이 끊길 수 있어, " +
          "PuTTY가 아닌 VirtualBox 콘솔에서 직접 작업했습니다."
      },
      {
        type: "code",
        title: "iptables 정책 (발췌)",
        code:
`iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT
iptables -A INPUT -i lo -j ACCEPT

# Host → SSH 차단 (로그 후 DROP)
iptables -A INPUT -s <Host IP> -p tcp --dport 22 -j LOG --log-prefix "IPT_HOST_SSH "
iptables -A INPUT -s <Host IP> -p tcp --dport 22 -j DROP
# Host → HTTP 차단
iptables -A INPUT -s <Host IP> -p tcp --dport 80 -j LOG --log-prefix "IPT_HOST_HTTP "
iptables -A INPUT -s <Host IP> -p tcp --dport 80 -j DROP

# 나머지 허용 후 기본 차단
iptables -A INPUT -p tcp -m multiport --dports 22,80,443 -j ACCEPT
iptables -A INPUT -p icmp -j ACCEPT
iptables -A INPUT -j DROP

# 검증 (Windows PowerShell)
Test-NetConnection <weblog IP> -Port 22    # False
Test-NetConnection <weblog IP> -Port 80    # False
Test-NetConnection <weblog IP> -Port 443   # True`
      },
      {
        type: "image",
        src: "assets/projects/system-security-lab/iptables-log.png",
        caption: "journalctl 결과 — IPT_HOST_SSH / IPT_HOST_HTTP 프리픽스로 Host(SRC)의 22·80 접속 시도(SYN)가 차단·기록됨"
      },
      {
        type: "table",
        head: ["로그 항목", "값", "의미"],
        rows: [
          ["IPT_HOST_SSH / IPT_HOST_HTTP", "log-prefix", "직접 만든 Host 차단 규칙에 걸렸다는 표시"],
          ["SRC → DST", "Host PC → weblog 서버", "패킷의 출발지와 목적지"],
          ["DPT", "22 / 80", "접속하려던 목적지 포트 (SSH / HTTP)"],
          ["SYN", "TCP 플래그", "연결을 시작하려는 첫 패킷 — 재시도가 반복되어 여러 줄 기록"]
        ]
      },

      /* ------------------------------ 05 ------------------------------ */
      {
        type: "text",
        nav: "05 Snort 3",
        title: "05 · Snort 3 탐지 센서 (소스 빌드)",
        body:
          "Ubuntu 24.04 Server에서 libdaq → gperftools(tcmalloc) → snort3 순으로 소스 빌드하고, " +
          "NIC를 promisc 모드로 두고 GRO/LRO를 끄는 systemd 서비스를 등록해 재부팅 후에도 유지되게 했습니다."
      },
      {
        type: "steps",
        items: [
          { h: "VM 준비", p: "RAM 4GB · CPU 2 · 디스크 25GB 이상, 어댑터는 브리지 + 무작위 모드 '모두 허용'. tcpdump로 패킷이 보이는지 사전 확인" },
          { h: "의존성 설치", p: "build-essential, libpcap, libnetfilter-queue, luajit, hwloc 등" },
          { h: "빌드", p: "libdaq → gperftools 2.13 → snort3 (--enable-tcmalloc), snort -V로 설치 확인" },
          { h: "NIC 서비스", p: "snort3-nic.service 로 promisc on + GRO/LRO off 를 부팅 시 자동 적용" },
          { h: "snort.lua", p: "HOME_NET / EXTERNAL_NET 지정, ips 블록에 local.rules include" },
          { h: "검증 후 실행", p: "snort -T 로 설정 검증 → alert_fast 모드로 실행" }
        ]
      },
      {
        type: "code",
        title: "local.rules — 탐지 룰 3개",
        code:
`alert icmp $KALI any -> $CTF any (msg:"[DETECT] Kali -> CTF Ping"; itype:8; sid:1000001; rev:1;)
alert http $KALI any -> $ROCKY any (msg:"[DETECT] Kali -> Rocky /etc/passwd"; http_uri; content:"/etc/passwd", nocase; sid:1000002; rev:1;)
alert tcp  $CTF  any -> $KALI 22 (msg:"[DETECT] CTF -> Kali SSH"; flags:S; sid:1000003; rev:1;)

# 검증 → 실행
sudo snort -c /usr/local/etc/snort/snort.lua -T
sudo snort -c /usr/local/etc/snort/snort.lua -i enp0s3 -A alert_fast -s 65535 -k none`
      },
      {
        type: "callout",
        title: "옵션 메모",
        body:
          "snort.lua에 local.rules를 이미 include 했다면 실행 옵션의 `-R`을 함께 쓰지 않습니다(같은 규칙이 두 번 읽혀 중복 경고). " +
          "VM 환경에서 체크섬 때문에 탐지가 되지 않는 경우가 있어 `-k none`으로 체크섬 검사를 껐습니다."
      },

      /* ------------------------------ 06 ------------------------------ */
      {
        type: "text",
        nav: "06 CTF (Earth)",
        title: "06 · CTF — Earth VM 정찰과 열거",
        body:
          "\"안 보이면 못 뚫는다\"는 원칙으로 정찰 단계부터 정리했습니다. 전체 포트 스캔으로 서비스와 인증서 정보를 수집하고, " +
          "이름 기반 가상호스팅 구조를 파악해 공격 경로를 좁혔습니다."
      },
      {
        type: "steps",
        items: [
          { h: "포트 · 서비스 스캔", p: "nmap -p- -sV -sC 로 22 / 80 / 443 오픈과 Apache 2.4.51(Fedora) 확인, 80 포트 타이틀 \"Earth Secure Messaging\"" },
          { h: "가상호스트 발견", p: "SSL 인증서 SAN에서 earth.local, terratest.earth.local 두 호스트명을 확인 → IP로 접속하면 기본 페이지만 나오는 이유(이름 기반 가상호스팅)를 파악" },
          { h: "hosts 등록", p: "Kali의 /etc/hosts 에 호스트명을 등록해 두 사이트에 접근" },
          { h: "정보 수집", p: "terratest의 robots.txt 에서 /testingnotes.* 경로 확인, gobuster로 earth.local의 관리자(admin) 로그인 포털 발견" },
          { h: "암호 분석 준비", p: "메인 페이지의 16진수 메시지는 XOR 암호 — 평문 ⊕ 암호문 = 키 원리로 키를 역산하는 계획 수립" }
        ]
      },
      {
        type: "code",
        title: "정찰 · 열거 명령",
        code:
`# 호스트 탐지 → 전체 포트 + 버전 + 기본 스크립트
sudo nmap -sn 192.168.16.0/24
sudo nmap -p- -sV -sC -T4 <EARTH_IP> -oN earth_nmap.txt

# 가상호스트 이름 등록
echo "<EARTH_IP> earth.local terratest.earth.local" | sudo tee -a /etc/hosts

# 숨은 경로 열거
curl -sk https://terratest.earth.local/robots.txt
gobuster dir -u https://earth.local/ -k -w /usr/share/wordlists/dirb/big.txt`
      },
      {
        type: "callout",
        title: "진행 상황",
        body:
          "현재 정찰·열거와 XOR 암호 분석 계획까지 정리한 상태이며, 복호화 → 관리자 로그인 → 플래그 획득 과정은 이어서 진행한 뒤 이 프로젝트에 추가할 예정입니다."
      },

      /* ------------------------------ 트러블슈팅 ------------------------------ */
      {
        type: "text",
        nav: "트러블슈팅",
        title: "트러블슈팅 기록",
        body: "실습 중 만난 문제와 원인, 해결 방법입니다."
      },
      {
        type: "table",
        head: ["문제", "원인", "해결"],
        rows: [
          ["root SSH 차단 후 원격 관리 불가 위험", "sudo 가능한 일반 계정이 없는 상태에서 차단", "wheel 그룹 계정을 먼저 만들고 적용, `sshd -t`로 문법 검증"],
          ["`Error: INVALID_ADDR: KALI_IP`", "자리표시(KALI_IP)를 IP 대신 그대로 입력", "Kali의 실제 IP로 교체해 Rich Rule 재등록"],
          ["Suricata `No rule files match the pattern`", "룰 파일(suricata.rules)이 아직 없음", "`suricata-update enable-source et/open` 후 `suricata-update`"],
          ["iptables 적용 중 SSH 세션 단절", "Host에서 SSH로 접속한 채 규칙을 적용", "VirtualBox 콘솔에서 직접 작업"],
          ["Snort 중복 경고 / 탐지 누락", "`-R`과 include 중복, VM 체크섬 문제", "`-R` 제거, `-k none` 적용"],
          ["룰이 동작하지 않음 (IP 변경)", "DHCP로 받은 IP가 바뀌어 룰의 IP와 불일치", "nmcli로 고정 IP 설정, 변수로 룰 재생성"],
          ["SetUID 재현 실패", "bash 복사본의 소유자가 root가 아닌 일반 사용자", "프로세스 종료 → 삭제 → root로 재생성 후 `chmod u+s`"]
        ]
      }
    ]
  }
];
