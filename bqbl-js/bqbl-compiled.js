var g=void 0,h=!0,j=null,k=!1,r,aa=aa||{},s=this;function ba(a){for(var a=a.split("."),b=s,c;c=a.shift();)if(b[c]!=j)b=b[c];else return j;return b}function ca(){}
function t(a){var b=typeof a;if("object"==b)if(a){if(a instanceof Array)return"array";if(a instanceof Object)return b;var c=Object.prototype.toString.call(a);if("[object Window]"==c)return"object";if("[object Array]"==c||"number"==typeof a.length&&"undefined"!=typeof a.splice&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("splice"))return"array";if("[object Function]"==c||"undefined"!=typeof a.call&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("call"))return"function"}else return"null";
else if("function"==b&&"undefined"==typeof a.call)return"object";return b}function da(a){var b=t(a);return"array"==b||"object"==b&&"number"==typeof a.length}function u(a){return"string"==typeof a}function v(a){return a[ea]||(a[ea]=++fa)}var ea="closure_uid_"+Math.floor(2147483648*Math.random()).toString(36),fa=0;function ga(a,b,c){return a.call.apply(a.bind,arguments)}
function ha(a,b,c){if(!a)throw Error();if(2<arguments.length){var d=Array.prototype.slice.call(arguments,2);return function(){var c=Array.prototype.slice.call(arguments);Array.prototype.unshift.apply(c,d);return a.apply(b,c)}}return function(){return a.apply(b,arguments)}}function w(a,b,c){w=Function.prototype.bind&&-1!=Function.prototype.bind.toString().indexOf("native code")?ga:ha;return w.apply(j,arguments)}
function ia(a,b){var c=Array.prototype.slice.call(arguments,1);return function(){var b=Array.prototype.slice.call(arguments);b.unshift.apply(b,c);return a.apply(this,b)}}var x=Date.now||function(){return+new Date};function ja(a,b){var c=a.split("."),d=s;!(c[0]in d)&&d.execScript&&d.execScript("var "+c[0]);for(var f;c.length&&(f=c.shift());)!c.length&&b!==g?d[f]=b:d=d[f]?d[f]:d[f]={}}function z(a,b){function c(){}c.prototype=b.prototype;a.F=b.prototype;a.prototype=new c};function la(a,b){for(var c=1;c<arguments.length;c++)var d=String(arguments[c]).replace(/\$/g,"$$$$"),a=a.replace(/\%s/,d);return a}function ma(a){return decodeURIComponent(a.replace(/\+/g," "))}function na(a){if(!oa.test(a))return a;-1!=a.indexOf("&")&&(a=a.replace(pa,"&amp;"));-1!=a.indexOf("<")&&(a=a.replace(qa,"&lt;"));-1!=a.indexOf(">")&&(a=a.replace(ra,"&gt;"));-1!=a.indexOf('"')&&(a=a.replace(sa,"&quot;"));return a}var pa=/&/g,qa=/</g,ra=/>/g,sa=/\"/g,oa=/[&<>\"]/;
function ta(a){return Array.prototype.join.call(arguments,"")};var A,ua,va,wa;function xa(){return s.navigator?s.navigator.userAgent:j}wa=va=ua=A=k;var ya;if(ya=xa()){var za=s.navigator;A=0==ya.indexOf("Opera");ua=!A&&-1!=ya.indexOf("MSIE");va=!A&&-1!=ya.indexOf("WebKit");wa=!A&&!va&&"Gecko"==za.product}var Aa=A,B=ua,C=wa,D=va,Ba=s.navigator,Ca=-1!=(Ba&&Ba.platform||"").indexOf("Mac"),Da;
a:{var Ea="",Fa;if(Aa&&s.opera)var Ga=s.opera.version,Ea="function"==typeof Ga?Ga():Ga;else if(C?Fa=/rv\:([^\);]+)(\)|;)/:B?Fa=/MSIE\s+([^\);]+)(\)|;)/:D&&(Fa=/WebKit\/(\S+)/),Fa)var Ha=Fa.exec(xa()),Ea=Ha?Ha[1]:"";if(B){var Ia,Ja=s.document;Ia=Ja?Ja.documentMode:g;if(Ia>parseFloat(Ea)){Da=String(Ia);break a}}Da=Ea}var Ka={};
function E(a){var b;if(!(b=Ka[a])){b=0;for(var c=String(Da).replace(/^[\s\xa0]+|[\s\xa0]+$/g,"").split("."),d=String(a).replace(/^[\s\xa0]+|[\s\xa0]+$/g,"").split("."),f=Math.max(c.length,d.length),e=0;0==b&&e<f;e++){var i=c[e]||"",q=d[e]||"",l=RegExp("(\\d*)(\\D*)","g"),m=RegExp("(\\d*)(\\D*)","g");do{var n=l.exec(i)||["","",""],p=m.exec(q)||["","",""];if(0==n[0].length&&0==p[0].length)break;b=((0==n[1].length?0:parseInt(n[1],10))<(0==p[1].length?0:parseInt(p[1],10))?-1:(0==n[1].length?0:parseInt(n[1],
10))>(0==p[1].length?0:parseInt(p[1],10))?1:0)||((0==n[2].length)<(0==p[2].length)?-1:(0==n[2].length)>(0==p[2].length)?1:0)||(n[2]<p[2]?-1:n[2]>p[2]?1:0)}while(0==b)}b=Ka[a]=0<=b}return b}var La={};function F(a){return La[a]||(La[a]=B&&!!document.documentMode&&document.documentMode>=a)};function Ma(a){Error.captureStackTrace?Error.captureStackTrace(this,Ma):this.stack=Error().stack||"";a&&(this.message=String(a))}z(Ma,Error);Ma.prototype.name="CustomError";function Na(a,b){b.unshift(a);Ma.call(this,la.apply(j,b));b.shift();this.kb=a}z(Na,Ma);Na.prototype.name="AssertionError";function Oa(a,b){throw new Na("Failure"+(a?": "+a:""),Array.prototype.slice.call(arguments,1));};var Pa=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^/?#]*)@)?([\\w\\d\\-\\u0100-\\uffff.%]*)(?::([0-9]+))?)?([^?#]+)?(?:\\?([^#]*))?(?:#(.*))?$");function Qa(a){var b=[],c=0,d;for(d in a)b[c++]=a[d];return b}function Ra(a){var b=[],c=0,d;for(d in a)b[c++]=d;return b}var Sa="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function Ta(a,b){for(var c,d,f=1;f<arguments.length;f++){d=arguments[f];for(c in d)a[c]=d[c];for(var e=0;e<Sa.length;e++)c=Sa[e],Object.prototype.hasOwnProperty.call(d,c)&&(a[c]=d[c])}};var G=Array.prototype,Ua=G.indexOf?function(a,b,c){return G.indexOf.call(a,b,c)}:function(a,b,c){c=c==j?0:0>c?Math.max(0,a.length+c):c;if(u(a))return!u(b)||1!=b.length?-1:a.indexOf(b,c);for(;c<a.length;c++)if(c in a&&a[c]===b)return c;return-1},Va=G.forEach?function(a,b,c){G.forEach.call(a,b,c)}:function(a,b,c){for(var d=a.length,f=u(a)?a.split(""):a,e=0;e<d;e++)e in f&&b.call(c,f[e],e,a)};function Wa(a,b){var c=Ua(a,b);0<=c&&G.splice.call(a,c,1)}
function Xa(a){return G.concat.apply(G,arguments)}function Ya(a){var b=a.length;if(0<b){for(var c=Array(b),d=0;d<b;d++)c[d]=a[d];return c}return[]}function Za(a,b){for(var c=0;c<a.length;c++)a[c]={index:c,value:a[c]};var d=b||$a;G.sort.call(a,function(a,b){return d(a.value,b.value)||a.index-b.index}||$a);for(c=0;c<a.length;c++)a[c]=a[c].value}function $a(a,b){return a>b?1:a<b?-1:0};function ab(a){if("function"==typeof a.l)return a.l();if(u(a))return a.split("");if(da(a)){for(var b=[],c=a.length,d=0;d<c;d++)b.push(a[d]);return b}return Qa(a)}function bb(a,b,c){if("function"==typeof a.forEach)a.forEach(b,c);else if(da(a)||u(a))Va(a,b,c);else{var d;if("function"==typeof a.u)d=a.u();else if("function"!=typeof a.l)if(da(a)||u(a)){d=[];for(var f=a.length,e=0;e<f;e++)d.push(e)}else d=Ra(a);else d=g;for(var f=ab(a),e=f.length,i=0;i<e;i++)b.call(c,f[i],d&&d[i],a)}};function cb(a,b){this.m={};this.d=[];var c=arguments.length;if(1<c){if(c%2)throw Error("Uneven number of arguments");for(var d=0;d<c;d+=2)this.set(arguments[d],arguments[d+1])}else if(a){a instanceof cb?(c=a.u(),d=a.l()):(c=Ra(a),d=Qa(a));for(var f=0;f<c.length;f++)this.set(c[f],d[f])}}r=cb.prototype;r.a=0;r.La=0;r.l=function(){db(this);for(var a=[],b=0;b<this.d.length;b++)a.push(this.m[this.d[b]]);return a};r.u=function(){db(this);return this.d.concat()};r.t=function(a){return H(this.m,a)};
r.remove=function(a){return H(this.m,a)?(delete this.m[a],this.a--,this.La++,this.d.length>2*this.a&&db(this),h):k};function db(a){if(a.a!=a.d.length){for(var b=0,c=0;b<a.d.length;){var d=a.d[b];H(a.m,d)&&(a.d[c++]=d);b++}a.d.length=c}if(a.a!=a.d.length){for(var f={},c=b=0;b<a.d.length;)d=a.d[b],H(f,d)||(a.d[c++]=d,f[d]=1),b++;a.d.length=c}}r.get=function(a,b){return H(this.m,a)?this.m[a]:b};r.set=function(a,b){H(this.m,a)||(this.a++,this.d.push(a),this.La++);this.m[a]=b};r.I=function(){return new cb(this)};
function H(a,b){return Object.prototype.hasOwnProperty.call(a,b)};function eb(a,b){var c;if(a instanceof eb)this.h=b!==g?b:a.h,fb(this,a.D),c=a.ga,I(this),this.ga=c,c=a.K,I(this),this.K=c,gb(this,a.ea),c=a.ca,I(this),this.ca=c,hb(this,a.o.I()),c=a.V,I(this),this.V=c;else if(a&&(c=String(a).match(Pa))){this.h=!!b;fb(this,c[1]||"",h);var d=c[2]||"";I(this);this.ga=d?decodeURIComponent(d):"";d=c[3]||"";I(this);this.K=d?decodeURIComponent(d):"";gb(this,c[4]);d=c[5]||"";I(this);this.ca=d?decodeURIComponent(d):"";hb(this,c[6]||"",h);c=c[7]||"";I(this);this.V=c?decodeURIComponent(c):
""}else this.h=!!b,this.o=new ib(j,0,this.h)}r=eb.prototype;r.D="";r.ga="";r.K="";r.ea=j;r.ca="";r.V="";r.Qa=k;r.h=k;r.toString=function(){var a=[],b=this.D;b&&a.push(jb(b,kb),":");if(b=this.K){a.push("//");var c=this.ga;c&&a.push(jb(c,kb),"@");a.push(encodeURIComponent(String(b)));b=this.ea;b!=j&&a.push(":",String(b))}if(b=this.ca)this.K&&"/"!=b.charAt(0)&&a.push("/"),a.push(jb(b,"/"==b.charAt(0)?lb:mb));(b=this.o.toString())&&a.push("?",b);(b=this.V)&&a.push("#",jb(b,nb));return a.join("")};
r.I=function(){return new eb(this)};function fb(a,b,c){I(a);a.D=c?b?decodeURIComponent(b):"":b;a.D&&(a.D=a.D.replace(/:$/,""))}function gb(a,b){I(a);if(b){b=Number(b);if(isNaN(b)||0>b)throw Error("Bad port number "+b);a.ea=b}else a.ea=j}function hb(a,b,c){I(a);b instanceof ib?(a.o=b,a.o.ra(a.h)):(c||(b=jb(b,ob)),a.o=new ib(b,0,a.h))}function I(a){if(a.Qa)throw Error("Tried to modify a read-only Uri");}r.ra=function(a){this.h=a;this.o&&this.o.ra(a);return this};
function jb(a,b){return u(a)?encodeURI(a).replace(b,pb):j}function pb(a){a=a.charCodeAt(0);return"%"+(a>>4&15).toString(16)+(a&15).toString(16)}var kb=/[#\/\?@]/g,mb=/[\#\?:]/g,lb=/[\#\?]/g,ob=/[\#\?@]/g,nb=/#/g;function ib(a,b,c){this.g=a||j;this.h=!!c}function J(a){if(!a.c&&(a.c=new cb,a.a=0,a.g))for(var b=a.g.split("&"),c=0;c<b.length;c++){var d=b[c].indexOf("="),f=j,e=j;0<=d?(f=b[c].substring(0,d),e=b[c].substring(d+1)):f=b[c];f=ma(f);f=K(a,f);a.add(f,e?ma(e):"")}}r=ib.prototype;r.c=j;r.a=j;
r.add=function(a,b){J(this);this.g=j;var a=K(this,a),c=this.c.get(a);c||this.c.set(a,c=[]);c.push(b);this.a++;return this};r.remove=function(a){J(this);a=K(this,a);return this.c.t(a)?(this.g=j,this.a-=this.c.get(a).length,this.c.remove(a)):k};r.t=function(a){J(this);a=K(this,a);return this.c.t(a)};r.u=function(){J(this);for(var a=this.c.l(),b=this.c.u(),c=[],d=0;d<b.length;d++)for(var f=a[d],e=0;e<f.length;e++)c.push(b[d]);return c};
r.l=function(a){J(this);var b=[];if(a)this.t(a)&&(b=Xa(b,this.c.get(K(this,a))));else for(var a=this.c.l(),c=0;c<a.length;c++)b=Xa(b,a[c]);return b};r.set=function(a,b){J(this);this.g=j;a=K(this,a);this.t(a)&&(this.a-=this.c.get(a).length);this.c.set(a,[b]);this.a++;return this};r.get=function(a,b){var c=a?this.l(a):[];return 0<c.length?String(c[0]):b};
r.toString=function(){if(this.g)return this.g;if(!this.c)return"";for(var a=[],b=this.c.u(),c=0;c<b.length;c++)for(var d=b[c],f=encodeURIComponent(String(d)),d=this.l(d),e=0;e<d.length;e++){var i=f;""!==d[e]&&(i+="="+encodeURIComponent(String(d[e])));a.push(i)}return this.g=a.join("&")};r.I=function(){var a=new ib;a.g=this.g;this.c&&(a.c=this.c.I(),a.a=this.a);return a};function K(a,b){var c=String(b);a.h&&(c=c.toLowerCase());return c}
r.ra=function(a){a&&!this.h&&(J(this),this.g=j,bb(this.c,function(a,c){var d=c.toLowerCase();c!=d&&(this.remove(c),this.remove(d),0<a.length&&(this.g=j,this.c.set(K(this,d),Ya(a)),this.a+=a.length))},this));this.h=a};function qb(){}var rb=0;r=qb.prototype;r.key=0;r.C=k;r.ta=k;r.Z=function(a,b,c,d,f,e){if("function"==t(a))this.Ba=h;else if(a&&a.handleEvent&&"function"==t(a.handleEvent))this.Ba=k;else throw Error("Invalid listener argument");this.R=a;this.Ga=b;this.src=c;this.type=d;this.capture=!!f;this.na=e;this.ta=k;this.key=++rb;this.C=k};r.handleEvent=function(a){return this.Ba?this.R.call(this.na||this.src,a):this.R.handleEvent.call(this.R,a)};!B||F(9);var sb=!B||F(9),tb=B&&!E("9");!D||E("528");C&&E("1.9b")||B&&E("8")||Aa&&E("9.5")||D&&E("528");C&&!E("8")||B&&E("9");var ub="click";function L(){0!=vb&&(this.gb=Error().stack,wb[v(this)]=this)}var vb=0,wb={};L.prototype.wa=k;L.prototype.J=function(){if(!this.wa&&(this.wa=h,this.f(),0!=vb)){var a=v(this);delete wb[a]}};L.prototype.f=function(){this.Na&&xb.apply(j,this.Na);if(this.Ea)for(;this.Ea.length;)this.Ea.shift()()};function xb(a){for(var b=0,c=arguments.length;b<c;++b){var d=arguments[b];da(d)?xb.apply(j,d):d&&"function"==typeof d.J&&d.J()}};function M(a,b){this.type=a;this.currentTarget=this.target=b}r=M.prototype;r.f=function(){};r.J=function(){};r.B=k;r.defaultPrevented=k;r.fa=h;r.preventDefault=function(){this.defaultPrevented=h;this.fa=k};function yb(a){yb[" "](a);return a}yb[" "]=ca;function zb(a,b){a&&this.Z(a,b)}z(zb,M);r=zb.prototype;r.target=j;r.relatedTarget=j;r.offsetX=0;r.offsetY=0;r.clientX=0;r.clientY=0;r.screenX=0;r.screenY=0;r.button=0;r.keyCode=0;r.charCode=0;r.ctrlKey=k;r.altKey=k;r.shiftKey=k;r.metaKey=k;r.Ya=k;r.ma=j;
r.Z=function(a,b){var c=this.type=a.type;M.call(this,c);this.target=a.target||a.srcElement;this.currentTarget=b;var d=a.relatedTarget;if(d){if(C){var f;a:{try{yb(d.nodeName);f=h;break a}catch(e){}f=k}f||(d=j)}}else"mouseover"==c?d=a.fromElement:"mouseout"==c&&(d=a.toElement);this.relatedTarget=d;this.offsetX=D||a.offsetX!==g?a.offsetX:a.layerX;this.offsetY=D||a.offsetY!==g?a.offsetY:a.layerY;this.clientX=a.clientX!==g?a.clientX:a.pageX;this.clientY=a.clientY!==g?a.clientY:a.pageY;this.screenX=a.screenX||
0;this.screenY=a.screenY||0;this.button=a.button;this.keyCode=a.keyCode||0;this.charCode=a.charCode||("keypress"==c?a.keyCode:0);this.ctrlKey=a.ctrlKey;this.altKey=a.altKey;this.shiftKey=a.shiftKey;this.metaKey=a.metaKey;this.Ya=Ca?a.metaKey:a.ctrlKey;this.state=a.state;this.ma=a;a.defaultPrevented&&this.preventDefault();delete this.B};
r.preventDefault=function(){zb.F.preventDefault.call(this);var a=this.ma;if(a.preventDefault)a.preventDefault();else if(a.returnValue=k,tb)try{if(a.ctrlKey||112<=a.keyCode&&123>=a.keyCode)a.keyCode=-1}catch(b){}};r.f=function(){};var N={},O={},P={},Q={};
function R(a,b,c,d,f){if(b){if("array"==t(b)){for(var e=0;e<b.length;e++)R(a,b[e],c,d,f);return j}var d=!!d,i=O;b in i||(i[b]={a:0,j:0});i=i[b];d in i||(i[d]={a:0,j:0},i.a++);var i=i[d],q=v(a),l;i.j++;if(i[q]){l=i[q];for(e=0;e<l.length;e++)if(i=l[e],i.R==c&&i.na==f){if(i.C)break;return l[e].key}}else l=i[q]=[],i.a++;var m=Ab,n=sb?function(a){return m.call(n.src,n.key,a)}:function(a){a=m.call(n.src,n.key,a);if(!a)return a},e=n;e.src=a;i=new qb;i.Z(c,e,a,b,d,f);c=i.key;e.key=c;l.push(i);N[c]=i;P[q]||
(P[q]=[]);P[q].push(i);a.addEventListener?(a==s||!a.va)&&a.addEventListener(b,e,d):a.attachEvent(b in Q?Q[b]:Q[b]="on"+b,e);return c}throw Error("Invalid event type");}function Bb(a,b,c,d,f){if("array"==t(b))for(var e=0;e<b.length;e++)Bb(a,b[e],c,d,f);else{d=!!d;a:{e=O;if(b in e&&(e=e[b],d in e&&(e=e[d],a=v(a),e[a]))){a=e[a];break a}a=j}if(a)for(e=0;e<a.length;e++)if(a[e].R==c&&a[e].capture==d&&a[e].na==f){S(a[e].key);break}}}
function S(a){if(!N[a])return k;var b=N[a];if(b.C)return k;var c=b.src,d=b.type,f=b.Ga,e=b.capture;c.removeEventListener?(c==s||!c.va)&&c.removeEventListener(d,f,e):c.detachEvent&&c.detachEvent(d in Q?Q[d]:Q[d]="on"+d,f);c=v(c);P[c]&&(f=P[c],Wa(f,b),0==f.length&&delete P[c]);b.C=h;if(b=O[d][e][c])b.Da=h,Cb(d,e,c,b);delete N[a];return h}
function Cb(a,b,c,d){if(!d.aa&&d.Da){for(var f=0,e=0;f<d.length;f++)d[f].C?d[f].Ga.src=j:(f!=e&&(d[e]=d[f]),e++);d.length=e;d.Da=k;0==e&&(delete O[a][b][c],O[a][b].a--,0==O[a][b].a&&(delete O[a][b],O[a].a--),0==O[a].a&&delete O[a])}}function Db(a,b,c,d,f){var e=1,b=v(b);if(a[b]){a.j--;a=a[b];a.aa?a.aa++:a.aa=1;try{for(var i=a.length,q=0;q<i;q++){var l=a[q];l&&!l.C&&(e&=Eb(l,f)!==k)}}finally{a.aa--,Cb(c,d,b,a)}}return Boolean(e)}function Eb(a,b){a.ta&&S(a.key);return a.handleEvent(b)}
function Ab(a,b){if(!N[a])return h;var c=N[a],d=c.type,f=O;if(!(d in f))return h;var f=f[d],e,i;if(!sb){e=b||ba("window.event");var q=h in f,l=k in f;if(q){if(0>e.keyCode||e.returnValue!=g)return h;a:{var m=k;if(0==e.keyCode)try{e.keyCode=-1;break a}catch(n){m=h}if(m||e.returnValue==g)e.returnValue=h}}m=new zb;m.Z(e,this);e=h;try{if(q){for(var p=[],ka=m.currentTarget;ka;ka=ka.parentNode)p.push(ka);i=f[h];i.j=i.a;for(var y=p.length-1;!m.B&&0<=y&&i.j;y--)m.currentTarget=p[y],e&=Db(i,p[y],d,h,m);if(l){i=
f[k];i.j=i.a;for(y=0;!m.B&&y<p.length&&i.j;y++)m.currentTarget=p[y],e&=Db(i,p[y],d,k,m)}}else e=Eb(c,m)}finally{p&&(p.length=0)}return e}d=new zb(b,this);return e=Eb(c,d)};function T(){L.call(this)}z(T,L);r=T.prototype;r.va=h;r.qa=j;r.addEventListener=function(a,b,c,d){R(this,a,b,c,d)};r.removeEventListener=function(a,b,c,d){Bb(this,a,b,c,d)};
r.dispatchEvent=function(a){var b=a.type||a,c=O;if(b in c){if(u(a))a=new M(a,this);else if(a instanceof M)a.target=a.target||this;else{var d=a,a=new M(b,this);Ta(a,d)}var d=1,f,c=c[b],b=h in c,e;if(b){f=[];for(e=this;e;e=e.qa)f.push(e);e=c[h];e.j=e.a;for(var i=f.length-1;!a.B&&0<=i&&e.j;i--)a.currentTarget=f[i],d&=Db(e,f[i],a.type,h,a)&&a.fa!=k}if(k in c)if(e=c[k],e.j=e.a,b)for(i=0;!a.B&&i<f.length&&e.j;i++)a.currentTarget=f[i],d&=Db(e,f[i],a.type,k,a)&&a.fa!=k;else for(f=this;!a.B&&f&&e.j;f=f.qa)a.currentTarget=
f,d&=Db(e,f,a.type,k,a)&&a.fa!=k;a=Boolean(d)}else a=h;return a};r.f=function(){T.F.f.call(this);var a,b=0,c=a==j;a=!!a;if(this==j){var d=function(d){for(var f=d.length-1;0<=f;f--){var e=d[f];if(c||a==e.capture)S(e.key),b++}},f;for(f in P)d.call(g,P[f])}else if(d=v(this),P[d]){d=P[d];for(f=d.length-1;0<=f;f--){var e=d[f];if(c||a==e.capture)S(e.key),b++}}this.qa=j};function Fb(a,b){L.call(this);this.N=a||1;this.T=b||Gb;this.ia=w(this.bb,this);this.pa=x()}z(Fb,T);Fb.prototype.enabled=k;var Gb=s.window;r=Fb.prototype;r.e=j;r.setInterval=function(a){this.N=a;this.e&&this.enabled?(this.stop(),this.start()):this.e&&this.stop()};r.bb=function(){if(this.enabled){var a=x()-this.pa;0<a&&a<0.8*this.N?this.e=this.T.setTimeout(this.ia,this.N-a):(this.dispatchEvent(Hb),this.enabled&&(this.e=this.T.setTimeout(this.ia,this.N),this.pa=x()))}};
r.start=function(){this.enabled=h;this.e||(this.e=this.T.setTimeout(this.ia,this.N),this.pa=x())};r.stop=function(){this.enabled=k;this.e&&(this.T.clearTimeout(this.e),this.e=j)};r.f=function(){Fb.F.f.call(this);this.stop();delete this.T};var Hb="tick";function Ib(a){L.call(this);this.Pa=a;this.d=[]}z(Ib,L);var Jb=[];function Kb(a,b,c,d){"array"!=t(c)&&(Jb[0]=c,c=Jb);for(var f=0;f<c.length;f++){var e=R(b,c[f],d||a,k,a.Pa||a);a.d.push(e)}}Ib.prototype.f=function(){Ib.F.f.call(this);Va(this.d,S);this.d.length=0};Ib.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented");};function Lb(a,b){M.call(this,"navigate");this.eb=a;this.hb=b}z(Lb,M);!B||F(9);!C&&!B||B&&F(9)||C&&E("1.9.1");B&&E("9");function U(a,b,c,d){L.call(this);if(a&&!b)throw Error("Can't use invisible history without providing a blank page.");var f;c?f=c:(f="history_state"+Mb,document.write(la(Nb,f,f)),f=u(f)?document.getElementById(f):f);this.M=f;this.k=c?(9==c.nodeType?c:c.ownerDocument||c.document)?(9==c.nodeType?c:c.ownerDocument||c.document).parentWindow||(9==c.nodeType?c:c.ownerDocument||c.document).defaultView:window:window;this.Ma=this.k.location.href.split("#")[0];this.X=b;B&&!b&&(this.X="https"==window.location.protocol?
"https:///":'javascript:""');this.e=new Fb(Ob);this.s=!a;this.p=new Ib(this);if(a||V)d?a=d:(a="history_iframe"+Mb,b=this.X?'src="'+na(this.X)+'"':"",document.write(la(Pb,a,b)),a=u(a)?document.getElementById(a):a),this.v=a,this.Ka=h;V&&(Kb(this.p,this.k,"load",this.Ta),this.Ja=this.ka=k);this.s?Qb(this,W(this),h):Rb(this,this.M.value);Mb++}z(U,T);U.prototype.L=k;U.prototype.A=k;U.prototype.w=j;var Sb=B&&F(8)||C&&E("1.9.2")||D&&E("532.1"),V=B&&!F(8),Tb=V;r=U.prototype;r.z=j;
r.f=function(){U.F.f.call(this);this.p.J();Ub(this,k)};function Ub(a,b){if(b!=a.L)if(V&&!a.ka)a.Ja=b;else if(b)if(Aa?Kb(a.p,a.k.document,Vb,a.Xa):C&&Kb(a.p,a.k,"pageshow",a.Wa),Sb&&a.s)Kb(a.p,a.k,"hashchange",a.Ua),a.L=h,a.dispatchEvent(new Lb(W(a),k));else{if(!B||a.ka)Kb(a.p,a.e,Hb,w(a.ua,a,h)),a.L=h,V||(a.w=W(a),a.dispatchEvent(new Lb(W(a),k))),a.e.start()}else{a.L=k;var c=a.p;Va(c.d,S);c.d.length=0;a.e.stop()}}r.Ta=function(){this.ka=h;this.M.value&&Rb(this,this.M.value,h);Ub(this,this.Ja)};
r.Wa=function(a){a.ma.persisted&&(Ub(this,k),Ub(this,h))};r.Ua=function(){var a=Wb(this.k);a!=this.w&&Xb(this,a,h)};function W(a){return a.z!=j?a.z:a.s?Wb(a.k):Yb(a)||""}function Zb(a){var b=$b;W(b)!=a&&(b.s?(Qb(b,a,k),Sb||B&&Rb(b,a,k,g),b.L&&b.ua(k)):(Rb(b,a,k),b.z=b.w=b.M.value=a,b.dispatchEvent(new Lb(a,k))))}function Wb(a){var a=a.location.href,b=a.indexOf("#");return 0>b?"":a.substring(b+1)}
function Qb(a,b,c){var d=a.k.location,a=a.Ma,f=-1!=d.href.indexOf("#");if(Tb||f||b)a+="#"+b;a!=d.href&&(c?d.replace(a):d.href=a)}function Rb(a,b,c,d){if(a.Ka||b!=Yb(a))if(a.Ka=k,b=encodeURIComponent(String(b)),B){var f=a.v.contentDocument||a.v.contentWindow.document;f.open("text/html",c?"replace":g);f.write(la(ac,na(d||a.k.document.title),b));f.close()}else if(b=a.X+"#"+b,a=a.v.contentWindow)c?a.location.replace(b):a.location.href=b}
function Yb(a){if(B)return a=a.v.contentDocument||a.v.contentWindow.document,a.body?ma(a.body.innerHTML):j;var b=a.v.contentWindow;if(b){var c;try{c=ma(Wb(b))}catch(d){return a.A||(a.A!=h&&a.e.setInterval(bc),a.A=h),j}a.A&&(a.A!=k&&a.e.setInterval(Ob),a.A=k);return c||j}return j}r.ua=function(a){if(this.s){var b=Wb(this.k);b!=this.w&&Xb(this,b,a)}if(!this.s||V)if(b=Yb(this)||"",this.z==j||b==this.z)this.z=j,b!=this.w&&Xb(this,b,a)};
function Xb(a,b,c){a.w=a.M.value=b;a.s?(V&&Rb(a,b),Qb(a,b)):Rb(a,b);a.dispatchEvent(new Lb(W(a),c))}r.Xa=function(){this.e.stop();this.e.start()};var Vb=["mousedown","keydown","mousemove"],ac="<title>%s</title><body>%s</body>",Pb='<iframe id="%s" style="display:none" %s></iframe>',Nb='<input type="text" name="%s" id="%s" style="display:none">',Mb=0,Ob=150,bc=1E4;function cc(a){a=String(a);if(/^\s*$/.test(a)?0:/^[\],:{}\s\u2028\u2029]*$/.test(a.replace(/\\["\\\/bfnrtu]/g,"@").replace(/"[^"\\\n\r\u2028\u2029\x00-\x08\x0a-\x1f]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:[\s\u2028\u2029]*\[)+/g,"")))try{return eval("("+a+")")}catch(b){}throw Error("Invalid JSON string: "+a);};function dc(){}dc.prototype.U=j;var ec;function fc(){}z(fc,dc);function gc(a){return(a=hc(a))?new ActiveXObject(a):new XMLHttpRequest}function ic(a){var b={};hc(a)&&(b[0]=h,b[1]=h);return b}
function hc(a){if(!a.Aa&&"undefined"==typeof XMLHttpRequest&&"undefined"!=typeof ActiveXObject){for(var b=["MSXML2.XMLHTTP.6.0","MSXML2.XMLHTTP.3.0","MSXML2.XMLHTTP","Microsoft.XMLHTTP"],c=0;c<b.length;c++){var d=b[c];try{return new ActiveXObject(d),a.Aa=d}catch(f){}}throw Error("Could not create ActiveXObject. ActiveX might be disabled, or MSXML might not be installed");}return a.Aa}ec=new fc;function jc(a){return kc(a||arguments.callee.caller,[])}
function kc(a,b){var c=[];if(0<=Ua(b,a))c.push("[...circular reference...]");else if(a&&50>b.length){c.push(lc(a)+"(");for(var d=a.arguments,f=0;f<d.length;f++){0<f&&c.push(", ");var e;e=d[f];switch(typeof e){case "object":e=e?"object":"null";break;case "string":break;case "number":e=String(e);break;case "boolean":e=e?"true":"false";break;case "function":e=(e=lc(e))?e:"[fn]";break;default:e=typeof e}40<e.length&&(e=e.substr(0,40)+"...");c.push(e)}b.push(a);c.push(")\n");try{c.push(kc(a.caller,b))}catch(i){c.push("[exception trying to get caller]\n")}}else a?
c.push("[...long stack...]"):c.push("[end]");return c.join("")}function lc(a){if(mc[a])return mc[a];a=String(a);if(!mc[a]){var b=/function ([^\(]+)/.exec(a);mc[a]=b?b[1]:"[Anonymous]"}return mc[a]}var mc={};function nc(a,b,c,d,f){this.reset(a,b,c,d,f)}nc.prototype.$a=0;nc.prototype.ya=j;nc.prototype.xa=j;var oc=0;nc.prototype.reset=function(a,b,c,d,f){this.$a="number"==typeof f?f:oc++;this.lb=d||x();this.Q=a;this.Ra=b;this.jb=c;delete this.ya;delete this.xa};nc.prototype.Ia=function(a){this.Q=a};function X(a){this.Sa=a}X.prototype.ba=j;X.prototype.Q=j;X.prototype.ja=j;X.prototype.za=j;function pc(a,b){this.name=a;this.value=b}pc.prototype.toString=function(){return this.name};var qc=new pc("SEVERE",1E3),rc=new pc("WARNING",900),sc=new pc("CONFIG",700),tc=new pc("FINE",500);X.prototype.getParent=function(){return this.ba};X.prototype.Ia=function(a){this.Q=a};function uc(a){if(a.Q)return a.Q;if(a.ba)return uc(a.ba);Oa("Root logger has no level set.");return j}
X.prototype.log=function(a,b,c){if(a.value>=uc(this).value){a=this.Oa(a,b,c);b="log:"+a.Ra;s.console&&(s.console.timeStamp?s.console.timeStamp(b):s.console.markTimeline&&s.console.markTimeline(b));s.msWriteProfilerMark&&s.msWriteProfilerMark(b);for(b=this;b;){var c=b,d=a;if(c.za)for(var f=0,e=g;e=c.za[f];f++)e(d);b=b.getParent()}}};
X.prototype.Oa=function(a,b,c){var d=new nc(a,String(b),this.Sa);if(c){d.ya=c;var f;var e=arguments.callee.caller;try{var i;var q=ba("window.location.href");if(u(c))i={message:c,name:"Unknown error",lineNumber:"Not available",fileName:q,stack:"Not available"};else{var l,m,n=k;try{l=c.lineNumber||c.ib||"Not available"}catch(p){l="Not available",n=h}try{m=c.fileName||c.filename||c.sourceURL||q}catch(ka){m="Not available",n=h}i=n||!c.lineNumber||!c.fileName||!c.stack?{message:c.message,name:c.name,lineNumber:l,
fileName:m,stack:c.stack||"Not available"}:c}f="Message: "+na(i.message)+'\nUrl: <a href="view-source:'+i.fileName+'" target="_new">'+i.fileName+"</a>\nLine: "+i.lineNumber+"\n\nBrowser stack:\n"+na(i.stack+"-> ")+"[end]\n\nJS stack traversal:\n"+na(jc(e)+"-> ")}catch(y){f="Exception trying to expose exception! You win, we lose. "+y}d.xa=f}return d};function Y(a,b){a.log(tc,b,g)}var vc={},wc=j;
function xc(a){wc||(wc=new X(""),vc[""]=wc,wc.Ia(sc));var b;if(!(b=vc[a])){b=new X(a);var c=a.lastIndexOf("."),d=a.substr(c+1),c=xc(a.substr(0,c));c.ja||(c.ja={});c.ja[d]=b;b.ba=c;vc[a]=b}return b};function yc(a){L.call(this);this.headers=new cb;this.H=a||j}z(yc,T);yc.prototype.i=xc("goog.net.XhrIo");var zc=/^https?$/i,Ac=[];function Bc(a){a.J();Wa(Ac,a)}r=yc.prototype;r.n=k;r.b=j;r.ha=j;r.$="";r.Ca="";r.O=0;r.P="";r.la=k;r.Y=k;r.oa=k;r.q=k;r.S=0;r.r=j;r.Ha="";r.fb=k;
r.send=function(a,b,c,d){if(this.b)throw Error("[goog.net.XhrIo] Object is active with another request="+this.$+"; newUri="+a);b=b?b.toUpperCase():"GET";this.$=a;this.P="";this.O=0;this.Ca=b;this.la=k;this.n=h;this.b=this.H?gc(this.H):gc(ec);this.ha=this.H?this.H.U||(this.H.U=ic(this.H)):ec.U||(ec.U=ic(ec));this.b.onreadystatechange=w(this.Fa,this);try{Y(this.i,Z(this,"Opening Xhr")),this.oa=h,this.b.open(b,a,h),this.oa=k}catch(f){Y(this.i,Z(this,"Error opening Xhr: "+f.message));Cc(this,f);return}var a=
c||"",e=this.headers.I();d&&bb(d,function(a,b){e.set(b,a)});d=s.FormData&&a instanceof s.FormData;"POST"==b&&(!e.t("Content-Type")&&!d)&&e.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");bb(e,function(a,b){this.b.setRequestHeader(b,a)},this);this.Ha&&(this.b.responseType=this.Ha);"withCredentials"in this.b&&(this.b.withCredentials=this.fb);try{this.r&&(Gb.clearTimeout(this.r),this.r=j),0<this.S&&(Y(this.i,Z(this,"Will abort after "+this.S+"ms if incomplete")),this.r=Gb.setTimeout(w(this.cb,
this),this.S)),Y(this.i,Z(this,"Sending request")),this.Y=h,this.b.send(a),this.Y=k}catch(i){Y(this.i,Z(this,"Send error: "+i.message)),Cc(this,i)}};r.cb=function(){"undefined"!=typeof aa&&this.b&&(this.P="Timed out after "+this.S+"ms, aborting",this.O=8,Y(this.i,Z(this,this.P)),this.dispatchEvent("timeout"),this.abort(8))};function Cc(a,b){a.n=k;a.b&&(a.q=h,a.b.abort(),a.q=k);a.P=b;a.O=5;Dc(a);Ec(a)}function Dc(a){a.la||(a.la=h,a.dispatchEvent("complete"),a.dispatchEvent("error"))}
r.abort=function(a){this.b&&this.n&&(Y(this.i,Z(this,"Aborting")),this.n=k,this.q=h,this.b.abort(),this.q=k,this.O=a||7,this.dispatchEvent("complete"),this.dispatchEvent("abort"),Ec(this))};r.f=function(){this.b&&(this.n&&(this.n=k,this.q=h,this.b.abort(),this.q=k),Ec(this,h));yc.F.f.call(this)};r.Fa=function(){!this.oa&&!this.Y&&!this.q?this.Va():Fc(this)};r.Va=function(){Fc(this)};
function Fc(a){if(a.n&&"undefined"!=typeof aa)if(a.ha[1]&&4==Gc(a)&&2==Hc(a))Y(a.i,Z(a,"Local request error detected and ignored"));else if(a.Y&&4==Gc(a))Gb.setTimeout(w(a.Fa,a),0);else if(a.dispatchEvent("readystatechange"),4==Gc(a)){Y(a.i,Z(a,"Request complete"));a.n=k;try{var b=Hc(a),c,d;a:switch(b){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:d=h;break a;default:d=k}if(!(c=d)){var f;if(f=0===b){var e=String(a.$).match(Pa)[1]||j;if(!e&&self.location)var i=self.location.protocol,
e=i.substr(0,i.length-1);f=!zc.test(e?e.toLowerCase():"")}c=f}if(c)a.dispatchEvent("complete"),a.dispatchEvent("success");else{a.O=6;var q;try{q=2<Gc(a)?a.b.statusText:""}catch(l){Y(a.i,"Can not get status: "+l.message),q=""}a.P=q+" ["+Hc(a)+"]";Dc(a)}}finally{Ec(a)}}}
function Ec(a,b){if(a.b){var c=a.b,d=a.ha[0]?ca:j;a.b=j;a.ha=j;a.r&&(Gb.clearTimeout(a.r),a.r=j);b||a.dispatchEvent("ready");try{c.onreadystatechange=d}catch(f){a.i.log(qc,"Problem encountered resetting onreadystatechange: "+f.message,g)}}}function Gc(a){return a.b?a.b.readyState:0}function Hc(a){try{return 2<Gc(a)?a.b.status:-1}catch(b){return a.i.log(rc,"Can not get status: "+b.message,g),-1}}function Z(a,b){return b+" ["+a.Ca+" "+a.$+" "+Hc(a)+"]"};var $b=j,Ic=[];function Jc(a,b){return a.G>b.G?1:a.G==b.G?0:-1}function Kc(a,b){return("Final"==a.W?1:0)-("Final"==b.W?1:0)}function Lc(a,b){return b.sa-a.sa}
function Mc(a){function b(){Ic=this.b?cc(this.b.responseText):g;var a=W($b).split(",");Nc(a);document.getElementById("updatetime").innerHTML=new Date}a=new eb(a);I(a);var c=Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^x()).toString(36);I(a);a.o.set("zx",c);a=a.toString();c=new yc;Ac.push(c);b&&R(c,"complete",b);R(c,"ready",ia(Bc,c));c.S=Math.max(0,6E4);c.send(a,g,g,g)}
function Nc(a){for(var a=a||[],b=Ic.map(Oc).map(function(a){var b=a.team,c=a.game_time,d=ta(a.completions+"/"+a.attempts+", ",a.pass_yards+" yd, ",a.pass_tds+" TD, ",a.interceptions_td+a.interceptions_notd+" INT"),l;l=a.pass_yards;var m;100>l?(l=25,m="under 100"):150>l?(l=12,m="under 150"):200>l?(l=6,m="under 200"):300>l?(l=0,m="under 300"):350>l?(l=-6,m="300+"):400>l?(l=-9,m="350+"):(l=-12,m="400+");l=new $(l,m+" passing yards");m=a.completions/a.attempts;var n;0.3>m?(m=25,n="under 30%"):0.4>m?(m=
15,n="under 40%"):0.5>m?(m=5,n="under 50%"):(m=0,n="50%+");m=new $(m,n+" completion rate");n=a.interceptions_notd+a.interceptions_td+a.fumbles_lost_notd+a.fumbles_lost_td;var p=0;3==n?p=12:4==n?p=16:5==n?p=24:5<n&&(p=50);l=[new $(25*a.interceptions_td,a.interceptions_td+"x INT returned for TD"),new $(5*a.interceptions_notd,a.interceptions_notd+"x INT"),new $(5*a.fumbles_lost_notd,a.fumbles_lost_notd+"x fumble lost"),new $(2*a.fumbles_kept,a.fumbles_kept+"x fumble kept"),new $(p,n+"-turnover game"),
new $(0==a.pass_tds+a.rush_tds?10:3>a.pass_tds+a.rush_tds?0:3==a.pass_tds+a.rush_tds?-5:4==a.pass_tds+a.rush_tds?-10:-20,a.pass_tds+a.rush_tds+"-touchdown game"),l,m];25>a.long_pass&&l.push(new $(10,"no pass of 25+ yards"));75<=a.rush_yards&&l.push(new $(-8,"75+ rushing yards"));a=l.filter(function(a){return 0!=a.da});return new Pc(b,c,d,a)}),c=a.length-1;0<=c;c--){var d;"team"==a[c]?d=Jc:"active"==a[c]?d=Kc:"score"==a[c]&&(d=Lc);d&&Za(b,d)}d=b.map(function(a){for(var b=[],c=0,d;d=a.Za[c++];)0!=d.da&&
b.push('<tr class="scorerow">  <td class="scoredesc">'+d.description+'</td>  <td class="scorepoints">'+Qc(d.da)+"</td></tr>");a=['<div class="team'+("Final"==a.W?"":" active")+'">','  <div class="teamheader">','    <img class="teamlogo" src="images/'+a.G+'.png" ','        width="48" height="32">','    <span class="teamname">'+a.G+"</span>",'    <span class="teampoints">'+Qc(a.sa)+"</span>","  </div>",'  <div class="statline">'+a.ab+"</div>",'  <div class="gamestatus">'+a.W+"</div>",'  <table class="scoretable">'];
a=a.concat(b);a=a.concat(["  </table>","</div>"]);return a.join("\n")});document.getElementById("bqblscores").innerHTML="";for(a=0;a<d.length;a++)document.getElementById("bqblscores").innerHTML+=d[a]}function Oc(a){for(var b in a)if(u(a[b])){var c;c=a[b];var d=Number(c);c=0==d&&/^[\s\xa0]*$/.test(c)?NaN:d;isNaN(c)||(a[b]=c)}return a}function Pc(a,b,c,d){this.G=a;this.W=b;this.ab=c;this.Za=d;this.sa=d.map(function(a){return a.da}).reduce(function(a,b){return a+b},0)}
function $(a,b){this.da=a;this.description=b}function Qc(a){return 0>a?'<span class="neg">&minus;'+-1*a+"</span>":0<a?"+"+a:""+a}ja("bqbl.init",function(){$b=new U;Zb("active,team");Ub($b,h);R($b,"navigate",function(a){setTimeout(function(){Nc(a.eb.split(","))},0)})});ja("bqbl.loadAndUpdate",Mc);
ja("bqbl.registerListeners",function(){function a(a,c){R(document.getElementById(a),ub,function(a){Zb(c.join(","));a.preventDefault()})}a("sortbyactive",["active","team"]);a("sortbyscore",["score","team"]);a("sortbyteam",["team"])});ja("bqbl.startUpdating",function(a,b){function c(){Mc(a);window.setTimeout(c,b||3E5)}c()});
