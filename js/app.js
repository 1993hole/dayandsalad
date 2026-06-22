/* 동작 로직 — 홈을 '5인 동등 라인업'으로 렌더 (특정 멤버 강조 없음)
   메뉴 데이터(MENU)는 menu-data.js 에서 먼저 로드됩니다. */

let currentMenu = null;

/* ===== 주문 상태 (localStorage) ===== */
const ORDER_KEY = 'dayand_order';
function getOrder(){
  try { return JSON.parse(localStorage.getItem(ORDER_KEY)); }
  catch(e){ return null; }
}
function saveOrder(order){
  localStorage.setItem(ORDER_KEY, JSON.stringify(order));
}
function renderOrderState(){
  const order = getOrder();
  const has = !!order;
  document.getElementById('trackEmpty').classList.toggle('hidden', has);
  document.getElementById('trackFilled').classList.toggle('hidden', !has);
  if(has){
    document.getElementById('tName').textContent = order.name || '-';
    document.getElementById('tAddr').textContent = order.addr || '주소 미입력';
    renderTrackPhoto(order);
  }
}

/* ===== 컨셉 공개 시간 판단 (서버 시간 기준 → 기기 시계 조작 무력화) ===== */
let REVEALED = false;  // 페이지 로드 시 1회 계산
async function initRevealState(){
  let now;
  try {
    const r = await fetch(location.href, { method:'HEAD', cache:'no-store' });
    const d = r.headers.get('Date');           // 서버가 내려주는 현재 시각(UTC)
    now = d ? new Date(d) : new Date();
  } catch(e){ now = new Date(); }              // 실패 시에만 기기시간 폴백
  REVEALED = (typeof REVEAL_AT !== 'undefined') && (now.getTime() >= new Date(REVEAL_AT).getTime());
  // 배달현황이 이미 떠 있으면 즉시 반영
  const filled = document.getElementById('trackFilled');
  if(getOrder() && filled && !filled.classList.contains('hidden')) renderTrackPhoto(getOrder());
}

/* 배달현황 사진 — 공개 시각 이후 + 이미지가 실제 존재할 때만 멤버 컨셉포토로 전환 */
function renderTrackPhoto(order){
  const mapEl = document.getElementById('map');
  const menu = MENU.find(m => m.id === order.menuId);
  if(!mapEl || !menu) return;

  const showBlind = () => {
    mapEl.style.background = (typeof TRACK_BLIND_IMG === 'string')
      ? `#1e1513 url('${TRACK_BLIND_IMG}') center/cover`
      : 'linear-gradient(135deg,#3a2a28,#1e1513)';
    mapEl.innerHTML = '';
  };

  if(!REVEALED){ showBlind(); return; }   // 아직 공개 시각 전 → 블라인드

  // 공개 시각 이후: 공개 이미지가 '실제로 존재'할 때만 전환 (업로드 전이면 블라인드 유지)
  const src = (typeof REVEAL_IMG !== 'undefined') && REVEAL_IMG[menu.id];
  if(!src){ showBlind(); return; }
  const probe = new Image();
  probe.onload  = () => { mapEl.style.background = `url('${src}') center/cover`; mapEl.innerHTML = ''; };
  probe.onerror = showBlind;
  probe.src = src;
}

/* 홈 렌더 — 5인 동등 라인업 (모두 같은 크기·스타일, 멤버 중심) */
function renderLineup(){
  const el = document.getElementById('homeLineup');
  if(!el) return;
  el.innerHTML = MENU.map(m=>`
    <div class="lineup-card" onclick="openDetail(${m.id})">
      <div class="photo" style="background:${m.grad}">
        <span class="ph-tag">240×300</span>
        <span class="mname">${m.member.replace(' PICK','')}</span>
      </div>
      <div class="body">
        <h4>${m.name}</h4>
        <div class="price">${m.price}원</div>
      </div>
    </div>`).join('');
}

/* 전체보기(menu 페이지) 메뉴 리스트 — 5종 전체 세로 리스트 */
function renderMenu(){
  const html = MENU.map(m=>`
    <div class="menu-card" onclick="openDetail(${m.id})">
      <div class="thumb" style="background:${m.grad}">
        <div class="badge">${m.badge}</div>
        <div style="position:absolute;bottom:8px;left:8px;color:#fff;font-size:9px;font-weight:800;text-shadow:0 1px 4px rgba(0,0,0,.3)">👤 멤버 사진 · 240×240</div>
      </div>
      <div class="body">
        <h4>${m.name}</h4>
        <div class="desc">${m.desc}</div>
        <div class="meta">⭐ 4.9 · ${m.member}</div>
        <div class="price">${m.price}원 <small>· 무료배송</small></div>
      </div>
    </div>`).join('');
  const el = document.getElementById('menuList');
  if(el) el.innerHTML = html;
}

/* 상세 열기 */
let detailFrom = 'menu';
function openDetail(id){
  const active = document.querySelector('.screen.active');
  if(active) detailFrom = active.id;
  const m = MENU.find(x=>x.id===id);
  currentMenu = m;
  document.getElementById('detailHero').style.background = m.grad;
  document.getElementById('detailHero').style.backgroundSize = 'cover';
  document.getElementById('detailHero').innerHTML =
    `<button class="back-btn" onclick="go(detailFrom)">←</button>
     <div style="position:absolute;bottom:16px;left:18px;color:#fff;font-size:12px;font-weight:800;text-shadow:0 1px 6px rgba(0,0,0,.35)">👤 ${m.member} · 멤버 사진 840×600</div>`;
  document.getElementById('detailBody').innerHTML = `
    <div class="eyebrow">${m.badge} · COMEBACK MENU</div>
    <h2>${m.name}</h2>
    <div class="price">${m.price}원 <small>무료배송</small></div>
    <div class="long">${m.long}</div>
    <div class="nutri">
      <div><b>${m.kcal}</b><span>kcal</span></div>
      <div><b>${m.protein}</b><span>단백질</span></div>
      <div><b>${m.time}</b><span>조리시간</span></div>
    </div>
    <h3 style="font-size:15px;font-weight:800;margin-top:18px;">재료</h3>
    <div class="ingredients">${m.ing.map(i=>`<span class="chip">${i}</span>`).join('')}</div>
  `;
  go('detail');
  document.getElementById('detail').scrollTop = 0;
}

/* 화면 전환 */
function go(id){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  const screen = document.getElementById(id);
  screen.classList.add('active');
  screen.scrollTop = 0;
  document.body.classList.toggle('on-detail', id==='detail');
  document.querySelectorAll('.tab').forEach(t=>t.classList.remove('on'));
  if(id==='home'||id==='menu') document.querySelector('.tab').classList.add('on');
  if(id==='track'){
    document.querySelectorAll('.tab')[1].classList.add('on');
    renderOrderState();
  }
}

/* 주문 폼 모달 */
function openOrder(){
  document.getElementById('orderTitle').textContent = '배송정보';
  document.getElementById('orderModal').classList.add('active');
}
function closeOrder(){ document.getElementById('orderModal').classList.remove('active'); }
document.getElementById('orderModal').addEventListener('click',e=>{
  if(e.target.id==='orderModal') closeOrder();
});

/* 주문 제출 */
function submitOrder(){
  const name = document.getElementById('fName').value.trim();
  const phone = document.getElementById('fPhone').value.trim();
  const addr = document.getElementById('fAddr').value.trim();
  const msg = document.getElementById('fMsg').value.trim();
  const consent = document.getElementById('fConsent').checked;

  if(!name || !phone){ alert('받는 분과 연락처를 입력해주세요.'); return; }
  if(!consent){ alert('개인정보 수집·이용 동의가 필요해요.'); return; }

  const data = { menu: currentMenu?.name, menuId: currentMenu?.id, name, phone, addr, msg, time:new Date().toISOString() };
  console.log('수집된 주문 데이터:', data);
  /* 구글 폼 연동 자리 — 추후 회사 폼 URL + entry ID 로 재연결 예정 (테스트 완료) */

  saveOrder(data);
  closeOrder();
  renderOrderState();
  go('track');
}

/* ===== 공유하기 (프로모션 문구 + 링크 클립보드 복사) ===== */
// ▼ 공유 문구는 여기서 수정하세요
const SHARE_TEXT = '#나우즈가 데이앤을 위해 준비한 특별한 샐러드';
// 배포 후엔 실제 도메인이 자동으로 들어갑니다. 특정 URL 로 고정하려면 직접 입력하세요.
const PROMO_URL = location.origin + location.pathname;

function sharePromo(){
  const text = `${SHARE_TEXT}\n${PROMO_URL}`;
  // 1순위: 네이티브 공유 시트 (지원 기기 — 주로 모바일). 카톡·인스타 등으로 바로 전송
  if(navigator.share){
    navigator.share({ text: SHARE_TEXT, url: PROMO_URL }).catch(err=>{
      if(err && err.name === 'AbortError') return;  // 사용자가 공유 취소 → 아무 동작 안 함
      copyToClipboard(text);                         // 그 외 실패 시에만 복사로 폴백
    });
    return;
  }
  // 2순위: 공유 시트 미지원 → 클립보드 복사
  copyToClipboard(text);
}

/* 클립보드 복사 (공유 시트 미지원 시) */
function copyToClipboard(text){
  if(navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(text)
      .then(()=>showToast('링크가 복사되었어요'))
      .catch(()=>fallbackCopy(text));
  } else {
    fallbackCopy(text);
  }
}

/* 구형 브라우저 / file:// / 비보안 컨텍스트 대비 폴백 */
function fallbackCopy(text){
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed'; ta.style.top = '-1000px'; ta.style.opacity = '0';
  document.body.appendChild(ta); ta.focus(); ta.select();
  let ok = false;
  try { ok = document.execCommand('copy'); } catch(e){ ok = false; }
  document.body.removeChild(ta);
  showToast(ok ? '링크가 복사되었어요' : '복사에 실패했어요. 길게 눌러 복사해주세요');
}

/* 하단 토스트 안내 */
function showToast(msg){
  let t = document.getElementById('toast');
  if(!t){
    t = document.createElement('div');
    t.id = 'toast'; t.className = 'toast';
    (document.querySelector('.phone') || document.body).appendChild(t);
  }
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(()=>t.classList.remove('show'), 1900);
}

/* ===== 데스크탑 마우스 드래그로 가로 스크롤 (모바일 터치 스와이프는 기본 지원) ===== */
function enableDragScroll(el){
  if(!el) return;
  let isDown = false, startX = 0, startScroll = 0, moved = false;
  el.addEventListener('mousedown', e=>{
    isDown = true; moved = false;
    startX = e.pageX; startScroll = el.scrollLeft;
    el.classList.add('dragging');
  });
  window.addEventListener('mousemove', e=>{
    if(!isDown) return;
    const dx = e.pageX - startX;
    if(Math.abs(dx) > 4) moved = true;     // 4px 이상 움직이면 '드래그'로 간주
    el.scrollLeft = startScroll - dx;
  });
  window.addEventListener('mouseup', ()=>{
    if(!isDown) return;
    isDown = false; el.classList.remove('dragging');
  });
  // 드래그였다면 카드 클릭(상세 열기) 막기 (capture 단계에서 가로채기)
  el.addEventListener('click', e=>{
    if(moved){ e.preventDefault(); e.stopPropagation(); moved = false; }
  }, true);
}

/* ===== 배너 슬라이드 ===== */
let slideIdx = 0;
const slidesEl = document.getElementById('slides');
const slideCount = slidesEl.children.length;
const dotsEl = document.getElementById('dots');
for(let i=0;i<slideCount;i++){
  const d = document.createElement('i');
  if(i===0) d.classList.add('on');
  d.onclick = ()=>goSlide(i);
  dotsEl.appendChild(d);
}
function goSlide(i){
  slideIdx = (i+slideCount)%slideCount;
  slidesEl.style.transform = `translateX(-${slideIdx*100}%)`;
  [...dotsEl.children].forEach((d,k)=>d.classList.toggle('on',k===slideIdx));
}
setInterval(()=>goSlide(slideIdx+1), 3500);

renderLineup();      // 홈: 5인 동등 라인업
renderMenu();        // 전체보기: 5종 전체
renderOrderState();  // 주문 유무 반영
enableDragScroll(document.getElementById('homeLineup'));  // PC 마우스 드래그 스크롤
initRevealState();   // 서버 시간 확인 → 공개 여부 판단(배달현황 사진)
