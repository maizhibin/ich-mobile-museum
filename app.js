const projects = {
  jingju: { name: "京剧", place: "北京", type: "表演艺术", intro: "一声锣鼓，一张脸谱，走进角色的千年情绪。", meta: "世界级非遗 | 完整专题", image: "assets/jingju-backstage.png" },
  tea: { name: "传统制茶技艺", place: "浙江", type: "自然知识", intro: "从一片鲜叶到一盏清香，听山场和手艺说话。", meta: "世界级非遗 | 约 5 分钟", image: "assets/museum-hero.png" },
  suxiu: { name: "苏绣", place: "江苏", type: "传统手工艺", intro: "一根丝线，能在光影里绣出花鸟与时光。", meta: "国家级非遗 | 约 4 分钟", image: "assets/museum-hero.png" },
  yueju: { name: "粤剧", place: "广东", type: "表演艺术", intro: "水袖、锣鼓与唱腔，唱的是岭南的风土人情。", meta: "国家级非遗 | 约 6 分钟", image: "assets/museum-hero.png" },
  nada: { name: "那达慕", place: "内蒙古", type: "社会实践与节庆", intro: "草原上的相聚，藏着勇气、礼仪与共同的记忆。", meta: "国家级非遗 | 约 5 分钟", image: "assets/museum-hero.png" }
};

const state = {
  route: "home",
  selected: "jingju",
  category: "全部",
  elder: localStorage.getItem("heritage-elder") === "true",
  favorites: JSON.parse(localStorage.getItem("heritage-favorites") || "[]"),
  history: JSON.parse(localStorage.getItem("heritage-history") || "[]"),
  badges: JSON.parse(localStorage.getItem("heritage-badges") || "[]"),
  audio: false,
  quiz: "",
  faceQuiz: "",
  video: false
};

const screen = document.querySelector("#screen");
const live = document.querySelector("#live-region");
const icon = (name, size = "") => `<i data-lucide="${name}" ${size ? `style="width:${size}px;height:${size}px"` : ""}></i>`;

function save() {
  localStorage.setItem("heritage-elder", state.elder);
  localStorage.setItem("heritage-favorites", JSON.stringify(state.favorites));
  localStorage.setItem("heritage-history", JSON.stringify(state.history));
  localStorage.setItem("heritage-badges", JSON.stringify(state.badges));
}
function say(message) { live.textContent = message; showToast(message); }
function showToast(message) {
  document.querySelector(".toast")?.remove();
  const toast = document.createElement("div"); toast.className = "toast"; toast.textContent = message; document.body.append(toast);
  window.setTimeout(() => toast.remove(), 2200);
}
function showPanorama() {
  document.querySelector(".panorama-modal")?.remove();
  const modal = document.createElement("section");
  modal.className = "panorama-modal";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("aria-label", "京剧后台360度漫游");
  modal.innerHTML = `<header class="panorama-header"><div><span>360° 漫游</span><strong>京剧后台</strong></div><button class="panorama-close" data-panorama="close" aria-label="退出全景">${icon("x")}</button></header><div class="panorama-viewport" tabindex="0" aria-label="拖动查看京剧后台全景"><div class="panorama-scene"></div><button class="hotspot hotspot-costume" data-hotspot="戏服架"><span>1</span><strong>戏服架</strong></button><button class="hotspot hotspot-makeup" data-hotspot="化妆台"><span>2</span><strong>化妆台</strong></button><button class="hotspot hotspot-music" data-hotspot="文武场"><span>3</span><strong>文武场</strong></button><div class="panorama-hint">${icon("move-horizontal")}按住画面左右拖动</div></div><div class="panorama-info" aria-live="polite"><span class="info-number">导览</span><div><strong>站在后台中央，先四处看看</strong><p>找到戏服、化妆台和锣鼓乐器，点击编号听讲解。</p></div></div><div class="panorama-controls"><button data-panorama="left" aria-label="向左旋转">${icon("rotate-ccw")}</button><button data-panorama="reset" aria-label="回到正面">${icon("locate-fixed")}<span>回正</span></button><button data-panorama="right" aria-label="向右旋转">${icon("rotate-cw")}</button></div>`;
  document.body.append(modal);
  if (window.lucide) window.lucide.createIcons();
  const viewport = modal.querySelector(".panorama-viewport");
  const scene = modal.querySelector(".panorama-scene");
  let x = 50;
  let dragging = false;
  let startX = 0;
  let startPosition = 50;
  const update = () => { scene.style.backgroundPosition = `${x}% center`; };
  const moveBy = amount => { x = (x + amount + 100) % 100; update(); };
  viewport.addEventListener("pointerdown", event => { dragging = true; startX = event.clientX; startPosition = x; viewport.setPointerCapture(event.pointerId); viewport.classList.add("dragging"); });
  viewport.addEventListener("pointermove", event => { if (!dragging) return; x = (startPosition - (event.clientX - startX) * 0.16 + 100) % 100; update(); });
  viewport.addEventListener("pointerup", event => { dragging = false; viewport.releasePointerCapture(event.pointerId); viewport.classList.remove("dragging"); });
  viewport.addEventListener("keydown", event => { if (event.key === "ArrowLeft") moveBy(-5); if (event.key === "ArrowRight") moveBy(5); });
  modal.addEventListener("click", event => {
    const command = event.target.closest("[data-panorama]")?.dataset.panorama;
    const hotspot = event.target.closest("[data-hotspot]")?.dataset.hotspot;
    if (command === "close") { modal.remove(); return; }
    if (command === "left") moveBy(-10);
    if (command === "right") moveBy(10);
    if (command === "reset") { x = 50; update(); }
    if (hotspot) {
      const notes = {
        "戏服架": ["01", "戏服架", "蟒、帔、靠等服装用颜色、纹样和轮廓提示人物身份。演员换装时，后台必须分工精准。"],
        "化妆台": ["02", "化妆台", "净角勾脸讲究谱式与笔法；生、旦、丑也各有不同的妆面程式。镜前准备常要数十分钟。"],
        "文武场": ["03", "文武场", "京胡、月琴等属于文场；鼓板、大锣、小锣、铙钹等属于武场，共同托住演员的节奏。"]
      };
      const [number, title, copy] = notes[hotspot];
      modal.querySelector(".panorama-info").innerHTML = `<span class="info-number">${number}</span><div><strong>${title}</strong><p>${copy}</p></div>`;
    }
  });
  modal.querySelector(".panorama-close").focus();
}
function addHistory(id) { state.history = [id, ...state.history.filter(item => item !== id)].slice(0, 8); save(); }
function nav() {
  const items = [["home","首页","house"],["map","地图","map-pinned"],["categories","分类","layout-grid"],["interactive","互动","sparkles"],["mine","我的","user-round"]];
  return `<nav class="bottom-nav" aria-label="主导航">${items.map(([route,label,iconName]) => `<button class="nav-item ${state.route === route ? "active" : ""}" data-route="${route}" aria-label="${label}">${icon(iconName)}<span>${label}</span></button>`).join("")}</nav>`;
}
function header(back = false) {
  return `<header class="topbar"><div class="brand">${back ? `<button class="icon-button" data-route="home" aria-label="返回首页">${icon("arrow-left")}</button>` : `<span class="seal">遗</span><span>非遗随身馆</span>`}</div><div class="top-actions"><button class="icon-button ${state.elder ? "active" : ""}" data-action="elder" aria-label="切换老人模式"><span>长</span></button><button class="icon-button" data-route="mine" aria-label="打开我的收藏">${icon("heart")}</button></div></header>`;
}

function renderHome() {
  return `<section class="hero"><img class="hero-image" src="assets/museum-hero.png" alt="传统文化展厅中的戏曲脸谱、陶瓷与亲子参观者" />${header()}<div class="hero-copy"><p class="eyebrow">今天，和一门手艺相遇</p><h1>把非遗带回生活里</h1><p>听一段故事，做一次体验。从身边开始认识正在传承的文化。</p><button class="primary-button light" data-detail="jingju">${icon("headphones")}开始语音导览</button></div></section><div class="screen-content"><div class="section-head"><div><h2>你想怎么逛？</h2><p>每一种方式，都从简单的一步开始</p></div></div><div class="path-grid"><button class="path-card" data-detail="jingju">${icon("headphones")}<strong>三分钟听懂非遗</strong><span>故事化音频导览</span></button><button class="path-card" data-route="interactive">${icon("badge-check")}<strong>带孩子闯一关</strong><span>任务和小小勋章</span></button><button class="path-card" data-route="elder">${icon("accessibility")}<strong>长辈安心听</strong><span>大字、清晰、慢一点</span></button><button class="path-card" data-route="map">${icon("map-pinned")}<strong>从地图出发</strong><span>找找家乡的手艺</span></button></div><div class="section-head"><div><h2>今日馆藏</h2><p>能听、能看，也能亲手试试</p></div><button class="quiet-button" data-route="categories">全部 ${icon("chevron-right", "15")}</button></div><div class="project-strip"><button class="project-card" data-detail="jingju"><p>北京 · 表演艺术</p><strong>京剧的<br>一张脸</strong><span>音频 · 短片 · 全景</span></button><button class="project-card" data-detail="tea"><p>浙江 · 自然知识</p><strong>一杯茶的<br>来处</strong><span>故事 · 工艺 · 问答</span></button><button class="project-card" data-detail="suxiu"><p>江苏 · 传统手工艺</p><strong>丝线里的<br>花鸟</strong><span>放大看 · 互动体验</span></button></div></div>`;
}
function renderMap() {
  const rows = [["京","北京 · 京剧","jingju"],["苏","江苏 · 苏绣","suxiu"],["浙","浙江 · 制茶技艺","tea"],["粤","广东 · 粤剧","yueju"],["蒙","内蒙古 · 那达慕","nada"]];
  return `${header()}<div class="screen-content"><div class="page-header"><h1>非遗地图</h1><p>点亮一处地方，听见一段正在发生的故事。</p></div><div class="chip-row"><button class="chip selected">离我最近</button><button class="chip">手工艺</button><button class="chip">表演</button><button class="chip">节庆</button></div><div class="map-panel" aria-label="非遗项目分布地图"><button class="map-pin pin-beijing" data-detail="jingju">北京 · 京剧</button><button class="map-pin pin-jiangsu" data-detail="suxiu">江苏 · 苏绣</button><button class="map-pin pin-zhejiang" data-detail="tea">浙江 · 制茶</button><button class="map-pin pin-guangdong" data-detail="yueju">广东 · 粤剧</button><button class="map-pin pin-yunnan" data-route="interactive">云南 · 泼水节</button><button class="map-pin pin-neimenggu" data-detail="nada">内蒙古 · 那达慕</button></div><div class="section-head"><div><h2>附近和热门</h2></div></div>${rows.map(([mark,title,id]) => `<button class="list-row" data-detail="${id}"><span class="list-mark">${mark}</span><span><strong>${title}</strong><p>${projects[id].intro}</p></span>${icon("chevron-right")}</button>`).join("")}</div>`;
}
function renderCategories() {
  const categories = [["全部","全","用多种方式认识活着的文化"],["表演艺术","演","戏曲、音乐、舞蹈与曲艺"],["传统手工艺","工","刺绣、陶瓷、纸艺与漆艺"],["礼仪与节庆","礼","节日、仪式与社区记忆"],["自然知识","知","农时、茶事与传统医药"]];
  const active = state.category;
  const cards = active === "全部" ? categories.slice(1) : categories.filter(item => item[0] === active);
  return `${header()}<div class="screen-content"><div class="page-header"><h1>分类探索</h1><p>五种进入非遗世界的门，选一扇慢慢看。</p></div><div class="chip-row">${categories.map(([name]) => `<button class="chip ${active === name ? "selected" : ""}" data-category="${name}">${name}</button>`).join("")}</div><div class="category-grid">${cards.map(([name,symbol,text], index) => `<button class="category-card" data-detail="${index % 2 ? "suxiu" : "jingju"}"><span class="category-symbol">${symbol}</span><span><strong>${name}</strong><p>${text}</p></span>${icon("chevron-right")}</button>`).join("")}</div><div class="section-head"><div><h2>听馆员说</h2><p>适合第一次了解非遗</p></div></div><button class="immersive-panel" data-route="interactive"><h3>从一出戏，读懂一座城</h3><p>用 4 个片段，认识台前幕后的人、声与手。</p><span class="tag">${icon("play", "13")}短片导览</span></button></div>`;
}
function renderDetail() {
  if (state.selected === "jingju") return renderJingjuDetail();
  const p = projects[state.selected]; const liked = state.favorites.includes(state.selected);
  return `<section class="detail-cover"><img src="${p.image}" alt="${p.name}主题展厅" />${header(true)}<div class="detail-title"><p>${p.place} · ${p.type}</p><h1>${p.name}</h1><p>${p.intro}</p><div class="detail-meta"><span class="tag">${icon("clock-3", "13")}${p.meta}</span><button class="tag" data-action="favorite" aria-label="收藏${p.name}">${icon(liked ? "heart" : "heart", "13")}${liked ? "已收藏" : "收藏"}</button></div></div></section><div class="screen-content"><div class="section-head"><div><h2>戴上耳机听一听</h2><p>由馆员讲述，语速可调</p></div></div><div class="audio-player"><button class="audio-play" data-action="audio" aria-label="${state.audio ? "暂停" : "播放"}音频">${icon(state.audio ? "pause" : "play")}</button><span><strong>${state.audio ? "正在讲述：一张脸谱的语言" : "一张脸谱的语言"}</strong><span>${state.audio ? "01:18 / 06:20" : "6 分 20 秒 · 普通话"}</span></span><span class="audio-track" aria-hidden="true"></span></div><div class="section-head"><div><h2>故事导览</h2><p>跟着三个片段认识它</p></div></div><ol class="story-steps"><li><strong>从市井走上舞台</strong>它的声音来自生活，也记录着一座城的记忆。</li><li><strong>一张脸，千种心事</strong>色彩与线条并不是装饰，它们在帮角色说话。</li><li><strong>台下也有传承</strong>服装、锣鼓、化妆与教学，让一出戏真正活起来。</li></ol><div class="immersive-panel"><h3>走进后台全景</h3><p>旋转视角，看看戏服、乐器和演员准备登台的瞬间。</p><button class="primary-button light" data-action="panorama">${icon("rotate-3d")}打开 3D / 全景</button></div><div class="section-head"><div><h2>给你的小任务</h2></div></div><button class="large-action" data-action="badge" data-badge="first-listen">${icon("badge-check")}<span><strong>找一找这张脸谱的主色</strong><span>完成后获得「初识非遗」勋章</span></span></button></div>`;
}
function renderJingjuDetail() {
  const p = projects.jingju; const liked = state.favorites.includes("jingju");
  return `<section class="detail-cover jingju-cover"><img src="${p.image}" alt="京剧演员在后台镜前勾画脸谱，年轻学员在旁观摩" />${header(true)}<div class="detail-title"><p>北京 · 表演艺术</p><h1>京剧</h1><p>一桌二椅，演尽人间万象</p><div class="detail-meta"><span class="tag">${icon("landmark", "13")}世界级非遗</span><button class="tag" data-action="favorite" aria-label="收藏京剧">${icon("heart", "13")}${liked ? "已收藏" : "收藏"}</button></div></div></section>
  <nav class="topic-nav" aria-label="京剧专题目录"><button data-scroll="jj-start">初识</button><button data-scroll="jj-roles">行当</button><button data-scroll="jj-skills">功法</button><button data-scroll="jj-stage">舞台</button><button data-scroll="jj-learn">体验</button></nav>
  <div class="screen-content jingju-topic">
    <section id="jj-start"><div class="topic-lead"><span class="chapter-no">01</span><div><p class="eyebrow dark">三分钟认识京剧</p><h2>它不只是一种唱腔</h2></div></div><p class="body-copy">京剧形成于清代中后期。徽班进京后，与汉调、昆曲及北京地方声腔不断交流，逐渐形成兼具唱、念、做、打的综合舞台艺术。2010 年，京剧列入联合国教科文组织人类非物质文化遗产代表作名录。</p><div class="fact-row"><div><strong>约 200 年</strong><span>形成与发展</span></div><div><strong>四大行当</strong><span>生、旦、净、丑</span></div><div><strong>虚拟舞台</strong><span>以少胜多</span></div></div></section>
    <section class="media-story"><img src="assets/jingju-backstage.png" alt="京剧演员勾画脸谱的后台场景" /><button class="media-play" data-action="video" aria-label="播放京剧后台短片">${icon(state.video ? "pause" : "play")}</button><div><span>馆藏短片 · 02:36</span><strong>${state.video ? "正在播放：上台前的四十分钟" : "上台前的四十分钟"}</strong></div></section>
    <div class="section-head"><div><h2>戴上耳机听一听</h2><p>长辈模式下自动使用慢速讲解</p></div></div><div class="audio-player extended"><button class="audio-play" data-action="audio" aria-label="${state.audio ? "暂停" : "播放"}音频">${icon(state.audio ? "pause" : "play")}</button><span><strong>${state.audio ? "正在讲述：为什么一桌二椅就是千山万水" : "为什么一桌二椅就是千山万水"}</strong><span>${state.audio ? "02:18 / 08:40" : "8 分 40 秒 · 含文字稿"}</span></span><button class="speed-button" data-action="speed">${state.elder ? "0.8×" : "1.0×"}</button></div>
    <section id="jj-roles" class="topic-section"><div class="topic-lead"><span class="chapter-no">02</span><div><p class="eyebrow dark">认识角色</p><h2>生、旦、净、丑</h2></div></div><div class="role-grid"><button class="role-card" data-action="role" data-role="生"><span>生</span><strong>男性角色</strong><small>老生、小生、武生</small></button><button class="role-card" data-action="role" data-role="旦"><span>旦</span><strong>女性角色</strong><small>青衣、花旦、武旦</small></button><button class="role-card" data-action="role" data-role="净"><span>净</span><strong>性格鲜明</strong><small>常用脸谱表现人物</small></button><button class="role-card" data-action="role" data-role="丑"><span>丑</span><strong>机敏风趣</strong><small>鼻梁常有白色粉块</small></button></div></section>
    <section class="face-lab"><div><p class="eyebrow light-text">脸谱观察室</p><h2>颜色也会“说话”</h2><p>脸谱颜色并不是固定的性格标签，但在传统舞台表达中常有约定俗成的倾向。</p></div><div class="color-legend"><button data-action="role" data-role="红色脸谱常表现忠勇、正直，例如关羽"><span class="swatch red"></span>红 · 忠勇</button><button data-action="role" data-role="黑色脸谱常表现刚直、勇猛，例如包拯、张飞"><span class="swatch black"></span>黑 · 刚直</button><button data-action="role" data-role="白色脸谱常用来塑造多疑、机变的人物"><span class="swatch white"></span>白 · 机变</button></div><div class="mini-question"><strong>观察题：关羽的代表脸谱主色是什么？</strong><div><button class="answer ${state.faceQuiz === "red" ? "correct" : ""}" data-face="red">红色</button><button class="answer ${state.faceQuiz === "white" ? "wrong" : ""}" data-face="white">白色</button></div></div></section>
    <section id="jj-skills" class="topic-section"><div class="topic-lead"><span class="chapter-no">03</span><div><p class="eyebrow dark">演员的基本功</p><h2>唱、念、做、打</h2></div></div><div class="skill-list"><button data-action="role" data-role="唱：通过不同板式、腔调和节奏表达人物情绪">${icon("music-2")}<span><strong>唱</strong><small>听旋律里的情绪</small></span></button><button data-action="role" data-role="念：有音乐性的舞台语言，与日常说话不同">${icon("message-circle")}<span><strong>念</strong><small>听舞台语言的韵律</small></span></button><button data-action="role" data-role="做：通过手、眼、身、法、步表现行动与内心">${icon("person-standing")}<span><strong>做</strong><small>看手眼身法步</small></span></button><button data-action="role" data-role="打：将武术动作提炼为具有节奏和造型的舞台表演">${icon("swords")}<span><strong>打</strong><small>看程式化的武打</small></span></button></div></section>
    <section id="jj-stage" class="topic-section"><div class="topic-lead"><span class="chapter-no">04</span><div><p class="eyebrow dark">舞台的秘密</p><h2>一桌二椅，千山万水</h2></div></div><p class="body-copy">京剧舞台重“写意”。演员用圆场表示赶路，用马鞭表示骑马，用船桨表示行舟。观众不是被动观看，而是和演员一起完成想象。</p><div class="stage-actions"><button class="immersive-panel" data-action="panorama"><h3>360° 看后台</h3><p>找出盔头、戏服、锣鼓与化妆台。</p><span class="primary-button light">${icon("rotate-3d")}开始漫游</span></button><button class="large-action" data-action="role" data-role="文场以京胡、京二胡、月琴等管弦乐器为主；武场以鼓板、大锣、小锣、铙钹等打击乐器为主"><span class="feature-icon">${icon("drum")}</span><span><strong>听辨文场与武场</strong><span>京胡的弦音与锣鼓的节奏</span></span></button></div></section>
    <section class="repertoire"><div class="section-head"><div><h2>从代表剧目开始看</h2><p>每出戏先认识一个看点</p></div></div><div class="repertoire-strip"><button data-action="role" data-role="《霸王别姬》：看人物情感如何通过唱腔、身段与剑舞层层展开"><span>01</span><strong>《霸王别姬》</strong><small>看剑舞与人物情感</small></button><button data-action="role" data-role="《贵妃醉酒》：看水袖、步态和细腻身段如何表现人物心绪"><span>02</span><strong>《贵妃醉酒》</strong><small>看水袖与细腻身段</small></button><button data-action="role" data-role="《三岔口》：在明亮舞台上表演黑夜搏斗，是京剧虚拟性的经典体现"><span>03</span><strong>《三岔口》</strong><small>看“明台演暗夜”</small></button></div></section>
    <section id="jj-learn" class="topic-section"><div class="topic-lead"><span class="chapter-no">05</span><div><p class="eyebrow dark">把知识带走</p><h2>完成一次小体验</h2></div></div><div class="learning-path"><button class="large-action" data-route="family">${icon("blocks")}<span><strong>亲子：画一张自己的脸谱</strong><span>先认识颜色，再设计人物性格</span></span></button><button class="large-action" data-action="badge" data-badge="jingju-explorer">${icon("badge-check")}<span><strong>完成京剧专题</strong><span>获得「梨园小知音」勋章</span></span></button></div><div class="completion-note"><span>${icon("book-open-check")}</span><div><strong>你已经认识了京剧的 5 个方面</strong><p>历史、行当、基本功、舞台与代表剧目。收藏后可以随时回来复习。</p></div></div></section>
  </div>`;
}
function renderInteractive() {
  const badgeCount = state.badges.length;
  return `${header()}<div class="screen-content"><div class="page-header"><h1>互动体验</h1><p>用一段故事、一场游戏，把知识变成自己的发现。</p></div><section class="guide-banner"><h2>今日任务：寻找一张会说话的脸</h2><p>完成语音导览和一个小游戏，点亮今日勋章。</p><button class="primary-button light" data-detail="jingju">从故事开始 ${icon("arrow-right")}</button></section><div class="section-head"><div><h2>玩一玩</h2><p>答对就能推进任务</p></div><span class="tag">已完成 ${badgeCount}/3</span></div><section class="quiz"><h3>小小观察家</h3><p>京剧脸谱里，红色通常更接近哪一种性格？</p><div class="answer-grid"><button class="answer ${state.quiz === "a" ? "correct" : ""}" data-quiz="a">忠勇正直</button><button class="answer ${state.quiz === "b" ? "wrong" : ""}" data-quiz="b">胆小怕事</button><button class="answer" data-quiz="c">冷漠无情</button><button class="answer" data-quiz="d">漫不经心</button></div></section><div class="section-head"><div><h2>沉浸式看看</h2><p>每次一点，换一个看法</p></div></div><div class="feature-list"><button class="feature-row" data-action="panorama"><span class="feature-icon">${icon("rotate-3d")}</span><span><strong>后台全景漫游</strong><p>转一转，找找戏服和乐器</p></span>${icon("chevron-right")}</button><button class="feature-row" data-action="badge" data-badge="craft"><span class="feature-icon">${icon("scissors")}</span><span><strong>剪纸纹样拼拼看</strong><p>拖动前先看看对称的巧思</p></span><span class="progress"><span style="width:45%"></span></span></button><button class="feature-row" data-route="family"><span class="feature-icon">${icon("blocks")}</span><span><strong>亲子一起学</strong><p>适合 6 至 12 岁的共学任务</p></span>${icon("chevron-right")}</button></div></div>`;
}
function renderFamily() {
  return `${header(true)}<div class="screen-content"><div class="page-header"><h1>亲子学习</h1><p>和孩子一起听、看、问、做。每次 10 分钟就很好。</p></div><section class="guide-banner"><h2>今天的亲子任务</h2><p>选一件家里常用的物品，猜猜它可能藏着哪种传统工艺。</p><button class="primary-button light" data-action="badge" data-badge="family">完成并点亮勋章</button></section><div class="section-head"><div><h2>一起发现</h2></div></div><button class="large-action" data-detail="suxiu">${icon("search")}<span><strong>放大看：一根丝线的旅程</strong><span>观察、提问、说出你的发现</span></span></button><button class="large-action" data-route="interactive">${icon("gamepad-2")}<span><strong>闯关：脸谱颜色配对</strong><span>用游戏记住角色的表情</span></span></button><button class="large-action" data-route="map">${icon("map")}<span><strong>家乡的非遗地图</strong><span>和家人找找附近的故事</span></span></button></div>`;
}
function renderElder() {
  return `${header(true)}<div class="screen-content"><div class="page-header"><h1>长辈安心听</h1><p>大字、清晰、一步一件事。</p></div><section class="mode-intro"><h2>今天想听什么？</h2><p>点一下就开始。讲解会慢一点，也可以随时暂停。</p></section><div class="section-head"><div><h2>常用功能</h2></div></div><button class="large-action" data-detail="jingju">${icon("volume-2")}<span><strong>听一段戏曲故事</strong><span>京剧的脸谱和唱腔</span></span></button><button class="large-action" data-route="map">${icon("map-pinned")}<span><strong>看看家乡的非遗</strong><span>从地图里慢慢找</span></span></button><button class="large-action" data-route="mine">${icon("heart")}<span><strong>打开我的收藏</strong><span>随时回到喜欢的内容</span></span></button><div class="section-head"><div><h2>阅读设置</h2></div></div><button class="large-action" data-action="elder">${icon("type")}<span><strong>${state.elder ? "正在使用大字模式" : "切换为大字模式"}</strong><span>提高文字和按钮大小</span></span></button></div>`;
}
function renderMine() {
  const favoriteList = state.favorites.map(id => projects[id]); const historyList = state.history.map(id => projects[id]);
  return `${header()}<div class="screen-content"><div class="page-header"><h1>我的足迹</h1><p>你正在一点点把非遗带回自己的生活。</p></div><div class="stats"><div><strong>${state.history.length}</strong><span>看过项目</span></div><div><strong>${state.favorites.length}</strong><span>我的收藏</span></div><div><strong>${state.badges.length}</strong><span>获得勋章</span></div></div><div class="section-head"><div><h2>我的勋章</h2></div></div><div class="badge-grid">${[["first-listen","初识非遗","headphones"],["face-reader","脸谱识色","palette"],["jingju-explorer","梨园小知音","theater"],["craft","巧手发现","scissors"],["family","亲子同行","heart-handshake"]].map(([id,title,ico]) => `<div class="badge ${state.badges.includes(id) ? "" : "locked"}">${icon(ico)}<span>${title}</span></div>`).join("")}</div><div class="section-head"><div><h2>收藏</h2></div></div>${favoriteList.length ? favoriteList.map(p => `<button class="list-row" data-detail="${Object.keys(projects).find(key => projects[key] === p)}"><span class="list-mark">藏</span><span><strong>${p.name}</strong><p>${p.place} · ${p.type}</p></span>${icon("chevron-right")}</button>`).join("") : `<p class="empty">还没有收藏，遇到喜欢的项目就点一下心形按钮。</p>`}<div class="section-head"><div><h2>最近看过</h2></div></div>${historyList.length ? historyList.map(p => `<button class="list-row" data-detail="${Object.keys(projects).find(key => projects[key] === p)}"><span class="list-mark">阅</span><span><strong>${p.name}</strong><p>${p.intro}</p></span>${icon("chevron-right")}</button>`).join("") : `<p class="empty">从首页、地图或分类开始，足迹会记在这里。</p>`}</div>`;
}
function render() {
  document.body.classList.toggle("elder-mode", state.elder);
  const views = { home: renderHome, map: renderMap, categories: renderCategories, detail: renderDetail, interactive: renderInteractive, family: renderFamily, elder: renderElder, mine: renderMine };
  screen.innerHTML = `${views[state.route]()}${nav()}`;
  window.scrollTo({ top: 0, behavior: "smooth" });
  if (window.lucide) window.lucide.createIcons();
}
document.addEventListener("click", event => {
  const route = event.target.closest("[data-route]")?.dataset.route;
  const detail = event.target.closest("[data-detail]")?.dataset.detail;
  const action = event.target.closest("[data-action]")?.dataset.action;
  const category = event.target.closest("[data-category]")?.dataset.category;
  const quiz = event.target.closest("[data-quiz]")?.dataset.quiz;
  const face = event.target.closest("[data-face]")?.dataset.face;
  const scrollTarget = event.target.closest("[data-scroll]")?.dataset.scroll;
  if (scrollTarget) { document.getElementById(scrollTarget)?.scrollIntoView({ behavior: "smooth", block: "start" }); return; }
  if (route) { state.route = route; render(); return; }
  if (detail) { state.selected = detail; addHistory(detail); state.route = "detail"; render(); return; }
  if (category) { state.category = category; render(); return; }
  if (quiz) { state.quiz = quiz; if (quiz === "a") { if (!state.badges.includes("first-listen")) state.badges.push("first-listen"); save(); say("答对了，已点亮初识非遗勋章"); } else say("再看看脸谱的颜色提示，试一次就会记住。"); render(); return; }
  if (face) { state.faceQuiz = face; if (face === "red") { if (!state.badges.includes("face-reader")) state.badges.push("face-reader"); save(); say("答对了，关羽的代表脸谱以红色为主"); } else say("再观察一次：红色常用来表现忠勇与正直"); render(); return; }
  if (action === "elder") { state.elder = !state.elder; save(); render(); say(state.elder ? "已开启大字高对比模式" : "已回到标准模式"); return; }
  if (action === "favorite") { const index = state.favorites.indexOf(state.selected); if (index >= 0) { state.favorites.splice(index, 1); say("已取消收藏"); } else { state.favorites.unshift(state.selected); say("已加入收藏"); } save(); render(); return; }
  if (action === "audio") { state.audio = !state.audio; render(); say(state.audio ? "正在播放语音导览" : "已暂停语音导览"); return; }
  if (action === "video") { state.video = !state.video; render(); say(state.video ? "正在播放京剧后台短片" : "短片已暂停"); return; }
  if (action === "speed") { say(state.elder ? "当前为慢速讲解 0.8 倍" : "当前为标准语速 1.0 倍"); return; }
  if (action === "role") { const message = event.target.closest("[data-role]")?.dataset.role; if (message) say(message); return; }
  if (action === "panorama") { showPanorama(); return; }
  if (action === "badge") { const id = event.target.closest("[data-badge]")?.dataset.badge || "first-listen"; if (!state.badges.includes(id)) state.badges.push(id); save(); say("任务完成，新的勋章已收入足迹"); render(); }
});
render();
