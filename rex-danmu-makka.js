/**
 * 弹幕示例模块
 * 给 module 指定 type 为 danmu 后，默认会携带以下参数：
 * tmdbId: TMDB ID，Optional
 * type: 类型，tv | movie
 * title: 搜索关键词
 * seriesName：剧名，Optional
 * episodeName：集名，Optional
 * airDate：播出日期，Optional
 * runtime：时长，Optional
 * premiereDate：首播日期，Optional
 * season: 季，电影时为空，Optional
 * episode: 集，电影时为空，Optional
 * link: 链接，Optional
 * videoUrl: 视频链接，Optional
 * commentId: 弹幕ID，Optional。在搜索到弹幕列表后实际加载时会携带
 * animeId: 动漫ID，Optional。在搜索到动漫列表后实际加载时会携带
 *
 */
WidgetMetadata = {
  id: "rex.danmu.makka",
  title: "弹幕",
  version: "1.0.5",
  requiredVersion: "0.0.2",
  description: "弹幕模块",
  author: "𝙈𝙖𝙠𝙠𝙖𝙋𝙖𝙠𝙠𝙖",
  site: "https://t.me/MakkaPakkaOvO",
  i18n: {
    "en": {
      "自定义弹幕": "Custom Danmu",
      "Rex 弹幕模块，支持弹弹play及用户配置的兼容弹幕服务；支持自定义颜色、弹幕屏蔽词、搜索结果屏蔽、繁简转换、数量上限": "Rex danmu module supporting DanDanPlay and user-configured compatible services; with custom color, keyword blocking, search-result blocking, Traditional/Simplified conversion and count limit",
      "自定义服务器": "Custom Servers",
      "搜索弹幕": "Search Danmu",
      "获取详情": "Get Details",
      "获取弹幕": "Get Danmu"
    },
    "zh-Hant": {
      "自定义弹幕": "自訂彈幕",
      "Rex 弹幕模块，支持弹弹play及用户配置的兼容弹幕服务；支持自定义颜色、弹幕屏蔽词、搜索结果屏蔽、繁简转换、数量上限": "Rex 彈幕模組，支援彈彈play及使用者設定的相容彈幕服務；支援自訂顏色、彈幕屏蔽詞、搜尋結果屏蔽、繁簡轉換、數量上限",
      "自定义服务器": "自訂伺服器",
      "搜索弹幕": "搜尋彈幕",
      "获取详情": "取得詳情",
      "获取弹幕": "取得彈幕"
    },
    "ja": {
      "自定义弹幕": "カスタムコメント",
      "Rex 弹幕模块，支持弹弹play及用户配置的兼容弹幕服务；支持自定义颜色、弹幕屏蔽词、搜索结果屏蔽、繁简转换、数量上限": "DanDanPlayとユーザー設定の互換サービスに対応するRexコメントモジュール；カスタムカラー、キーワードブロック、検索結果ブロック、簡繁変換、件数上限に対応",
      "自定义服务器": "カスタムサーバー",
      "搜索弹幕": "コメントを検索",
      "获取详情": "詳細を取得",
      "获取弹幕": "コメントを取得"
    },
    "ko": {
      "自定义弹幕": "사용자 지정 댓글",
      "Rex 弹幕模块，支持弹弹play及用户配置的兼容弹幕服务；支持自定义颜色、弹幕屏蔽词、搜索结果屏蔽、繁简转换、数量上限": "DanDanPlay 및 사용자 설정 호환 서비스를 지원하는 Rex 댓글 모듈；사용자 지정 색상, 키워드 차단, 검색 결과 차단, 간체/번체 변환, 개수 제한 지원",
      "自定义服务器": "사용자 지정 서버",
      "搜索弹幕": "댓글 검색",
      "获取详情": "상세 정보 가져오기",
      "获取弹幕": "댓글 가져오기"
    },
    "es": {
      "自定义弹幕": "Danmu personalizado",
      "Rex 弹幕模块，支持弹弹play及用户配置的兼容弹幕服务；支持自定义颜色、弹幕屏蔽词、搜索结果屏蔽、繁简转换、数量上限": "Módulo danmu de Rex compatible con DanDanPlay y servicios configurados por el usuario; admite color personalizado, bloqueo de palabras, bloqueo de resultados, conversión entre chino simplificado/tradicional y límite de cantidad",
      "自定义服务器": "Servidores personalizados",
      "搜索弹幕": "Buscar danmu",
      "获取详情": "Obtener detalles",
      "获取弹幕": "Obtener danmu"
    },
    "fr": {
      "自定义弹幕": "Danmu personnalisé",
      "Rex 弹幕模块，支持弹弹play及用户配置的兼容弹幕服务；支持自定义颜色、弹幕屏蔽词、搜索结果屏蔽、繁简转换、数量上限": "Module danmu Rex compatible avec DanDanPlay et les services configurés par l'utilisateur ; couleurs personnalisées, blocage de mots, blocage des résultats, conversion simplifié/traditionnel et limite de quantité",
      "自定义服务器": "Serveurs personnalisés",
      "搜索弹幕": "Rechercher des danmu",
      "获取详情": "Obtenir les détails",
      "获取弹幕": "Obtenir les danmu"
    },
    "pt-BR": {
      "自定义弹幕": "Danmu personalizado",
      "Rex 弹幕模块，支持弹弹play及用户配置的兼容弹幕服务；支持自定义颜色、弹幕屏蔽词、搜索结果屏蔽、繁简转换、数量上限": "Módulo danmu do Rex compatível com DanDanPlay e serviços configurados pelo usuário; cores personalizadas, bloqueio de palavras, bloqueio de resultados, conversão simplificado/tradicional e limite de quantidade",
      "自定义服务器": "Servidores personalizados",
      "搜索弹幕": "Buscar danmu",
      "获取详情": "Obter detalhes",
      "获取弹幕": "Obter danmu"
    },
    "ru": {
      "自定义弹幕": "Настраиваемые комментарии",
      "Rex 弹幕模块，支持弹弹play及用户配置的兼容弹幕服务；支持自定义颜色、弹幕屏蔽词、搜索结果屏蔽、繁简转换、数量上限": "Модуль комментариев Rex с поддержкой DanDanPlay и совместимых пользовательских сервисов; пользовательские цвета, блокировка слов, блокировка результатов поиска, конвертация упрощённый/традиционный и лимит количества",
      "自定义服务器": "Пользовательские серверы",
      "搜索弹幕": "Поиск комментариев",
      "获取详情": "Получить сведения",
      "获取弹幕": "Получить комментарии"
    },
    "ar": {
      "自定义弹幕": "تعليقات Danmu مخصصة",
      "Rex 弹幕模块，支持弹弹play及用户配置的兼容弹幕服务；支持自定义颜色、弹幕屏蔽词、搜索结果屏蔽、繁简转换、数量上限": "وحدة Danmu من Rex تدعم DanDanPlay والخدمات المتوافقة التي يضبطها المستخدم؛ ألوان مخصصة، حظر الكلمات، حظر نتائج البحث، تحويل المبسّط/التقليدي وحد أقصى للعدد",
      "自定义服务器": "خوادم مخصصة",
      "搜索弹幕": "البحث عن Danmu",
      "获取详情": "جلب التفاصيل",
      "获取弹幕": "جلب Danmu"
    }
  },
  // Rex generated i18n: end
  globalParams: [
    {
      name: "server",
      title: "自定义服务器",
      type: "input",
      placeholders: [
        {
          title: "弹弹play",
          value: "https://api.dandanplay.net",
        },
      ],
    },
    {
      name: "convertMode",
      title: "弹幕转换",
      type: "enumeration",
      value: "none",
      enumOptions: [
        { title: "保持原样", value: "none" },
        { title: "转简体 (繁->简)", value: "t2s" },
        { title: "转繁体 (简->繁)", value: "s2t" },
      ],
    },
    {
      name: "colorMode",
      title: "弹幕颜色",
      type: "enumeration",
      value: "none",
      enumOptions: [
        { title: "保持原样", value: "none" },
        { title: "全部纯白", value: "white" },
        { title: "部分彩色 (50%彩色)", value: "partial" },
        { title: "完全彩色 (100%彩色)", value: "all" },
      ],
    },
    {
      name: "blockKeywords",
      title: "弹幕内容屏蔽词 (逗号分隔)",
      type: "input",
      value: "",
      description: "屏蔽不想看到的弹幕内容，如: 广告,求片",
    },
    {
      name: "searchBlockKeywords",
      title: "搜索结果屏蔽词 (逗号分隔)",
      type: "input",
      value: "",
      description: "屏蔽不想看到的搜索结果，如: 动态漫,电视剧,漫画",
    },
    {
      name: "maxCount",
      title: "弹幕数量上限",
      type: "input",
      value: "0",
      description: "填0或留空不限制。超出则随机剔除并按时序排序",
    },
  ],
  modules: [
    {
      //id需固定为searchDanmu
      id: "searchDanmu",
      title: "搜索弹幕",
      functionName: "searchDanmu",
      type: "danmu",
      params: [],
    },
    {
      //id需固定为getDetail
      id: "getDetail",
      title: "获取详情",
      functionName: "getDetailById",
      type: "danmu",
      params: [],
    },
    {
      //id需固定为getComments
      id: "getComments",
      title: "获取弹幕",
      functionName: "getCommentsById",
      type: "danmu",
      params: [],
    },
  ],
};

const DEFAULT_DANMU_SERVER = "https://api.dandanplay.net";
const DANMU_SERVER_ID_SEPARATOR = "__REX_DANMU_SERVER__";
const DANMU_SOURCE_BATCH_SIZE = 5;
const DANMU_SEARCH_RESULT_LIMIT = 5;

function normalizeDanmuServer(server) {
  return String(server || "").trim().replace(/\/+$/, "");
}

function getDanmuSourceTitle(server) {
  try {
    return new URL(server).host || server;
  } catch (error) {
    return server;
  }
}

function looksLikeServerAddress(value) {
  return /^(https?:\/\/|localhost\b|127\.0\.0\.1\b)/i.test(value);
}

function makeDanmuSource(title, server, explicitTitle) {
  const normalizedServer = normalizeDanmuServer(server);
  const normalizedTitle = String(title || "").trim();
  return {
    title: normalizedTitle || getDanmuSourceTitle(normalizedServer),
    server: normalizedServer,
    explicitTitle: Boolean(explicitTitle && normalizedTitle),
  };
}

function parseDanmuSourceLine(line) {
  const separatorMatch = line.match(/[，,]/);
  if (!separatorMatch) {
    return makeDanmuSource("", line, false);
  }

  const separatorIndex = separatorMatch.index;
  const title = line.slice(0, separatorIndex).trim();
  const server = line.slice(separatorIndex + separatorMatch[0].length).trim();

  if (!server && looksLikeServerAddress(title)) {
    return makeDanmuSource("", title, false);
  }

  return makeDanmuSource(title, server, true);
}

function getDanmuSources(server) {
  const serverValue = Array.isArray(server) ? server.join("\n") : server;
  const rawValue = String(serverValue || "").trim();

  if (!rawValue) {
    return [makeDanmuSource("弹弹play", DEFAULT_DANMU_SERVER, true)];
  }

  const lines = rawValue.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  if (lines.length === 1) {
    const commaParts = lines[0].split(/[，,]/).map((item) => item.trim()).filter(Boolean);
    if (commaParts.length > 1 && commaParts.every(looksLikeServerAddress)) {
      return dedupeDanmuSources(commaParts.map((item) => makeDanmuSource("", item, false)));
    }
  }

  return dedupeDanmuSources(lines.map(parseDanmuSourceLine).filter((source) => source.server));
}

function dedupeDanmuSources(sources) {
  const sourceMap = new Map();
  for (const source of sources) {
    if (!sourceMap.has(source.server)) {
      sourceMap.set(source.server, source);
    }
  }
  return Array.from(sourceMap.values());
}

function bindDanmuServerId(id, source, shouldBind) {
  if (!shouldBind || id === undefined || id === null) {
    return id;
  }
  const payload = JSON.stringify({
    title: source.title,
    server: source.server,
  });
  return `${encodeURIComponent(payload)}${DANMU_SERVER_ID_SEPARATOR}${id}`;
}

function parseDanmuServerId(id) {
  if (typeof id !== "string") {
    return { id, source: null };
  }

  const separatorIndex = id.indexOf(DANMU_SERVER_ID_SEPARATOR);
  if (separatorIndex === -1) {
    return { id, source: null };
  }

  const encodedSource = id.slice(0, separatorIndex);
  const rawId = id.slice(separatorIndex + DANMU_SERVER_ID_SEPARATOR.length);
  const decodedSource = decodeURIComponent(encodedSource);
  try {
    const source = JSON.parse(decodedSource);
    if (source && source.server) {
      return {
        id: rawId,
        source: makeDanmuSource(source.title, source.server, true),
      };
    }
  } catch (error) {
    // 兼容旧版只绑定 server 地址的 ID。
  }

  return {
    id: rawId,
    source: makeDanmuSource("", decodedSource, false),
  };
}

function getDanmuRequestSources(server, boundSource) {
  return boundSource ? [boundSource] : getDanmuSources(server);
}

function shouldShowDanmuSource(sources) {
  return sources.some((source) => source.explicitTitle);
}

function appendDanmuSourceTitle(title, source, shouldAppend) {
  if (!shouldAppend) {
    return title;
  }
  return `${title} - ${source.title}`;
}

function scoreDanmuSearchAnime(anime, params, index) {
  const animeTitle = cleanAnimeTitle(anime && anime.animeTitle);
  const queryTitle = cleanAnimeTitle(params.seriesName || params.title);
  let score = 500 - index;
  if (queryTitle && animeTitle.includes(queryTitle)) {
    score += 120;
  }
  const seasonNum = Number(params.season);
  if (!Number.isNaN(seasonNum) && seasonNum > 0) {
    const animeSeason = extractSeasonNumber(animeTitle);
    if (animeSeason === seasonNum) {
      score += 160;
    } else if (animeSeason !== null) {
      score -= 160;
    }
  }
  return score;
}

function rankedDanmuCandidates(candidates) {
  const seen = new Set();
  return candidates
    .sort((left, right) => right.score - left.score)
    .filter(({ anime }) => {
      const id = anime.animeId === undefined || anime.animeId === null ? anime.animeTitle : String(anime.animeId);
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    })
    .slice(0, DANMU_SEARCH_RESULT_LIMIT)
    .map(({ anime }) => anime);
}

function getDanmuHeaders() {
  return {
    // "X-AppId": "",
    // "X-AppSecret": "",
    "Content-Type": "application/json",
    "User-Agent": "RexWidgets/1.0.0",
  };
}

async function mapDanmuSourcesInBatches(sources, batchSize, task) {
  const results = [];
  for (let index = 0; index < sources.length; index += batchSize) {
    const batch = sources.slice(index, index + batchSize);
    const batchResults = await Promise.all(batch.map(task));
    results.push(...batchResults);
  }
  return results;
}

// ==========================================
// 弹幕过滤 / 转换 / 数量 / 颜色（来自参考模块功能）
// ==========================================

function parseBlockedKeywords(raw) {
  return String(raw || "").split(/[,，]/).map((k) => k.trim()).filter(Boolean);
}

function isTitleBlocked(title, blockedList) {
  if (!blockedList.length || !title) return false;
  return blockedList.some((k) => String(title).includes(k));
}

// ---- 繁简转换（opencc 词表，缓存到 storage） ----
const DICT_URL_S2T = "https://cdn.jsdelivr.net/npm/opencc-data@1.0.3/data/STCharacters.txt";
const DICT_URL_T2S = "https://cdn.jsdelivr.net/npm/opencc-data@1.0.3/data/TSCharacters.txt";
let MEM_DICT = null;

async function initDict(mode) {
  if (!mode || mode === "none") return;
  if (MEM_DICT) return;
  const key = `dict_${mode}`;
  let local = await Widget.storage.get(key);
  if (!local) {
    try {
      const res = await Widget.http.get(mode === "s2t" ? DICT_URL_S2T : DICT_URL_T2S);
      let text = res.data || res;
      if (typeof text === "string" && text.length > 100) {
        const map = {};
        text.split("\n").forEach((line) => {
          const parts = line.split(/\s+/);
          if (parts.length >= 2) map[parts[0]] = parts[1];
        });
        await Widget.storage.set(key, JSON.stringify(map));
        MEM_DICT = map;
      }
    } catch (error) {
      console.error("加载转换词表失败:", error);
    }
  } else {
    try {
      MEM_DICT = JSON.parse(local);
    } catch (error) {
      // 缓存损坏时忽略，下次重新下载
    }
  }
}

function convertText(text) {
  if (!text || !MEM_DICT) return text;
  let result = "";
  for (const char of text) {
    result += MEM_DICT[char] || char;
  }
  return result;
}

// 对弹幕列表依次应用：繁简转换 → 内容屏蔽 → 数量上限 → 颜色重写
function processDanmuComments(list, options) {
  const { convertMode, blockKeywords, colorMode, maxCount } = options;
  if (!Array.isArray(list)) return list;

  if (convertMode !== "none" && MEM_DICT) {
    list.forEach((c) => {
      if (c.m) c.m = convertText(c.m);
      if (c.message) c.message = convertText(c.message);
    });
  }

  const blockedList = parseBlockedKeywords(blockKeywords);
  if (blockedList.length > 0) {
    list = list.filter((c) => {
      const msg = c.m || c.message || "";
      return !blockedList.some((k) => msg.includes(k));
    });
  }

  const limit = parseInt(maxCount, 10);
  if (!Number.isNaN(limit) && limit > 0 && list.length > limit) {
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
    list = list.slice(0, limit);
    list.sort((a, b) => {
      const timeA = a.p ? parseFloat(String(a.p).split(",")[0]) || 0 : 0;
      const timeB = b.p ? parseFloat(String(b.p).split(",")[0]) || 0 : 0;
      return timeA - timeB;
    });
  }

  if (colorMode && colorMode !== "none") {
    const COLORS = [16711680, 16776960, 16752384, 16738740, 13445375, 11730943, 11730790];
    const COLOR_WHITE = "16777215";
    list.forEach((c) => {
      if (!c.p) return;
      const parts = String(c.p).split(",");
      if (parts.length < 3) return;
      const colorIndex = parts.length >= 8 ? 3 : 2;
      let targetColor = COLOR_WHITE;
      if (colorMode === "white") {
        targetColor = COLOR_WHITE;
      } else if (colorMode === "partial") {
        targetColor = Math.random() < 0.5 ? String(COLORS[Math.floor(Math.random() * COLORS.length)]) : COLOR_WHITE;
      } else if (colorMode === "all") {
        targetColor = String(COLORS[Math.floor(Math.random() * COLORS.length)]);
      }
      parts[colorIndex] = targetColor;
      c.p = parts.join(",");
    });
  }

  return list;
}

// 从番剧标题提取季号，兼容多种命名：
//   "剑来 第二季"→2、"【tencent】剑来_02"→2、"剑来2"→2、"剑来 S2"→2
// 优先匹配"第X季/部"，并把季号限制在 1-2 位，避免把年份(2025)误判为季号
function extractSeasonNumber(animeTitle) {
  const title = String(animeTitle || "");
  let m = title.match(/第\s*([0-9一二三四五六七八九十壹贰叁肆伍陆柒捌玖拾]+)\s*[季部]/);
  if (m) {
    const n = convertChineseNumber(m[1]);
    if (n > 0) return n;
  }
  m = title.match(/(?:_|\bS|\bSeason\s+)(\d{1,2})\b/i);
  if (m) return Number(m[1]);
  m = title.match(/[^\d](\d{1,2})$/);
  if (m) return Number(m[1]);
  return null;
}

function filterAnimes(rawAnimes, type, season, queryTitle) {
  const movieTypes = ["movie", "电影", "奇幻片", "剧场版"];
  let animes = [];

  if (rawAnimes && rawAnimes.length > 0) {
    animes = rawAnimes.filter((anime) => {
      const animeType = (anime.type || "").toLowerCase();
      if (type === "movie") {
        return movieTypes.some(t => t.toLowerCase() === animeType);
      }
      // tv 类型兜底：只排除电影类型，其余都算剧集
      if (type === "tv") {
        return !movieTypes.some(t => t.toLowerCase() === animeType);
      }
      return true;
    });
  }

  return animes;
}

function buildMatchedAnime(source, matched, episode, fallbackTitle, fileName, shouldBindSource) {
  if (!matched || matched.episodeId === undefined || matched.episodeId === null) return null;
  const rawEpisodeId = String(matched.episodeId);
  const rawAnimeId = matched.animeId === undefined || matched.animeId === null
    ? `unknown-${rawEpisodeId}`
    : String(matched.animeId);
  const animeTitle = String(matched.animeTitle || fallbackTitle || fileName || "").trim();
  const episodeTitle = String(matched.episodeTitle || fallbackTitle || fileName || "").trim();
  const displayTitle = [animeTitle, episodeTitle]
    .filter(Boolean)
    .filter((item, index, items) => index === 0 || item !== items[0])
    .join(" - ");
  const safeDisplayTitle = displayTitle || String(fallbackTitle || fileName || "").trim() || "弹幕匹配结果";
  const providerId = `match-${rawAnimeId}-${rawEpisodeId}`;
  const episodeNumber = episode ? String(episode) : undefined;
  return {
    animeId: bindDanmuServerId(providerId, source, shouldBindSource),
    animeTitle: safeDisplayTitle,
    type: "match",
    episodes: [{
      episodeId: bindDanmuServerId(rawEpisodeId, source, shouldBindSource),
      episodeTitle: episodeTitle || `第${episodeNumber || 1}集`,
      episodeNumber,
    }],
  };
}

function buildCanonicalMatchFileName(params) {
  const title = cleanAnimeTitle(params.seriesName || params.title)
    .replace(/\s*第\s*[一二三四五六七八九十百零〇\d]+\s*[季部]\s*$/g, "")
    .trim();
  const episode = Number(params.episode);
  if (!title || Number.isNaN(episode) || episode <= 0) return null;

  const season = Number(params.season);
  const seasonNumber = !Number.isNaN(season) && season > 0 ? season : 1;
  return `${title} S${String(seasonNumber).padStart(2, "0")}E${String(episode).padStart(2, "0")}`;
}

function buildSearchMatchInputs(params) {
  const canonicalFileName = buildCanonicalMatchFileName(params);
  if (!canonicalFileName) {
    return [];
  }
  return [{
    fileName: canonicalFileName,
    fileHash: null,
    scoreBase: 10000,
  }];
}

async function fetchMatchedAnimeForSearch(source, params, shouldBindSource) {
  const inputs = buildSearchMatchInputs(params);
  const candidates = [];
  for (const input of inputs) {
    try {
      const response = await Widget.http.request({
        url: `${source.server}/api/v2/match`,
        method: "POST",
        data: {
          videoDuration: 0,
          fileHash: input.fileHash,
          fileName: input.fileName,
          matchMode: "fileNameOnly",
          fileSize: 0,
        },
        headers: getDanmuHeaders(),
      });
      const data = response && response.data;
      if (!data || !data.isMatched || !Array.isArray(data.matches) || data.matches.length === 0) continue;
      candidates.push(...data.matches
        .map((matched, index) => ({
          anime: buildMatchedAnime(source, matched, params.episode, params.title, input.fileName, shouldBindSource),
          score: input.scoreBase - index,
        }))
        .filter(({ anime }) => Boolean(anime)));
    } catch (error) {
      console.error(`match ${source.server} 失败:`, error);
    }
  }
  return candidates;
}

async function searchDanmu(params) {
  const { tmdbId, type, title, season, link, videoUrl, server, searchBlockKeywords } = params;
  const blockedKeywords = parseBlockedKeywords(searchBlockKeywords);

  let queryTitle = title;
  const sources = getDanmuSources(server);
  const shouldBindSource = shouldShowDanmuSource(sources);
  const matchedResults = await mapDanmuSourcesInBatches(sources, DANMU_SOURCE_BATCH_SIZE, async (source) => {
    const candidates = await fetchMatchedAnimeForSearch(source, params, shouldBindSource);
    return { source, candidates };
  });
  const results = await mapDanmuSourcesInBatches(sources, DANMU_SOURCE_BATCH_SIZE, async (source) => {
    try {
      // 调用弹弹play搜索API - 使用Widget.http.get
      const response = await Widget.http.get(
        `${source.server}/api/v2/search/anime?keyword=${encodeURIComponent(queryTitle)}`,
        {
          headers: getDanmuHeaders(),
        }
      );

      if (!response) {
        throw new Error("获取数据失败");
      }

      const data = response.data;

      // 检查API返回状态
      if (!data.success) {
        throw new Error(data.errorMessage || "API调用失败");
      }

      let rawAnimes = Array.isArray(data.animes) ? data.animes : [];
      // 兜底：search/anime 为空时用 search/episodes（库内查询，兼容未开后备/并行搜索的实例）
      if (rawAnimes.length === 0) {
        const epResponse = await Widget.http.get(
          `${source.server}/api/v2/search/episodes?anime=${encodeURIComponent(queryTitle)}`,
          { headers: getDanmuHeaders() }
        );
        const epData = epResponse && epResponse.data;
        if (epData && Array.isArray(epData.animes)) {
          // 剥离内联 episodes，只保留番剧候选层（App 按三段流程后续调 getDetail 取分集）
          rawAnimes = epData.animes.map(({ episodes, ...anime }) => anime);
        }
      }

      // 搜索结果屏蔽词：过滤不想看到的番剧标题
      if (blockedKeywords.length > 0) {
        rawAnimes = rawAnimes.filter((anime) => !isTitleBlocked(anime && anime.animeTitle, blockedKeywords));
      }

      return {
        source,
        animes: filterAnimes(rawAnimes, type, season, queryTitle),
      };
    } catch (error) {
      console.error(`请求 ${source.server} 失败:`, error);
      return {
        source,
        error,
      };
    }
  });

  let lastError = null;
  let hasSuccessfulResponse = false;
  const candidates = [];

  for (const result of matchedResults) {
    candidates.push(...result.candidates);
  }

  for (const result of results) {
    if (result.error) {
      lastError = result.error;
      continue;
    }

    hasSuccessfulResponse = true;
    candidates.push(...result.animes.map((anime, index) => {
      const searchAnime = {
        ...anime,
        // Misaka 等兼容服务的 bangumi/{id} 端点只认 bangumiId(如 "A900016")，而非数字 animeId(900016)；
        // 标准 dandanplay 无 bangumiId 字段，回退到 animeId 保持原行为
        animeId: bindDanmuServerId(anime.bangumiId || anime.animeId, result.source, shouldBindSource),
        animeTitle: appendDanmuSourceTitle(anime.animeTitle, result.source, shouldBindSource),
      };
      return {
        anime: searchAnime,
        score: scoreDanmuSearchAnime(anime, params, index),
      };
    }));
  }

  // 搜索结果屏蔽词：对 match 候选也生效
  const finalCandidates = candidates.filter((c) => !isTitleBlocked(c.anime && c.anime.animeTitle, blockedKeywords));

  if (hasSuccessfulResponse || finalCandidates.length > 0) {
    return {
      animes: rankedDanmuCandidates(finalCandidates),
    };
  }

  throw lastError || new Error("获取数据失败");
}

function convertChineseNumber(chineseNumber) {
  // 如果是阿拉伯数字，直接转换
  if (/^\d+$/.test(chineseNumber)) {
    return Number(chineseNumber);
  }
  
  // 中文数字映射（简体+繁体）
  const digits = {
    // 简体
    '零': 0, '一': 1, '二': 2, '三': 3, '四': 4, '五': 5,
    '六': 6, '七': 7, '八': 8, '九': 9,
    // 繁体
    '壹': 1, '貳': 2, '參': 3, '肆': 4, '伍': 5,
    '陸': 6, '柒': 7, '捌': 8, '玖': 9
  };
  
  // 单位映射（简体+繁体）
  const units = {
    // 简体
    '十': 10, '百': 100, '千': 1000,
    // 繁体
    '拾': 10, '佰': 100, '仟': 1000
  };
  
  let result = 0;
  let current = 0;
  let lastUnit = 1;
  
  for (let i = 0; i < chineseNumber.length; i++) {
    const char = chineseNumber[i];
    
    if (digits[char] !== undefined) {
      // 数字
      current = digits[char];
    } else if (units[char] !== undefined) {
      // 单位
      const unit = units[char];
      
      if (current === 0) current = 1;
      
      if (unit >= lastUnit) {
        // 更大的单位，重置结果
        result = current * unit;
      } else {
        // 更小的单位，累加到结果
        result += current * unit;
      }
      
      lastUnit = unit;
      current = 0;
    }
  }
  
  // 处理最后的个位数
  if (current > 0) {
    result += current;
  }
  
  return result;
}

// 去掉 Misaka 兼容服务在 animeTitle 上加的后缀，还原干净搜索词
//   "剑来 第二季 （来源：tencent 年份：2025）" -> "剑来 第二季"
//   "剑来（库内：2）（搜索：1-10）" -> "剑来"
function cleanAnimeTitle(title) {
  return String(title || "").replace(/（[^）]*）/g, "").replace(/\([^)]*\)/g, "").replace(/\s+/g, " ").trim();
}

// 标准 dandanplay / 真实作品ID：bangumi/{id} 直接拿分集（稳定，不过期）
async function fetchEpisodesByBangumi(source, id) {
  try {
    const response = await Widget.http.get(
      `${source.server}/api/v2/bangumi/${id}`,
      { headers: getDanmuHeaders() }
    );
    const episodes = response && response.data && response.data.bangumi && response.data.bangumi.episodes;
    return Array.isArray(episodes) && episodes.length > 0 ? episodes : null;
  } catch (error) {
    return null;
  }
}

// 库内兜底：search/episodes 直接内联返回稳定 episodes（仅库内，兼容未开后备的实例如 wuqingfeng）
async function fetchEpisodesByLibrary(source, title, season) {
  const query = cleanAnimeTitle(title);
  if (!query) return null;
  try {
    const response = await Widget.http.get(
      `${source.server}/api/v2/search/episodes?anime=${encodeURIComponent(query)}`,
      { headers: getDanmuHeaders() }
    );
    const animes = response && response.data && response.data.animes;
    if (!Array.isArray(animes) || animes.length === 0) return null;

    let target = animes[0];
    const s = Number(season);
    if (animes.length > 1 && !Number.isNaN(s) && s > 0) {
      const matched = animes.find((a) => extractSeasonNumber(a.animeTitle) === s);
      if (matched) target = matched;
    }
    return Array.isArray(target.episodes) && target.episodes.length > 0 ? target.episodes : null;
  } catch (error) {
    return null;
  }
}

// 兜底：bangumi 临时ID跨数据快照会过期。重新 search/anime 拿"新鲜"ID（同请求内不过期，
// 且能并行命中库外新剧，search/episodes 只查库内），再立即 bangumi 取分集
async function fetchEpisodesByResearch(source, title, season) {
  const query = cleanAnimeTitle(title);
  if (!query) return null;
  try {
    const searchRes = await Widget.http.get(
      `${source.server}/api/v2/search/anime?keyword=${encodeURIComponent(query)}`,
      { headers: getDanmuHeaders() }
    );
    const animes = searchRes && searchRes.data && searchRes.data.animes;
    if (!Array.isArray(animes) || animes.length === 0) return null;

    // 选回对应番剧：原始标题精确匹配优先，否则按 清洗标题+season 收窄
    let target = animes.find((a) => a.animeTitle === title);
    if (!target) {
      const cands = animes.filter((a) => {
        const c = cleanAnimeTitle(a.animeTitle);
        return c === query || c.startsWith(query) || query.startsWith(c);
      });
      const s = Number(season);
      if (!Number.isNaN(s) && s > 0) {
        target = cands.find((a) => extractSeasonNumber(a.animeTitle) === s);
      }
      target = target || cands[0];
    }
    if (!target) return null;

    const freshId = target.bangumiId || target.animeId;
    const detailRes = await Widget.http.get(
      `${source.server}/api/v2/bangumi/${freshId}`,
      { headers: getDanmuHeaders() }
    );
    const episodes = detailRes && detailRes.data && detailRes.data.bangumi && detailRes.data.bangumi.episodes;
    return Array.isArray(episodes) && episodes.length > 0 ? episodes : null;
  } catch (error) {
    return null;
  }
}

// match 兜底：用 title+season+episode 构造标准文件名 → POST /match 直接匹配当前集。
// 走库内直接匹配 + 触发"匹配后备"导入(需服务端开 matchFallbackEnabled)，命中稳定真实作品，不依赖会过期的临时ID。
// 注意：parse_filename 要求 "标题 SxxExx" 格式（"第N集"格式匹配不到）。
async function fetchEpisodesByMatch(source, title, season, episode) {
  // 去来源后缀 + 去尾部"第N季/第N部"（季由 SxxExx 表达，避免 "剑来 第二季 S02E02" 季信息重复导致匹配失败）
  const cleanTitle = cleanAnimeTitle(title).replace(/\s*第\s*[一二三四五六七八九十百零〇\d]+\s*[季部]\s*$/g, "").trim();
  const e = Number(episode);
  if (!cleanTitle || Number.isNaN(e) || e <= 0) return null;
  const s = Number(season);
  const seasonNum = !Number.isNaN(s) && s > 0 ? s : 1;
  const fileName = `${cleanTitle} S${String(seasonNum).padStart(2, "0")}E${String(e).padStart(2, "0")}`;
  try {
    const response = await Widget.http.request({
      url: `${source.server}/api/v2/match`,
      method: "POST",
      data: { fileName, fileHash: null, fileSize: 0, videoDuration: 0, matchMode: "fileNameOnly" },
      headers: getDanmuHeaders(),
    });
    const data = response && response.data;
    if (!data || !data.isMatched || !Array.isArray(data.matches) || data.matches.length === 0) return null;
    const matched = data.matches[0];
    // match 只返回匹配到的当前集，构造单集列表（episodeNumber 设为当前集，供 App 选集对齐）
    return [{
      episodeId: matched.episodeId,
      episodeTitle: matched.episodeTitle || `第${e}集`,
      episodeNumber: String(e),
    }];
  } catch (error) {
    return null;
  }
}

async function getDetailById(params) {
  const { server, animeId, title, seriesName, season, episode } = params;
  // match 用原始剧名(seriesName=video.seriesName)优先，而非 searchDanmu 选番后的候选名(title 被 App 覆盖成 provider.seriesName，可能偏到"特别版")
  const matchTitle = seriesName || title;
  const parsedAnimeId = parseDanmuServerId(animeId);
  const sources = getDanmuRequestSources(server, parsedAnimeId.source);
  const shouldBindSource = shouldShowDanmuSource(sources) || Boolean(parsedAnimeId.source);

  // 多 source 并发，同 source 内 4 级 fallback 保持串行
  const results = await mapDanmuSourcesInBatches(sources, DANMU_SOURCE_BATCH_SIZE, async (source) => {
    try {
      // 1. match 优先：用原始剧名(matchTitle)+season+episode 构造 "标题 SxxExx" 直接匹配当前集。
      //    库内直接匹配 + 严格标题过滤，一步到位拿稳定 episodeId，不依赖易过期的临时ID。
      let episodes = await fetchEpisodesByMatch(source, matchTitle, season, episode);
      // 2. 失败 → 标准 bangumi 端点（官方 dandanplay / 真实作品ID 直接命中）
      if (!episodes) {
        episodes = await fetchEpisodesByBangumi(source, parsedAnimeId.id);
      }
      // 3. 失败 → 重新 search/anime 拿新鲜ID再 bangumi（并行后备实例走实时源）
      if (!episodes) {
        episodes = await fetchEpisodesByResearch(source, title, season);
      }
      // 4. 仍失败 → search/episodes 库内查询兜底（兼容未开后备/search-anime为空的实例如 wuqingfeng）
      if (!episodes) {
        episodes = await fetchEpisodesByLibrary(source, title, season);
      }

      if (episodes) {
        return { source, episodes };
      }
      return { source, error: new Error("获取数据失败") };
    } catch (error) {
      console.error(`请求 ${source.server} 失败:`, error);
      return { source, error };
    }
  });

  let lastError = null;
  let hasSuccessfulResponse = false;
  const allEpisodes = [];

  for (const result of results) {
    if (result.error) {
      lastError = result.error;
      continue;
    }
    hasSuccessfulResponse = true;
    allEpisodes.push(...result.episodes.map((episode) => ({
      ...episode,
      episodeId: bindDanmuServerId(episode.episodeId, result.source, shouldBindSource),
      episodeTitle: appendDanmuSourceTitle(episode.episodeTitle, result.source, shouldBindSource),
    })));
  }

  if (hasSuccessfulResponse) {
    return allEpisodes;
  }

  throw lastError || new Error("获取数据失败");
}

async function getCommentsById(params) {
  const { server, commentId, link, videoUrl, season, episode, tmdbId, type, title, convertMode, blockKeywords, colorMode, maxCount } = params;

  if (commentId) {
    // 繁简转换需要先加载/恢复词表
    await initDict(convertMode);

    const parsedCommentId = parseDanmuServerId(commentId);
    const sources = getDanmuRequestSources(server, parsedCommentId.source);
    let lastError = null;

    for (const source of sources) {
      try {
        // async=1：慢源/库外剧弹幕需实时下载，服务端会等待下载完成再返回（同步请求会直接返回0条）。
        // widget JS 环境无 setTimeout，无法轮询 taskcomment；超长下载返回 taskId 时本次取不到，
        // 靠 App "空弹幕不缓存→下次重试" + Misaka 预下载兜底。
        const response = await Widget.http.get(
          `${source.server}/api/v2/comment/${parsedCommentId.id}?async=1&withRelated=true&chConvert=1`,
          {
            headers: getDanmuHeaders(),
          }
        );

        if (response && response.data) {
          const data = response.data;
          if (Array.isArray(data.comments)) {
            data.comments = processDanmuComments(data.comments, {
              convertMode,
              blockKeywords,
              colorMode,
              maxCount,
            });
          }
          return data;
        }

        lastError = new Error("获取数据失败");
      } catch (error) {
        lastError = error;
        console.error(`请求 ${source.server} 失败:`, error);
      }
    }

    throw lastError || new Error("获取数据失败");
  }
  // else {
  //   // just for sample
  //   const url = "https://dm.itcxo.cn/?ac=dm&url=https://v.qq.com/x/cover/mzc00200tjkzeps/y4101qnn3jo.html"
  //   const response = await Widget.http.get(url);
  //   return response.data;
  // }
  return null;
}
