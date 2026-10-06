/**
 * ASSRT 字幕模块
 * 基于 assrt.net 字幕库的字幕搜索/加载（type: subtitle）。
 * 使用前需在 assrt.net 注册并取得 API Token，配置到下方「API Token」参数。
 * 说明：字幕服务由 assrt.net 提供。
 */
WidgetMetadata = {
  id: "assrt.subtitle.makka",
  title: "ASSRT 字幕",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  description: "基于 assrt.net 的字幕搜索 - 注册后配置 API Token 使用",
  author: "𝙈𝙖𝙠𝙠𝙖𝙋𝙖𝙠𝙠𝙖",
  site: "https://secure.assrt.net/",
  globalParams: [
    {
      name: "token",
      title: "API Token",
      type: "input",
      placeholders: [
        { title: "输入 assrt.net API Token", value: "" },
      ],
    },
  ],
  modules: [
    {
      id: "loadSubtitle",
      title: "加载字幕",
      functionName: "loadSubtitle",
      type: "subtitle",
      cacheDuration: 180,
      params: [],
    },
  ],
};

const API_BASE = "https://api.assrt.net";
const MAX_RESULT_COUNT = 10;   // 最终展示条数上限
const MAX_DETAIL_COUNT = 3;    // 对多少条搜索结果做 detail 深查

// ============ 通用工具 ============

function getText(value) {
  return String(value || "").trim();
}

function getLangText(langField) {
  if (!langField) return "";
  if (typeof langField === "string") return langField;
  if (typeof langField === "object") return langField.desc || "";
  return "";
}

function getFileNameText(file) {
  return getText(file?.f || file?.filename || "");
}

function getExt(name) {
  if (!name) return "";
  const s = String(name).toLowerCase();
  if (s.endsWith(".srt")) return ".srt";
  if (s.endsWith(".ass")) return ".ass";
  if (s.endsWith(".ssa")) return ".ssa";
  if (s.endsWith(".zip")) return ".zip";
  if (s.endsWith(".rar")) return ".rar";
  if (s.endsWith(".7z")) return ".7z";
  return "";
}

function parseSize(sizeVal) {
  if (typeof sizeVal === "number") return Number.isFinite(sizeVal) ? sizeVal : 0;
  const s = getText(sizeVal).toUpperCase();
  if (!s) return 0;
  const m = s.match(/([\d.]+)\s*(B|KB|MB|GB)?/i);
  if (!m) return 0;
  const n = Number(m[1]);
  if (!Number.isFinite(n)) return 0;
  const unit = (m[2] || "B").toUpperCase();
  if (unit === "GB") return n * 1024 * 1024 * 1024;
  if (unit === "MB") return n * 1024 * 1024;
  if (unit === "KB") return n * 1024;
  return n;
}

function formatDownload(num) {
  const n = Number(num) || 0;
  if (n >= 10000) return (n / 10000).toFixed(1) + "w";
  if (n >= 1000) return (n / 1000).toFixed(1) + "k";
  return n;
}

// ============ 语言识别 ============

function getLangHintFromText(text) {
  const t = getText(text).toLowerCase();
  if (!t) return "other";

  const hasTradZh = t.includes("chinese traditional") || t.includes("traditional chinese")
    || t.includes("zh-hant") || /\btc\b/i.test(t);
  const hasSimpZh = t.includes("chinese simplified") || t.includes("simplified chinese")
    || t.includes("zh-hans") || /\bsc\b/i.test(t);

  if (/\b(chs&eng|cht&eng|chs\+eng|cht\+eng)\b/i.test(t)
    || t.includes("双语") || t.includes("中英") || t.includes("简英") || t.includes("繁英")
    || t.includes("简体&英文") || t.includes("繁体&英文")) {
    if (/cht&eng/i.test(t) || t.includes("繁英") || t.includes("繁体&英文")) return "cht&eng";
    return "chs&eng";
  }
  if (/\bchs\b/i.test(t) || t.includes("简中") || t.includes("简体") || t.includes("简") || hasSimpZh) return "chs";
  if (/\bcht\b/i.test(t) || t.includes("繁中") || t.includes("繁体") || t.includes("繁") || hasTradZh) return "cht";
  if (/\beng\b/i.test(t) || t.includes("英文") || t.includes("英语") || t.includes("英")) return "eng";
  if (/\bfr\b/i.test(t) || t.includes("法文") || t.includes("法语") || t.includes("法")) return "fr";
  return "other";
}

function getLangTag(langStr, fileName = "") {
  const hint = getLangHintFromText(`${langStr || ""} ${fileName || ""}`);
  if (hint === "chs&eng") return "【简·双语】";
  if (hint === "cht&eng") return "【繁·双语】";
  if (hint === "chs") return "【简中】";
  if (hint === "cht") return "【繁中】";
  if (hint === "eng") return "【英文】";
  if (hint === "fr") return "【法文】";
  return "【字幕】";
}

function getLangPriority(langText, fileName) {
  const hint = getLangHintFromText(`${langText} ${fileName}`);
  if (hint === "chs&eng" || hint === "cht&eng") return 1;
  if (hint === "chs") return 2;
  if (hint === "cht") return 3;
  return 99;
}

function isChineseSubtitle(langText, fileName) {
  const hint = getLangHintFromText(`${langText} ${fileName}`);
  return hint === "chs" || hint === "cht";
}

function isBilingualSubtitle(langText, fileName) {
  const hint = getLangHintFromText(`${langText} ${fileName}`);
  return hint === "chs&eng" || hint === "cht&eng";
}

// ============ 媒体类型 / 搜索词 / 匹配打分 ============

function detectMediaType(params) {
  const explicit = getText(params?.mediaType).toLowerCase();
  if (explicit === "movie" || explicit === "film") return "movie";
  if (explicit === "tv" || explicit === "series" || explicit === "episode") return "tv";

  const season = Number(params?.season);
  const episode = Number(params?.episode);
  if ((!Number.isNaN(season) && season > 0) || (!Number.isNaN(episode) && episode > 0)) return "tv";

  const title = getText(params?.title) || getText(params?.seriesName);
  if (/S\d{1,2}E\d{1,2}/i.test(title) || /Season\s*\d+\s*Episode\s*\d+/i.test(title) || /第\s*\d+\s*集/.test(title)) return "tv";

  return "movie";
}

function buildSearchKeys(params, mediaType) {
  const { title, seriesName, season, episode } = params;
  const mainName = getText(title || seriesName);
  if (!mainName) return [];

  // 本地译名与原始名不同时，额外用原始名搜索
  const origName = getText(params.originalTitle || params.originalName || params.tmdbInfo?.originalTitle || params.tmdbInfo?.originalName || "");
  const altNames = origName && origName.toLowerCase() !== mainName.toLowerCase() ? [origName] : [];
  const names = [mainName, ...altNames];

  if (mediaType === "tv") {
    const s = Number(season);
    const e = Number(episode);
    const hasSeason = !Number.isNaN(s) && s > 0;
    const hasEpisode = !Number.isNaN(e) && e > 0;
    const keys = [];
    for (const name of names) {
      if (hasSeason && hasEpisode) {
        const sStr = String(s).padStart(2, "0");
        const eStr = String(e).padStart(2, "0");
        keys.push(`${name} S${sStr}E${eStr}`);
        keys.push(`${name} ${sStr}x${eStr}`);
      } else if (hasEpisode) {
        keys.push(`${name} E${String(e).padStart(2, "0")}`);
      }
      if (hasSeason) keys.push(`${name} S${String(s).padStart(2, "0")}`);
      keys.push(name);
    }
    return keys.filter((k) => k.length >= 2);
  }
  return names.filter((k) => k.length >= 2);
}

function getMatchScore(item, params, mediaType) {
  const title = getText(params?.title || params?.seriesName);
  const origTitle = getText(params?.originalTitle || params?.originalName || params?.tmdbInfo?.originalTitle || params?.tmdbInfo?.originalName || "");
  const season = Number(params?.season);
  const episode = Number(params?.episode);
  const sStr = !Number.isNaN(season) && season > 0 ? String(season).padStart(2, "0") : "";
  const eStr = !Number.isNaN(episode) && episode > 0 ? String(episode).padStart(2, "0") : "";
  const movieYear = Number(params?.year);
  const hasMovieYear = !Number.isNaN(movieYear) && movieYear >= 1900;

  const text = (getText(item?.native_name) + " " + getText(item?.videoname) + " " + getText(item?.filename)).toLowerCase();
  const titleLower = title.toLowerCase();
  const origLower = origTitle && origTitle.toLowerCase() !== titleLower ? origTitle.toLowerCase() : "";
  let score = Number(item?.vote_score) || 0;

  if (mediaType === "tv") {
    if (sStr && eStr && new RegExp(`S${sStr}E${eStr}`, "i").test(text)) score += 100000;
    else if (sStr && eStr && new RegExp(`${sStr}x${eStr}`, "i").test(text)) score += 90000;
    else if (sStr && new RegExp(`S${sStr}(?!E)`, "i").test(text)) score += 50000;
    else if (titleLower && text.includes(titleLower)) score += 10000;
    else if (origLower && text.includes(origLower)) score += 5000;
  } else if (titleLower && text.includes(titleLower)) {
    score += 10000;
  } else if (origLower && text.includes(origLower)) {
    score += 5000;
  }

  // 语言加分：双语 +3000，中文 +1000
  const langHint = getLangHintFromText(getLangText(item?.lang));
  if (langHint === "chs&eng" || langHint === "cht&eng") score += 3000;
  else if (langHint === "chs" || langHint === "cht") score += 1000;

  if (mediaType === "movie" && hasMovieYear) {
    const yearMatches = text.match(/(?:19|20)\d{2}/g) || [];
    const years = yearMatches.map(Number).filter((y) => !Number.isNaN(y));
    if (years.length > 0) {
      const bestDiff = Math.min(...years.map((y) => Math.abs(y - movieYear)));
      if (bestDiff === 0) score += 30000;
      else if (bestDiff === 1) score += 18000;
      else if (bestDiff === 2) score += 8000;
      else score -= Math.min(bestDiff * 300, 6000);
    } else {
      score -= 1000;
    }
  }

  score += Math.min(Number(item?.down_count) || 0, 9999) / 10000;
  return score;
}

// 集数匹配级别：3=当前集强匹配，2=同季非当前集，1=弱命中，0=无关
function getEpisodeMatchLevel(fileName, season, episode) {
  const text = getText(fileName);
  if (!text) return 0;

  const s = Number(season);
  const e = Number(episode);
  const hasSeason = !Number.isNaN(s) && s > 0;
  const hasEpisode = !Number.isNaN(e) && e > 0;
  if (!hasSeason || !hasEpisode) return 0;

  const e2 = String(e).padStart(2, "0");
  const exactSe = new RegExp(`\\bS0*${s}\\s*E(?:P)?0*${e}\\b`, "i");
  const exactX = new RegExp(`\\b0*${s}x0*${e}\\b`, "i");
  const exactDot = new RegExp(`\\b0*${s}[._ -]0*${e}\\b`, "i");
  const exactZhJi = new RegExp(`第\\s*0*${e}\\s*[集话話]\\b`, "i");
  const exactEpOnly = new RegExp(`\\bE(?:P)?\\s*0*${e}\\b`, "i");
  const exactStandaloneNumber = new RegExp(`(?:^|[^\\d])0*${e}(?:\\.(?:srt|ass|ssa|zip|rar|7z)|$|[^\\d])`, "i");
  const exactSeasonOnly = new RegExp(`\\bS0*${s}(?!\\s*E)\\b`, "i");

  if (exactSe.test(text) || exactX.test(text) || exactDot.test(text) || exactZhJi.test(text) || exactEpOnly.test(text)) return 3;
  if (new RegExp(`^\\s*0*${e2}(?:\\.(?:srt|ass|ssa|zip|rar|7z))?$`, "i").test(text) || exactStandaloneNumber.test(text)) return 3;
  if (exactSeasonOnly.test(text)) return 2;
  if (/\bS\d{1,2}\s*E(?:P)?\d{1,3}\b/i.test(text) || /\b\d{1,2}x\d{1,3}\b/i.test(text)
    || /\bE(?:P)?\s*\d{1,3}\b/i.test(text) || /第\s*\d+\s*[集话話]/i.test(text)
    || /(?:^|[^\d])\d{1,3}(?:$|[^\d])/i.test(text)) return 1;

  return 0;
}

function shortenSubtitleName(name, maxLen = 28) {
  const text = getText(name);
  if (!text || text.length <= maxLen) return text;

  const suffixMatch = text.match(/\s*(chs&eng|cht&eng|chs|cht|简体&英文|繁体&英文|简体|繁体)\s*$/i);
  const suffix = suffixMatch ? suffixMatch[1] : "";
  const base = suffix ? text.slice(0, suffixMatch.index).trim() : text;

  const episodePatterns = [
    /\bS\d{1,2}E\d{1,2}\b/i,
    /\b\d{1,2}x\d{1,2}\b/i,
    /\b第\s*0*\d+\s*[集话話]\b/i,
    /\b0*\d+\s*[集话話]\b/i,
    /\bE(?:P)?\s*0*\d+\b/i,
    /\bEP\s*0*\d+\b/i,
    /\b\d{1,2}(?:[._ -])\d{1,2}\b/i,
  ];
  const episodeMatch = episodePatterns.map((re) => base.match(re)).find(Boolean);
  const episodeText = episodeMatch ? episodeMatch[0] : "";

  if (base.length <= maxLen) return suffix ? `${base} ${suffix}` : base;

  const reserveLen = episodeText ? episodeText.length + 1 : 0;
  const available = Math.max(12, maxLen - reserveLen);

  let shortened = base;
  if (base.length > available) {
    const headLen = Math.max(8, Math.floor((available - 1) * 0.55));
    const tailLen = Math.max(8, available - headLen - 1);
    shortened = `${base.slice(0, headLen)}…${base.slice(-tailLen)}`;
  }

  if (episodeText && !shortened.includes(episodeText)) shortened = `${shortened} ${episodeText}`;
  return suffix ? `${shortened} ${suffix}` : shortened;
}

// ============ assrt API ============

function getHeaders() {
  return { "User-Agent": "ForwardWidgets/1.0.2" };
}

async function searchSub(token, key) {
  const url = `${API_BASE}/v1/sub/search?token=${encodeURIComponent(token)}&q=${encodeURIComponent(key)}&cnt=15&no_muxer=1`;
  try {
    const res = await Widget.http.get(url, { headers: getHeaders() });
    if (!res?.data || res.data.status !== 0) {
      console.warn(`[assrt] search "${key}" failed: status=${res?.data?.status} msg=${res?.data?.errmsg}`);
      return [];
    }
    return Array.isArray(res.data.sub?.subs) ? res.data.sub.subs : [];
  } catch (err) {
    console.warn(`[assrt] search "${key}" error:`, err?.message || err);
    return [];
  }
}

async function fetchDetail(token, id) {
  const url = `${API_BASE}/v1/sub/detail?token=${encodeURIComponent(token)}&id=${encodeURIComponent(id)}`;
  try {
    const res = await Widget.http.get(url, { headers: getHeaders() });
    if (!res?.data || res.data.status !== 0) return null;
    return res.data.sub?.subs?.[0] || null;
  } catch (err) {
    console.warn(`[assrt] detail id=${id} error:`, err?.message || err);
    return null;
  }
}

// 归一化 pack 类型条目（搜索结果里的"包"没有 id/lang，用 fileid / m_langn 替代）
function normalizeSubItems(subs) {
  return subs.map((item) => {
    if (!item.id && item.fileid) item.id = item.fileid;
    if (!item.lang && item.m_langn) {
      const arr = item.m_langn;
      const hasDou = arr.includes("langdou");
      const hasChs = arr.includes("langchs");
      const hasCht = arr.includes("langcht");
      const hasEng = arr.includes("langeng");
      let desc = "";
      if (hasDou) desc = hasCht ? "cht&eng" : "chs&eng";
      else if (hasChs) desc = "chs";
      else if (hasCht) desc = "cht";
      else if (hasEng) desc = "eng";
      item.lang = desc ? { desc } : item.m_lang || "";
    }
    if (!item.filename && item.sub_name) item.filename = item.sub_name;
    return item;
  });
}

// 临时下载 URL 统一升级为 HTTPS，并把路径中的 & 转义为 %26
function normalizeDownloadUrl(url) {
  if (!url) return "";
  let u = url.replace(/^http:\/\//i, "https://");
  const qi = u.indexOf("?");
  if (qi >= 0) u = u.slice(0, qi).replace(/&/g, "%26") + u.slice(qi);
  else u = u.replace(/&/g, "%26");
  return u;
}

// ============ 主入口 ============

async function loadSubtitle(params) {
  const { token } = params;
  if (!token) return [];

  const mediaType = detectMediaType(params);
  const searchKeys = buildSearchKeys(params, mediaType);
  if (searchKeys.length === 0) return [];

  // 依次用候选搜索词查询，命中即停
  let allSubs = [];
  for (const word of searchKeys) {
    const list = await searchSub(token, word);
    if (list.length > 0) {
      allSubs = list;
      break;
    }
  }
  if (allSubs.length === 0) return [];

  allSubs = normalizeSubItems(allSubs);

  // 剧集：按标题收窄到相关结果
  const titleLower = getText(params?.title || params?.seriesName).toLowerCase();
  if (titleLower && mediaType === "tv") {
    const matched = allSubs.filter((item) => {
      const text = (getText(item?.native_name) + " " + getText(item?.videoname) + " " + getText(item?.filename)).toLowerCase();
      return text.includes(titleLower);
    });
    if (matched.length > 0) allSubs = matched;
  }

  // 电影：按年份收窄
  const movieYear = Number(params?.year);
  const hasMovieYear = mediaType === "movie" && !Number.isNaN(movieYear) && movieYear >= 1900;
  if (hasMovieYear) {
    const yearMatched = allSubs.filter((item) => {
      const text = (getText(item?.native_name) + " " + getText(item?.videoname) + " " + getText(item?.filename)).toLowerCase();
      const years = (text.match(/(?:19|20)\d{2}/g) || []).map(Number).filter((y) => !Number.isNaN(y));
      return years.some((y) => Math.abs(y - movieYear) <= 1);
    });
    if (yearMatched.length > 0) allSubs = yearMatched;
  }

  // 搜索结果有中文/双语时优先只保留它们
  const hasChineseInSearch = allSubs.some((item) => {
    const hint = getLangHintFromText(getLangText(item.lang));
    return hint === "chs" || hint === "cht" || hint === "chs&eng" || hint === "cht&eng";
  });
  let filteredByLang = allSubs;
  if (hasChineseInSearch) {
    const chineseOrBilingual = allSubs.filter((item) => {
      const hint = getLangHintFromText(getLangText(item.lang));
      return hint === "chs" || hint === "cht" || hint === "chs&eng" || hint === "cht&eng";
    });
    if (chineseOrBilingual.length > 0) filteredByLang = chineseOrBilingual;
  }

  // 打分排序，取前 MAX_DETAIL_COUNT 个做详情深查
  const scored = filteredByLang
    .map((item) => ({ item, score: getMatchScore(item, params, mediaType) }))
    .sort((a, b) => b.score - a.score);

  const packages = [];
  let hasChineseSubtitle = false;

  for (const { item } of scored.slice(0, MAX_DETAIL_COUNT)) {
    const subInfo = await fetchDetail(token, item.id);
    if (!subInfo) continue;

    const langText = getLangText(subInfo.lang) || getLangText(item.lang) || "未知";
    const downNum = subInfo.down_count || item.down_count || 0;
    const score = Number(item.vote_score) || 0;
    const subName = subInfo.native_name || item.native_name || subInfo.filename || item.filename || "字幕";
    const langTag = getLangTag(langText, subName);
    const downText = formatDownload(downNum);

    const hasFilelist = Array.isArray(subInfo.filelist) && subInfo.filelist.length > 0;
    const files = hasFilelist ? subInfo.filelist : [subInfo];

    const season = Number(params?.season);
    const episode = Number(params?.episode);
    const isTvEpisode = mediaType === "tv" && !Number.isNaN(season) && season > 0 && !Number.isNaN(episode) && episode > 0;

    const rankedFilesRaw = files
      .map((file, idx) => {
        const fileName = getFileNameText(file) || getText(subInfo.filename || subName);
        const normalizedHint = getLangHintFromText(fileName) !== "other"
          ? getLangHintFromText(fileName)
          : getLangHintFromText(getLangText(file.lang)) !== "other"
            ? getLangHintFromText(getLangText(file.lang))
            : getLangHintFromText(langText);
        return {
          file: file || {},
          idx,
          fileName,
          fileLangText: normalizedHint,
          langPriority: getLangPriority(normalizedHint, fileName),
          isChinese: isChineseSubtitle(normalizedHint, fileName),
          isBilingual: isBilingualSubtitle(normalizedHint, fileName),
          episodeMatchLevel: getEpisodeMatchLevel(fileName, season, episode),
        };
      })
      .filter((entry) => entry.fileName);

    const exactEpisodeFiles = isTvEpisode ? rankedFilesRaw.filter((e) => e.episodeMatchLevel >= 3) : rankedFilesRaw;
    const seasonLevelFiles = isTvEpisode ? rankedFilesRaw.filter((e) => e.episodeMatchLevel >= 2) : rankedFilesRaw;
    const nonConflictingFiles = isTvEpisode ? rankedFilesRaw.filter((e) => e.episodeMatchLevel !== 1) : rankedFilesRaw;
    const episodeFirst = exactEpisodeFiles.length > 0
      ? exactEpisodeFiles
      : seasonLevelFiles.length > 0
        ? seasonLevelFiles
        : nonConflictingFiles.length > 0
          ? nonConflictingFiles
          : rankedFilesRaw;

    const rankedFiles = episodeFirst
      .sort((a, b) => {
        if (isTvEpisode && a.episodeMatchLevel !== b.episodeMatchLevel) return b.episodeMatchLevel - a.episodeMatchLevel;
        if (a.langPriority !== b.langPriority) return a.langPriority - b.langPriority;
        const aSize = parseSize(a.file?.s);
        const bSize = parseSize(b.file?.s);
        if (aSize !== bSize) return bSize - aSize;
        return a.idx - b.idx;
      })
      .slice(0, hasFilelist ? episodeFirst.length : isTvEpisode ? 1 : 2);

    const packageHasChinese = rankedFiles.some((e) => e.isChinese || e.isBilingual);
    if (packageHasChinese) hasChineseSubtitle = true;

    packages.push({
      item,
      subInfo,
      langText,
      downNum,
      score,
      subName,
      langTag,
      downText,
      hasFilelist,
      rankedFiles,
      packageHasChinese,
      packageEpisodeMatchLevel: rankedFiles[0]?.episodeMatchLevel || 0,
      packageLangPriority: rankedFiles[0]?.langPriority || 99,
      packageDownCount: Number(downNum) || 0,
      packageVoteScore: Number(score) || 0,
      packageUploadTs: Date.parse(subInfo.upload_time || item.upload_time || "") || 0,
    });
  }

  const selectedPackages = (hasChineseSubtitle
    ? packages.filter((p) => p.packageHasChinese)
    : packages
  ).sort((a, b) => {
    if (a.packageEpisodeMatchLevel !== b.packageEpisodeMatchLevel) return b.packageEpisodeMatchLevel - a.packageEpisodeMatchLevel;
    if (a.packageLangPriority !== b.packageLangPriority) return a.packageLangPriority - b.packageLangPriority;
    if (a.packageDownCount !== b.packageDownCount) return b.packageDownCount - a.packageDownCount;
    if (a.packageVoteScore !== b.packageVoteScore) return b.packageVoteScore - a.packageVoteScore;
    if (a.packageUploadTs !== b.packageUploadTs) return b.packageUploadTs - a.packageUploadTs;
    return 0;
  });

  const result = [];
  const existKey = new Set();

  function tryPushEntry(pack, entry) {
    if (!entry) return false;
    const file = entry.file || {};
    const fileName = entry.fileName;
    let url = pack.hasFilelist ? file.url : pack.subInfo.url;
    if (!url) return false;

    url = normalizeDownloadUrl(url);

    const dedupeKey = `${pack.item.id}|${(fileName || "").toLowerCase()}`;
    if (existKey.has(dedupeKey)) return false;
    existKey.add(dedupeKey);

    const rawName = pack.hasFilelist ? fileName : pack.subName;
    const cleanName = rawName.replace(/\.(srt|ass|ssa|zip|rar|7z)$/i, "");
    const ext = getExt(fileName) || getExt(pack.subName);
    // 压缩包扩展名对用户无信息量，播放器会自行解压，移除显示
    const displayExt = [".zip", ".rar", ".7z"].includes(ext) ? "" : ext;
    const displayName = shortenSubtitleName(cleanName);
    const entryLangTagByFile = getLangTag("", fileName || "");
    const entryLangTagByMerged = getLangTag(entry.fileLangText || pack.langText, fileName || pack.subName);
    const entryLangTag = entryLangTagByFile !== "【字幕】"
      ? entryLangTagByFile
      : entryLangTagByMerged;

    result.push({
      id: `${pack.item.id}-${entry.idx}`,
      title: `${entryLangTag}${displayName}${displayExt} | 下载${pack.downText}次`,
      lang: pack.langText,
      count: pack.score,
      url,
    });
    return true;
  }

  const packVisibleMap = new Map();

  // 第一轮：每包先取 1 条
  for (const pack of selectedPackages) {
    if (result.length >= MAX_RESULT_COUNT) break;
    const visibleFiles = hasChineseSubtitle
      ? pack.rankedFiles.filter((e) => e.isChinese || e.isBilingual)
      : pack.rankedFiles;
    packVisibleMap.set(pack.item.id, visibleFiles);
    if (visibleFiles.length === 0) continue;
    tryPushEntry(pack, visibleFiles[0]);
  }

  // 第二轮：不足上限时从每包次优候选补齐
  if (result.length < MAX_RESULT_COUNT) {
    for (const pack of selectedPackages) {
      if (result.length >= MAX_RESULT_COUNT) break;
      const visibleFiles = packVisibleMap.get(pack.item.id) || [];
      for (let i = 1; i < visibleFiles.length; i++) {
        if (result.length >= MAX_RESULT_COUNT) break;
        tryPushEntry(pack, visibleFiles[i]);
      }
    }
  }

  return result;
}
