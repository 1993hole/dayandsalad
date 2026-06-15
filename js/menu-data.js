/* ===== 컨셉 공개 스위치 =====
   배달현황 화면의 사진을 한 번에 전환합니다.
   false → 컨셉 공개 전: 모든 메뉴 '블라인드' 사진
   true  → 컨셉 공개 후: 주문한 메뉴의 멤버 컨셉포토
   (6/15 공개일에 이 값만 true 로 바꾸면 됩니다) */
const CONCEPT_REVEALED = false;

/* ===== 메뉴 데이터 (신메뉴 = 신곡 컨셉, 가상 그룹 LUMINA) =====
   아이돌 사진 자리는 색상 그라데이션 placeholder로 대체.
   실제 사용 시 grad 대신 thumb 배경을 멤버 사진(assets/menu/...)으로 교체하면 됩니다.

   ※ 고객 콘텐츠(메뉴 이름·가격·설명·재료) 수정은 이 파일에서만 하면 됩니다. */
const MENU = [
  { id:1, name:"오로라 그린 볼", member:"현빈 PICK", price:"12,900",
    grad:"linear-gradient(135deg,#E23B2E,#B22A1F)", badge:"NEW",
    desc:"상큼한 시트러스 드레싱의 베이스 샐러드",
    long:"이번 컴백의 타이틀 메뉴. 신선한 베이비 채소 위에 오렌지 시트러스 드레싱을 더해 첫 곡처럼 산뜻하게 시작하는 한 그릇이에요.",
    kcal:"320", protein:"14g", time:"20분",
    ing:["베이비 채소","오렌지","아몬드","페타치즈","시트러스 드레싱"] },
  { id:2, name:"미드나잇 프로틴 볼", member:"윤 PICK", price:"14,500",
    grad:"linear-gradient(135deg,#E23B2E,#B22A1F)", badge:"인기",
    desc:"닭가슴살·계란 듬뿍 고단백 샐러드",
    long:"무대를 위한 든든한 한 끼. 그릴드 치킨과 삶은 계란을 넉넉히 올려 강렬한 비트처럼 묵직하게 채워줍니다.",
    kcal:"410", protein:"38g", time:"22분",
    ing:["그릴드 치킨","계란","퀴노아","케일","발사믹"] },
  { id:3, name:"베리 하모니 볼", member:"연우 PICK", price:"13,200",
    grad:"linear-gradient(135deg,#E23B2E,#B22A1F)", badge:"NEW",
    desc:"베리 가득 상큼 프루트 샐러드",
    long:"다섯 멤버의 화음처럼 여러 베리가 어우러진 메뉴. 딸기·블루베리·라즈베리가 달콤한 후렴구를 만들어요.",
    kcal:"280", protein:"9g", time:"18분",
    ing:["딸기","블루베리","라즈베리","리코타","꿀요거트"] },
  { id:4, name:"키토 아보카도 볼", member:"진혁 PICK", price:"13,900",
    grad:"linear-gradient(135deg,#E23B2E,#B22A1F)", badge:"키토",
    desc:"저탄수 아보카도 키토 샐러드",
    long:"군더더기 없는 매력. 크리미한 아보카도와 견과류로 담백하게 떨어지는 후반부 벌스 같은 메뉴예요.",
    kcal:"350", protein:"12g", time:"20분",
    ing:["아보카도","연어","호두","루꼴라","올리브오일"] },
  { id:5, name:"앙코르 시그니처 볼", member:"시윤 PICK", price:"15,900",
    grad:"linear-gradient(135deg,#E23B2E,#B22A1F)", badge:"한정",
    desc:"전 멤버 추천 재료를 한 그릇에",
    long:"앵콜 무대처럼 모든 걸 담은 스페셜. 다섯 메뉴의 핵심 재료를 모은 한정판으로, 컴백 기간에만 만나볼 수 있어요.",
    kcal:"460", protein:"30g", time:"25분",
    ing:["치킨","아보카도","베리","퀴노아","페타치즈","시트러스"] },
];
