#!/bin/bash
#===============================================================================
# KISA "주요정보통신기반시설 기술적 취약점 분석·평가 방법 상세가이드" 기반
# Ubuntu Linux 서버 취약점 점검 스크립트
# System_Security_Lab 팀 과제 - Ubuntu 담당
#
# 항목 코드(U-01~U-67)는 KISA 가이드의 UNIX 서버 점검항목 코드를 그대로 사용합니다.
#===============================================================================

LOGFILE="/var/log/kisa_check_$(date +%Y%m%d_%H%M%S).log"
PASS=0; FAIL=0; INFO=0
CURRENT_CODE=""
declare -a FAIL_CODES=()
declare -a INFO_CODES=()

GREEN='\033[0;32m'; RED='\033[0;31m'; YELLOW='\033[1;33m'; BLUE='\033[0;34m'; NC='\033[0m'

log()  { echo -e "$1" | tee -a "$LOGFILE"; }
pass() { PASS=$((PASS+1)); log "${GREEN}[양호]${NC} $1"; }
fail() { FAIL=$((FAIL+1)); FAIL_CODES+=("$CURRENT_CODE"); log "${RED}[취약]${NC} $1"; }
info() { INFO=$((INFO+1)); INFO_CODES+=("$CURRENT_CODE"); log "${YELLOW}[확인필요]${NC} $1"; }
na()   { log "${BLUE}[해당없음]${NC} $1"; }
sect() { log ""; log "############################################################"; log "# $1"; log "############################################################"; }
item() {
    log ""
    log "----- $1 -----"
    # 항목 코드(U-01 등) 추출
    CURRENT_CODE=$(echo "$1" | grep -oE "^U-[0-9]+")
}

if [[ $EUID -ne 0 ]]; then
    echo "root 권한으로 실행하세요: sudo bash $0"
    exit 1
fi

log "KISA 기반 Ubuntu 취약점 점검 시작: $(date)"
log "호스트: $(hostname) / IP: $(hostname -I | awk '{print $1}')"

#===============================================================================
sect "1. 계정 관리"
#===============================================================================

item "U-01 (상) root 계정 원격 접속 제한"
PRL=$(sshd -T 2>/dev/null | grep -i "^permitrootlogin" | awk '{print $2}')
[[ "$PRL" == "no" ]] && pass "PermitRootLogin=no" || fail "PermitRootLogin=$PRL (원격 root 접속 허용 상태)"

item "U-02 (상) 비밀번호 관리정책 설정"
MINLEN=$(grep -E "^\s*minlen" /etc/security/pwquality.conf 2>/dev/null | tail -1 | grep -oE "[0-9]+")
UCR=$(grep -E "^\s*ucredit" /etc/security/pwquality.conf 2>/dev/null | tail -1 | grep -oE "\-[0-9]+")
ENF_ROOT=$(grep -E "^\s*enforce_for_root" /etc/security/pwquality.conf 2>/dev/null)
MAXD=$(grep -E "^PASS_MAX_DAYS" /etc/login.defs | awk '{print $2}')
if [[ -n "$MINLEN" && "$MINLEN" -ge 8 && "$UCR" == "-1" && "$MAXD" == "90" ]]; then
    pass "minlen=$MINLEN, ucredit=$UCR, PASS_MAX_DAYS=$MAXD 정상 설정"
else
    fail "minlen=${MINLEN:-미설정}, ucredit=${UCR:-미설정}, PASS_MAX_DAYS=${MAXD:-미설정} (요구값: 8자/-1/90일)"
fi
[[ -z "$ENF_ROOT" ]] && info "enforce_for_root 미설정 (root 계정은 정책 예외 적용 중)"

item "U-03 (상) 계정 잠금 임계값 설정"
if command -v faillock &>/dev/null || [[ -f /etc/security/faillock.conf ]]; then
    DENY=$(grep -E "^\s*deny" /etc/security/faillock.conf 2>/dev/null | grep -oE "[0-9]+")
    if [[ -n "$DENY" && "$DENY" -le 10 ]]; then
        pass "faillock deny=$DENY (10회 이하)"
    else
        fail "faillock deny=${DENY:-미설정} (10회 이하로 설정 필요)"
    fi
else
    fail "pam_faillock 미설정 (계정 잠금 정책 없음)"
fi

item "U-04 (상) 비밀번호 파일 보호 (Shadow 사용 여부)"
if awk -F: '$2=="x"{c++} END{exit !c}' /etc/passwd; then
    pass "/etc/passwd 2번째 필드가 x (shadow 정책 사용 중)"
else
    fail "/etc/passwd에 평문/해시 비밀번호가 직접 저장된 계정 존재"
fi

item "U-05 (상) root 이외의 UID '0' 금지"
DUP0=$(awk -F: '$3==0 && $1!="root"{print $1}' /etc/passwd)
[[ -z "$DUP0" ]] && pass "UID 0인 계정은 root 뿐" || fail "UID 0 계정 발견: $DUP0"

item "U-06 (상) 사용자 계정 su 기능 제한"
SU_PAM=$(grep -E "pam_wheel.so" /etc/pam.d/su 2>/dev/null)
if [[ -n "$SU_PAM" ]]; then
    pass "su가 wheel 그룹으로 제한됨: $SU_PAM"
else
    fail "/etc/pam.d/su에 pam_wheel.so 제한 설정 없음 (모든 사용자 su 사용 가능)"
fi

item "U-07 (하) 불필요한 계정 제거 (로그인 가능한 UID>=1000 계정 목록)"
awk -F: '$3>=1000 && $7 !~ /nologin|false/ {print "  - "$1" (uid="$3", shell="$7")"}' /etc/passwd | tee -a "$LOGFILE"
info "위 목록에서 실제 사용하지 않는 계정이 있는지 수동 확인 필요"

item "U-08 (중) 관리자 그룹(sudo)에 최소 계정만 포함"
SUDO_MEMBERS=$(getent group sudo | awk -F: '{print $4}')
log "sudo 그룹 구성원: ${SUDO_MEMBERS:-없음}"
info "불필요한 계정이 포함되어 있지 않은지 수동 확인"

item "U-10 (중) 동일한 UID 금지"
DUP_UID=$(awk -F: '{print $3}' /etc/passwd | sort | uniq -d)
[[ -z "$DUP_UID" ]] && pass "중복 UID 없음" || fail "중복 UID 발견: $DUP_UID"

item "U-11 (하) 사용자 Shell 점검 (시스템 계정)"
BAD_SHELL=$(awk -F: '$3<1000 && $1!="root" && $7 !~ /nologin|false/ {print $1}' /etc/passwd)
[[ -z "$BAD_SHELL" ]] && pass "시스템 계정은 모두 nologin/false 쉘 사용" || fail "쉘이 부여된 시스템 계정: $BAD_SHELL"

item "U-12 (하) 세션 종료 시간(TMOUT) 설정"
TMOUT=$(grep -rE "^\s*(export\s+)?TMOUT" /etc/profile /etc/profile.d/*.sh 2>/dev/null | grep -oE "TMOUT=[0-9]+" | head -1)
[[ -n "$TMOUT" ]] && pass "$TMOUT 설정됨" || fail "TMOUT 미설정 (세션 자동 종료 없음)"

item "U-13 (중) 안전한 비밀번호 암호화 알고리즘"
ENC=$(grep -E "^ENCRYPT_METHOD" /etc/login.defs | awk '{print $2}')
if [[ "$ENC" =~ SHA512|YESCRYPT ]]; then
    pass "ENCRYPT_METHOD=$ENC"
else
    fail "ENCRYPT_METHOD=${ENC:-미설정} (SHA512 또는 YESCRYPT 권장)"
fi

#===============================================================================
sect "2. 파일 및 디렉터리 관리"
#===============================================================================

item "U-15 (상) 소유자 없는 파일 점검"
NOOWNER=$(find / -xdev \( -nouser -o -nogroup \) 2>/dev/null | head -10)
[[ -z "$NOOWNER" ]] && pass "소유자/그룹 없는 파일 없음" || { fail "소유자 없는 파일 발견 (상위 10개):"; log "$NOOWNER"; }

item "U-16 (상) /etc/passwd 소유자 및 권한"
PPERM=$(stat -c "%U:%a" /etc/passwd)
[[ "$PPERM" == "root:644" ]] && pass "root:644" || fail "현재 $PPERM (권장: root:644)"

item "U-18 (상) /etc/shadow 소유자 및 권한"
SPERM=$(stat -c "%U:%a" /etc/shadow)
if [[ "$SPERM" == "root:640" || "$SPERM" == "root:600" || "$SPERM" == "root:000" ]]; then
    pass "$SPERM"
else
    fail "현재 $SPERM (640 이하 권장)"
fi

item "U-19 (상) /etc/hosts 소유자 및 권한"
HPERM=$(stat -c "%U:%a" /etc/hosts)
[[ "$HPERM" == "root:644" || "$HPERM" == "root:600" ]] && pass "$HPERM" || fail "현재 $HPERM (권장: root:644 이하)"

item "U-21 (상) /etc/rsyslog.conf 소유자 및 권한"
if [[ -f /etc/rsyslog.conf ]]; then
    RPERM=$(stat -c "%U:%a" /etc/rsyslog.conf)
    [[ "$RPERM" == "root:644" || "$RPERM" == "root:640" ]] && pass "$RPERM" || fail "현재 $RPERM"
else
    na "/etc/rsyslog.conf 없음"
fi

item "U-23 (상) SUID/SGID/Sticky bit 설정 파일 점검"
SUID_FILES=$(find / -xdev -perm -4000 -type f 2>/dev/null)
SGID_FILES=$(find / -xdev -perm -2000 -type f 2>/dev/null)
log "SUID 파일 수: $(echo "$SUID_FILES" | grep -c .) / SGID 파일 수: $(echo "$SGID_FILES" | grep -c .)"
KNOWN="passwd|sudo|su|mount|umount|newgrp|gpasswd|chsh|chfn|chage|fusermount|pkexec|ssh-keysign|unix_chkpwd|at|crontab|Xorg"
UNKNOWN_SUID=$(echo "$SUID_FILES" | grep -vE "$KNOWN" | grep -v "^$")
if [[ -z "$UNKNOWN_SUID" ]]; then
    pass "화이트리스트 외 SUID 파일 없음"
else
    fail "의심 SUID 파일 발견:"; log "$UNKNOWN_SUID"
fi

item "U-25 (상) world writable 파일 점검"
WW=$(find / -xdev -type f -perm -0002 2>/dev/null | grep -v "^/proc")
WWC=$(echo "$WW" | grep -c .)
[[ "$WWC" -eq 0 ]] && pass "world-writable 파일 없음" || { fail "world-writable 파일 ${WWC}개:"; log "$WW"; }

item "U-27 (상) \$HOME/.rhosts, hosts.equiv 사용 금지"
RHOSTS=$(find /home /root -name ".rhosts" 2>/dev/null; [[ -f /etc/hosts.equiv ]] && echo "/etc/hosts.equiv")
[[ -z "$RHOSTS" ]] && pass ".rhosts / hosts.equiv 파일 없음" || { fail "발견된 파일:"; log "$RHOSTS"; }

item "U-28 (상) 접속 IP 및 포트 제한 (UFW)"
if command -v ufw &>/dev/null; then
    UFW_STATUS=$(ufw status | head -1)
    echo "$UFW_STATUS" | grep -qi active && pass "UFW 활성화: $UFW_STATUS" || fail "UFW 비활성화"
else
    fail "ufw 미설치"
fi

item "U-30 (중) UMASK 설정 관리"
UMASK_ETC=$(grep -E "^\s*UMASK" /etc/login.defs | awk '{print $2}')
[[ "$UMASK_ETC" == "022" || "$UMASK_ETC" == "027" ]] && pass "UMASK=$UMASK_ETC" || fail "UMASK=${UMASK_ETC:-미설정} (022 권장)"

#===============================================================================
sect "3. 서비스 관리"
#===============================================================================

check_service_disabled () {
    local svc="$1" label="$2"
    if systemctl list-unit-files 2>/dev/null | grep -q "^${svc}"; then
        if systemctl is-active --quiet "$svc"; then
            fail "$label ($svc) 서비스가 활성 상태"
        else
            pass "$label ($svc) 설치되어 있으나 비활성 상태"
        fi
    else
        na "$label ($svc) 미설치"
    fi
}

item "U-34 (상) Finger 서비스 비활성화"
check_service_disabled "fingerd" "Finger"

item "U-36 (상) r 계열 서비스(rlogin/rsh/rexec) 비활성화"
check_service_disabled "rlogin" "rlogin"
check_service_disabled "rsh" "rsh"

item "U-37 (상) crontab 설정파일 권한 설정"
if [[ -d /var/spool/cron/crontabs ]]; then
    CPERM=$(stat -c "%a" /var/spool/cron/crontabs 2>/dev/null)
    [[ "$CPERM" -le 750 ]] && pass "crontabs 디렉터리 권한 $CPERM" || fail "crontabs 디렉터리 권한 $CPERM (750 이하 권장)"
else
    na "/var/spool/cron/crontabs 없음"
fi

item "U-38 (상) DoS 공격에 취약한 서비스(echo/discard/daytime/chargen) 비활성화"
for s in echo discard daytime chargen; do
    check_service_disabled "$s" "$s"
done

item "U-44 (상) tftp, talk 서비스 비활성화"
check_service_disabled "tftp" "tftp"
check_service_disabled "talk" "talk"

item "U-52 (중) Telnet 서비스 비활성화"
check_service_disabled "telnet.socket" "Telnet"
dpkg -l 2>/dev/null | grep -qi "^ii.*telnetd" && fail "telnetd 패키지 설치됨" || pass "telnetd 패키지 미설치"

item "U-62 (하) 로그인 시 경고 메시지 설정"
BANNER=$(sshd -T 2>/dev/null | grep -i "^banner" | awk '{print $2}')
if [[ -n "$BANNER" && "$BANNER" != "none" ]]; then
    pass "SSH Banner=$BANNER"
else
    fail "SSH 배너 미설정 (/etc/ssh/sshd_config Banner 지시자 필요)"
fi

item "U-63 (중) sudo 명령어 접근 관리"
SUDOERS_PERM=$(stat -c "%U:%a" /etc/sudoers)
[[ "$SUDOERS_PERM" == "root:440" ]] && pass "/etc/sudoers 권한 정상 ($SUDOERS_PERM)" || fail "/etc/sudoers 권한 $SUDOERS_PERM (440 권장)"
visudo -c &>/dev/null && pass "visudo 문법 검증 통과" || fail "sudoers 문법 오류 존재"

#===============================================================================
sect "4. 패치 관리"
#===============================================================================

item "U-64 (상) 주기적 보안 패치 및 벤더 권고사항 적용"
UPGRADABLE=$(apt list --upgradable 2>/dev/null | grep -c upgradable)
[[ "$UPGRADABLE" -eq 0 ]] && pass "모든 패키지 최신 상태" || fail "업데이트 가능한 패키지 ${UPGRADABLE}개 (apt update && apt upgrade 필요)"
log "커널 버전: $(uname -r) / OS: $(lsb_release -ds 2>/dev/null)"

#===============================================================================
sect "5. 로그 관리"
#===============================================================================

item "U-65 (중) NTP 및 시각 동기화 설정"
if systemctl is-active --quiet systemd-timesyncd; then
    pass "systemd-timesyncd 활성화됨"
elif systemctl is-active --quiet chrony; then
    pass "chrony 활성화됨"
else
    fail "시각 동기화 서비스(timesyncd/chrony) 비활성화 상태"
fi

item "U-66 (중) 정책에 따른 시스템 로깅 설정"
if systemctl is-active --quiet rsyslog; then
    pass "rsyslog 서비스 정상 작동 중"
else
    fail "rsyslog 서비스 비활성화 상태"
fi

item "U-67 (중) 로그 디렉터리 소유자 및 권한 설정"
LOGPERM=$(stat -c "%U:%a" /var/log)
[[ "$LOGPERM" == "root:755" || "$LOGPERM" == "root:750" ]] && pass "/var/log $LOGPERM" || info "/var/log 권한: $LOGPERM (환경에 따라 상이할 수 있음, 수동 검토 권장)"

#===============================================================================
sect "점검 결과 요약"
#===============================================================================
log "양호(PASS): $PASS / 취약(FAIL): $FAIL / 확인필요(INFO): $INFO"
log ""

# 중복 제거 + 번호(U-01 -> U-1) 순 정렬 후 콤마로 나열
format_codes () {
    printf '%s\n' "$@" | grep -v '^$' | sort -u -t- -k2 -n | sed -E 's/^U-0*([0-9]+)$/U-\1/' | paste -sd ',' - | sed 's/,/, /g'
}

FAIL_LIST=$(format_codes "${FAIL_CODES[@]}")
INFO_LIST=$(format_codes "${INFO_CODES[@]}")

log "취약     : ${FAIL_LIST:-없음}"
log "확인필요 : ${INFO_LIST:-없음}"
log ""
log "상세 로그 저장 위치: $LOGFILE"
log "점검 종료: $(date)"
