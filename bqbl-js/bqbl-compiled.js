var g=void 0,i=!0,j=null,l=!1,r,aa=aa||{},s=this;function ba(a){for(var a=a.split("."),b=s,c;c=a.shift();)if(b[c]!=j)b=b[c];else return j;return b}function ca(){}
function u(a){var b=typeof a;if("object"==b)if(a){if(a instanceof Array)return"array";if(a instanceof Object)return b;var c=Object.prototype.toString.call(a);if("[object Window]"==c)return"object";if("[object Array]"==c||"number"==typeof a.length&&"undefined"!=typeof a.splice&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("splice"))return"array";if("[object Function]"==c||"undefined"!=typeof a.call&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("call"))return"function"}else return"null";
else if("function"==b&&"undefined"==typeof a.call)return"object";return b}function da(a){var b=u(a);return"array"==b||"object"==b&&"number"==typeof a.length}function v(a){return"string"==typeof a}function ea(a){var b=typeof a;return"object"==b&&a!=j||"function"==b}function w(a){return a[fa]||(a[fa]=++ga)}var fa="closure_uid_"+Math.floor(2147483648*Math.random()).toString(36),ga=0;function ha(a,b,c){return a.call.apply(a.bind,arguments)}
function ia(a,b,c){if(!a)throw Error();if(2<arguments.length){var d=Array.prototype.slice.call(arguments,2);return function(){var c=Array.prototype.slice.call(arguments);Array.prototype.unshift.apply(c,d);return a.apply(b,c)}}return function(){return a.apply(b,arguments)}}function x(a,b,c){x=Function.prototype.bind&&-1!=Function.prototype.bind.toString().indexOf("native code")?ha:ia;return x.apply(j,arguments)}
function ja(a,b){var c=Array.prototype.slice.call(arguments,1);return function(){var b=Array.prototype.slice.call(arguments);b.unshift.apply(b,c);return a.apply(this,b)}}var y=Date.now||function(){return+new Date};function ka(a,b){var c=a.split("."),d=s;!(c[0]in d)&&d.execScript&&d.execScript("var "+c[0]);for(var f;c.length&&(f=c.shift());)!c.length&&b!==g?d[f]=b:d=d[f]?d[f]:d[f]={}}function A(a,b){function c(){}c.prototype=b.prototype;a.H=b.prototype;a.prototype=new c};function la(a,b){for(var c=1;c<arguments.length;c++)var d=String(arguments[c]).replace(/\$/g,"$$$$"),a=a.replace(/\%s/,d);return a}function ma(a){return decodeURIComponent(a.replace(/\+/g," "))}function B(a){if(!na.test(a))return a;-1!=a.indexOf("&")&&(a=a.replace(oa,"&amp;"));-1!=a.indexOf("<")&&(a=a.replace(pa,"&lt;"));-1!=a.indexOf(">")&&(a=a.replace(qa,"&gt;"));-1!=a.indexOf('"')&&(a=a.replace(ra,"&quot;"));return a}var oa=/&/g,pa=/</g,qa=/>/g,ra=/\"/g,na=/[&<>\"]/;
function sa(a){var a=String(a),b=a.indexOf(".");-1==b&&(b=a.length);b=Math.max(0,2-b);return Array(b+1).join("0")+a}function ta(a){return Array.prototype.join.call(arguments,"")};var C,ua,va,wa;function xa(){return s.navigator?s.navigator.userAgent:j}wa=va=ua=C=l;var ya;if(ya=xa()){var za=s.navigator;C=0==ya.indexOf("Opera");ua=!C&&-1!=ya.indexOf("MSIE");va=!C&&-1!=ya.indexOf("WebKit");wa=!C&&!va&&"Gecko"==za.product}var Aa=C,D=ua,E=wa,F=va,Ba=s.navigator,Ca=-1!=(Ba&&Ba.platform||"").indexOf("Mac"),Da;
a:{var Ea="",Fa;if(Aa&&s.opera)var Ga=s.opera.version,Ea="function"==typeof Ga?Ga():Ga;else if(E?Fa=/rv\:([^\);]+)(\)|;)/:D?Fa=/MSIE\s+([^\);]+)(\)|;)/:F&&(Fa=/WebKit\/(\S+)/),Fa)var Ha=Fa.exec(xa()),Ea=Ha?Ha[1]:"";if(D){var Ia,Ja=s.document;Ia=Ja?Ja.documentMode:g;if(Ia>parseFloat(Ea)){Da=String(Ia);break a}}Da=Ea}var Ka={};
function G(a){var b;if(!(b=Ka[a])){b=0;for(var c=String(Da).replace(/^[\s\xa0]+|[\s\xa0]+$/g,"").split("."),d=String(a).replace(/^[\s\xa0]+|[\s\xa0]+$/g,"").split("."),f=Math.max(c.length,d.length),e=0;0==b&&e<f;e++){var h=c[e]||"",n=d[e]||"",k=RegExp("(\\d*)(\\D*)","g"),m=RegExp("(\\d*)(\\D*)","g");do{var p=k.exec(h)||["","",""],q=m.exec(n)||["","",""];if(0==p[0].length&&0==q[0].length)break;b=((0==p[1].length?0:parseInt(p[1],10))<(0==q[1].length?0:parseInt(q[1],10))?-1:(0==p[1].length?0:parseInt(p[1],
10))>(0==q[1].length?0:parseInt(q[1],10))?1:0)||((0==p[2].length)<(0==q[2].length)?-1:(0==p[2].length)>(0==q[2].length)?1:0)||(p[2]<q[2]?-1:p[2]>q[2]?1:0)}while(0==b)}b=Ka[a]=0<=b}return b}var La={};function H(a){return La[a]||(La[a]=D&&!!document.documentMode&&document.documentMode>=a)};function Ma(a){Error.captureStackTrace?Error.captureStackTrace(this,Ma):this.stack=Error().stack||"";a&&(this.message=String(a))}A(Ma,Error);Ma.prototype.name="CustomError";function Na(a,b){b.unshift(a);Ma.call(this,la.apply(j,b));b.shift();this.Nb=a}A(Na,Ma);Na.prototype.name="AssertionError";function Oa(a,b){throw new Na("Failure"+(a?": "+a:""),Array.prototype.slice.call(arguments,1));};var Pa=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^/?#]*)@)?([\\w\\d\\-\\u0100-\\uffff.%]*)(?::([0-9]+))?)?([^?#]+)?(?:\\?([^#]*))?(?:#(.*))?$");function Qa(a,b){for(var c in a)b.call(g,a[c],c,a)}function Ra(a){var b=[],c=0,d;for(d in a)b[c++]=a[d];return b}function Sa(a){var b=[],c=0,d;for(d in a)b[c++]=d;return b}var Ta="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function Ua(a,b){for(var c,d,f=1;f<arguments.length;f++){d=arguments[f];for(c in d)a[c]=d[c];for(var e=0;e<Ta.length;e++)c=Ta[e],Object.prototype.hasOwnProperty.call(d,c)&&(a[c]=d[c])}};var I=Array.prototype,Va=I.indexOf?function(a,b,c){return I.indexOf.call(a,b,c)}:function(a,b,c){c=c==j?0:0>c?Math.max(0,a.length+c):c;if(v(a))return!v(b)||1!=b.length?-1:a.indexOf(b,c);for(;c<a.length;c++)if(c in a&&a[c]===b)return c;return-1},Wa=I.forEach?function(a,b,c){I.forEach.call(a,b,c)}:function(a,b,c){for(var d=a.length,f=v(a)?a.split(""):a,e=0;e<d;e++)e in f&&b.call(c,f[e],e,a)};function Xa(a,b){var c=Va(a,b);0<=c&&I.splice.call(a,c,1)}
function Ya(a){return I.concat.apply(I,arguments)}function Za(a){var b=a.length;if(0<b){for(var c=Array(b),d=0;d<b;d++)c[d]=a[d];return c}return[]}function $a(a,b,c){return 2>=arguments.length?I.slice.call(a,b):I.slice.call(a,b,c)}function ab(a,b){for(var c=0;c<a.length;c++)a[c]={index:c,value:a[c]};var d=b||bb;I.sort.call(a,function(a,b){return d(a.value,b.value)||a.index-b.index}||bb);for(c=0;c<a.length;c++)a[c]=a[c].value}function bb(a,b){return a>b?1:a<b?-1:0};function cb(a){if("function"==typeof a.m)return a.m();if(v(a))return a.split("");if(da(a)){for(var b=[],c=a.length,d=0;d<c;d++)b.push(a[d]);return b}return Ra(a)}function db(a,b,c){if("function"==typeof a.forEach)a.forEach(b,c);else if(da(a)||v(a))Wa(a,b,c);else{var d;if("function"==typeof a.w)d=a.w();else if("function"!=typeof a.m)if(da(a)||v(a)){d=[];for(var f=a.length,e=0;e<f;e++)d.push(e)}else d=Sa(a);else d=g;for(var f=cb(a),e=f.length,h=0;h<e;h++)b.call(c,f[h],d&&d[h],a)}};function eb(a,b){this.n={};this.d=[];var c=arguments.length;if(1<c){if(c%2)throw Error("Uneven number of arguments");for(var d=0;d<c;d+=2)this.set(arguments[d],arguments[d+1])}else if(a){a instanceof eb?(c=a.w(),d=a.m()):(c=Sa(a),d=Ra(a));for(var f=0;f<c.length;f++)this.set(c[f],d[f])}}r=eb.prototype;r.a=0;r.Oa=0;r.m=function(){fb(this);for(var a=[],b=0;b<this.d.length;b++)a.push(this.n[this.d[b]]);return a};r.w=function(){fb(this);return this.d.concat()};r.v=function(a){return J(this.n,a)};
r.remove=function(a){return J(this.n,a)?(delete this.n[a],this.a--,this.Oa++,this.d.length>2*this.a&&fb(this),i):l};function fb(a){if(a.a!=a.d.length){for(var b=0,c=0;b<a.d.length;){var d=a.d[b];J(a.n,d)&&(a.d[c++]=d);b++}a.d.length=c}if(a.a!=a.d.length){for(var f={},c=b=0;b<a.d.length;)d=a.d[b],J(f,d)||(a.d[c++]=d,f[d]=1),b++;a.d.length=c}}r.get=function(a,b){return J(this.n,a)?this.n[a]:b};r.set=function(a,b){J(this.n,a)||(this.a++,this.d.push(a),this.Oa++);this.n[a]=b};r.u=function(){return new eb(this)};
function J(a,b){return Object.prototype.hasOwnProperty.call(a,b)};function gb(a,b){var c;if(a instanceof gb)this.i=b!==g?b:a.i,hb(this,a.G),c=a.ha,K(this),this.ha=c,c=a.L,K(this),this.L=c,ib(this,a.fa),c=a.da,K(this),this.da=c,jb(this,a.p.u()),c=a.W,K(this),this.W=c;else if(a&&(c=String(a).match(Pa))){this.i=!!b;hb(this,c[1]||"",i);var d=c[2]||"";K(this);this.ha=d?decodeURIComponent(d):"";d=c[3]||"";K(this);this.L=d?decodeURIComponent(d):"";ib(this,c[4]);d=c[5]||"";K(this);this.da=d?decodeURIComponent(d):"";jb(this,c[6]||"",i);c=c[7]||"";K(this);this.W=c?decodeURIComponent(c):
""}else this.i=!!b,this.p=new kb(j,0,this.i)}r=gb.prototype;r.G="";r.ha="";r.L="";r.fa=j;r.da="";r.W="";r.Xa=l;r.i=l;r.toString=function(){var a=[],b=this.G;b&&a.push(lb(b,mb),":");if(b=this.L){a.push("//");var c=this.ha;c&&a.push(lb(c,mb),"@");a.push(encodeURIComponent(String(b)));b=this.fa;b!=j&&a.push(":",String(b))}if(b=this.da)this.L&&"/"!=b.charAt(0)&&a.push("/"),a.push(lb(b,"/"==b.charAt(0)?nb:ob));(b=this.p.toString())&&a.push("?",b);(b=this.W)&&a.push("#",lb(b,pb));return a.join("")};
r.u=function(){return new gb(this)};function hb(a,b,c){K(a);a.G=c?b?decodeURIComponent(b):"":b;a.G&&(a.G=a.G.replace(/:$/,""))}function ib(a,b){K(a);if(b){b=Number(b);if(isNaN(b)||0>b)throw Error("Bad port number "+b);a.fa=b}else a.fa=j}function jb(a,b,c){K(a);b instanceof kb?(a.p=b,a.p.sa(a.i)):(c||(b=lb(b,qb)),a.p=new kb(b,0,a.i))}function K(a){if(a.Xa)throw Error("Tried to modify a read-only Uri");}r.sa=function(a){this.i=a;this.p&&this.p.sa(a);return this};
function lb(a,b){return v(a)?encodeURI(a).replace(b,rb):j}function rb(a){a=a.charCodeAt(0);return"%"+(a>>4&15).toString(16)+(a&15).toString(16)}var mb=/[#\/\?@]/g,ob=/[\#\?:]/g,nb=/[\#\?]/g,qb=/[\#\?@]/g,pb=/#/g;function kb(a,b,c){this.h=a||j;this.i=!!c}function L(a){if(!a.c&&(a.c=new eb,a.a=0,a.h))for(var b=a.h.split("&"),c=0;c<b.length;c++){var d=b[c].indexOf("="),f=j,e=j;0<=d?(f=b[c].substring(0,d),e=b[c].substring(d+1)):f=b[c];f=ma(f);f=M(a,f);a.add(f,e?ma(e):"")}}r=kb.prototype;r.c=j;r.a=j;
r.add=function(a,b){L(this);this.h=j;var a=M(this,a),c=this.c.get(a);c||this.c.set(a,c=[]);c.push(b);this.a++;return this};r.remove=function(a){L(this);a=M(this,a);return this.c.v(a)?(this.h=j,this.a-=this.c.get(a).length,this.c.remove(a)):l};r.v=function(a){L(this);a=M(this,a);return this.c.v(a)};r.w=function(){L(this);for(var a=this.c.m(),b=this.c.w(),c=[],d=0;d<b.length;d++)for(var f=a[d],e=0;e<f.length;e++)c.push(b[d]);return c};
r.m=function(a){L(this);var b=[];if(a)this.v(a)&&(b=Ya(b,this.c.get(M(this,a))));else for(var a=this.c.m(),c=0;c<a.length;c++)b=Ya(b,a[c]);return b};r.set=function(a,b){L(this);this.h=j;a=M(this,a);this.v(a)&&(this.a-=this.c.get(a).length);this.c.set(a,[b]);this.a++;return this};r.get=function(a,b){var c=a?this.m(a):[];return 0<c.length?String(c[0]):b};
r.toString=function(){if(this.h)return this.h;if(!this.c)return"";for(var a=[],b=this.c.w(),c=0;c<b.length;c++)for(var d=b[c],f=encodeURIComponent(String(d)),d=this.m(d),e=0;e<d.length;e++){var h=f;""!==d[e]&&(h+="="+encodeURIComponent(String(d[e])));a.push(h)}return this.h=a.join("&")};r.u=function(){var a=new kb;a.h=this.h;this.c&&(a.c=this.c.u(),a.a=this.a);return a};function M(a,b){var c=String(b);a.i&&(c=c.toLowerCase());return c}
r.sa=function(a){a&&!this.i&&(L(this),this.h=j,db(this.c,function(a,c){var d=c.toLowerCase();c!=d&&(this.remove(c),this.remove(d),0<a.length&&(this.h=j,this.c.set(M(this,d),Za(a)),this.a+=a.length))},this));this.i=a};function sb(){}var tb=0;r=sb.prototype;r.key=0;r.F=l;r.ua=l;r.$=function(a,b,c,d,f,e){if("function"==u(a))this.Ea=i;else if(a&&a.handleEvent&&"function"==u(a.handleEvent))this.Ea=l;else throw Error("Invalid listener argument");this.S=a;this.Ja=b;this.src=c;this.type=d;this.capture=!!f;this.oa=e;this.ua=l;this.key=++tb;this.F=l};r.handleEvent=function(a){return this.Ea?this.S.call(this.oa||this.src,a):this.S.handleEvent.call(this.S,a)};!D||H(9);var ub=!D||H(9),vb=D&&!G("9");!F||G("528");E&&G("1.9b")||D&&G("8")||Aa&&G("9.5")||F&&G("528");E&&!G("8")||D&&G("9");var wb="click";function N(){0!=xb&&(this.Jb=Error().stack,yb[w(this)]=this)}var xb=0,yb={};N.prototype.xa=l;N.prototype.K=function(){if(!this.xa&&(this.xa=i,this.g(),0!=xb)){var a=w(this);delete yb[a]}};N.prototype.g=function(){this.Ta&&zb.apply(j,this.Ta);if(this.Ha)for(;this.Ha.length;)this.Ha.shift()()};function zb(a){for(var b=0,c=arguments.length;b<c;++b){var d=arguments[b];da(d)?zb.apply(j,d):d&&"function"==typeof d.K&&d.K()}};function O(a,b){this.type=a;this.currentTarget=this.target=b}r=O.prototype;r.g=function(){};r.K=function(){};r.D=l;r.defaultPrevented=l;r.ga=i;r.preventDefault=function(){this.defaultPrevented=i;this.ga=l};function Ab(a){Ab[" "](a);return a}Ab[" "]=ca;function Bb(a,b){a&&this.$(a,b)}A(Bb,O);r=Bb.prototype;r.target=j;r.relatedTarget=j;r.offsetX=0;r.offsetY=0;r.clientX=0;r.clientY=0;r.screenX=0;r.screenY=0;r.button=0;r.keyCode=0;r.charCode=0;r.ctrlKey=l;r.altKey=l;r.shiftKey=l;r.metaKey=l;r.gb=l;r.na=j;
r.$=function(a,b){var c=this.type=a.type;O.call(this,c);this.target=a.target||a.srcElement;this.currentTarget=b;var d=a.relatedTarget;if(d){if(E){var f;a:{try{Ab(d.nodeName);f=i;break a}catch(e){}f=l}f||(d=j)}}else"mouseover"==c?d=a.fromElement:"mouseout"==c&&(d=a.toElement);this.relatedTarget=d;this.offsetX=F||a.offsetX!==g?a.offsetX:a.layerX;this.offsetY=F||a.offsetY!==g?a.offsetY:a.layerY;this.clientX=a.clientX!==g?a.clientX:a.pageX;this.clientY=a.clientY!==g?a.clientY:a.pageY;this.screenX=a.screenX||
0;this.screenY=a.screenY||0;this.button=a.button;this.keyCode=a.keyCode||0;this.charCode=a.charCode||("keypress"==c?a.keyCode:0);this.ctrlKey=a.ctrlKey;this.altKey=a.altKey;this.shiftKey=a.shiftKey;this.metaKey=a.metaKey;this.gb=Ca?a.metaKey:a.ctrlKey;this.state=a.state;this.na=a;a.defaultPrevented&&this.preventDefault();delete this.D};
r.preventDefault=function(){Bb.H.preventDefault.call(this);var a=this.na;if(a.preventDefault)a.preventDefault();else if(a.returnValue=l,vb)try{if(a.ctrlKey||112<=a.keyCode&&123>=a.keyCode)a.keyCode=-1}catch(b){}};r.g=function(){};var Cb={},P={},Q={},Db={};
function R(a,b,c,d,f){if(b){if("array"==u(b)){for(var e=0;e<b.length;e++)R(a,b[e],c,d,f);return j}var d=!!d,h=P;b in h||(h[b]={a:0,k:0});h=h[b];d in h||(h[d]={a:0,k:0},h.a++);var h=h[d],n=w(a),k;h.k++;if(h[n]){k=h[n];for(e=0;e<k.length;e++)if(h=k[e],h.S==c&&h.oa==f){if(h.F)break;return k[e].key}}else k=h[n]=[],h.a++;var m=Eb,p=ub?function(a){return m.call(p.src,p.key,a)}:function(a){a=m.call(p.src,p.key,a);if(!a)return a},e=p;e.src=a;h=new sb;h.$(c,e,a,b,d,f);c=h.key;e.key=c;k.push(h);Cb[c]=h;Q[n]||
(Q[n]=[]);Q[n].push(h);a.addEventListener?(a==s||!a.wa)&&a.addEventListener(b,e,d):a.attachEvent(b in Db?Db[b]:Db[b]="on"+b,e);return c}throw Error("Invalid event type");}function Fb(a,b,c,d,f){if("array"==u(b))for(var e=0;e<b.length;e++)Fb(a,b[e],c,d,f);else{d=!!d;a:{e=P;if(b in e&&(e=e[b],d in e&&(e=e[d],a=w(a),e[a]))){a=e[a];break a}a=j}if(a)for(e=0;e<a.length;e++)if(a[e].S==c&&a[e].capture==d&&a[e].oa==f){Gb(a[e].key);break}}}
function Gb(a){if(!Cb[a])return l;var b=Cb[a];if(b.F)return l;var c=b.src,d=b.type,f=b.Ja,e=b.capture;c.removeEventListener?(c==s||!c.wa)&&c.removeEventListener(d,f,e):c.detachEvent&&c.detachEvent(d in Db?Db[d]:Db[d]="on"+d,f);c=w(c);Q[c]&&(f=Q[c],Xa(f,b),0==f.length&&delete Q[c]);b.F=i;if(b=P[d][e][c])b.Ga=i,Hb(d,e,c,b);delete Cb[a];return i}
function Hb(a,b,c,d){if(!d.ba&&d.Ga){for(var f=0,e=0;f<d.length;f++)d[f].F?d[f].Ja.src=j:(f!=e&&(d[e]=d[f]),e++);d.length=e;d.Ga=l;0==e&&(delete P[a][b][c],P[a][b].a--,0==P[a][b].a&&(delete P[a][b],P[a].a--),0==P[a].a&&delete P[a])}}function Ib(a,b,c,d,f){var e=1,b=w(b);if(a[b]){a.k--;a=a[b];a.ba?a.ba++:a.ba=1;try{for(var h=a.length,n=0;n<h;n++){var k=a[n];k&&!k.F&&(e&=Jb(k,f)!==l)}}finally{a.ba--,Hb(c,d,b,a)}}return Boolean(e)}function Jb(a,b){a.ua&&Gb(a.key);return a.handleEvent(b)}
function Eb(a,b){if(!Cb[a])return i;var c=Cb[a],d=c.type,f=P;if(!(d in f))return i;var f=f[d],e,h;if(!ub){e=b||ba("window.event");var n=i in f,k=l in f;if(n){if(0>e.keyCode||e.returnValue!=g)return i;a:{var m=l;if(0==e.keyCode)try{e.keyCode=-1;break a}catch(p){m=i}if(m||e.returnValue==g)e.returnValue=i}}m=new Bb;m.$(e,this);e=i;try{if(n){for(var q=[],t=m.currentTarget;t;t=t.parentNode)q.push(t);h=f[i];h.k=h.a;for(var z=q.length-1;!m.D&&0<=z&&h.k;z--)m.currentTarget=q[z],e&=Ib(h,q[z],d,i,m);if(k){h=
f[l];h.k=h.a;for(z=0;!m.D&&z<q.length&&h.k;z++)m.currentTarget=q[z],e&=Ib(h,q[z],d,l,m)}}else e=Jb(c,m)}finally{q&&(q.length=0)}return e}d=new Bb(b,this);return e=Jb(c,d)};function Kb(){N.call(this)}A(Kb,N);r=Kb.prototype;r.wa=i;r.ra=j;r.addEventListener=function(a,b,c,d){R(this,a,b,c,d)};r.removeEventListener=function(a,b,c,d){Fb(this,a,b,c,d)};
r.dispatchEvent=function(a){var b=a.type||a,c=P;if(b in c){if(v(a))a=new O(a,this);else if(a instanceof O)a.target=a.target||this;else{var d=a,a=new O(b,this);Ua(a,d)}var d=1,f,c=c[b],b=i in c,e;if(b){f=[];for(e=this;e;e=e.ra)f.push(e);e=c[i];e.k=e.a;for(var h=f.length-1;!a.D&&0<=h&&e.k;h--)a.currentTarget=f[h],d&=Ib(e,f[h],a.type,i,a)&&a.ga!=l}if(l in c)if(e=c[l],e.k=e.a,b)for(h=0;!a.D&&h<f.length&&e.k;h++)a.currentTarget=f[h],d&=Ib(e,f[h],a.type,l,a)&&a.ga!=l;else for(f=this;!a.D&&f&&e.k;f=f.ra)a.currentTarget=
f,d&=Ib(e,f,a.type,l,a)&&a.ga!=l;a=Boolean(d)}else a=i;return a};r.g=function(){Kb.H.g.call(this);var a,b=0,c=a==j;a=!!a;if(this==j)Qa(Q,function(d){for(var e=d.length-1;0<=e;e--){var f=d[e];if(c||a==f.capture)Gb(f.key),b++}});else{var d=w(this);if(Q[d])for(var d=Q[d],f=d.length-1;0<=f;f--){var e=d[f];if(c||a==e.capture)Gb(e.key),b++}}this.ra=j};function Lb(a,b){N.call(this);this.O=a||1;this.U=b||Mb;this.ja=x(this.kb,this);this.qa=y()}A(Lb,Kb);Lb.prototype.enabled=l;var Mb=s.window;r=Lb.prototype;r.f=j;r.setInterval=function(a){this.O=a;this.f&&this.enabled?(this.stop(),this.start()):this.f&&this.stop()};r.kb=function(){if(this.enabled){var a=y()-this.qa;0<a&&a<0.8*this.O?this.f=this.U.setTimeout(this.ja,this.O-a):(this.dispatchEvent(Nb),this.enabled&&(this.f=this.U.setTimeout(this.ja,this.O),this.qa=y()))}};
r.start=function(){this.enabled=i;this.f||(this.f=this.U.setTimeout(this.ja,this.O),this.qa=y())};r.stop=function(){this.enabled=l;this.f&&(this.U.clearTimeout(this.f),this.f=j)};r.g=function(){Lb.H.g.call(this);this.stop();delete this.U};var Nb="tick";function Ob(a){N.call(this);this.Wa=a;this.d=[]}A(Ob,N);var Pb=[];function Qb(a,b,c,d){"array"!=u(c)&&(Pb[0]=c,c=Pb);for(var f=0;f<c.length;f++){var e=R(b,c[f],d||a,l,a.Wa||a);a.d.push(e)}}Ob.prototype.g=function(){Ob.H.g.call(this);Wa(this.d,Gb);this.d.length=0};Ob.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented");};function Rb(a,b){O.call(this,"navigate");this.mb=a;this.Kb=b}A(Rb,O);function Sb(a,b){var c;c=a.className;c=v(c)&&c.match(/\S+/g)||[];for(var d=$a(arguments,1),f=c.length+d.length,e=c,h=0;h<d.length;h++)0<=Va(e,d[h])||e.push(d[h]);a.className=c.join(" ");return c.length==f};var Tb=!D||H(9);!E&&!D||D&&H(9)||E&&G("1.9.1");D&&G("9");var Ub={cellpadding:"cellPadding",cellspacing:"cellSpacing",colspan:"colSpan",frameborder:"frameBorder",height:"height",maxlength:"maxLength",role:"role",rowspan:"rowSpan",type:"type",usemap:"useMap",valign:"vAlign",width:"width"};
function Vb(a,b,c){var d=arguments,f=document,e=d[0],h=d[1];if(!Tb&&h&&(h.name||h.type)){e=["<",e];h.name&&e.push(' name="',B(h.name),'"');if(h.type){e.push(' type="',B(h.type),'"');var n={};Ua(n,h);delete n.type;h=n}e.push(">");e=e.join("")}e=f.createElement(e);if(h)if(v(h))e.className=h;else if("array"==u(h))Sb.apply(j,[e].concat(h));else{var k=e;Qa(h,function(a,b){"style"==b?k.style.cssText=a:"class"==b?k.className=a:"for"==b?k.htmlFor=a:b in Ub?k.setAttribute(Ub[b],a):0==b.lastIndexOf("aria-",
0)||0==b.lastIndexOf("data-",0)?k.setAttribute(b,a):k[b]=a})}if(2<d.length)for(var m=f,p=e,f=function(a){a&&p.appendChild(v(a)?m.createTextNode(a):a)},h=2;h<d.length;h++)if(n=d[h],da(n)&&!(ea(n)&&0<n.nodeType)){var q=Wa,t;a:{if((t=n)&&"number"==typeof t.length){if(ea(t)){t="function"==typeof t.item||"string"==typeof t.item;break a}if("function"==u(t)){t="function"==typeof t.item;break a}}t=l}q(t?Za(n):n,f)}else f(n);return e};function S(a,b,c,d){N.call(this);if(a&&!b)throw Error("Can't use invisible history without providing a blank page.");var f;c?f=c:(f="history_state"+Wb,document.write(la(Xb,f,f)),f=v(f)?document.getElementById(f):f);this.N=f;this.l=c?(9==c.nodeType?c:c.ownerDocument||c.document)?(9==c.nodeType?c:c.ownerDocument||c.document).parentWindow||(9==c.nodeType?c:c.ownerDocument||c.document).defaultView:window:window;this.Ra=this.l.location.href.split("#")[0];this.Y=b;D&&!b&&(this.Y="https"==window.location.protocol?
"https:///":'javascript:""');this.f=new Lb(Yb);this.t=!a;this.q=new Ob(this);if(a||T)d?a=d:(a="history_iframe"+Wb,b=this.Y?'src="'+B(this.Y)+'"':"",document.write(la(Zb,a,b)),a=v(a)?document.getElementById(a):a),this.z=a,this.Na=i;T&&(Qb(this.q,this.l,"load",this.ab),this.Ma=this.la=l);this.t?$b(this,U(this),i):ac(this,this.N.value);Wb++}A(S,Kb);S.prototype.M=l;S.prototype.C=l;S.prototype.A=j;var bc=D&&H(8)||E&&G("1.9.2")||F&&G("532.1"),T=D&&!H(8),cc=T;r=S.prototype;r.B=j;
r.g=function(){S.H.g.call(this);this.q.K();dc(this,l)};function dc(a,b){if(b!=a.M)if(T&&!a.la)a.Ma=b;else if(b)if(Aa?Qb(a.q,a.l.document,ec,a.fb):E&&Qb(a.q,a.l,"pageshow",a.eb),bc&&a.t)Qb(a.q,a.l,"hashchange",a.bb),a.M=i,a.dispatchEvent(new Rb(U(a),l));else{if(!D||a.la)Qb(a.q,a.f,Nb,x(a.va,a,i)),a.M=i,T||(a.A=U(a),a.dispatchEvent(new Rb(U(a),l))),a.f.start()}else{a.M=l;var c=a.q;Wa(c.d,Gb);c.d.length=0;a.f.stop()}}r.ab=function(){this.la=i;this.N.value&&ac(this,this.N.value,i);dc(this,this.Ma)};
r.eb=function(a){a.na.persisted&&(dc(this,l),dc(this,i))};r.bb=function(){var a=fc(this.l);a!=this.A&&gc(this,a,i)};function U(a){return a.B!=j?a.B:a.t?fc(a.l):hc(a)||""}function fc(a){var a=a.location.href,b=a.indexOf("#");return 0>b?"":a.substring(b+1)}function $b(a,b,c){var d=a.l.location,a=a.Ra,f=-1!=d.href.indexOf("#");if(cc||f||b)a+="#"+b;a!=d.href&&(c?d.replace(a):d.href=a)}
function ac(a,b,c,d){if(a.Na||b!=hc(a))if(a.Na=l,b=encodeURIComponent(String(b)),D){var f=a.z.contentDocument||a.z.contentWindow.document;f.open("text/html",c?"replace":g);f.write(la(ic,B(d||a.l.document.title),b));f.close()}else if(b=a.Y+"#"+b,a=a.z.contentWindow)c?a.location.replace(b):a.location.href=b}
function hc(a){if(D)return a=a.z.contentDocument||a.z.contentWindow.document,a.body?ma(a.body.innerHTML):j;var b=a.z.contentWindow;if(b){var c;try{c=ma(fc(b))}catch(d){return a.C||(a.C!=i&&a.f.setInterval(jc),a.C=i),j}a.C&&(a.C!=l&&a.f.setInterval(Yb),a.C=l);return c||j}return j}r.va=function(a){if(this.t){var b=fc(this.l);b!=this.A&&gc(this,b,a)}if(!this.t||T)if(b=hc(this)||"",this.B==j||b==this.B)this.B=j,b!=this.A&&gc(this,b,a)};
function gc(a,b,c){a.A=a.N.value=b;a.t?(T&&ac(a,b),$b(a,b)):ac(a,b);a.dispatchEvent(new Rb(U(a),c))}r.fb=function(){this.f.stop();this.f.start()};var ec=["mousedown","keydown","mousemove"],ic="<title>%s</title><body>%s</body>",Zb='<iframe id="%s" style="display:none" %s></iframe>',Xb='<input type="text" name="%s" id="%s" style="display:none">',Wb=0,Yb=150,jc=1E4;var kc={sb:["BC","AD"],rb:["Before Christ","Anno Domini"],ub:"JFMAMJJASOND".split(""),Bb:"JFMAMJJASOND".split(""),tb:"January February March April May June July August September October November December".split(" "),Ab:"January February March April May June July August September October November December".split(" "),xb:"Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "),Db:"Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "),Hb:"Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "),
Fb:"Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "),zb:"Sun Mon Tue Wed Thu Fri Sat".split(" "),Eb:"Sun Mon Tue Wed Thu Fri Sat".split(" "),vb:"SMTWTFS".split(""),Cb:"SMTWTFS".split(""),yb:["Q1","Q2","Q3","Q4"],wb:["1st quarter","2nd quarter","3rd quarter","4th quarter"],pb:["AM","PM"],qb:["EEEE, MMMM d, y","MMMM d, y","MMM d, y","M/d/yy"],Gb:["h:mm:ss a zzzz","h:mm:ss a z","h:mm:ss a","h:mm a"],Pa:6,Ib:[5,6],Qa:5};function lc(a,b){switch(b){case 1:return 0==a%4&&(0!=a%100||0==a%400)?29:28;case 5:case 8:case 10:case 3:return 30}return 31}function mc(a,b,c){"number"==typeof a?(this.e=new Date(a,b||0,c||1),nc(this,c||1)):ea(a)?(this.e=new Date(a.getFullYear(),a.getMonth(),a.getDate()),nc(this,a.getDate())):(this.e=new Date(y()),this.e.setHours(0),this.e.setMinutes(0),this.e.setSeconds(0),this.e.setMilliseconds(0))}r=mc.prototype;r.Aa=kc.Pa;r.Ba=kc.Qa;
r.u=function(){var a=new mc(this.e);a.Aa=this.Aa;a.Ba=this.Ba;return a};r.getFullYear=function(){return this.e.getFullYear()};r.getYear=function(){return this.getFullYear()};r.getMonth=function(){return this.e.getMonth()};r.getDate=function(){return this.e.getDate()};r.getTime=function(){return this.e.getTime()};r.getUTCHours=function(){return this.e.getUTCHours()};r.set=function(a){this.e=new Date(a.getFullYear(),a.getMonth(),a.getDate())};r.setFullYear=function(a){this.e.setFullYear(a)};
r.setMonth=function(a){this.e.setMonth(a)};r.setDate=function(a){this.e.setDate(a)};
r.add=function(a){if(a.ob||a.Ya){var b=this.getMonth()+a.Ya+12*a.ob,c=this.getYear()+Math.floor(b/12),b=b%12;0>b&&(b+=12);var d=Math.min(lc(c,b),this.getDate());this.setDate(1);this.setFullYear(c);this.setMonth(b);this.setDate(d)}a.Sa&&(a=new Date((new Date(this.getYear(),this.getMonth(),this.getDate(),12)).getTime()+864E5*a.Sa),this.setDate(1),this.setFullYear(a.getFullYear()),this.setMonth(a.getMonth()),this.setDate(a.getDate()),nc(this,a.getDate()))};
r.toString=function(){return[this.getFullYear(),sa(this.getMonth()+1),sa(this.getDate())].join("")+""};function nc(a,b){a.getDate()!=b&&a.e.setUTCHours(a.e.getUTCHours()+(a.getDate()<b?1:-1))}r.valueOf=function(){return this.e.valueOf()};function oc(a){a=String(a);if(/^\s*$/.test(a)?0:/^[\],:{}\s\u2028\u2029]*$/.test(a.replace(/\\["\\\/bfnrtu]/g,"@").replace(/"[^"\\\n\r\u2028\u2029\x00-\x08\x0a-\x1f]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:[\s\u2028\u2029]*\[)+/g,"")))try{return eval("("+a+")")}catch(b){}throw Error("Invalid JSON string: "+a);};function pc(){}pc.prototype.V=j;var qc;function rc(){}A(rc,pc);function sc(a){return(a=tc(a))?new ActiveXObject(a):new XMLHttpRequest}function uc(a){var b={};tc(a)&&(b[0]=i,b[1]=i);return b}
function tc(a){if(!a.Da&&"undefined"==typeof XMLHttpRequest&&"undefined"!=typeof ActiveXObject){for(var b=["MSXML2.XMLHTTP.6.0","MSXML2.XMLHTTP.3.0","MSXML2.XMLHTTP","Microsoft.XMLHTTP"],c=0;c<b.length;c++){var d=b[c];try{return new ActiveXObject(d),a.Da=d}catch(f){}}throw Error("Could not create ActiveXObject. ActiveX might be disabled, or MSXML might not be installed");}return a.Da}qc=new rc;function vc(a){return wc(a||arguments.callee.caller,[])}
function wc(a,b){var c=[];if(0<=Va(b,a))c.push("[...circular reference...]");else if(a&&50>b.length){c.push(xc(a)+"(");for(var d=a.arguments,f=0;f<d.length;f++){0<f&&c.push(", ");var e;e=d[f];switch(typeof e){case "object":e=e?"object":"null";break;case "string":break;case "number":e=String(e);break;case "boolean":e=e?"true":"false";break;case "function":e=(e=xc(e))?e:"[fn]";break;default:e=typeof e}40<e.length&&(e=e.substr(0,40)+"...");c.push(e)}b.push(a);c.push(")\n");try{c.push(wc(a.caller,b))}catch(h){c.push("[exception trying to get caller]\n")}}else a?
c.push("[...long stack...]"):c.push("[end]");return c.join("")}function xc(a){if(yc[a])return yc[a];a=String(a);if(!yc[a]){var b=/function ([^\(]+)/.exec(a);yc[a]=b?b[1]:"[Anonymous]"}return yc[a]}var yc={};function zc(a,b,c,d,f){this.reset(a,b,c,d,f)}zc.prototype.ib=0;zc.prototype.za=j;zc.prototype.ya=j;var Ac=0;zc.prototype.reset=function(a,b,c,d,f){this.ib="number"==typeof f?f:Ac++;this.Ob=d||y();this.R=a;this.Za=b;this.Mb=c;delete this.za;delete this.ya};zc.prototype.La=function(a){this.R=a};function V(a){this.$a=a}V.prototype.ca=j;V.prototype.R=j;V.prototype.ka=j;V.prototype.Ca=j;function Bc(a,b){this.name=a;this.value=b}Bc.prototype.toString=function(){return this.name};var Cc=new Bc("SEVERE",1E3),Dc=new Bc("WARNING",900),Ec=new Bc("CONFIG",700),Fc=new Bc("FINE",500);r=V.prototype;r.getParent=function(){return this.ca};r.Ua=function(){this.ka||(this.ka={});return this.ka};r.La=function(a){this.R=a};
function Gc(a){if(a.R)return a.R;if(a.ca)return Gc(a.ca);Oa("Root logger has no level set.");return j}r.log=function(a,b,c){if(a.value>=Gc(this).value){a=this.Va(a,b,c);b="log:"+a.Za;s.console&&(s.console.timeStamp?s.console.timeStamp(b):s.console.markTimeline&&s.console.markTimeline(b));s.msWriteProfilerMark&&s.msWriteProfilerMark(b);for(b=this;b;){var c=b,d=a;if(c.Ca)for(var f=0,e=g;e=c.Ca[f];f++)e(d);b=b.getParent()}}};
r.Va=function(a,b,c){var d=new zc(a,String(b),this.$a);if(c){d.za=c;var f;var e=arguments.callee.caller;try{var h;var n=ba("window.location.href");if(v(c))h={message:c,name:"Unknown error",lineNumber:"Not available",fileName:n,stack:"Not available"};else{var k,m,p=l;try{k=c.lineNumber||c.Lb||"Not available"}catch(q){k="Not available",p=i}try{m=c.fileName||c.filename||c.sourceURL||n}catch(t){m="Not available",p=i}h=p||!c.lineNumber||!c.fileName||!c.stack?{message:c.message,name:c.name,lineNumber:k,
fileName:m,stack:c.stack||"Not available"}:c}f="Message: "+B(h.message)+'\nUrl: <a href="view-source:'+h.fileName+'" target="_new">'+h.fileName+"</a>\nLine: "+h.lineNumber+"\n\nBrowser stack:\n"+B(h.stack+"-> ")+"[end]\n\nJS stack traversal:\n"+B(vc(e)+"-> ")}catch(z){f="Exception trying to expose exception! You win, we lose. "+z}d.ya=f}return d};function W(a,b){a.log(Fc,b,g)}var Hc={},Ic=j;
function Jc(a){Ic||(Ic=new V(""),Hc[""]=Ic,Ic.La(Ec));var b;if(!(b=Hc[a])){b=new V(a);var c=a.lastIndexOf("."),d=a.substr(c+1),c=Jc(a.substr(0,c));c.Ua()[d]=b;b.ca=c;Hc[a]=b}return b};function Kc(a){N.call(this);this.headers=new eb;this.J=a||j}A(Kc,Kb);Kc.prototype.j=Jc("goog.net.XhrIo");var Lc=/^https?$/i,Mc=[];function Nc(a){a.K();Xa(Mc,a)}r=Kc.prototype;r.o=l;r.b=j;r.ia=j;r.aa="";r.Fa="";r.P=0;r.Q="";r.ma=l;r.Z=l;r.pa=l;r.r=l;r.T=0;r.s=j;r.Ka="";r.nb=l;
r.send=function(a,b,c,d){if(this.b)throw Error("[goog.net.XhrIo] Object is active with another request="+this.aa+"; newUri="+a);b=b?b.toUpperCase():"GET";this.aa=a;this.Q="";this.P=0;this.Fa=b;this.ma=l;this.o=i;this.b=this.J?sc(this.J):sc(qc);this.ia=this.J?this.J.V||(this.J.V=uc(this.J)):qc.V||(qc.V=uc(qc));this.b.onreadystatechange=x(this.Ia,this);try{W(this.j,X(this,"Opening Xhr")),this.pa=i,this.b.open(b,a,i),this.pa=l}catch(f){W(this.j,X(this,"Error opening Xhr: "+f.message));Oc(this,f);return}var a=
c||"",e=this.headers.u();d&&db(d,function(a,b){e.set(b,a)});d=s.FormData&&a instanceof s.FormData;"POST"==b&&(!e.v("Content-Type")&&!d)&&e.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");db(e,function(a,b){this.b.setRequestHeader(b,a)},this);this.Ka&&(this.b.responseType=this.Ka);"withCredentials"in this.b&&(this.b.withCredentials=this.nb);try{this.s&&(Mb.clearTimeout(this.s),this.s=j),0<this.T&&(W(this.j,X(this,"Will abort after "+this.T+"ms if incomplete")),this.s=Mb.setTimeout(x(this.lb,
this),this.T)),W(this.j,X(this,"Sending request")),this.Z=i,this.b.send(a),this.Z=l}catch(h){W(this.j,X(this,"Send error: "+h.message)),Oc(this,h)}};r.lb=function(){"undefined"!=typeof aa&&this.b&&(this.Q="Timed out after "+this.T+"ms, aborting",this.P=8,W(this.j,X(this,this.Q)),this.dispatchEvent("timeout"),this.abort(8))};function Oc(a,b){a.o=l;a.b&&(a.r=i,a.b.abort(),a.r=l);a.Q=b;a.P=5;Pc(a);Qc(a)}function Pc(a){a.ma||(a.ma=i,a.dispatchEvent("complete"),a.dispatchEvent("error"))}
r.abort=function(a){this.b&&this.o&&(W(this.j,X(this,"Aborting")),this.o=l,this.r=i,this.b.abort(),this.r=l,this.P=a||7,this.dispatchEvent("complete"),this.dispatchEvent("abort"),Qc(this))};r.g=function(){this.b&&(this.o&&(this.o=l,this.r=i,this.b.abort(),this.r=l),Qc(this,i));Kc.H.g.call(this)};r.Ia=function(){!this.pa&&!this.Z&&!this.r?this.cb():Rc(this)};r.cb=function(){Rc(this)};
function Rc(a){if(a.o&&"undefined"!=typeof aa)if(a.ia[1]&&4==Sc(a)&&2==Tc(a))W(a.j,X(a,"Local request error detected and ignored"));else if(a.Z&&4==Sc(a))Mb.setTimeout(x(a.Ia,a),0);else if(a.dispatchEvent("readystatechange"),4==Sc(a)){W(a.j,X(a,"Request complete"));a.o=l;try{var b=Tc(a),c,d;a:switch(b){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:d=i;break a;default:d=l}if(!(c=d)){var f;if(f=0===b){var e=String(a.aa).match(Pa)[1]||j;if(!e&&self.location)var h=self.location.protocol,
e=h.substr(0,h.length-1);f=!Lc.test(e?e.toLowerCase():"")}c=f}if(c)a.dispatchEvent("complete"),a.dispatchEvent("success");else{a.P=6;var n;try{n=2<Sc(a)?a.b.statusText:""}catch(k){W(a.j,"Can not get status: "+k.message),n=""}a.Q=n+" ["+Tc(a)+"]";Pc(a)}}finally{Qc(a)}}}
function Qc(a,b){if(a.b){var c=a.b,d=a.ia[0]?ca:j;a.b=j;a.ia=j;a.s&&(Mb.clearTimeout(a.s),a.s=j);b||a.dispatchEvent("ready");try{c.onreadystatechange=d}catch(f){a.j.log(Cc,"Problem encountered resetting onreadystatechange: "+f.message,g)}}}function Sc(a){return a.b?a.b.readyState:0}function Tc(a){try{return 2<Sc(a)?a.b.status:-1}catch(b){return a.j.log(Dc,"Can not get status: "+b.message,g),-1}}function X(a,b){return b+" ["+a.Fa+" "+a.aa+" "+Tc(a)+"]"};var Y=j,Uc=[];function Vc(a){for(var a=a.split(";"),b={},c=0,d;d=a[c++];)if(!(0>d.indexOf(":"))){var f=d.indexOf(":");0>f||(b[d.substring(0,f)]=d.substring(f+1))}return b}function Wc(a,b){return a.I>b.I?1:a.I==b.I?0:-1}function Xc(a,b){return(0<=a.X.indexOf("Final")?1:0)-(0<=b.X.indexOf("Final")?1:0)}function Yc(a,b){return b.ta-a.ta}
function Zc(){function a(){var a;try{var b;b=this.b?oc(this.b.responseText):g;a=b.lastUpdate;Uc=b.scores}catch(c){window.console.log(c),window.console.log("Could not load data; drawing a blank page."),a=(new Date).getTime()/1E3,Uc=[]}b=Vc(U(Y)).sort;$c(b?b.split(","):[]);document.getElementById("updatetime").innerHTML=new Date(1E3*a)}var b;if(!(b=Vc(U(Y)).week)){var c=new mc,d=c.getDate();b=c.getFullYear();for(c=c.getMonth()-1;0<=c;c--)d+=lc(b,c);b=Math.floor((d-247)/7)+1}d=gb;if(!(""+b).match(/^\d+$/))throw"Invalid week number: "+
b;d=new d("week"+b+".json");K(d);b=Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^y()).toString(36);K(d);d.p.set("zx",b);d=d.toString();b=new Kc;Mc.push(b);a&&R(b,"complete",a);R(b,"ready",ja(Nc,b));b.T=Math.max(0,6E4);b.send(d,g,g,g)}
function $c(a){var b=Uc,a=a||[];0==a.length&&(a=["active","score"]);var b=b.map(ad).map(function(a){var b=a,a=b;if("proj"==(Vc(U(Y)).score||"proj")){var c=b;a:{var b=""+b.game_time,d=b.match(/([^ ]*) ([1-4]).. Qtr/);if(d)b=d[2],d=d[1],-1<d.indexOf(":")?(d=d.split(":"),d=60*parseInt(d[0],10)+parseInt(d[1],10)):d=0;else if(-1<b.toLowerCase().indexOf("half"))b=2,d=0;else{b=1;break a}b=(900*b-d)/3600}var d=[],k;for(k in c)d[k]=k in bd&&1>b?Math.round(parseInt(c[k],10)+(1-b)*bd[k]):c[k];b=d}k=b;c=k.pass_yards;
100>c?(c=25,d="under 100"):150>c?(c=12,d="under 150"):200>c?(c=6,d="under 200"):300>c?(c=0,d="under 300"):350>c?(c=-6,d="300+"):400>c?(c=-9,d="350+"):(c=-12,d="400+");var c=new Z(c,d+" passing yards"),d=k.completions/k.attempts,m;0.3>d?(d=25,m="under 30%"):0.4>d?(d=15,m="under 40%"):0.5>d?(d=5,m="under 50%"):(d=0,m="50%+");d=new Z(d,m+" completion rate");m=k.interceptions_notd+k.interceptions_td+k.fumbles_lost_notd+k.fumbles_lost_td;var p=0;3==m?p=12:4==m?p=16:5==m?p=24:5<m&&(p=25*(m-4));c=[$(25,
k.interceptions_td,"INT returned for TD"),$(5,k.interceptions_notd,"INT"),$(25,k.fumbles_lost_td,"fumble lost for TD"),$(5,k.fumbles_lost_notd,"fumble lost"),$(2,k.fumbles_kept,"fumble kept"),new Z(p,m+"-turnover game"),new Z(0==k.pass_tds+k.rush_tds?10:3>k.pass_tds+k.rush_tds?0:3==k.pass_tds+k.rush_tds?-5:4==k.pass_tds+k.rush_tds?-10:-20,k.pass_tds+k.rush_tds+"-touchdown game"),c,d,$(20,k.safeties,"QB at fault for safety"),$(35,k.benchings,"QB benched")];25>k.long_pass&&c.push(new Z(10,"no pass of 25+ yards"));
75<=k.rush_yards&&c.push(new Z(-8,"75+ rushing yards"));k.game_losing_taint&&c.push(new Z(50,"game-losing pick six in OT"));k=c.filter(function(a){return 0!=a.ea});return new cd(b.team,b.game_time,ta(a.completions+"/"+a.attempts+", ",a.pass_yards+" yd, ",a.pass_tds+" TD, ",a.interceptions_td+a.interceptions_notd+" INT"),k)}),c=a.length-1;for(;0<=c;c--){var d;"team"==a[c]?d=Wc:"active"==a[c]?d=Xc:"score"==a[c]&&(d=Yc);d&&ab(b,d)}d=b.map(function(a){for(var b=[],c=0,d;d=a.hb[c++];)0!=d.ea&&b.push('<tr class="scorerow">  <td class="scoredesc">'+
d.description+'</td>  <td class="scorepoints">'+dd(d.ea)+"</td></tr>");a=['<div class="team'+(0<=a.X.indexOf("Final")?"":" active")+'">','  <div class="teamheader">','    <img class="teamlogo" src="images/'+a.I+'.png" ','        width="48" height="32">','    <span class="teamname">'+a.I+"</span>",'    <span class="teampoints">'+dd(a.ta)+"</span>","  </div>",'  <div class="statline">'+a.jb+"</div>",'  <div class="gamestatus">'+a.X+"</div>",'  <table class="scoretable">'];a=a.concat(b);a=a.concat(["  </table>",
"</div>"]);return a.join("\n")});document.getElementById("bqblscores").innerHTML="";for(a=0;a<d.length;a++)document.getElementById("bqblscores").innerHTML+=d[a]}function ad(a){for(var b in a)if(v(a[b])){var c;c=a[b];var d=Number(c);c=0==d&&/^[\s\xa0]*$/.test(c)?NaN:d;isNaN(c)||(a[b]=c)}return a}function cd(a,b,c,d){this.I=a;this.X=b;this.jb=c;this.hb=d;this.ta=d.map(function(a){return a.ea}).reduce(function(a,b){return a+b},0)}function Z(a,b){this.ea=a;this.description=b}
function dd(a){return 0>a?'<span class="neg">&minus;'+-1*a+"</span>":0<a?"+"+a:""+a}function $(a,b,c){1!=b&&(c=b+"x "+c);return new Z(b*a,c)}var bd={pass_yards:250,pass_tds:1.6,completions:22,attempts:35,long_pass:40};ka("bqbl.init",function(){Y=new S;dc(Y,i);R(Y,"navigate",function(a){var a=Vc(a.mb).sort,b=[];a&&(b=a.split(","));setTimeout(function(){$c(b)},0)})});ka("bqbl.loadAndUpdate",Zc);
ka("bqbl.registerListeners",function(){function a(a,b,c){a&&R(a,wb,function(a){var d=Vc(U(Y)),e;for(e in b)d[e]=b[e];e=Y;var f=[],t;for(t in d)f.push(t+":"+d[t]);d=f.join(";");U(e)!=d&&(e.t?($b(e,d,l),bc||D&&ac(e,d,l,g),e.M&&e.va(l)):(ac(e,d,l),e.B=e.A=e.N.value=d,e.dispatchEvent(new Rb(d,l))));c&&Zc();a.preventDefault()})}a(document.getElementById("sortbyactive"),{sort:["active","team"]});a(document.getElementById("sortbyscore"),{sort:["score","team"]});a(document.getElementById("sortbyteam"),{sort:["team"]});
var b=document.getElementById("weekselectors");b.appendChild(document.createTextNode("Week: "));for(var c=1;17>=c;c++){var d=Vb("a",{href:"#"},document.createTextNode(""+c));b.appendChild(d);if(17!=c){var f=Vb("span");f.innerHTML="&nbsp;&middot;&nbsp;";b.appendChild(f)}a(d,{week:c},i)}a(document.getElementById("scoresreal"),{score:"real"});a(document.getElementById("scoresprojected"),{score:"proj"})});ka("bqbl.startUpdating",function(a){function b(){Zc();window.setTimeout(b,a||3E5)}b()});
