import type { MarkerConfig } from "@photo-sphere-viewer/markers-plugin";

export type PanoramaKind = "jingju" | "tea";

export type PanoramaConfig = {
  dialogLabel: string;
  eyebrow: string;
  title: string;
  panorama: string;
  caption: string;
  description: string;
  loadingText: string;
  defaultYaw: string;
  ariaLabel: string;
  fallbackImage: string;
  fallbackAlt: string;
  fallbackCaption: string;
  disclosure: string;
  markers: MarkerConfig[];
};

const marker = (
  id: string,
  label: string,
  yaw: string,
  pitch: string,
  tooltip: string,
  content: string,
): MarkerConfig => ({
  id,
  position: { yaw, pitch },
  html: `<span class="vr-hotspot">${label}</span>`,
  anchor: "center bottom",
  tooltip,
  content,
  listContent: label,
});

export const panoramaConfigs: Record<PanoramaKind, PanoramaConfig> = {
  jingju: {
    dialogLabel: "京剧后台全景",
    eyebrow: "360° 球面漫游 · AI 概念全景",
    title: "京剧后台",
    panorama: "panoramas/jingju-backstage-concept-4096.jpg",
    caption: "京剧后台 · AI 概念全景（非真实馆藏）",
    description:
      "使用鼠标、触控或方向键环视；点击标记查看戏服、化妆与文武场说明。",
    loadingText: "正在进入概念全景……",
    defaultYaw: "-180deg",
    ariaLabel: "京剧后台 AI 概念球面全景",
    fallbackImage: "assets/jingju-backstage.webp",
    fallbackAlt: "京剧演员在后台镜前勾画脸谱，学员在旁观摩",
    fallbackCaption: "图文降级模式：后台的戏服、化妆与乐器共同支撑一场演出。",
    disclosure:
      "全景为 AI 生成的空间概念图，并非历史影像或真实馆藏；设备不适合运行时可使用等价图文内容。",
    markers: [
      marker(
        "costume",
        "戏服架",
        "-68deg",
        "2deg",
        "戏服架：蟒、帔、靠等服饰共同塑造舞台身份",
        "<h2>戏服架</h2><p>京剧服装通过纹样、色彩与形制提示人物的身份、性格和处境。此画面为 AI 生成概念示意，不是历史影像或真实后台复原。</p>",
      ),
      marker(
        "makeup",
        "化妆台",
        "-180deg",
        "-8deg",
        "化妆台：勾脸、梳头与穿戴的准备空间",
        "<h2>化妆台</h2><p>演员在登台前完成勾脸、梳头、盔头和穿戴等准备。脸谱与妆容是角色塑造的一部分，并非对现实人物相貌的写实描摹。</p>",
      ),
      marker(
        "music",
        "文武场",
        "68deg",
        "1deg",
        "文武场：京胡、月琴与锣鼓等伴奏乐器",
        "<h2>文武场</h2><p>京剧伴奏通常分为以京胡等弦管乐器为主的文场，以及以鼓板、锣、钹等打击乐器为主的武场。</p>",
      ),
    ],
  },
  tea: {
    dialogLabel: "茶室全景",
    eyebrow: "360° 球面漫游 · AI 概念全景",
    title: "山间茶室",
    panorama: "panoramas/tea-room-360-4096.png",
    caption: "山间茶室 · AI 概念全景（非真实馆藏）",
    description:
      "使用鼠标、触控或方向键环视；点击标记认识茶席、制茶与山场之间的联系。",
    loadingText: "正在进入山间茶室……",
    defaultYaw: "0deg",
    ariaLabel: "山间茶室 AI 概念球面全景",
    fallbackImage: "assets/tea-wares-concept.webp",
    fallbackAlt: "概念插画：茶席上的茶壶、茶杯与盛水器",
    fallbackCaption:
      "图文降级模式：茶器、冲泡动作与待客礼俗共同构成一席茶的生活现场。",
    disclosure:
      "全景为 AI 生成的空间概念图，并非特定茶室、历史影像或真实馆藏；设备不适合运行时可使用等价图文内容。",
    markers: [
      marker(
        "tea-table",
        "茶席",
        "0deg",
        "-8deg",
        "茶席：器物与动作共同组织分享一杯茶的过程",
        "<h2>茶席</h2><p>茶席不只是器物陈列。备水、置茶、冲泡、分饮等动作，让制茶成果进入待客、交流与日常生活。</p>",
      ),
      marker(
        "tea-ware",
        "茶器",
        "73deg",
        "-12deg",
        "茶器：不同器物承接取水、冲泡、分饮等动作",
        "<h2>茶器</h2><p>壶、盏、盖碗与茶盘各自承接具体动作。器形和使用方式会随地方经验、茶类与生活场景而变化。</p>",
      ),
      marker(
        "landscape",
        "山场",
        "-92deg",
        "5deg",
        "山场：环境、品种与人的经验共同影响一片叶子",
        "<h2>山场与茶园</h2><p>茶叶并非脱离环境的标准原料。气候、土壤、茶树品种和制茶人的判断共同形成多样的地方实践。</p>",
      ),
    ],
  },
};
