var h,aa="function"==typeof Object.defineProperties?Object.defineProperty:function(a,b,c){a!=Array.prototype&&a!=Object.prototype&&(a[b]=c.value)},m="undefined"!=typeof window&&window===this?this:"undefined"!=typeof global&&null!=global?global:this;function ba(){ba=function(){};m.Symbol||(m.Symbol=ca)}var ca=function(){var a=0;return function(b){return"jscomp_symbol_"+(b||"")+a++}}();
function da(){ba();var a=m.Symbol.iterator;a||(a=m.Symbol.iterator=m.Symbol("iterator"));"function"!=typeof Array.prototype[a]&&aa(Array.prototype,a,{configurable:!0,writable:!0,value:function(){return ea(this)}});da=function(){}}function ea(a){var b=0;return fa(function(){return b<a.length?{done:!1,value:a[b++]}:{done:!0}})}function fa(a){da();a={next:a};a[m.Symbol.iterator]=function(){return this};return a}
for(var p=m,ha=["Object","entries"],ia=0;ia<ha.length-1;ia++){var ja=ha[ia];ja in p||(p[ja]={});p=p[ja]}var ka=ha[ha.length-1],la=p[ka],ma=la?la:function(a){var b=[],c;for(c in a)Object.prototype.hasOwnProperty.call(a,c)&&b.push([c,a[c]]);return b};ma!=la&&null!=ma&&aa(p,ka,{configurable:!0,writable:!0,value:ma});var q=this;function r(a){return"string"==typeof a}
function na(a,b){a=a.split(".");var c=q;a[0]in c||!c.execScript||c.execScript("var "+a[0]);for(var d;a.length&&(d=a.shift());)a.length||void 0===b?c[d]&&c[d]!==Object.prototype[d]?c=c[d]:c=c[d]={}:c[d]=b}function oa(){}
function t(a){var b=typeof a;if("object"==b)if(a){if(a instanceof Array)return"array";if(a instanceof Object)return b;var c=Object.prototype.toString.call(a);if("[object Window]"==c)return"object";if("[object Array]"==c||"number"==typeof a.length&&"undefined"!=typeof a.splice&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("splice"))return"array";if("[object Function]"==c||"undefined"!=typeof a.call&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("call"))return"function"}else return"null";
else if("function"==b&&"undefined"==typeof a.call)return"object";return b}function u(a){return"array"==t(a)}function pa(a){var b=t(a);return"array"==b||"object"==b&&"number"==typeof a.length}function v(a){var b=typeof a;return"object"==b&&null!=a||"function"==b}var w="closure_uid_"+(1E9*Math.random()>>>0),qa=0;function ra(a,b,c){return a.call.apply(a.bind,arguments)}
function sa(a,b,c){if(!a)throw Error();if(2<arguments.length){var d=Array.prototype.slice.call(arguments,2);return function(){var c=Array.prototype.slice.call(arguments);Array.prototype.unshift.apply(c,d);return a.apply(b,c)}}return function(){return a.apply(b,arguments)}}function x(a,b,c){Function.prototype.bind&&-1!=Function.prototype.bind.toString().indexOf("native code")?x=ra:x=sa;return x.apply(null,arguments)}
function ta(a,b){var c=Array.prototype.slice.call(arguments,1);return function(){var b=c.slice();b.push.apply(b,arguments);return a.apply(this,b)}}var y=Date.now||function(){return+new Date};function z(a,b){function c(){}c.prototype=b.prototype;a.H=b.prototype;a.prototype=new c;a.prototype.constructor=a;a.ia=function(a,c,f){for(var d=Array(arguments.length-2),e=2;e<arguments.length;e++)d[e-2]=arguments[e];return b.prototype[c].apply(a,d)}};function A(){0!=ua&&(va[this[w]||(this[w]=++qa)]=this);this.G=this.G;this.o=this.o}var ua=0,va={};A.prototype.G=!1;A.prototype.N=function(){if(!this.G&&(this.G=!0,this.j(),0!=ua)){var a=this[w]||(this[w]=++qa);delete va[a]}};A.prototype.j=function(){if(this.o)for(;this.o.length;)this.o.shift()()};function wa(a){a&&"function"==typeof a.N&&a.N()};function C(a){if(Error.captureStackTrace)Error.captureStackTrace(this,C);else{var b=Error().stack;b&&(this.stack=b)}a&&(this.message=String(a))}z(C,Error);C.prototype.name="CustomError";function xa(a,b){for(var c=a.split("%s"),d="",e=Array.prototype.slice.call(arguments,1);e.length&&1<c.length;)d+=c.shift()+e.shift();return d+c.join("%s")}var ya=String.prototype.trim?function(a){return a.trim()}:function(a){return a.replace(/^[\s\xa0]+|[\s\xa0]+$/g,"")};
function za(a){if(!Aa.test(a))return a;-1!=a.indexOf("&")&&(a=a.replace(Ba,"&amp;"));-1!=a.indexOf("<")&&(a=a.replace(Ca,"&lt;"));-1!=a.indexOf(">")&&(a=a.replace(Da,"&gt;"));-1!=a.indexOf('"')&&(a=a.replace(Ea,"&quot;"));-1!=a.indexOf("'")&&(a=a.replace(Fa,"&#39;"));-1!=a.indexOf("\x00")&&(a=a.replace(Ga,"&#0;"));return a}var Ba=/&/g,Ca=/</g,Da=/>/g,Ea=/"/g,Fa=/'/g,Ga=/\x00/g,Aa=/[\x00&<>"']/,Ha=String.prototype.repeat?function(a,b){return a.repeat(b)}:function(a,b){return Array(b+1).join(a)};
function Ia(a){a=String(a);var b=a.indexOf(".");-1==b&&(b=a.length);return Ha("0",Math.max(0,2-b))+a}function Ja(a){return Array.prototype.join.call(arguments,"")}function Ka(a,b){return a<b?-1:a>b?1:0};function La(a,b){b.unshift(a);C.call(this,xa.apply(null,b));b.shift()}z(La,C);La.prototype.name="AssertionError";function D(a,b){throw new La("Failure"+(a?": "+a:""),Array.prototype.slice.call(arguments,1));};var Ma=Array.prototype.indexOf?function(a,b,c){return Array.prototype.indexOf.call(a,b,c)}:function(a,b,c){c=null==c?0:0>c?Math.max(0,a.length+c):c;if(r(a))return r(b)&&1==b.length?a.indexOf(b,c):-1;for(;c<a.length;c++)if(c in a&&a[c]===b)return c;return-1},Na=Array.prototype.forEach?function(a,b,c){Array.prototype.forEach.call(a,b,c)}:function(a,b,c){for(var d=a.length,e=r(a)?a.split(""):a,f=0;f<d;f++)f in e&&b.call(c,e[f],f,a)},Oa=Array.prototype.map?function(a,b,c){return Array.prototype.map.call(a,
b,c)}:function(a,b,c){for(var d=a.length,e=Array(d),f=r(a)?a.split(""):a,g=0;g<d;g++)g in f&&(e[g]=b.call(c,f[g],g,a));return e};function Pa(a){var b=a.length;if(0<b){for(var c=Array(b),d=0;d<b;d++)c[d]=a[d];return c}return[]}function Qa(a,b){a.sort(b||Ra)}function Sa(a,b){for(var c=Array(a.length),d=0;d<a.length;d++)c[d]={index:d,value:a[d]};var e=b||Ra;Qa(c,function(a,b){return e(a.value,b.value)||a.index-b.index});for(d=0;d<a.length;d++)a[d]=c[d].value}function Ra(a,b){return a>b?1:a<b?-1:0};var E;a:{var Ta=q.navigator;if(Ta){var Ua=Ta.userAgent;if(Ua){E=Ua;break a}}E=""}function F(a){return-1!=E.indexOf(a)};function Va(a,b,c){for(var d in a)b.call(c,a[d],d,a)}var Wa="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function Xa(a,b){for(var c,d,e=1;e<arguments.length;e++){d=arguments[e];for(c in d)a[c]=d[c];for(var f=0;f<Wa.length;f++)c=Wa[f],Object.prototype.hasOwnProperty.call(d,c)&&(a[c]=d[c])}};function Ya(a){Ya[" "](a);return a}Ya[" "]=oa;var Za=F("Opera"),G=F("Trident")||F("MSIE"),$a=F("Edge"),ab=F("Gecko")&&!(-1!=E.toLowerCase().indexOf("webkit")&&!F("Edge"))&&!(F("Trident")||F("MSIE"))&&!F("Edge"),bb=-1!=E.toLowerCase().indexOf("webkit")&&!F("Edge");function cb(){var a=q.document;return a?a.documentMode:void 0}var db;
a:{var eb="",fb=function(){var a=E;if(ab)return/rv\:([^\);]+)(\)|;)/.exec(a);if($a)return/Edge\/([\d\.]+)/.exec(a);if(G)return/\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/.exec(a);if(bb)return/WebKit\/(\S+)/.exec(a);if(Za)return/(?:Version)[ \/]?(\S+)/.exec(a)}();fb&&(eb=fb?fb[1]:"");if(G){var gb=cb();if(null!=gb&&gb>parseFloat(eb)){db=String(gb);break a}}db=eb}var hb={},H;var ib=q.document;H=ib&&G?cb()||("CSS1Compat"==ib.compatMode?parseInt(db,10):5):void 0;var jb=!G||9<=Number(H),kb;
if(kb=G){var lb;if(Object.prototype.hasOwnProperty.call(hb,"9"))lb=hb["9"];else{for(var mb=0,nb=ya(String(db)).split("."),ob=ya("9").split("."),pb=Math.max(nb.length,ob.length),qb=0;0==mb&&qb<pb;qb++){var rb=nb[qb]||"",sb=ob[qb]||"";do{var I=/(\d*)(\D*)(.*)/.exec(rb)||["","","",""],J=/(\d*)(\D*)(.*)/.exec(sb)||["","","",""];if(0==I[0].length&&0==J[0].length)break;mb=Ka(0==I[1].length?0:parseInt(I[1],10),0==J[1].length?0:parseInt(J[1],10))||Ka(0==I[2].length,0==J[2].length)||Ka(I[2],J[2]);rb=I[3];
sb=J[3]}while(0==mb)}lb=hb["9"]=0<=mb}kb=!lb}var tb=kb,ub=function(){if(!q.addEventListener||!Object.defineProperty)return!1;var a=!1,b=Object.defineProperty({},"passive",{get:function(){a=!0}});q.addEventListener("test",oa,b);q.removeEventListener("test",oa,b);return a}();function K(a,b){this.type=a;this.a=this.target=b;this.X=!0}K.prototype.preventDefault=function(){this.X=!1};function L(a,b){K.call(this,a?a.type:"");this.relatedTarget=this.a=this.target=null;this.button=this.screenY=this.screenX=this.clientY=this.clientX=0;this.key="";this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1;this.b=null;if(a){var c=this.type=a.type,d=a.changedTouches?a.changedTouches[0]:null;this.target=a.target||a.srcElement;this.a=b;if(b=a.relatedTarget){if(ab){a:{try{Ya(b.nodeName);var e=!0;break a}catch(f){}e=!1}e||(b=null)}}else"mouseover"==c?b=a.fromElement:"mouseout"==c&&(b=a.toElement);
this.relatedTarget=b;null===d?(this.clientX=void 0!==a.clientX?a.clientX:a.pageX,this.clientY=void 0!==a.clientY?a.clientY:a.pageY,this.screenX=a.screenX||0,this.screenY=a.screenY||0):(this.clientX=void 0!==d.clientX?d.clientX:d.pageX,this.clientY=void 0!==d.clientY?d.clientY:d.pageY,this.screenX=d.screenX||0,this.screenY=d.screenY||0);this.button=a.button;this.key=a.key||"";this.ctrlKey=a.ctrlKey;this.altKey=a.altKey;this.shiftKey=a.shiftKey;this.metaKey=a.metaKey;this.b=a;a.defaultPrevented&&this.preventDefault()}}
z(L,K);L.prototype.preventDefault=function(){L.H.preventDefault.call(this);var a=this.b;if(a.preventDefault)a.preventDefault();else if(a.returnValue=!1,tb)try{if(a.ctrlKey||112<=a.keyCode&&123>=a.keyCode)a.keyCode=-1}catch(b){}};var vb="closure_listenable_"+(1E6*Math.random()|0);function M(a){return!(!a||!a[vb])}var wb=0;function xb(a,b,c,d,e){this.listener=a;this.a=null;this.src=b;this.type=c;this.capture=!!d;this.K=e;this.key=++wb;this.w=this.I=!1}function yb(a){a.w=!0;a.listener=null;a.a=null;a.src=null;a.K=null};function zb(a){this.src=a;this.a={};this.b=0}function Ab(a,b,c,d,e,f){var g=b.toString();b=a.a[g];b||(b=a.a[g]=[],a.b++);var l=Bb(b,c,e,f);-1<l?(a=b[l],d||(a.I=!1)):(a=new xb(c,a.src,g,!!e,f),a.I=d,b.push(a));return a}function Cb(a,b){var c=b.type;if(c in a.a){var d=a.a[c],e=Ma(d,b),f;(f=0<=e)&&Array.prototype.splice.call(d,e,1);f&&(yb(b),0==a.a[c].length&&(delete a.a[c],a.b--))}}function Db(a,b,c,d,e){a=a.a[b.toString()];b=-1;a&&(b=Bb(a,c,d,e));return-1<b?a[b]:null}
function Bb(a,b,c,d){for(var e=0;e<a.length;++e){var f=a[e];if(!f.w&&f.listener==b&&f.capture==!!c&&f.K==d)return e}return-1};var Eb="closure_lm_"+(1E6*Math.random()|0),Fb={},Gb=0;function Hb(a,b,c,d,e){if(d&&d.once)return Ib(a,b,c,d,e);if(u(b)){for(var f=0;f<b.length;f++)Hb(a,b[f],c,d,e);return null}c=Jb(c);return M(a)?a.m(b,c,v(d)?!!d.capture:!!d,e):Kb(a,b,c,!1,d,e)}
function Kb(a,b,c,d,e,f){if(!b)throw Error("Invalid event type");var g=v(e)?!!e.capture:!!e,l=N(a);l||(a[Eb]=l=new zb(a));c=Ab(l,b,c,d,g,f);if(c.a)return c;d=Lb();c.a=d;d.src=a;d.listener=c;if(a.addEventListener)ub||(e=g),void 0===e&&(e=!1),a.addEventListener(b.toString(),d,e);else if(a.attachEvent)a.attachEvent(Mb(b.toString()),d);else throw Error("addEventListener and attachEvent are unavailable.");Gb++;return c}
function Lb(){var a=Nb,b=jb?function(c){return a.call(b.src,b.listener,c)}:function(c){c=a.call(b.src,b.listener,c);if(!c)return c};return b}function Ib(a,b,c,d,e){if(u(b)){for(var f=0;f<b.length;f++)Ib(a,b[f],c,d,e);return null}c=Jb(c);return M(a)?Ab(a.a,String(b),c,!0,v(d)?!!d.capture:!!d,e):Kb(a,b,c,!0,d,e)}function Ob(a,b,c,d,e){if(u(b))for(var f=0;f<b.length;f++)Ob(a,b[f],c,d,e);else d=v(d)?!!d.capture:!!d,c=Jb(c),M(a)?a.U(b,c,d,e):a&&(a=N(a))&&(b=Db(a,b,c,d,e))&&Pb(b)}
function Pb(a){if("number"!=typeof a&&a&&!a.w){var b=a.src;if(M(b))Cb(b.a,a);else{var c=a.type,d=a.a;b.removeEventListener?b.removeEventListener(c,d,a.capture):b.detachEvent&&b.detachEvent(Mb(c),d);Gb--;(c=N(b))?(Cb(c,a),0==c.b&&(c.src=null,b[Eb]=null)):yb(a)}}}function Mb(a){return a in Fb?Fb[a]:Fb[a]="on"+a}function Qb(a,b,c,d){var e=!0;if(a=N(a))if(b=a.a[b.toString()])for(b=b.concat(),a=0;a<b.length;a++){var f=b[a];f&&f.capture==c&&!f.w&&(f=Rb(f,d),e=e&&!1!==f)}return e}
function Rb(a,b){var c=a.listener,d=a.K||a.src;a.I&&Pb(a);return c.call(d,b)}
function Nb(a,b){if(a.w)return!0;if(!jb){if(!b)a:{b=["window","event"];for(var c=q,d;d=b.shift();)if(null!=c[d])c=c[d];else{b=null;break a}b=c}d=b;b=new L(d,this);c=!0;if(!(0>d.keyCode||void 0!=d.returnValue)){a:{var e=!1;if(0==d.keyCode)try{d.keyCode=-1;break a}catch(g){e=!0}if(e||void 0==d.returnValue)d.returnValue=!0}d=[];for(e=b.a;e;e=e.parentNode)d.push(e);e=a.type;for(var f=d.length-1;0<=f;f--)b.a=d[f],a=Qb(d[f],e,!0,b),c=c&&a;for(f=0;f<d.length;f++)b.a=d[f],a=Qb(d[f],e,!1,b),c=c&&a}return c}return Rb(a,
new L(b,this))}function N(a){a=a[Eb];return a instanceof zb?a:null}var Sb="__closure_events_fn_"+(1E9*Math.random()>>>0);function Jb(a){if("function"==t(a))return a;a[Sb]||(a[Sb]=function(b){return a.handleEvent(b)});return a[Sb]};function O(){A.call(this);this.a=new zb(this);this.$=this;this.S=null}z(O,A);O.prototype[vb]=!0;O.prototype.removeEventListener=function(a,b,c,d){Ob(this,a,b,c,d)};
function Tb(a,b){var c,d=a.S;if(d)for(c=[];d;d=d.S)c.push(d);a=a.$;d=b.type||b;if(r(b))b=new K(b,a);else if(b instanceof K)b.target=b.target||a;else{var e=b;b=new K(d,a);Xa(b,e)}e=!0;if(c)for(var f=c.length-1;0<=f;f--){var g=b.a=c[f];e=Ub(g,d,!0,b)&&e}g=b.a=a;e=Ub(g,d,!0,b)&&e;e=Ub(g,d,!1,b)&&e;if(c)for(f=0;f<c.length;f++)g=b.a=c[f],e=Ub(g,d,!1,b)&&e}
O.prototype.j=function(){O.H.j.call(this);if(this.a){var a=this.a,b=0,c;for(c in a.a){for(var d=a.a[c],e=0;e<d.length;e++)++b,yb(d[e]);delete a.a[c];a.b--}}this.S=null};O.prototype.m=function(a,b,c,d){return Ab(this.a,String(a),b,!1,c,d)};O.prototype.U=function(a,b,c,d){var e=this.a;a=String(a).toString();if(a in e.a){var f=e.a[a];b=Bb(f,b,c,d);-1<b?(yb(f[b]),Array.prototype.splice.call(f,b,1),0==f.length&&(delete e.a[a],e.b--),e=!0):e=!1}else e=!1;return e};
function Ub(a,b,c,d){b=a.a.a[String(b)];if(!b)return!0;b=b.concat();for(var e=!0,f=0;f<b.length;++f){var g=b[f];if(g&&!g.w&&g.capture==c){var l=g.listener,k=g.K||g.src;g.I&&Cb(a.a,g);e=!1!==l.call(k,d)&&e}}return e&&0!=d.X};function Vb(a,b){O.call(this);this.c=a||1;this.b=b||q;this.g=x(this.ha,this);this.i=y()}z(Vb,O);h=Vb.prototype;h.D=!1;h.f=null;function Wb(a,b){a.c=b;a.f&&a.D?(Xb(a),a.start()):a.f&&Xb(a)}h.ha=function(){if(this.D){var a=y()-this.i;0<a&&a<.8*this.c?this.f=this.b.setTimeout(this.g,this.c-a):(this.f&&(this.b.clearTimeout(this.f),this.f=null),Tb(this,"tick"),this.D&&(this.f=this.b.setTimeout(this.g,this.c),this.i=y()))}};
h.start=function(){this.D=!0;this.f||(this.f=this.b.setTimeout(this.g,this.c),this.i=y())};function Xb(a){a.D=!1;a.f&&(a.b.clearTimeout(a.f),a.f=null)}h.j=function(){Vb.H.j.call(this);Xb(this);delete this.b};var Yb=!G||9<=Number(H);var Zb={area:!0,base:!0,br:!0,col:!0,command:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0};function P(){this.a="";this.b=$b}P.prototype.l=!0;P.prototype.h=function(){return this.a};P.prototype.toString=function(){return"Const{"+this.a+"}"};function ac(a){if(a instanceof P&&a.constructor===P&&a.b===$b)return a.a;D("expected object of type Const, got '"+a+"'");return"type_error:Const"}var $b={};function bc(a){var b=new P;b.a=a;return b}bc("");function cc(){this.a="";this.b=dc}h=cc.prototype;h.l=!0;h.h=function(){return this.a};h.O=!0;h.C=function(){return 1};h.toString=function(){return"TrustedResourceUrl{"+this.a+"}"};function ec(a){if(a instanceof cc&&a.constructor===cc&&a.b===dc)return a.a;D("expected object of type TrustedResourceUrl, got '"+a+"' of type "+t(a));return"type_error:TrustedResourceUrl"}var dc={};function fc(a){var b=new cc;b.a=a;return b};function Q(){this.a="";this.b=gc}h=Q.prototype;h.l=!0;h.h=function(){return this.a};h.O=!0;h.C=function(){return 1};h.toString=function(){return"SafeUrl{"+this.a+"}"};function hc(a){if(a instanceof Q&&a.constructor===Q&&a.b===gc)return a.a;D("expected object of type SafeUrl, got '"+a+"' of type "+t(a));return"type_error:SafeUrl"}var ic=/^(?:(?:https?|mailto|ftp):|[^:/?#]*(?:[/?#]|$))/i;
function jc(a){if(a instanceof Q)return a;a=a.l?a.h():String(a);ic.test(a)||(a="about:invalid#zClosurez");return kc(a)}var gc={};function kc(a){var b=new Q;b.a=a;return b}kc("about:blank");function R(){this.a="";this.b=lc}R.prototype.l=!0;var lc={};R.prototype.h=function(){return this.a};R.prototype.toString=function(){return"SafeStyle{"+this.a+"}"};function mc(a){var b=new R;b.a=a;return b}var nc=mc("");
function oc(a){if(a instanceof Q)a='url("'+hc(a).replace(/</g,"%3c").replace(/[\\"]/g,"\\$&")+'")';else if(a instanceof P)a=ac(a);else{a=String(a);var b=a.replace(pc,"$1").replace(qc,"url");if(rc.test(b)){for(var c=b=!0,d=0;d<a.length;d++){var e=a.charAt(d);"'"==e&&c?b=!b:'"'==e&&b&&(c=!c)}b&&c?a=sc(a):(D("String value requires balanced quotes, got: "+a),a="zClosurez")}else D("String value allows only "+tc+" and simple functions, got: "+a),a="zClosurez"}return a}
var tc="[-,.\"'%_!# a-zA-Z0-9]",rc=new RegExp("^"+tc+"+$"),qc=/\b(url\([ \t\n]*)('[ -&(-\[\]-~]*'|"[ !#-\[\]-~]*"|[!#-&*-\[\]-~]*)([ \t\n]*\))/g,pc=/\b(hsl|hsla|rgb|rgba|(rotate|scale|translate)(X|Y|Z|3d)?)\([-0-9a-z.%, ]+\)/g;function sc(a){return a.replace(qc,function(a,c,d,e){var b="";d=d.replace(/^(['"])(.*)\1$/,function(a,c,d){b=c;return d});a=jc(d).h();return c+b+a+b+e})};function uc(){this.a="";this.c=vc;this.b=null}h=uc.prototype;h.O=!0;h.C=function(){return this.b};h.l=!0;h.h=function(){return this.a};h.toString=function(){return"SafeHtml{"+this.a+"}"};function wc(a){if(a instanceof uc&&a.constructor===uc&&a.c===vc)return a.a;D("expected object of type SafeHtml, got '"+a+"' of type "+t(a));return"type_error:SafeHtml"}
var xc=/^[a-zA-Z0-9-]+$/,yc={action:!0,cite:!0,data:!0,formaction:!0,href:!0,manifest:!0,poster:!0,src:!0},zc={APPLET:!0,BASE:!0,EMBED:!0,IFRAME:!0,LINK:!0,MATH:!0,META:!0,OBJECT:!0,SCRIPT:!0,STYLE:!0,SVG:!0,TEMPLATE:!0};function Ac(a,b,c){var d=String(a);if(!xc.test(d))throw Error("Invalid tag name <"+d+">.");if(d.toUpperCase()in zc)throw Error("Tag name <"+d+"> is not allowed for SafeHtml.");return Bc(String(a),b,c)}
function Cc(a){function b(a){if(u(a))Na(a,b);else{if(a instanceof uc)var e=a;else e=null,a.O&&(e=a.C()),a=za(a.l?a.h():String(a)),e=S(a,e);d+=wc(e);e=e.C();0==c?c=e:0!=e&&c!=e&&(c=null)}}var c=0,d="";Na(arguments,b);return S(d,c)}var vc={};function S(a,b){var c=new uc;c.a=a;c.b=b;return c}
function Bc(a,b,c){var d=null,e="";if(b)for(B in b){if(!xc.test(B))throw Error('Invalid attribute name "'+B+'".');var f=b[B];if(null!=f){var g=a;var l=B;var k=f;if(k instanceof P)k=ac(k);else if("style"==l.toLowerCase()){f=void 0;g=k;if(!v(g))throw Error('The "style" attribute requires goog.html.SafeStyle or map of style properties, '+typeof g+" given: "+g);if(!(g instanceof R)){k="";for(f in g){if(!/^[-_a-zA-Z0-9]+$/.test(f))throw Error("Name allows only [-_a-zA-Z0-9], got: "+f);var n=g[f];null!=
n&&(n=u(n)?Oa(n,oc).join(" "):oc(n),k+=f+":"+n+";")}g=k?mc(k):nc}g instanceof R&&g.constructor===R&&g.b===lc?f=g.a:(D("expected object of type SafeStyle, got '"+g+"' of type "+t(g)),f="type_error:SafeStyle");k=f}else{if(/^on/i.test(l))throw Error('Attribute "'+l+'" requires goog.string.Const value, "'+k+'" given.');if(l.toLowerCase()in yc)if(k instanceof cc)k=ec(k);else if(k instanceof Q)k=hc(k);else if(r(k))k=jc(k).h();else throw Error('Attribute "'+l+'" on tag "'+g+'" requires goog.html.SafeUrl, goog.string.Const, or string, value "'+
k+'" given.');}k.l&&(k=k.h());l=l+'="'+za(String(k))+'"';e+=" "+l}}var B="<"+a+e;null!=c?u(c)||(c=[c]):c=[];!0===Zb[a.toLowerCase()]?B+=">":(d=Cc(c),B+=">"+wc(d)+"</"+a+">",d=d.C());(a=b&&b.dir)&&(/^(ltr|rtl|auto)$/i.test(a)?d=0:d=null);return S(B,d)}S("<!DOCTYPE html>",0);S("",0);S("<br>",0);function Dc(a){var b=document;return r(a)?b.getElementById(a):a}function Ec(a,b){Va(b,function(b,d){b&&b.l&&(b=b.h());"style"==d?a.style.cssText=b:"class"==d?a.className=b:"for"==d?a.htmlFor=b:Fc.hasOwnProperty(d)?a.setAttribute(Fc[d],b):0==d.lastIndexOf("aria-",0)||0==d.lastIndexOf("data-",0)?a.setAttribute(d,b):a[d]=b})}
var Fc={cellpadding:"cellPadding",cellspacing:"cellSpacing",colspan:"colSpan",frameborder:"frameBorder",height:"height",maxlength:"maxLength",nonce:"nonce",role:"role",rowspan:"rowSpan",type:"type",usemap:"useMap",valign:"vAlign",width:"width"};
function Gc(a,b,c){var d=arguments,e=document,f=String(d[0]),g=d[1];if(!Yb&&g&&(g.name||g.type)){f=["<",f];g.name&&f.push(' name="',za(g.name),'"');if(g.type){f.push(' type="',za(g.type),'"');var l={};Xa(l,g);delete l.type;g=l}f.push(">");f=f.join("")}f=e.createElement(f);g&&(r(g)?f.className=g:u(g)?f.className=g.join(" "):Ec(f,g));2<d.length&&Hc(e,f,d);return f}
function Hc(a,b,c){function d(c){c&&b.appendChild(r(c)?a.createTextNode(c):c)}for(var e=2;e<c.length;e++){var f=c[e];!pa(f)||v(f)&&0<f.nodeType?d(f):Na(Ic(f)?Pa(f):f,d)}}function Jc(a){return a.contentDocument||a.contentWindow.document}function Ic(a){if(a&&"number"==typeof a.length){if(v(a))return"function"==typeof a.item||"string"==typeof a.item;if("function"==t(a))return"function"==typeof a.item}return!1};function Kc(a,b,c){"number"==typeof a?(this.a=Lc(a,b||0,c||1),Mc(this,c||1)):v(a)?(this.a=Lc(a.getFullYear(),a.getMonth(),a.getDate()),Mc(this,a.getDate())):(this.a=new Date(y()),a=this.a.getDate(),this.a.setHours(0),this.a.setMinutes(0),this.a.setSeconds(0),this.a.setMilliseconds(0),Mc(this,a))}function Lc(a,b,c){b=new Date(a,b,c);0<=a&&100>a&&b.setFullYear(b.getFullYear()-1900);return b}h=Kc.prototype;h.getFullYear=function(){return this.a.getFullYear()};h.getMonth=function(){return this.a.getMonth()};
h.getDate=function(){return this.a.getDate()};h.set=function(a){this.a=new Date(a.getFullYear(),a.getMonth(),a.getDate())};h.toString=function(){return[this.getFullYear(),Ia(this.getMonth()+1),Ia(this.getDate())].join("")+""};function Mc(a,b){a.getDate()!=b&&a.a.setUTCHours(a.a.getUTCHours()+(a.getDate()<b?1:-1))}h.valueOf=function(){return this.a.valueOf()};function T(a){A.call(this);this.b=a;this.a={}}z(T,A);var Nc=[];T.prototype.m=function(a,b,c,d){u(b)||(b&&(Nc[0]=b.toString()),b=Nc);for(var e=0;e<b.length;e++){var f=Hb(a,b[e],c||this.handleEvent,d||!1,this.b||this);if(!f)break;this.a[f.key]=f}return this};
T.prototype.U=function(a,b,c,d,e){if(u(b))for(var f=0;f<b.length;f++)this.U(a,b[f],c,d,e);else c=c||this.handleEvent,d=v(d)?!!d.capture:!!d,e=e||this.b||this,c=Jb(c),d=!!d,b=M(a)?Db(a.a,String(b),c,d,e):a?(a=N(a))?Db(a,b,c,d,e):null:null,b&&(Pb(b),delete this.a[b.key]);return this};function Oc(a){Va(a.a,function(a,c){this.a.hasOwnProperty(c)&&Pb(a)},a);a.a={}}T.prototype.j=function(){T.H.j.call(this);Oc(this)};
T.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented");};function Pc(){K.call(this,"navigate")}z(Pc,K);function Qc(){return!(F("iPad")||F("Android")&&!F("Mobile")||F("Silk"))&&(F("iPod")||F("iPhone")||F("Android")||F("IEMobile"))};function Rc(a,b){a=[a];for(var c=b.length-1;0<=c;--c)a.push(typeof b[c],b[c]);return a.join("\x0B")};function U(a,b,c,d){O.call(this);if(a&&!b)throw Error("Can't use invisible history without providing a blank page.");if(c)var e=c;else{e="history_state"+Sc;var f=Ac("input",{type:"text",name:e,id:e,style:bc("display:none")});document.write(wc(f));e=Dc(e)}this.F=e;c=c?(c=9==c.nodeType?c:c.ownerDocument||c.document)?c.parentWindow||c.defaultView:window:window;this.b=c;this.R=b;G&&!b&&(this.R="https"==window.location.protocol?fc(ac(bc("https:///"))):fc(ac(bc('javascript:""'))));this.c=new Vb(Tc);b=ta(wa,
this.c);this.G?b():(this.o||(this.o=[]),this.o.push(b));this.s=!a;this.g=new T(this);if(a||V){if(d)var g=d;else{a="history_iframe"+Sc;c=this.R;d={id:a,style:bc("display:none"),sandbox:void 0};c&&ec(c);b={};b.src=c||null;b.srcdoc=null;c={sandbox:""};e={};for(g in b)e[g]=b[g];for(g in c)e[g]=c[g];for(g in d){f=g.toLowerCase();if(f in b)throw Error('Cannot override "'+f+'" attribute, got "'+g+'" with value "'+d[g]+'"');f in c&&delete e[f];e[g]=d[g]}g=Bc("iframe",e,void 0);document.write(wc(g));g=Dc(a)}this.L=
g;this.Z=!0}V&&(this.g.m(this.b,"load",this.ba),this.Y=this.P=!1);this.s?Uc(this,W(this),!0):X(this,this.F.value);Sc++}z(U,O);U.prototype.B=!1;U.prototype.i=!1;U.prototype.u=null;var Vc=function(a,b){var c=b||Rc;return function(){var b=this||q;b=b.closure_memoize_cache_||(b.closure_memoize_cache_={});var e=c(a[w]||(a[w]=++qa),arguments);return b.hasOwnProperty(e)?b[e]:b[e]=a.apply(this,arguments)}}(function(){return G?8<=Number(H):"onhashchange"in q}),V=G&&!(8<=Number(H));h=U.prototype;h.v=null;
h.j=function(){U.H.j.call(this);this.g.N();Wc(this,!1)};function Wc(a,b){if(b!=a.B)if(V&&!a.P)a.Y=b;else if(b)if(Za?a.g.m(a.b.document,Xc,a.ea):ab&&a.g.m(a.b,"pageshow",a.da),Vc()&&a.s)a.g.m(a.b,"hashchange",a.ca),a.B=!0,Tb(a,new Pc(W(a)));else{if(!G||Qc()||a.P)a.g.m(a.c,"tick",x(a.V,a,!0)),a.B=!0,V||(a.u=W(a),Tb(a,new Pc(W(a)))),a.c.start()}else a.B=!1,Oc(a.g),Xb(a.c)}h.ba=function(){this.P=!0;this.F.value&&X(this,this.F.value,!0);Wc(this,this.Y)};
h.da=function(a){a.b.persisted&&(Wc(this,!1),Wc(this,!0))};h.ca=function(){var a=Yc(this.b);a!=this.u&&Zc(this,a)};function W(a){return null!=a.v?a.v:a.s?Yc(a.b):$c(a)||""}function Yc(a){a=a.location.href;var b=a.indexOf("#");return 0>b?"":a.substring(b+1)}function Uc(a,b,c){a=a.b.location;var d=a.href.split("#")[0],e=-1!=a.href.indexOf("#");if(V||e||b)d+="#"+b;d!=a.href&&(c?a.replace(d):a.href=d)}
function X(a,b,c,d){if(a.Z||b!=$c(a))if(a.Z=!1,b=encodeURIComponent(String(b)),G){var e=Jc(a.L);e.open("text/html",c?"replace":void 0);c=Cc(Ac("title",{},d||a.b.document.title),Ac("body",{},b));e.write(wc(c));e.close()}else if(e=ec(a.R)+"#"+b,a=a.L.contentWindow)c?a.location.replace(e):a.location.href=e}
function $c(a){if(G)return a=Jc(a.L),a.body?decodeURIComponent(a.body.innerHTML.replace(/\+/g," ")):null;var b=a.L.contentWindow;if(b){try{var c=decodeURIComponent(Yc(b).replace(/\+/g," "))}catch(d){return a.i||(1!=a.i&&Wb(a.c,ad),a.i=!0),null}a.i&&(0!=a.i&&Wb(a.c,Tc),a.i=!1);return c||null}return null}h.V=function(){if(this.s){var a=Yc(this.b);a!=this.u&&Zc(this,a)}if(!this.s||V)if(a=$c(this)||"",null==this.v||a==this.v)this.v=null,a!=this.u&&Zc(this,a)};
function Zc(a,b){a.u=a.F.value=b;a.s?(V&&X(a,b),Uc(a,b)):X(a,b);Tb(a,new Pc(W(a)))}h.ea=function(){Xb(this.c);this.c.start()};var Xc=["mousedown","keydown","mousemove"],Sc=0,Tc=150,ad=1E4;var bd=new Date(2017,8,7),cd=null,dd={},ed=null,fd="";function gd(){for(var a=W(cd).split(";"),b={},c=0,d;d=a[c++];)if(!(0>d.indexOf(":"))){var e=d.indexOf(":");0>e||(b[d.substring(0,e)]=d.substring(e+1))}return b}function hd(a,b){return a.A>b.A?1:a.A==b.A?0:-1}function id(a,b){return(0<=a.J.indexOf("Final")?1:0)-(0<=b.J.indexOf("Final")?1:0)}function jd(a,b){return b.T-a.T}
function kd(){var a;(a=gd().week)||(new Kc,a=""+Math.min(Math.floor((new Date-bd)/6048E5)+1,17));fd&&ed.ref(fd).off();fd=a="/stats/2017/"+a;ed.ref(a).on("value",function(a){document.getElementById("status").textContent="Listening for updates.";(a=a.val())&&a instanceof Object&&(dd=a,ld())})}function ld(){var a=gd().sort;a=a?a.split(","):[];md(a);document.getElementById("updatetime").textContent=new Date}
function md(a){var b=dd;a=a||[];0==a.length&&(a=["active","score"]);b=Object.entries(b).map(function(a){da();var b=(b=a[Symbol.iterator])?b.call(a):ea(a);a=b.next().value;b=b.next().value;var c=nd(b);b=c;if("proj"==(gd().score||"proj")){a:{var d=""+c.CLOCK;var e=d.match(/([^ ]*) - ([1-4])/);if(e)d=e[2],e=e[1],-1<e.indexOf(":")?(e=e.split(":"),e=60*parseInt(e[0],10)+parseInt(e[1],10)):e=0;else if(e=d.match(/End.*([1-4])../))d=parseInt(e[1],10),e=0;else if(-1<d.toLowerCase().indexOf("half"))d=2,e=0;
else{d=1;break a}d=(900*d-e)/3600}e={};for(var n in c)e[n]=n in od&&1>d?Math.round(parseInt(c[n],10)+(1-d)*od[n]):c[n];c=nd(e)}n=pd(c);return new qd(a,c.OPP||"",c.URL||"javascript:void(0);",c.CLOCK,Ja(b.CMP+"/"+b.ATT+", ",b.PASSYD+b.SACKYD+" yd, ",b.TD+" TD, ",b.INT+" INT"),n)});for(var c=a.length-1;0<=c;c--){var d;"team"==a[c]?d=hd:"active"==a[c]?d=id:"score"==a[c]&&(d=jd);d&&Sa(b,d)}d=b.map(function(a){for(var b=[],c=0,d;d=a.fa[c++];)0!=d.M&&b.push('<tr class="scorerow">  <td class="scoredesc">'+
d.a+'</td>  <td class="scorepoints">'+rd(d.M)+"</td></tr>");c="";a.W&&(c="(vs. "+a.W+")");a=['<div class="team'+(0<=a.J.indexOf("Final")?"":" active")+'">','  <div class="teamheader">','    <img class="teamlogo" src="images/'+a.A+'.svg" ','        width="48" height="32">','    <span class="teamname">'+a.A+"</span>",'    <span class="teampoints">'+rd(a.T)+"</span>","  </div>",'  <div class="statline">'+a.ga+"</div>",'  <div class="gamestatus">','    <a href="'+a.aa+'">'+a.J+"</a>","    "+c,"  </div>",
'  <table class="scoretable">'];a=a.concat(b);a=a.concat(["  </table>","</div>"]);return a.join("\n")});document.getElementById("bqblscores").innerHTML="";for(a=0;a<d.length;a++)document.getElementById("bqblscores").innerHTML+=d[a]}function nd(a){return new Proxy(a,{get:function(a,c){if(!(c in a))return 0;var b=a[c];if(!r(b))return b;a=""+a[c];c=Number(a);a=0==c&&/^[\s\xa0]*$/.test(a)?NaN:c;return isNaN(a)?b:a}})}
function qd(a,b,c,d,e,f){this.A=a;this.W=b;this.aa=c;this.J=d;this.ga=e;this.fa=f;this.T=f.map(function(a){return a.M}).reduce(function(a,b){return a+b},0)}function Y(a,b){this.M=a;this.a=b}function rd(a){return 0>a?'<span class="neg">&minus;'+-1*a+"</span>":0<a?"+"+a:""+a}function Z(a,b,c){b=b||0;1!=b&&(c=b+"x "+c);return new Y(b*a,c)}
function pd(a){var b=[Z(25,a.INT6-a.INT6OT,"INT returned for TD"),Z(5,a.INT-a.INT6,"INT"),Z(25,a.FUM6,"fumble lost for TD"),Z(5,a.FUML-a.FUM6,"fumble lost"),Z(2,a.FUM-a.FUML,"fumble kept"),sd(a),td(a.TD),ud(a.PASSYD+a.SACKYD),vd(a.CMP,a.ATT),Z(1,a.SACK,"sacked"),Z(20,a.SAF,"QB at fault for safety"),Z(35,a.BENCH,"QB benched"),Z(20,a.FREEAGENT,"free agent starter")];25>a.LONG&&b.push(new Y(10,"no pass of 25+ yards"));75<=a.RUSHYD&&b.push(new Y(-8,"75+ rushing yards"));a.INT6OT&&b.push(new Y(50,"game-losing pick six in OT"));
return b.filter(function(a){return 0!=a.M})}function sd(a){a=a.INT+a.FUML;var b=0;3==a?b=10:4==a?b=20:5<=a&&(b=32);for(var c=6;c<=a;c++)b+=b/2;return new Y(b,a+"-turnover game")}function ud(a){if(100>a){a=25;var b="under 100"}else 150>a?(a=12,b="under 150"):200>a?(a=6,b="under 200"):300>a?(a=0,b="under 300"):350>a?(a=-6,b="300+"):400>a?(a=-9,b="350+"):(a=-12,b="400+");return new Y(a,b+" passing yards")}
function vd(a,b){a/=b;.3>a?(a=25,b="under 30%"):.4>a?(a=15,b="under 40%"):.5>a?(a=5,b="under 50%"):(a=0,b="50%+");return new Y(a,b+" completion rate")}function td(a){var b=0==a?10:3>a?0:-5;for(var c=4;c<=a;c++)b*=2;return new Y(b,a+"-touchdown game")}var od={PASSYD:250,TD:1.6,CMP:22,ATT:35,LONG:40};
na("bqbl.init",function(){firebase.initializeApp({apiKey:"AIzaSyCVbZ7U5Y4ZO-tsQpsZgIf7ROPJdpAXLuE",databaseURL:"https://bqbl-591f3.firebaseio.com"});ed=firebase.database();cd=new U;Wc(cd,!0);Hb(cd,"navigate",function(){return setTimeout(ld,0)});kd()});
na("bqbl.registerListeners",function(){function a(a,b,c){a&&Hb(a,"click",function(a){var d=gd();for(e in b)d[e]=b[e];var e=cd;var f=[],g;for(g in d)f.push(g+":"+d[g]);d=f.join(";");W(e)!=d&&(e.s?(Uc(e,d,!1),Vc()||G&&!Qc()&&X(e,d,!1,void 0),e.B&&e.V()):(X(e,d,!1),e.v=e.u=e.F.value=d,Tb(e,new Pc)));c&&kd();a.preventDefault()})}a(document.getElementById("sortbyactive"),{sort:["active","team"]});a(document.getElementById("sortbyscore"),{sort:["score","team"]});a(document.getElementById("sortbyteam"),
{sort:["team"]});var b=document.getElementById("weekselectors");b.appendChild(document.createTextNode("Week: "));for(var c=1;17>=c;c++){var d=Gc("a",{href:"#"},document.createTextNode(String(""+c)));b.appendChild(d);if(17!=c){var e=Gc("span");e.innerHTML="&nbsp;&middot;&nbsp;";b.appendChild(e)}a(d,{week:c},!0)}a(document.getElementById("scoresreal"),{score:"real"});a(document.getElementById("scoresprojected"),{score:"proj"})});
