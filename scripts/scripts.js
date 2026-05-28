class OzcalendarKoreanDateFix {
    constructor() {
    this.app = customJS.app;
    this.ozCalendarObserver = null;
    
    this.monthMap = {
        'Jan': '1', 'Feb': '2', 'Mar': '3', 'Apr': '4', 'May': '5', 'Jun': '6',
        'Jul': '7', 'Aug': '8', 'Sep': '9', 'Oct': '10', 'Nov': '11', 'Dec': '12'
    };
    }
 
    async invoke() {
    console.log("✅ OzcalendarKoreanDateFix invoke() 실행됨");
    
    this.removeKoreanIl();
    this.translateCalendarTexts();
    this.setupObserver();
    this.setupButtonListeners();
    this.backupInterval = setInterval(() => {
        this.removeKoreanIl();
        this.translateCalendarTexts();
    }, 10000);
    }
 
    removeKoreanIl() {
    const abbrs = document.querySelectorAll('.react-calendar__tile abbr');
    if (abbrs.length === 0) {
        return;
    }
 
    let fixedCount = 0;
    abbrs.forEach(el => {
        const original = el.textContent;
        const cleaned = original.replace(/일$/, '');
        if (original !== cleaned) {
        el.textContent = cleaned;
        fixedCount++;
        }
    });
 
    if (fixedCount > 0) {
        console.log(`📅 OzCalendar 날짜 수정 완료: ${fixedCount}개`);
    }
    }
 
    translateCalendarTexts() {
    const monthLabels = document.querySelectorAll('.react-calendar__navigation__label__labelText');
    monthLabels.forEach(label => {
        const text = label.textContent;
        if (text && !text.includes('년')) {
        const translated = this.translateMonthLabel(text);
        if (translated !== text) {
            label.textContent = translated;
            console.log(`📅 월 표기 번역: ${text} → ${translated}`);
        }
        }
    });
 
    const dateLabels = document.querySelectorAll('.oz-calendar-nav-action-middle');
    dateLabels.forEach(label => {
        const text = label.textContent;
        if (text && !text.includes('년')) {
        const translated = this.translateDateLabel(text);
        if (translated !== text) {
            label.textContent = translated;
            console.log(`📅 날짜 표기 번역: ${text} → ${translated}`);
        }
        }
    });
 
    const noNoteElements = document.querySelectorAll('.oz-calendar-note-no-note');
    noNoteElements.forEach(element => {
        const text = element.textContent;
        if (text === 'No note found') {
        element.textContent = '해당 날짜에 문서가 존재하지 않습니다.';
        console.log(`📝 노트 없음 메시지 번역: ${text} → 해당 날짜에 문서가 존재하지 않습니다.`);
        }
    });
    }
 
    translateMonthLabel(monthText) {
    const match = monthText.match(/(\w+)\s+(\d{4})/);
    if (match) {
        const month = this.monthMap[match[1]];
        const year = match[2];
        if (month) {
        return `${year}년 ${month}월`;
        }
    }
    return monthText;
    }
 
    translateDateLabel(dateText) {
    const match = dateText.match(/(\d{1,2})\s+(\w+)\s+(\d{4})/);
    if (match) {
        const day = match[1];
        const month = this.monthMap[match[2]];
        const year = match[3];
        if (month) {
        return `${year}년 ${month}월 ${day}일`;
        }
    }
    return dateText;
    }
 
    setupObserver() {
    if (this.ozCalendarObserver) {
        this.ozCalendarObserver.disconnect();
    }
 
    this.ozCalendarObserver = new MutationObserver((mutations) => {
        let shouldCheck = false;
        
        mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.querySelector?.('.react-calendar__tile abbr') || 
                node.classList?.contains('react-calendar__tile')) {
                shouldCheck = true;
            }
            }
        });
 
        if (mutation.type === 'characterData' || mutation.type === 'childList') {
            const target = mutation.target;
            if (target.nodeType === Node.TEXT_NODE) {
            const parent = target.parentElement;
            if (parent && parent.closest('.react-calendar__tile')) {
                shouldCheck = true;
            }
            } else if (target.nodeType === Node.ELEMENT_NODE) {
            if (target.closest('.react-calendar__tile')) {
                shouldCheck = true;
            }
            }
        }
        });
 
        if (shouldCheck) {
        // 지연추가 기능 (기본값 1ms)
        setTimeout(() => {
            this.removeKoreanIl();
            this.translateCalendarTexts();
        }, 1);
        }
    });
 
    this.ozCalendarObserver.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true
    });
 
    console.log("👀 OzCalendar DOM 변화 감지 시작");
    }
 
    setupButtonListeners() {
    document.removeEventListener('click', this.handleOzCalendarButtonClick);
    document.addEventListener('click', this.handleOzCalendarButtonClick.bind(this));
    
    console.log("👂 OzCalendar 버튼 클릭 감지 시작");
    }
 
    handleOzCalendarButtonClick(event) {
    const target = event.target;
    if (target.closest('.react-calendar__navigation__arrow') ||
        target.closest('.react-calendar__tile') ||
        target.closest('.oz-calendar-nav-action-left') ||
        target.closest('.oz-calendar-nav-action-right') ||
        target.closest('.oz-calendar-nav-action-plus')) {
        
        console.log("🖱️ OzCalendar 버튼 클릭 감지:", target.textContent || target.className);
        
        // 지연추가 기능 (기본값 1ms)
        setTimeout(() => {
        this.removeKoreanIl();
        this.translateCalendarTexts();
        }, 1);
    }
    }
    
    stop() {
    if (this.ozCalendarObserver) {
        this.ozCalendarObserver.disconnect();
        this.ozCalendarObserver = null;
    }
    
    if (this.backupInterval) {
        clearInterval(this.backupInterval);
        this.backupInterval = null;
    }
 
    document.removeEventListener('click', this.handleOzCalendarButtonClick);
    }
}

