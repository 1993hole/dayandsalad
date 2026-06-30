/* ===== 컨셉 공개 설정 =====
   - 한국시간 REVEAL_AT 이 되면 메뉴 이미지(미리보기/썸네일/상세) + 메인배너가 '블라인드' → '공개 이미지' 로 일괄 전환
   - 시간 판단은 '서버 시간' 기준이라 기기 시계를 바꿔도 안 통함
   - 공개 이미지는 공개 직전 업로드. 그 전엔 파일이 없어 블라인드(없으면 그라데이션) 유지
   - 배달현황은 단일 고정 이미지(전환 없음) */
const REVEAL_AT = '2026-07-21T18:00:00+09:00';    // 한국시간 7/21(화) 오후 6시
const TRACK_IMG = 'assets/track/track.png';        // 배달현황 단일 이미지 (전환 없음)
const BANNER_BLIND = 'assets/banner/banner-blind.png'; // 메인배너 공개 전
const BANNER_IMG   = 'assets/banner/banner.png';        // 메인배너 공개 후
/* 메뉴별 이미지: 슬롯마다 공개 전 blind(assets/menu/) / 공개 후(assets/menu/open/)
   공개 후 이미지는 7/21 공개 직전 assets/menu/open/ 에 업로드. 없으면 블라인드 유지 */
const MENU_IMG = {
  1: { preview:'assets/menu/open/preview1.png', previewBlind:'assets/menu/preview1-blind.png', thumb:'assets/menu/open/thumb1.png', thumbBlind:'assets/menu/thumb1-blind.png', detail:'assets/menu/open/detail1.png', detailBlind:'assets/menu/detail1-blind.png' }, // 현빈
  2: { preview:'assets/menu/open/preview2.png', previewBlind:'assets/menu/preview2-blind.png', thumb:'assets/menu/open/thumb2.png', thumbBlind:'assets/menu/thumb2-blind.png', detail:'assets/menu/open/detail2.png', detailBlind:'assets/menu/detail2-blind.png' }, // 윤
  3: { preview:'assets/menu/open/preview3.png', previewBlind:'assets/menu/preview3-blind.png', thumb:'assets/menu/open/thumb3.png', thumbBlind:'assets/menu/thumb3-blind.png', detail:'assets/menu/open/detail3.png', detailBlind:'assets/menu/detail3-blind.png' }, // 연우
  4: { preview:'assets/menu/open/preview4.png', previewBlind:'assets/menu/preview4-blind.png', thumb:'assets/menu/open/thumb4.png', thumbBlind:'assets/menu/thumb4-blind.png', detail:'assets/menu/open/detail4.png', detailBlind:'assets/menu/detail4-blind.png' }, // 진혁
  5: { preview:'assets/menu/open/preview5.png', previewBlind:'assets/menu/preview5-blind.png', thumb:'assets/menu/open/thumb5.png', thumbBlind:'assets/menu/thumb5-blind.png', detail:'assets/menu/open/detail5.png', detailBlind:'assets/menu/detail5-blind.png' }  // 시윤
};

/* ===== 메뉴 데이터 (신메뉴 = 신곡 컨셉, 가상 그룹 LUMINA) =====
   아이돌 사진 자리는 색상 그라데이션 placeholder로 대체.
   실제 사용 시 grad 대신 thumb 배경을 멤버 사진(assets/menu/...)으로 교체하면 됩니다.

   ※ 고객 콘텐츠(메뉴 이름·가격·설명·재료) 수정은 이 파일에서만 하면 됩니다. */
const MENU = [
  { id:1, name:"[삐니원픽] 산지직송 숙면 상추 타코", member:"HYEONBIN’s pick!", price:"12,900",
    grad:"linear-gradient(135deg,#E23B2E,#B22A1F)", badge:"NEW signature",
    desc:"오늘 하루를 책임져 줄 데이앤 샐러드 대표 메뉴",
    long:"신선함 가득한 하루를 책임져 줄 데이앤 샐러드 대표 메뉴. 아침 사이클을 탄 듯한 가벼움을 느껴보세요.",
    kcal:"831", protein:"402", time:"5분",
    ing:["Magnesium","Mental Strength","L-Theanine"],
    caution:"차가워 보이지만 칭찬 한마디에 즉시 녹아내릴 수 있습니다." },
  { id:2, name:"[강추해윤] 아삭 오이 샌드위치", member:"YOON’s pick!", price:"14,500",
    grad:"linear-gradient(135deg,#E23B2E,#B22A1F)", badge:"NEW signature",
    desc:"싱그러운 매력을 맛볼 수 있는 여름 한정 메뉴",
    long:"싱그러운 매력을 맛볼 수 있는 여름 한정 메뉴. 최고급 오이의 아삭! 한 식감과 함께 터지는 달콤함, 어디로 튈지 모르는 애교를 만끽하세요.",
    kcal:"827", protein:"402", time:"7분",
    ing:["Natural Sweetness","Sodium","Vitamin C"],
    caution:"애교에 취약한 사람들에게 웃음을 유발하며, 미소를 멈추기 어려울 수 있습니다." },
  { id:3, name:"[꼭 드셔보세연] 멋쟁이 여누 토마토 샐러드", member:" YEONWOO’s pick!", price:"13,200",
    grad:"linear-gradient(135deg,#E23B2E,#B22A1F)", badge:"NEW signature",
    desc:"익숙함 속 새로움을 담아낸 개성만점 메뉴",
    long:"익숙함 속 새로움을 담아낸 개성 만점 메뉴. 섬세함이 깃든 사랑과 관심으로 7년간 키워낸 착한 말 토마토를 담았습니다.",
    kcal:"923", protein:"402", time:"42분",
    ing:["Allulose","Chubby Cheeks","Vitamin B"],
    caution:"메뉴의 신선함 유지를 위해 지속적인 사랑과 관심이 필요합니다." },
  { id:4, name:"[양이 녘녘] 마법의 아보카도 볼", member:"JINHYUK’s pick!", price:"14,500",
    grad:"linear-gradient(135deg,#E23B2E,#B22A1F)", badge:"NEW signature",
    desc:"부드럽고 든든하게, 사랑을 듬뿍 담은 메뉴",
    long:"부드럽고 든든한 매력의 고단백 메뉴. 크리미한 아보카도 한 숟갈과 함께라면 이 세상 모든 고민 타파!",
    kcal:"521", protein:"402", time:"21분",
    ing:["Protein","Melatonin","Carbohydrates (Active)"],
    caution:"개봉 후 즉시 섭취하세요. 중독성이 높아 맛볼수록 자꾸만 생각날 수 있습니다." },
  { id:5, name:"[먹자마자 반했슌] 셰프의 고단백 닭가슴살 샐러드", member:"SIYUN’s pick!", price:"15,900",
    grad:"linear-gradient(135deg,#E23B2E,#B22A1F)", badge:"NEW signature",
    desc:"한입 만에 입덕 가능한 시그니처 메뉴",
    long:"한입 만에 입덕 가능한 시그니처 메뉴. 지방 5% 함유로, 황금 밸런스와 비주얼을 자랑하는 셰프의 필살기입니다.",
    kcal:"804", protein:"402", time:"1분",
    ing:["Protein","Omega-3","Caffeine"],
    caution:"달콤한 비주얼이 혈당 스파이크를 유발할 수 있습니다." },
];
