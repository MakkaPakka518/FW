 WidgetMetadata = {
  id: 'makkapakka.7sefun', title: '七色番', author: 'MakkaPakka518', version: '1.0.1', requiredVersion: '0.0.1',
  description: '番剧分类、搜索、选集与多线路播放，可设置全站前缀反代。', site:'https://www.7sefun.top', detailCacheDuration:0,
  globalParams:[{name:'proxy',title:'反代根地址（可选）',type:'input',value:'',description:'填写后使用「反代根地址/完整目标网址」，不回退直连。反代须中转重定向并支持 Range。'}],
  modules:[{id:'catalog',title:'分类片库',functionName:'loadList',cacheDuration:0,params:[
    {name:'category',title:'分类',type:'enumeration',value:'1',enumOptions:[{title:'TV番剧',value:'1'},{title:'国漫',value:'5'},{title:'剧场电影',value:'2'},{title:'特摄剧',value:'4'}]},
    {name:'order',title:'排序',type:'enumeration',value:'time',enumOptions:[{title:'更新时间',value:'time'},{title:'人气',value:'hits'},{title:'评分',value:'score'}]},
    {name:'area',title:'地区',type:'input',value:''},{name:'genre',title:'类型',type:'input',value:''},
    {name:'lang',title:'语言',type:'input',value:''},{name:'letter',title:'首字母',type:'input',value:''},{name:'year',title:'年份',type:'input',value:''},
    {name:'page',title:'页码',type:'page'}]},
    {id:'loadResource',title:'七色番播放线路',functionName:'loadResource',type:'stream',cacheDuration:0,params:[]}],
  search:{title:'搜索七色番',functionName:'search',params:[{name:'keyword',title:'关键词',type:'input'},{name:'page',title:'页码',type:'page'}]}
};

const SITE='https://www.7sefun.top', UA='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131.0.0.0 Safari/537.36';
const PROXY_KEY='7sefun.proxy';
const IMAGE_HEADERS={'User-Agent':UA,Referer:SITE+'/'},MEDIA_HEADERS={'User-Agent':UA};
function clean(s){return String(s==null?'':s).trim();}
function positive(x){return /^[1-9]\d*$/.test(String(x));}
function http(s){return /^https?:\/\/[a-z\d.-]+(?::\d+)?(?:[/?#][^\s\\]*)?$/i.test(s);}
function prefix(value){
  const p=clean(value).replace(/\/+$/,'');
  if(!p && !clean(value))return '';
  if(!/^https?:\/\/[a-z\d.-]+(?::\d+)?(?:\/[\w.~-]+)*$/i.test(p)||/(?:^|\/)\.{1,2}(?:\/|$)/.test(p))throw Error('请填写有效的反代根地址，不要包含查询参数');
  return p+'/';
}
async function storeGet(){const s=Widget.storage;if(!s)return undefined;if(typeof s.getItem==='function')return await s.getItem(PROXY_KEY);if(typeof s.get==='function')return await s.get(PROXY_KEY);return undefined;}
async function storeSet(v){const s=Widget.storage;if(!s)return;if(typeof s.setItem==='function'){await s.setItem(PROXY_KEY,v);return;}if(typeof s.set==='function')await s.set(PROXY_KEY,v);}
async function setting(params, required){
  if(params && params.proxy!=null){const p=prefix(params.proxy);if(required&&!p)throw Error('该条目使用反代，请刷新片库');await storeSet(p);return p;}
  const p=prefix(await storeGet());
  if(required&&!p)throw Error('反代配置缺失，请刷新片库；已停止请求');
  return p;
}
function target(arg){if(typeof arg==='string')return {value:arg,params:{}};if(arg&&typeof arg==='object')return {value:arg.link!=null?arg.link:arg.id,params:arg};return {value:undefined,params:{}};}
function via(p,u){if(!http(u))throw Error('无效的资源地址');return !p||u.startsWith(p)?u:p+u;}
function image(p,u){u=clean(u);if(u.startsWith('//'))u='https:'+u;else if(u.startsWith('/'))u=SITE+u;return http(u)?via(p,u):'';}
async function get(p,u,referer){
  const address=via(p,u);
  const r=await Widget.http.get(address,{allow_redirects:!p,headers:{'User-Agent':UA,Referer:referer||SITE+'/'}});
  const status=Number(r.statusCode||r.status||200);
  if(status<200||status>=300)throw Error('站点或反代返回 HTTP '+status);
  if(p&&http(r.url)&&!r.url.startsWith(p))throw Error('请求离开了反代地址');
  if(typeof r.data!=='string')throw Error('站点未返回文本');
  return r.data;
}
function key(kind,id,sid,nid,p){return `7sefun:${kind}:${id}`+(sid?`:${sid}:${nid}`:'')+(p?':via':'');}
function owned(s){const m=/^7sefun:(tv|movie|item):([1-9]\d*)(?::([1-9]\d*):([1-9]\d*))?(:via)?$/.exec(String(s||''));return m&&{kind:m[1],id:m[2],sid:m[3],nid:m[4],proxy:!!m[5]};}
function cards(p,html,kind){
  const $=Widget.html.load(html),out=[],seen=new Set();
  if(!$('.videos').length && !/搜索结果|暂无|没有找到/.test($('title,.main-header').text()))throw Error('没有识别到七色番片库页面');
  $('.videos .video').each((_,el)=>{const n=$(el), m=/^\/voddetail\/([1-9]\d*)\.html$/.exec(n.find('a.video-wrapper').attr('href')||'');
    const img=n.find('img.videoimg'),title=clean(n.find('.video-name').text())||clean(img.attr('alt'))||clean(n.find('.video-by').text());
    if(!m||!title||seen.has(m[1]))return;seen.add(m[1]);const link=key(kind,m[1],null,null,p);
    const durationText=clean(n.find('.video-view').text())||clean(n.find('.video-time:not(.video-time-score)').text());
    out.push({id:link,link,type:'url',title,...(kind==='item'?{}:{mediaType:kind}),posterPath:image(p,img.attr('src')||img.attr('data-original')),headers:IMAGE_HEADERS,durationText});
  });return out;
}
async function loadList(params={}){
  const p=await setting(params),c=String(params.category||'1');if(!['1','2','4','5'].includes(c))return [];
  const fields=[c,params.area,['time','hits','score'].includes(params.order)?params.order:'time',params.genre,params.lang,params.letter,'','',positive(params.page)?params.page:1,'','',params.year];
  return cards(p,await get(p,SITE+'/vodshow/'+fields.map(v=>encodeURIComponent(clean(v))).join('-')+'.html'),c==='2'?'movie':'tv');
}
async function search(params={}){const p=await setting(params),q=clean(params.keyword);if(!q)return [];return cards(p,await get(p,SITE+'/vodsearch/'+encodeURIComponent(q)+'----------'+(positive(params.page)?params.page:1)+'---.html'),'item');}
function episodeNumber(s){const m=/^(?:第\s*)?(\d+)\s*(?:集|话|話|回)?$/.exec(s);return m?Number(m[1]):null;}
async function show(k,p){
  const $=Widget.html.load(await get(p,SITE+'/voddetail/'+k.id+'.html'));
  const title=clean($('.video-p-name').first().text().split('热度：')[0])||clean(($('title').text().match(/《([^》]+)》/)||[])[1]);
  if(!title)throw Error('没有识别到七色番详情页');
  const groups=new Map(),info={};
  $('.video-p-sub1').each((_,el)=>{const m=/^([^：:]+)[：:]\s*([\s\S]+)$/.exec(clean($(el).text()));if(m&&clean(m[2])!=='未知')info[m[1]]=clean(m[2]);});
  $('.vod-play-list-container').each((i,el)=>{const n=$(el),line=clean(n.prev().find('.chat-stream-bfq').text())||'线路'+(i+1);
    n.find('a[href]').each((_,a)=>{const path=$(a).attr('href'),m=/^\/vodplay\/([1-9]\d*)-([1-9]\d*)-([1-9]\d*)\.html$/.exec(path),label=clean($(a).text())||clean($(a).attr('title'));if(!m||m[1]!==k.id||!label)return;
      const number=episodeNumber(label),tag=number==null?'label:'+label:'ep:'+number;
      if(!groups.has(tag))groups.set(tag,{label,number,tracks:[]});const tracks=groups.get(tag).tracks;
      if(!tracks.some(t=>t.path===path))tracks.push({sid:m[2],nid:m[3],path,line});
    });});
  const episodes=Array.from(groups.values());const mediaType=k.kind!=='item'?k.kind:episodes.some(e=>e.number!=null&&/集|话|話|回/.test(e.label))?'tv':episodes.length===1&&/正片|高清|剧场版/.test(title+' '+episodes[0].label)?'movie':null;
  const summary=$('.video-p-subtitle').first();summary.find('script,style').remove();
  const link=key(k.kind,k.id,null,null,p),posterPath=image(p,$('.video-author img.author-img').attr('src'));
  const item={id:link,link,type:'url',title,posterPath,headers:IMAGE_HEADERS,description:clean(summary.text()),...(mediaType?{mediaType}:{}),genreTitle:info['类型']||'',releaseDate:info['上映时间']||''};
  item.episodeItems=episodes.map(ep=>{const t=ep.tracks[0],l=key(k.kind,k.id,t.sid,t.nid,p);return {id:l,link:l,type:'url',title:ep.label,posterPath,headers:IMAGE_HEADERS,...(mediaType?{mediaType}:{}),...(ep.number!=null?{episode:ep.number}:{})};});
  return {item,episodes};
}
function selected(k,params,series){
  if(k.sid)return series.episodes.find(e=>e.tracks.some(t=>t.sid===k.sid&&t.nid===k.nid));
  if(series.item.mediaType==='movie'&&series.episodes.length===1)return series.episodes[0];
  if(params.episode!=null && clean(params.episode)!==''){return series.episodes.find(e=>e.number!=null&&String(e.number)===String(params.episode));}
  if(clean(params.episodeName))return series.episodes.find(e=>e.label===clean(params.episodeName));
  return series.episodes.length===1?series.episodes[0]:null;
}
async function loadDetail(arg){const {value}=target(arg);const k=owned(value);if(!k)return null;const p=await setting(null,k.proxy),series=await show(k,p);if(!k.sid)return series.item;
  const ep=selected(k,{},series);return ep?series.item.episodeItems[series.episodes.indexOf(ep)]:null;
}

function bytes64(s){const chars='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';if(!/^[A-Za-z\d+/]+={0,2}$/.test(s))throw Error('播放器编码无效');const out=[];let bits=0,v=0;for(const ch of s){if(ch==='=')break;v=(v<<6)|chars.indexOf(ch);bits+=6;if(bits>=8){bits-=8;out.push((v>>bits)&255);}}return Uint8Array.from(out);}
function utf8(bytes){return decodeURIComponent(Array.from(bytes,b=>'%'+b.toString(16).padStart(2,'0')).join(''));}
function unwrap(s){return String(s).replace(/%u([0-9a-f]{4})|%([0-9a-f]{2})/gi,(_,wide,byte)=>String.fromCharCode(parseInt(wide||byte,16)));}
function media(u){return http(u)&&/\.(?:mp4|m3u8|flv|mkv|webm|m4v)$/i.test(u.split(/[?#]/)[0]);}
function jsField(text){const m=/(?:["']url["']|\burl)\s*:\s*("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')/.exec(text);if(!m)return '';return m[1][0]==='"'?JSON.parse(m[1]):m[1].slice(1,-1).replace(/\\\//g,'/');}
async function resolveTrack(k,t,p){
  const page=SITE+t.path, html=await get(p,page,SITE+'/voddetail/'+k.id+'.html');
  const $=Widget.html.load(html),script=$('script').toArray().map(e=>$(e).html()||'').find(s=>/^\s*var\s+player_aaaa\s*=/.test(s));if(!script)return '';
  const c=JSON.parse(script.replace(/^\s*var\s+player_aaaa\s*=\s*/,'').replace(/;?\s*$/,''));
  if(String(c.id)!==k.id||String(c.sid)!==t.sid||String(c.nid)!==t.nid||Number(c.points)>0)return '';
  const u=String(c.encrypt)==='2'?unwrap(utf8(bytes64(c.url))):String(c.encrypt)==='1'?unwrap(c.url):c.url;
  if(media(u))return u;
  if(c.from==='lmm'){
    if(!/^https?:\/\/www\.lmm\d+\.com\/play\/[\w-]+\.html$/.test(u))return '';
    const h=await get(p,'https://dp.no3acg.com/player/ec.php?code=qw&if=1&from=lmm&url='+encodeURIComponent(u),page);
    const m=/\bConFig\s*=\s*(\{[\s\S]*?\})\s*,\s*box/.exec(h);if(!m)return '';const v=JSON.parse(m[1]);if(Number(v.code)!==200||!v.config)return '';
    const ascii=s=>Uint8Array.from(s,ch=>ch.charCodeAt(0));const result=utf8(SevenAES.cbc(ascii('2890'+v.config.uid+'tB959C'),ascii('2F131BE91247866E')).decrypt(bytes64(v.url)));return media(result)?result:'';
  }
  if(!/^[a-z0-9_]+$/i.test(c.from))return '';
  const wrapper=SITE+'/addons/dp/player/index.php?key=0&id='+k.id+'&uid=0&from='+c.from+'&url='+encodeURIComponent(u);
  const h=await get(p,wrapper,page),m=/(?:location\.)?href\s*=\s*["'](\/addons\/dp\/player\/(?:dp|art)\.php\?[^"'<>]+)["']\s*;/.exec(h);
  if(!m)return '';const inner=await get(p,SITE+m[1].replace(/&amp;/g,'&'),wrapper);
  const config=/\b(?:var\s+)?config\s*=\s*\{([\s\S]*?)\}\s*(?:;|if\s*\()/.exec(inner),url=config?jsField(config[1]):'';return media(url)?url:'';
}

// 原生播放器会自行请求子清单和分片；仅代理入口不足以阻止这些请求直连。
function childURL(base,ref){
  if(!ref||/[\s\\{}]/.test(ref))throw Error('不支持动态或非法 HLS 引用');
  if(http(ref))return ref;if(ref.startsWith('//'))return base.split(':')[0]+':'+ref;
  if(/^[\w+.-]+:/.test(ref))throw Error('不支持该 HLS URI');
  const origin=base.match(/^https?:\/\/[^/]+/i)[0],path=ref.split(/[?#]/)[0];
  if(!path)return base.split(/[?#]/)[0]+ref;
  const parts=path.startsWith('/')?['']:base.slice(origin.length).split(/[?#]/)[0].split('/').slice(0,-1);
  for(const part of (path.startsWith('/')?path.slice(1):path).split('/')){const dot=part.replace(/%2e/ig,'.');if(dot==='.')continue;if(dot==='..'){if(parts.length>1)parts.pop();}else parts.push(part);}
  return origin+parts.join('/')+ref.slice(path.length);
}
async function checkHLS(proxy,entry,seen=new Set()){
  if(seen.has(entry))return;if(seen.size>=32)throw Error('HLS 子清单过多');seen.add(entry);
  const text=await get(proxy,entry);if(!/^\s*#EXTM3U\b/.test(text))throw Error('反代未返回 HLS 清单');
  let nextList=false,master=false,end=false;const children=new Set();
  function check(ref,list){const resolved=childURL(entry,ref);if(!resolved.startsWith(proxy)||!http(resolved.slice(proxy.length)))throw Error('HLS 含未中转的地址：请启用反代的播放列表重写');if(list)children.add(resolved);}
  for(const raw of text.split(/\r?\n/)){const l=raw.trim();if(!l)continue;
    if(!l.startsWith('#')){check(l,nextList||/\.m3u8(?:[?#]|$)/i.test(l));nextList=false;continue;}
    if(/^#EXT-X-STREAM-INF:/.test(l)){master=true;nextList=true;}
    if(l==='#EXT-X-ENDLIST')end=true;
    if(l.startsWith('#EXT-X-')){
      const tag=l.split(':')[0].slice(7);
      if(!/^(?:VERSION|INDEPENDENT-SEGMENTS|START|STREAM-INF|MEDIA|I-FRAME-STREAM-INF|IMAGE-STREAM-INF|SESSION-KEY|KEY|MAP|TARGETDURATION|MEDIA-SEQUENCE|DISCONTINUITY-SEQUENCE|DISCONTINUITY|ENDLIST|PLAYLIST-TYPE|I-FRAMES-ONLY|PROGRAM-DATE-TIME|GAP|BITRATE|BYTERANGE)$/.test(tag))throw Error('反代模式不接受未验证的 HLS 标签：'+tag);
      const uris=/(?:[:,])\s*URI\s*=\s*"([^"]+)"/gi;let m;
      while((m=uris.exec(l)))check(m[1],/^(?:MEDIA|I-FRAME-STREAM-INF|IMAGE-STREAM-INF)$/.test(tag));
      if(/[:,]\s*[\w-]*URI\s*=/i.test(l.replace(uris,'')))throw Error('不支持该 HLS URI 格式');
    }else if(/^#EXT/i.test(l)&&!/^#(?:EXTM3U$|EXTINF:)/.test(l))throw Error('不支持该 HLS 扩展');
  }
  if(!master&&!end)throw Error('反代模式下仅支持可预检的点播清单');for(const sub of children)await checkHLS(proxy,sub,seen);
}
async function loadResource(arg={}){
  const {value,params}=target(arg);const k=owned(value);if(!k)return [];
  const p=await setting(params,k.proxy),series=await show(k,p),ep=selected(k,params,series);if(!ep)return [];
  const results=await Promise.all(ep.tracks.map(async t=>{try{const raw=await resolveTrack(k,t,p);if(!raw)return null;const url=via(p,raw);if(p&&/\.m3u8$/i.test(raw.split(/[?#]/)[0]))await checkHLS(p,url);
    return {name:t.line,description:ep.label,url,customHeaders:MEDIA_HEADERS,headers:MEDIA_HEADERS,playerType:'app'};
  }catch(error){return {error:clean(error.message)||'播放线路请求失败'};}}));
  const ok=results.filter(r=>r&&r.url);if(!ok.length){const err=results.find(r=>r&&r.error);if(err)throw Error(err.error);}return ok;
}

/* Bundled @noble/ciphers 1.3.0
The MIT License (MIT)

Copyright (c) 2022 Paul Miller (https://paulmillr.com)
Copyright (c) 2016 Thomas Pornin <pornin@bolet.org>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the “Software”), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.*/
var SevenAES=(()=>{var S=Object.defineProperty;var $=Object.getOwnPropertyDescriptor;var G=Object.getOwnPropertyNames;var J=Object.prototype.hasOwnProperty;var Q=(t,n)=>{for(var e in n)S(t,e,{get:n[e],enumerable:!0})},X=(t,n,e,o)=>{if(n&&typeof n=="object"||typeof n=="function")for(let r of G(n))!J.call(t,r)&&r!==e&&S(t,r,{get:()=>n[r],enumerable:!(o=$(n,r))||o.enumerable});return t};var tt=t=>X(S({},"__esModule",{value:!0}),t);var ht={};Q(ht,{cbc:()=>W});function nt(t){return t instanceof Uint8Array||ArrayBuffer.isView(t)&&t.constructor.name==="Uint8Array"}function x(t,...n){if(!nt(t))throw new Error("Uint8Array expected");if(n.length>0&&!n.includes(t.length))throw new Error("Uint8Array expected of length "+n+", got length="+t.length)}function m(t){return new Uint32Array(t.buffer,t.byteOffset,Math.floor(t.byteLength/4))}function T(...t){for(let n=0;n<t.length;n++)t[n].fill(0)}var et=new Uint8Array(new Uint32Array([287454020]).buffer)[0]===68;function M(t,n){return t.buffer===n.buffer&&t.byteOffset<n.byteOffset+n.byteLength&&n.byteOffset<t.byteOffset+t.byteLength}function C(t,n){if(M(t,n)&&t.byteOffset<n.byteOffset)throw new Error("complex overlap of input and output is not supported")}var P=(t,n)=>{function e(o,...r){if(x(o),!et)throw new Error("Non little-endian hardware is not yet supported");if(t.nonceLength!==void 0){let i=r[0];if(!i)throw new Error("nonce / iv required");t.varSizeNonce?x(i):x(i,t.nonceLength)}let s=t.tagLength;s&&r[1]!==void 0&&x(r[1]);let u=n(o,...r),l=(i,a)=>{if(a!==void 0){if(i!==2)throw new Error("cipher output not supported");x(a)}},c=!1;return{encrypt(i,a){if(c)throw new Error("cannot encrypt() twice with same key + nonce");return c=!0,x(i),l(u.encrypt.length,a),u.encrypt(i,a)},decrypt(i,a){if(x(i),s&&i.length<s)throw new Error("invalid ciphertext length: smaller than tagLength="+s);return l(u.decrypt.length,a),u.decrypt(i,a)}}}return Object.assign(e,t),e};function K(t,n,e=!0){if(n===void 0)return new Uint8Array(t);if(n.length!==t)throw new Error("invalid output length, expected "+t+", got: "+n.length);if(e&&!B(n))throw new Error("invalid output, must be aligned");return n}function B(t){return t.byteOffset%4===0}function v(t){return Uint8Array.from(t)}var U=16;var ot=283;function N(t){return t<<1^ot&-(t>>7)}function _(t,n){let e=0;for(;n>0;n>>=1)e^=t&-(n&1),t=N(t);return e}var O=(()=>{let t=new Uint8Array(256);for(let e=0,o=1;e<256;e++,o^=N(o))t[e]=o;let n=new Uint8Array(256);n[0]=99;for(let e=0;e<255;e++){let o=t[255-e];o|=o<<8,n[t[e]]=(o^o>>4^o>>5^o>>6^o>>7^99)&255}return T(t),n})(),rt=O.map((t,n)=>O.indexOf(n)),ct=t=>t<<24|t>>>8,I=t=>t<<8|t>>>24;function k(t,n){if(t.length!==256)throw new Error("Wrong sbox length");let e=new Uint32Array(256).map((f,i)=>n(t[i])),o=e.map(I),r=o.map(I),s=r.map(I),u=new Uint32Array(256*256),l=new Uint32Array(256*256),c=new Uint16Array(256*256);for(let f=0;f<256;f++)for(let i=0;i<256;i++){let a=f*256+i;u[a]=e[f]^o[i],l[a]=r[f]^s[i],c[a]=t[f]<<8|t[i]}return{sbox:t,sbox2:c,T0:e,T1:o,T2:r,T3:s,T01:u,T23:l}}var z=k(O,t=>_(t,3)<<24|t<<16|t<<8|_(t,2)),j=k(rt,t=>_(t,11)<<24|_(t,13)<<16|_(t,9)<<8|_(t,14)),st=(()=>{let t=new Uint8Array(16);for(let n=0,e=1;n<16;n++,e=N(e))t[n]=e;return t})();function V(t){x(t);let n=t.length;if(![16,24,32].includes(n))throw new Error("aes: invalid key size, should be 16, 24 or 32, got "+n);let{sbox2:e}=z,o=[];B(t)||o.push(t=v(t));let r=m(t),s=r.length,u=c=>E(e,c,c,c,c),l=new Uint32Array(n+28);l.set(r);for(let c=s;c<l.length;c++){let f=l[c-1];c%s===0?f=u(ct(f))^st[c/s-1]:s>6&&c%s===4&&(f=u(f)),l[c]=l[c-s]^f}return T(...o),l}function it(t){let n=V(t),e=n.slice(),o=n.length,{sbox2:r}=z,{T0:s,T1:u,T2:l,T3:c}=j;for(let f=0;f<o;f+=4)for(let i=0;i<4;i++)e[f+i]=n[o-f-4+i];T(n);for(let f=4;f<o-4;f++){let i=e[f],a=E(r,i,i,i,i);e[f]=s[a&255]^u[a>>>8&255]^l[a>>>16&255]^c[a>>>24]}return e}function A(t,n,e,o,r,s){return t[e<<8&65280|o>>>8&255]^n[r>>>8&65280|s>>>24&255]}function E(t,n,e,o,r){return t[n&255|e&65280]|t[o>>>16&255|r>>>16&65280]<<16}function H(t,n,e,o,r){let{sbox2:s,T01:u,T23:l}=z,c=0;n^=t[c++],e^=t[c++],o^=t[c++],r^=t[c++];let f=t.length/4-2;for(let p=0;p<f;p++){let y=t[c++]^A(u,l,n,e,o,r),w=t[c++]^A(u,l,e,o,r,n),g=t[c++]^A(u,l,o,r,n,e),h=t[c++]^A(u,l,r,n,e,o);n=y,e=w,o=g,r=h}let i=t[c++]^E(s,n,e,o,r),a=t[c++]^E(s,e,o,r,n),b=t[c++]^E(s,o,r,n,e),d=t[c++]^E(s,r,n,e,o);return{s0:i,s1:a,s2:b,s3:d}}function ft(t,n,e,o,r){let{sbox2:s,T01:u,T23:l}=j,c=0;n^=t[c++],e^=t[c++],o^=t[c++],r^=t[c++];let f=t.length/4-2;for(let p=0;p<f;p++){let y=t[c++]^A(u,l,n,r,o,e),w=t[c++]^A(u,l,e,n,r,o),g=t[c++]^A(u,l,o,e,n,r),h=t[c++]^A(u,l,r,o,e,n);n=y,e=w,o=g,r=h}let i=t[c++]^E(s,n,r,o,e),a=t[c++]^E(s,e,n,r,o),b=t[c++]^E(s,o,e,n,r),d=t[c++]^E(s,r,o,e,n);return{s0:i,s1:a,s2:b,s3:d}}function lt(t){if(x(t),t.length%U!==0)throw new Error("aes-(cbc/ecb).decrypt ciphertext should consist of blocks with size "+U)}function ut(t,n,e){x(t);let o=t.length,r=o%U;if(!n&&r!==0)throw new Error("aec/(cbc-ecb): unpadded plaintext with disabled padding");B(t)||(t=v(t));let s=m(t);if(n){let l=U-r;l||(l=U),o=o+l}e=K(o,e),C(t,e);let u=m(e);return{b:s,o:u,out:e}}function at(t,n){if(!n)return t;let e=t.length;if(!e)throw new Error("aes/pcks5: empty ciphertext not allowed");let o=t[e-1];if(o<=0||o>16)throw new Error("aes/pcks5: wrong padding");let r=t.subarray(0,-o);for(let s=0;s<o;s++)if(t[e-s-1]!==o)throw new Error("aes/pcks5: wrong padding");return r}function gt(t){let n=new Uint8Array(16),e=m(n);n.set(t);let o=U-t.length;for(let r=U-o;r<U;r++)n[r]=o;return e}var W=P({blockSize:16,nonceLength:16},function(n,e,o={}){let r=!o.disablePadding;return{encrypt(s,u){let l=V(n),{b:c,o:f,out:i}=ut(s,r,u),a=e,b=[l];B(a)||b.push(a=v(a));let d=m(a),p=d[0],y=d[1],w=d[2],g=d[3],h=0;for(;h+4<=c.length;)p^=c[h+0],y^=c[h+1],w^=c[h+2],g^=c[h+3],{s0:p,s1:y,s2:w,s3:g}=H(l,p,y,w,g),f[h++]=p,f[h++]=y,f[h++]=w,f[h++]=g;if(r){let L=gt(s.subarray(h*4));p^=L[0],y^=L[1],w^=L[2],g^=L[3],{s0:p,s1:y,s2:w,s3:g}=H(l,p,y,w,g),f[h++]=p,f[h++]=y,f[h++]=w,f[h++]=g}return T(...b),i},decrypt(s,u){lt(s);let l=it(n),c=e,f=[l];B(c)||f.push(c=v(c));let i=m(c);u=K(s.length,u),B(s)||f.push(s=v(s)),C(s,u);let a=m(s),b=m(u),d=i[0],p=i[1],y=i[2],w=i[3];for(let g=0;g+4<=a.length;){let h=d,L=p,q=y,D=w;d=a[g+0],p=a[g+1],y=a[g+2],w=a[g+3];let{s0:F,s1:Y,s2:Z,s3:R}=ft(l,d,p,y,w);b[g++]=F^h,b[g++]=Y^L,b[g++]=Z^q,b[g++]=R^D}return T(...f),at(u,r)}}});return tt(ht);})();
/*! Bundled license information:

@noble/ciphers/esm/utils.js:
  (*! noble-ciphers - MIT License (c) 2023 Paul Miller (paulmillr.com) *)
*/
