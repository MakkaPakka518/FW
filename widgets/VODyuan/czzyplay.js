WidgetMetadata = {
  id: 'czzyplay.makka', title: '资源聚合', author: '𝙈𝙖𝙠𝙠𝙖𝙋𝙖𝙠𝙠𝙖', version: '1.0.0', requiredVersion: '0.0.1',
  iconurl: 'https://raw.githubusercontent.com/MakkaPakka518/Icon/refs/heads/main/Rex_White.png',
  description: '播放资源聚合：分类片库、搜索、详情选集与 HLS 播放，可设置前置代理。',
  site: 'https://rex.778477.xyz',detailCacheDuration: 0,
  globalParams: [{name: 'proxy', title: '前置代理根地址（可选）', type: 'input', value: '',
    description: '填写后所有请求使用「代理根地址/完整目标网址」，不回退直连。代理须中转重定向、支持 Range，并重写 HLS 清单。'}],
  modules: [{id: 'catalog', title: '资源片库', functionName: 'loadList', cacheDuration: 0, params: [
    {name: 'category', title: '分类', type: 'enumeration', value: 'all', enumOptions: [
      {title: '全部', value: 'all'},
      {title: '电影片', value: '1'},
      {title: '电影片 · 动作片', value: '101'},
      {title: '电影片 · 喜剧片', value: '102'},
      {title: '电影片 · 科幻片', value: '103'},
      {title: '电影片 · 恐怖片', value: '104'},
      {title: '电影片 · 爱情片', value: '105'},
      {title: '电影片 · 剧情片', value: '106'},
      {title: '电影片 · 战争片', value: '107'},
      {title: '电影片 · 纪录片', value: '6'},
      {title: '电影片 · 动画片', value: '108'},
      {title: '电影片 · 伦理片', value: '109'},
      {title: '连续剧', value: '2'},
      {title: '连续剧 · 国产剧', value: '201'},
      {title: '连续剧 · 欧美剧', value: '202'},
      {title: '连续剧 · 香港剧', value: '203'},
      {title: '连续剧 · 韩国剧', value: '204'},
      {title: '连续剧 · 台湾剧', value: '205'},
      {title: '连续剧 · 日本剧', value: '206'},
      {title: '连续剧 · 海外剧', value: '207'},
      {title: '连续剧 · 泰国剧', value: '208'},
      {title: '动漫片', value: '4'},
      {title: '动漫片 · 国产动漫', value: '401'},
      {title: '动漫片 · 日韩动漫', value: '402'},
      {title: '动漫片 · 欧美动漫', value: '403'},
      {title: '动漫片 · 港台动漫', value: '404'},
      {title: '动漫片 · 海外动漫', value: '405'},
      {title: '综艺片', value: '3'},
      {title: '综艺片 · 大陆综艺', value: '301'},
      {title: '综艺片 · 港台综艺', value: '302'},
      {title: '综艺片 · 日韩综艺', value: '303'},
      {title: '综艺片 · 欧美综艺', value: '304'},
      {title: '体育', value: '8'},
      {title: '体育 · 足球', value: '801'},
      {title: '体育 · 篮球', value: '802'},
      {title: '短剧', value: '5'},
      {title: '短剧 · 都市脑洞', value: '501'},
      {title: '短剧 · 古装仙侠', value: '502'},
      {title: '短剧 · 反转爽文', value: '503'},
      {title: '短剧 · 重生民国', value: '504'},
      {title: '短剧 · 穿越年代', value: '505'},
      {title: '短剧 · 现代言情', value: '506'},
      {title: '短剧 · 闪婚离婚', value: '507'},
      {title: '短剧 · 女恋总裁', value: '508'}
    ]},
    {name: 'year', title: '年份', type: 'input', value: '', description: '留空全部；可填 2026 或 2020-2026'},
    {name: 'isend', title: '完结状态', type: 'enumeration', value: 'all', enumOptions: [
      {title: '全部', value: 'all'}, {title: '已完结', value: '1'}, {title: '连载中', value: '0'}
    ]},
    {name: 'page', title: '页码', type: 'page'}
  ]},
  {id: 'loadResource', title: '播放资源线路', functionName: 'loadResource', type: 'stream', cacheDuration: 0, params: []}],
  search: {title: '搜索资源', functionName: 'search', params: [
    {name: 'keyword', title: '关键词', type: 'input'},
    {name: 'page', title: '页码', type: 'page'}
  ]}
};

const API = 'https://api.changzhang.tv/api.php/provide/vod/';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131.0.0.0 Safari/537.36';
const PROXY_KEY = 'vodrealm.proxy';
const IMAGE_HEADERS = {'User-Agent': UA, Referer: 'https://changzhang.tv/'};
const MEDIA_HEADERS = {'User-Agent': UA};
const DETAIL_TTL = 5 * 60 * 1000, DETAIL_MAX = 30;
const detailCache = new Map();

function clean(value) {
  return String(value == null ? '' : value).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}
function positive(value) { return /^[1-9]\d*$/.test(String(value || '')); }
function http(value) { return /^https?:\/\/[a-z\d.-]+(?::\d+)?(?:[/?#][^\s\\]*)?$/i.test(String(value || '')); }
function prefix(value) {
  const p = clean(value).replace(/\/+$/, '');
  if (!p && !clean(value)) return '';
  if (!/^https?:\/\/[a-z\d.-]+(?::\d+)?(?:\/[\w.~-]+)*$/i.test(p) || /(?:^|\/)\.{1,2}(?:\/|$)/.test(p)) {
    throw Error('[资源聚合] 请填写有效的前置代理根地址，不要包含查询参数');
  }
  return p + '/';
}
async function storeGet() {
  const storage = Widget.storage;
  if (!storage) return undefined;
  if (typeof storage.getItem === 'function') return await storage.getItem(PROXY_KEY);
  if (typeof storage.get === 'function') return await storage.get(PROXY_KEY);
  return undefined;
}
async function storeSet(value) {
  const storage = Widget.storage;
  if (!storage) return;
  if (typeof storage.setItem === 'function') { await storage.setItem(PROXY_KEY, value); return; }
  if (typeof storage.set === 'function') await storage.set(PROXY_KEY, value);
}
async function setting(params, required) {
  if (params && params.proxy != null) {
    const p = prefix(params.proxy);
    if (required && !p) throw Error('[资源聚合] 该条目使用前置代理，请刷新片库');
    await storeSet(p);
    return p;
  }
  const p = prefix(await storeGet());
  if (required && !p) throw Error('[资源聚合] 前置代理配置缺失，请刷新片库；已停止请求');
  return p;
}
function target(arg) {
  if (typeof arg === 'string') return {value: arg, params: {}};
  if (arg && typeof arg === 'object') return {value: arg.link != null ? arg.link : arg.id, params: arg};
  return {value: undefined, params: {}};
}
function via(p, url) {
  if (!http(url)) throw Error('[资源聚合] 无效的资源地址');
  return !p || url.startsWith(p) ? url : p + url;
}
function image(value, p) {
  let url = clean(value);
  if (!url) return '';
  if (url.startsWith('//')) url = 'https:' + url;
  return http(url) ? via(p, url) : '';
}
function pageOf(value) { return positive(value) ? Number(value) : 1; }
function yearOf(value) {
  const text = clean(value);
  if (!text) return '';
  if (!/^(?:19|20)\d{2}(?:-(?:19|20)\d{2})?$/.test(text)) throw Error('[资源聚合] 年份请填 2026 或 2020-2026');
  const [start, end = start] = text.split('-');
  if (Number(start) > Number(end)) throw Error('[资源聚合] 年份起始不能晚于结束');
  return text;
}
function owned(raw) {
  const match = /^vod:(detail|play):([1-9]\d*)(?::([1-9]\d*))?(?::(via))?$/.exec(String(raw || ''));
  if (!match) return null;
  return {kind: match[1], id: match[2], episode: match[3] ? Number(match[3]) : 0, via: !!match[4]};
}
function endpoint(fields) {
  return API + '?' + Object.keys(fields).filter(key => fields[key] !== '' && fields[key] != null)
    .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(String(fields[key]))).join('&');
}
async function api(fields, p) {
  let response;
  try {
    response = await Widget.http.get(via(p, endpoint(fields)), {allow_redirects: !p,
      headers: {'User-Agent': UA, Referer: 'https://changzhang.tv/'}});
  } catch (error) {
    throw Error('[资源聚合] 采集接口请求失败：' + (clean(error && error.message) || '网络错误'));
  }
  if (p && http(response && response.url) && !response.url.startsWith(p)) {
    throw Error('[资源聚合] 采集接口请求离开了前置代理');
  }
  const status = Number(response && (response.statusCode || response.status || 200));
  if (status < 200 || status >= 300) throw Error('[资源聚合] 采集接口返回 HTTP ' + status);
  let data = response && response.data;
  if (typeof data === 'string') {
    try { data = JSON.parse(data); } catch (error) { throw Error('[资源聚合] 采集接口未返回 JSON'); }
  }
  if (!data || Number(data.code) !== 1 || !Array.isArray(data.list)) throw Error('[资源聚合] 采集接口返回了无效数据');
  return data;
}
function episodeNumber(label, index) {
  const match = /(?:第\s*)?(\d+)\s*(?:集|话|話|回)/.exec(String(label || '')) || /^(\d+)$/.exec(String(label || ''));
  return match ? Number(match[1]) : index;
}
function mediaTypeOf(vod, episodes) {
  const parent = Number(vod.type_id_1 || Math.floor(Number(vod.type_id || 0) / 100));
  if (parent === 1) return 'movie';
  if (episodes && episodes.length === 1 && !/集|话|話|回|期/.test(episodes[0].label || '')) return 'movie';
  if (!episodes && parent === 4 && !/集|话|話|回|期/.test(clean(vod.vod_remarks))) return 'movie';
  return 'tv';
}
function itemOf(vod, episodes, p) {
  const id = String(vod.vod_id || '');
  if (!positive(id)) return null;
  const link = 'vod:detail:' + id + (p ? ':via' : '');
  const mediaType = mediaTypeOf(vod, episodes);
  const score = Number(vod.vod_score), rating = Number.isFinite(score) && score > 0 ? score : undefined;
  return {
    id: link, link, type: 'url', title: clean(vod.vod_name) || ('资源影片 ' + id),
    posterPath: image(vod.vod_pic, p), headers: IMAGE_HEADERS, mediaType,
    description: clean(vod.vod_content || vod.vod_blurb),
    ...(rating ? {rating} : {}), genreTitle: clean(vod.type_name),
    releaseDate: clean(vod.vod_pubdate || vod.vod_year),
    durationText: clean(vod.vod_remarks)
  };
}
function parseGroups(vod) {
  const names = String(vod.vod_play_from || '').split('$$$');
  const blocks = String(vod.vod_play_url || '').split('$$$');
  const groups = [];
  for (let index = 0; index < blocks.length; index++) {
    const entries = [];
    for (const raw of blocks[index].split('#')) {
      const text = String(raw || '').trim();
      if (!text) continue;
      const cut = text.indexOf('$');
      const label = clean(cut >= 0 ? text.slice(0, cut) : '正片') || ('第' + (entries.length + 1) + '集');
      const url = clean(cut >= 0 ? text.slice(cut + 1) : text);
      if (!http(url)) continue;
      entries.push({label, url, episode: episodeNumber(label, entries.length + 1)});
    }
    if (!entries.length) continue;
    groups.push({name: clean(names[index]) || ('线路' + (groups.length + 1)), entries});
  }
  return groups;
}
function buildEpisodes(groups) {
  if (!groups.length) return [];
  let base = groups[0];
  for (const group of groups) if (group.entries.length > base.entries.length) base = group;
  return base.entries.map((entry, index) => {
    const sources = [];
    for (const group of groups) {
      const positional = group.entries[index];
      const candidate = positional && positional.label === entry.label ? positional :
        (group.entries.length === base.entries.length ? positional : group.entries.find(item => item.label === entry.label));
      if (candidate) sources.push({name: group.name, url: candidate.url});
    }
    return {label: entry.label, episode: entry.episode, sources};
  }).filter(episode => episode.sources.length);
}
async function fetchSeries(id, p) {
  const data = await api({ac: 'videolist', ids: String(id)}, p);
  const vod = data.list.find(item => String(item.vod_id) === String(id));
  if (!vod) throw Error('[资源聚合] 没有找到影片 ' + id);
  const episodes = buildEpisodes(parseGroups(vod));
  return {vod, episodes};
}
async function series(id, p) {
  const now = Date.now(), cacheKey = id + (p ? ':via' : ''), hit = detailCache.get(cacheKey);
  if (hit && hit.promise && now - hit.at < DETAIL_TTL) return await hit.promise;
  if (detailCache.size >= DETAIL_MAX) detailCache.delete(detailCache.keys().next().value);
  const entry = {at: now, promise: fetchSeries(id, p)};
  detailCache.set(cacheKey, entry);
  try { return await entry.promise; }
  catch (error) { detailCache.delete(cacheKey); throw error; }
}
// 播放页 share 链接统一映射为 /play/<id>/<ep>/index.m3u8。
function shareToPlay(url) {
  const text = String(url || '');
  const share = /^https:\/\/svip\.czzyplay\.com\/share\/([1-9]\d*)\/([A-Za-z0-9_-]{1,64})\/?(?:[?#][^\s\\]*)?$/.exec(text);
  if (share) return 'https://svip.czzyplay.com/play/' + share[1] + '/' + share[2] + '/index.m3u8';
  const play = /^https:\/\/svip\.czzyplay\.com\/play\/([1-9]\d*)\/([A-Za-z0-9_-]{1,64})\/index\.m3u8(?:[?#][^\s\\]*)?$/.exec(text);
  return play ? 'https://svip.czzyplay.com/play/' + play[1] + '/' + play[2] + '/index.m3u8' : '';
}
async function getText(p, url, referer) {
  let response;
  try {
    response = await Widget.http.get(via(p, url), {allow_redirects: !p,
      headers: {'User-Agent': UA, Referer: referer || 'https://changzhang.tv/'}});
  } catch (error) {
    throw Error('[资源聚合] 请求失败：' + (clean(error && error.message) || '网络错误'));
  }
  if (p && http(response && response.url) && !response.url.startsWith(p)) {
    throw Error('[资源聚合] 请求离开了前置代理');
  }
  const status = Number(response && (response.statusCode || response.status || 200));
  if (status < 200 || status >= 300) throw Error('[资源聚合] 前置代理返回 HTTP ' + status);
  if (typeof (response && response.data) !== 'string') throw Error('[资源聚合] 前置代理未返回文本');
  return response.data;
}
async function available(url, p) {
  try {
    const text = await getText(p, url);
    return /^\s*#EXTM3U\b/.test(text);
  } catch (error) {
    return false;
  }
}
// 播放器仍会自行请求子清单和分片；仅代理入口不足以阻止这些请求直连。
function childURL(base, ref) {
  if (!ref || /[\s\\{}]/.test(ref)) throw Error('[资源聚合] 不支持动态或非法 HLS 引用');
  if (http(ref)) return ref;
  if (ref.startsWith('//')) return base.split(':')[0] + ':' + ref;
  if (/^[\w+.-]+:/.test(ref)) throw Error('[资源聚合] 不支持该 HLS URI');
  const origin = base.match(/^https?:\/\/[^/]+/i)[0], path = ref.split(/[?#]/)[0];
  if (!path) return base.split(/[?#]/)[0] + ref;
  const parts = path.startsWith('/') ? [''] : base.slice(origin.length).split(/[?#]/)[0].split('/').slice(0, -1);
  for (const part of (path.startsWith('/') ? path.slice(1) : path).split('/')) {
    const dot = part.replace(/%2e/ig, '.');
    if (dot === '.') continue;
    if (dot === '..') { if (parts.length > 1) parts.pop(); } else parts.push(part);
  }
  return origin + parts.join('/') + ref.slice(path.length);
}
async function checkHLS(proxy, entry, seen = new Set()) {
  if (seen.has(entry)) return;
  if (seen.size >= 32) throw Error('[资源聚合] HLS 子清单过多');
  seen.add(entry);
  const text = await getText(proxy, entry);
  if (!/^\s*#EXTM3U\b/.test(text)) throw Error('[资源聚合] 前置代理未返回 HLS 清单');
  let nextList = false, master = false, end = false;
  const children = new Set();
  function check(ref, list) {
    const resolved = childURL(entry, ref);
    if (!resolved.startsWith(proxy) || !http(resolved.slice(proxy.length))) {
      throw Error('[资源聚合] HLS 含未中转的地址：请启用代理的播放列表重写');
    }
    if (list) children.add(resolved);
  }
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line) continue;
    if (!line.startsWith('#')) {
      check(line, nextList || /\.m3u8(?:[?#]|$)/i.test(line));
      nextList = false;
      continue;
    }
    if (/^#EXT-X-STREAM-INF:/.test(line)) { master = true; nextList = true; }
    if (line === '#EXT-X-ENDLIST') end = true;
    if (line.startsWith('#EXT-X-')) {
      const tag = line.split(':')[0].slice(7);
      if (!/^(?:VERSION|INDEPENDENT-SEGMENTS|START|STREAM-INF|MEDIA|I-FRAME-STREAM-INF|IMAGE-STREAM-INF|SESSION-KEY|KEY|MAP|TARGETDURATION|MEDIA-SEQUENCE|DISCONTINUITY-SEQUENCE|DISCONTINUITY|ENDLIST|PLAYLIST-TYPE|I-FRAMES-ONLY|PROGRAM-DATE-TIME|GAP|BITRATE|BYTERANGE)$/.test(tag)) {
        throw Error('[资源聚合] 代理模式不接受未验证的 HLS 标签：' + tag);
      }
      const uris = /(?:[:,])\s*URI\s*=\s*"([^"]+)"/gi;
      let match;
      while ((match = uris.exec(line))) check(match[1], /^(?:MEDIA|I-FRAME-STREAM-INF|IMAGE-STREAM-INF)$/.test(tag));
      if (/[:,]\s*[\w-]*URI\s*=/i.test(line.replace(uris, ''))) throw Error('[资源聚合] 不支持该 HLS URI 格式');
    } else if (/^#EXT/i.test(line) && !/^#(?:EXTM3U$|EXTINF:)/.test(line)) {
      throw Error('[资源聚合] 不支持该 HLS 扩展');
    }
  }
  if (!master && !end) throw Error('[资源聚合] 代理模式下仅支持可预检的点播清单');
  for (const sub of children) await checkHLS(proxy, sub, seen);
}
async function loadList(params = {}) {
  try {
    const p = await setting(params);
    const category = positive(params.genreId) ? String(params.genreId) : clean(params.category || 'all');
    const data = await api({ac: 'videolist', t: category === 'all' ? '' : category, year: yearOf(params.year),
      isend: ['0', '1'].includes(String(params.isend)) ? String(params.isend) : '', pg: pageOf(params.page), pagesize: 20}, p);
    return data.list.map(vod => itemOf(vod, null, p)).filter(Boolean);
  } catch (error) {
    throw Error(clean(error && error.message) || '[资源聚合] 分类加载失败');
  }
}
async function search(params = {}) {
  const keyword = clean(params.keyword);
  if (!keyword) return [];
  try {
    const p = await setting(params);
    const data = await api({ac: 'videolist', wd: keyword, pg: pageOf(params.page), pagesize: 20}, p);
    return data.list.map(vod => itemOf(vod, null, p)).filter(Boolean);
  } catch (error) {
    throw Error(clean(error && error.message) || '[资源聚合] 搜索失败');
  }
}
async function loadDetail(raw) {
  const {value, params} = target(raw);
  const key = owned(value);
  if (!key || key.kind !== 'detail') return null;
  try {
    const p = await setting(params, key.via);
    const result = await series(key.id, p);
    const item = itemOf(result.vod, result.episodes, p);
    if (!item) return null;
    item.episodeItems = result.episodes.map((episode, index) => ({
      id: 'vod:play:' + key.id + ':' + (index + 1) + (p ? ':via' : ''),
      link: 'vod:play:' + key.id + ':' + (index + 1) + (p ? ':via' : ''), type: 'url',
      title: episode.label, posterPath: item.posterPath, headers: IMAGE_HEADERS, mediaType: item.mediaType,
      episode: episode.episode
    }));
    return item;
  } catch (error) {
    throw Error(clean(error && error.message) || '[资源聚合] 详情加载失败');
  }
}
async function loadResource(arg = {}) {
  const {value, params} = target(arg);
  const key = owned(value);
  if (!key || !key.id) return [];
  try {
    const p = await setting(params, key.via);
    const result = await series(key.id, p);
    if (key.kind === 'play' && !key.episode) return [];
    const index = key.kind === 'play' ? key.episode - 1 : (positive(params.episode) ? Number(params.episode) - 1 : 0);
    const episode = result.episodes[index];
    if (!episode) return [];
    const candidates = [];
    const seen = new Set();
    for (const source of episode.sources) {
      const play = shareToPlay(source.url);
      if (!play || seen.has(play)) continue;
      seen.add(play);
      candidates.push({name: source.name, url: play});
    }
    if (!candidates.length) return [];
    const results = await Promise.all(candidates.map(async source => {
      try {
        if (!await available(source.url, p)) return null;
        const url = via(p, source.url);
        if (p) await checkHLS(p, url);
        return {
          name: '播放资源', description: episode.label + ' · HLS', url,
          customHeaders: MEDIA_HEADERS, headers: MEDIA_HEADERS, playerType: 'app'
        };
      } catch (error) {
        return {error: clean(error && error.message) || '[资源聚合] 播放线路解析失败'};
      }
    }));
    const streams = results.filter(item => item && item.url);
    if (!streams.length) {
      const failure = results.find(item => item && item.error);
      if (failure) throw Error(failure.error);
    }
    return streams;
  } catch (error) {
    throw Error(clean(error && error.message) || '[资源聚合] 播放线路解析失败');
  }
}
