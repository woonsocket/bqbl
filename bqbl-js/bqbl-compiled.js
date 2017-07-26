var h,aa="function"==typeof Object.defineProperties?Object.defineProperty:function(a,b,c){if(c.get||c.set)throw new TypeError("ES3 does not support getters and setters.");a!=Array.prototype&&a!=Object.prototype&&(a[b]=c.value)},ba="undefined"!=typeof window&&window===this?this:"undefined"!=typeof global?global:this;
function ca(a,b){if(b){for(var c=ba,d=a.split("."),e=0;e<d.length-1;e++){var f=d[e];f in c||(c[f]={});c=c[f]}d=d[d.length-1];e=c[d];f=b(e);f!=e&&null!=f&&aa(c,d,{configurable:!0,writable:!0,value:f})}}
ca("String.prototype.repeat",function(a){return a?a:function(a){var c;if(null==this)throw new TypeError("The 'this' value for String.prototype.repeat must not be null or undefined");c=this+"";if(0>a||1342177279<a)throw new RangeError("Invalid count value");a|=0;for(var d="";a;)if(a&1&&(d+=c),a>>>=1)c+=c;return d}});ca("Math.sign",function(a){return a?a:function(a){a=Number(a);return!a||isNaN(a)?a:0<a?1:-1}});var m=this;
function da(a,b){var c=a.split("."),d=m;c[0]in d||!d.execScript||d.execScript("var "+c[0]);for(var e;c.length&&(e=c.shift());)c.length||void 0===b?d[e]?d=d[e]:d=d[e]={}:d[e]=b}
function n(a){var b=typeof a;if("object"==b)if(a){if(a instanceof Array)return"array";if(a instanceof Object)return b;var c=Object.prototype.toString.call(a);if("[object Window]"==c)return"object";if("[object Array]"==c||"number"==typeof a.length&&"undefined"!=typeof a.splice&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("splice"))return"array";if("[object Function]"==c||"undefined"!=typeof a.call&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("call"))return"function"}else return"null";
else if("function"==b&&"undefined"==typeof a.call)return"object";return b}function q(a){return"array"==n(a)}function ea(a){var b=n(a);return"array"==b||"object"==b&&"number"==typeof a.length}function r(a){return"string"==typeof a}function fa(a){var b=typeof a;return"object"==b&&null!=a||"function"==b}var t="closure_uid_"+(1E9*Math.random()>>>0),ga=0;function ha(a,b,c){return a.call.apply(a.bind,arguments)}
function ia(a,b,c){if(!a)throw Error();if(2<arguments.length){var d=Array.prototype.slice.call(arguments,2);return function(){var c=Array.prototype.slice.call(arguments);Array.prototype.unshift.apply(c,d);return a.apply(b,c)}}return function(){return a.apply(b,arguments)}}function ja(a,b,c){ja=Function.prototype.bind&&-1!=Function.prototype.bind.toString().indexOf("native code")?ha:ia;return ja.apply(null,arguments)}
function la(a,b){var c=Array.prototype.slice.call(arguments,1);return function(){var b=c.slice();b.push.apply(b,arguments);return a.apply(this,b)}}var u=Date.now||function(){return+new Date};function v(a,b){function c(){}c.prototype=b.prototype;a.I=b.prototype;a.prototype=new c;a.prototype.constructor=a;a.qa=function(a,c,f){for(var g=Array(arguments.length-2),k=2;k<arguments.length;k++)g[k-2]=arguments[k];return b.prototype[c].apply(a,g)}};function w(a){if(Error.captureStackTrace)Error.captureStackTrace(this,w);else{var b=Error().stack;b&&(this.stack=b)}a&&(this.message=String(a))}v(w,Error);w.prototype.name="CustomError";function ma(a,b){for(var c=a.split("%s"),d="",e=Array.prototype.slice.call(arguments,1);e.length&&1<c.length;)d+=c.shift()+e.shift();return d+c.join("%s")}var na=String.prototype.trim?function(a){return a.trim()}:function(a){return a.replace(/^[\s\xa0]+|[\s\xa0]+$/g,"")};
function oa(a){if(!pa.test(a))return a;-1!=a.indexOf("&")&&(a=a.replace(qa,"&amp;"));-1!=a.indexOf("<")&&(a=a.replace(ra,"&lt;"));-1!=a.indexOf(">")&&(a=a.replace(sa,"&gt;"));-1!=a.indexOf('"')&&(a=a.replace(ta,"&quot;"));-1!=a.indexOf("'")&&(a=a.replace(ua,"&#39;"));-1!=a.indexOf("\x00")&&(a=a.replace(va,"&#0;"));return a}var qa=/&/g,ra=/</g,sa=/>/g,ta=/"/g,ua=/'/g,va=/\x00/g,pa=/[\x00&<>"']/,wa=String.prototype.repeat?function(a,b){return a.repeat(b)}:function(a,b){return Array(b+1).join(a)};
function xa(a){a=String(a);var b=a.indexOf(".");-1==b&&(b=a.length);return wa("0",Math.max(0,2-b))+a}function ya(a){return Array.prototype.join.call(arguments,"")}function za(a,b){return a<b?-1:a>b?1:0};function Aa(a,b){b.unshift(a);w.call(this,ma.apply(null,b));b.shift()}v(Aa,w);Aa.prototype.name="AssertionError";function x(a,b){throw new Aa("Failure"+(a?": "+a:""),Array.prototype.slice.call(arguments,1));};function Ca(a,b,c){for(var d in a)b.call(c,a[d],d,a)}var Da="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function Ea(a,b){for(var c,d,e=1;e<arguments.length;e++){d=arguments[e];for(c in d)a[c]=d[c];for(var f=0;f<Da.length;f++)c=Da[f],Object.prototype.hasOwnProperty.call(d,c)&&(a[c]=d[c])}};var Fa=Array.prototype.indexOf?function(a,b,c){return Array.prototype.indexOf.call(a,b,c)}:function(a,b,c){c=null==c?0:0>c?Math.max(0,a.length+c):c;if(r(a))return r(b)&&1==b.length?a.indexOf(b,c):-1;for(;c<a.length;c++)if(c in a&&a[c]===b)return c;return-1},Ga=Array.prototype.forEach?function(a,b,c){Array.prototype.forEach.call(a,b,c)}:function(a,b,c){for(var d=a.length,e=r(a)?a.split(""):a,f=0;f<d;f++)f in e&&b.call(c,e[f],f,a)};
function Ha(a){var b=a.length;if(0<b){for(var c=Array(b),d=0;d<b;d++)c[d]=a[d];return c}return[]}function Ia(a,b){a.sort(b||Ja)}function Ka(a,b){for(var c=Array(a.length),d=0;d<a.length;d++)c[d]={index:d,value:a[d]};var e=b||Ja;Ia(c,function(a,b){return e(a.value,b.value)||a.index-b.index});for(d=0;d<a.length;d++)a[d]=c[d].value}function Ja(a,b){return a>b?1:a<b?-1:0};function z(){this.a="";this.b=La}z.prototype.s=!0;z.prototype.l=function(){return this.a};z.prototype.toString=function(){return"Const{"+this.a+"}"};function Ma(a){if(a instanceof z&&a.constructor===z&&a.b===La)return a.a;x("expected object of type Const, got '"+a+"'");return"type_error:Const"}var La={};function Na(a){var b=new z;b.a=a;return b};function A(){this.a="";this.b=Oa}h=A.prototype;h.s=!0;h.l=function(){return this.a};h.S=!0;h.G=function(){return 1};h.toString=function(){return"SafeUrl{"+this.a+"}"};var Pa=/^(?:(?:https?|mailto|ftp):|[^&:/?#]*(?:[/?#]|$))/i,Oa={};function Qa(a){var b=new A;b.a=a;return b}Qa("about:blank");function B(){this.a="";this.b=Ra}B.prototype.s=!0;var Ra={};B.prototype.l=function(){return this.a};B.prototype.toString=function(){return"SafeStyle{"+this.a+"}"};function Sa(a){var b=new B;b.a=a;return b}var Ta=Sa(""),Ua=/^([-,."'%_!# a-zA-Z0-9]+|(?:rgb|hsl)a?\([0-9.%, ]+\))$/;function C(){this.a="";this.b=Va}h=C.prototype;h.s=!0;h.l=function(){return this.a};h.S=!0;h.G=function(){return 1};h.toString=function(){return"TrustedResourceUrl{"+this.a+"}"};function Wa(a){if(a instanceof C&&a.constructor===C&&a.b===Va)return a.a;x("expected object of type TrustedResourceUrl, got '"+a+"' of type "+n(a));return"type_error:TrustedResourceUrl"}var Va={};function Xa(a){var b=new C;b.a=a;return b};var Ya={area:!0,base:!0,br:!0,col:!0,command:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0};var D;a:{var Za=m.navigator;if(Za){var $a=Za.userAgent;if($a){D=$a;break a}}D=""}function E(a){return-1!=D.indexOf(a)};function F(){this.a="";this.c=ab;this.b=null}h=F.prototype;h.S=!0;h.G=function(){return this.b};h.s=!0;h.l=function(){return this.a};h.toString=function(){return"SafeHtml{"+this.a+"}"};function G(a){if(a instanceof F&&a.constructor===F&&a.c===ab)return a.a;x("expected object of type SafeHtml, got '"+a+"' of type "+n(a));return"type_error:SafeHtml"}
var bb=/^[a-zA-Z0-9-]+$/,cb={action:!0,cite:!0,data:!0,formaction:!0,href:!0,manifest:!0,poster:!0,src:!0},db={APPLET:!0,BASE:!0,EMBED:!0,IFRAME:!0,LINK:!0,MATH:!0,META:!0,OBJECT:!0,SCRIPT:!0,STYLE:!0,SVG:!0,TEMPLATE:!0};function eb(a,b,c){var d=String(a);if(!bb.test(d))throw Error("Invalid tag name <"+d+">.");if(d.toUpperCase()in db)throw Error("Tag name <"+d+"> is not allowed for SafeHtml.");return fb(String(a),b,c)}
function gb(a){function b(a){if(q(a))Ga(a,b);else{var f;a instanceof F?f=a:(f=null,a.S&&(f=a.G()),a=oa(a.s?a.l():String(a)),f=H(a,f));d+=G(f);f=f.G();0==c?c=f:0!=f&&c!=f&&(c=null)}}var c=0,d="";Ga(arguments,b);return H(d,c)}var ab={};function H(a,b){var c=new F;c.a=a;c.b=b;return c}
function fb(a,b,c){var d=null,e,f="";if(b)for(e in b){if(!bb.test(e))throw Error('Invalid attribute name "'+e+'".');var g=b[e];if(null!=g){var k,l=a;k=e;if(g instanceof z)g=Ma(g);else if("style"==k.toLowerCase()){if(!fa(g))throw Error('The "style" attribute requires goog.html.SafeStyle or map of style properties, '+typeof g+" given: "+g);if(!(g instanceof B)){var l="",W=void 0;for(W in g){if(!/^[-_a-zA-Z0-9]+$/.test(W))throw Error("Name allows only [-_a-zA-Z0-9], got: "+W);var p=g[W];if(null!=p){if(p instanceof
z)p=Ma(p);else if(Ua.test(p)){for(var ka=!0,y=!0,Ba=0;Ba<p.length;Ba++){var wb=p.charAt(Ba);"'"==wb&&y?ka=!ka:'"'==wb&&ka&&(y=!y)}ka&&y||(x("String value requires balanced quotes, got: "+p),p="zClosurez")}else x("String value allows only [-,.\"'%_!# a-zA-Z0-9], rgb() and rgba(), got: "+p),p="zClosurez";l+=W+":"+p+";"}}g=l?Sa(l):Ta}g instanceof B&&g.constructor===B&&g.b===Ra?g=g.a:(x("expected object of type SafeStyle, got '"+g+"' of type "+n(g)),g="type_error:SafeStyle")}else{if(/^on/i.test(k))throw Error('Attribute "'+
k+'" requires goog.string.Const value, "'+g+'" given.');if(k.toLowerCase()in cb)if(g instanceof C)g=Wa(g);else if(g instanceof A)g instanceof A&&g.constructor===A&&g.b===Oa?g=g.a:(x("expected object of type SafeUrl, got '"+g+"' of type "+n(g)),g="type_error:SafeUrl");else if(r(g))g instanceof A||(g=g.s?g.l():String(g),Pa.test(g)||(g="about:invalid#zClosurez"),g=Qa(g)),g=g.l();else throw Error('Attribute "'+k+'" on tag "'+l+'" requires goog.html.SafeUrl, goog.string.Const, or string, value "'+g+'" given.');
}g.s&&(g=g.l());k=k+'="'+oa(String(g))+'"';f+=" "+k}}e="<"+a+f;null!=c?q(c)||(c=[c]):c=[];!0===Ya[a.toLowerCase()]?e+=">":(d=gb(c),e+=">"+G(d)+"</"+a+">",d=d.G());(a=b&&b.dir)&&(/^(ltr|rtl|auto)$/i.test(a)?d=0:d=null);return H(e,d)}H("<!DOCTYPE html>",0);H("",0);H("<br>",0);function I(){0!=hb&&(ib[this[t]||(this[t]=++ga)]=this);this.v=this.v;this.m=this.m}var hb=0,ib={};I.prototype.v=!1;I.prototype.R=function(){if(!this.v&&(this.v=!0,this.h(),0!=hb)){var a=this[t]||(this[t]=++ga);delete ib[a]}};I.prototype.h=function(){if(this.m)for(;this.m.length;)this.m.shift()()};function jb(a){a&&"function"==typeof a.R&&a.R()};var J="closure_listenable_"+(1E6*Math.random()|0),kb=0;function lb(a,b,c,d,e){this.listener=a;this.a=null;this.src=b;this.type=c;this.K=!!d;this.M=e;this.$=++kb;this.C=this.J=!1}function mb(a){a.C=!0;a.listener=null;a.a=null;a.src=null;a.M=null};function nb(a){this.src=a;this.a={};this.b=0}function ob(a,b,c,d,e){var f=b.toString();b=a.a[f];b||(b=a.a[f]=[],a.b++);var g=pb(b,c,d,e);-1<g?(a=b[g],a.J=!1):(a=new lb(c,a.src,f,!!d,e),a.J=!1,b.push(a));return a}function qb(a,b){var c=b.type;if(c in a.a){var d=a.a[c],e=Fa(d,b),f;(f=0<=e)&&Array.prototype.splice.call(d,e,1);f&&(mb(b),a.a[c].length||(delete a.a[c],a.b--))}}function rb(a,b,c,d,e){a=a.a[b.toString()];b=-1;a&&(b=pb(a,c,d,e));return-1<b?a[b]:null}
function pb(a,b,c,d){for(var e=0;e<a.length;++e){var f=a[e];if(!f.C&&f.listener==b&&f.K==!!c&&f.M==d)return e}return-1};function K(a,b){this.type=a;this.a=this.target=b;this.ba=!0}K.prototype.preventDefault=function(){this.ba=!1};function sb(a){sb[" "](a);return a}sb[" "]=function(){};var tb=E("Opera"),L=E("Trident")||E("MSIE"),ub=E("Edge"),vb=E("Gecko")&&!(-1!=D.toLowerCase().indexOf("webkit")&&!E("Edge"))&&!(E("Trident")||E("MSIE"))&&!E("Edge"),xb=-1!=D.toLowerCase().indexOf("webkit")&&!E("Edge");function yb(){var a=m.document;return a?a.documentMode:void 0}var zb;
a:{var Ab="",Bb=function(){var a=D;if(vb)return/rv\:([^\);]+)(\)|;)/.exec(a);if(ub)return/Edge\/([\d\.]+)/.exec(a);if(L)return/\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/.exec(a);if(xb)return/WebKit\/(\S+)/.exec(a);if(tb)return/(?:Version)[ \/]?(\S+)/.exec(a)}();Bb&&(Ab=Bb?Bb[1]:"");if(L){var Cb=yb();if(null!=Cb&&Cb>parseFloat(Ab)){zb=String(Cb);break a}}zb=Ab}var Db={},Eb=m.document,Fb=Eb&&L?yb()||("CSS1Compat"==Eb.compatMode?parseInt(zb,10):5):void 0;var Gb=!L||9<=Number(Fb),Hb;
if(Hb=L){var Ib;if(Object.prototype.hasOwnProperty.call(Db,"9"))Ib=Db["9"];else{for(var Jb=0,Kb=na(String(zb)).split("."),Lb=na("9").split("."),Mb=Math.max(Kb.length,Lb.length),Nb=0;!Jb&&Nb<Mb;Nb++){var Ob=Kb[Nb]||"",Pb=Lb[Nb]||"";do{var M=/(\d*)(\D*)(.*)/.exec(Ob)||["","","",""],N=/(\d*)(\D*)(.*)/.exec(Pb)||["","","",""];if(0==M[0].length&&0==N[0].length)break;Jb=za(0==M[1].length?0:parseInt(M[1],10),0==N[1].length?0:parseInt(N[1],10))||za(0==M[2].length,0==N[2].length)||za(M[2],N[2]);Ob=M[3];Pb=
N[3]}while(!Jb)}Ib=Db["9"]=0<=Jb}Hb=!Ib}var Qb=Hb;function O(a,b){K.call(this,a?a.type:"");this.b=this.a=this.target=null;if(a){this.type=a.type;this.target=a.target||a.srcElement;this.a=b;var c=a.relatedTarget;if(c&&vb)try{sb(c.nodeName)}catch(d){}this.b=a;a.defaultPrevented&&this.preventDefault()}}v(O,K);O.prototype.preventDefault=function(){O.I.preventDefault.call(this);var a=this.b;if(a.preventDefault)a.preventDefault();else if(a.returnValue=!1,Qb)try{if(a.ctrlKey||112<=a.keyCode&&123>=a.keyCode)a.keyCode=-1}catch(b){}};var Rb="closure_lm_"+(1E6*Math.random()|0),Sb={},Tb=0;
function Ub(a,b,c,d,e){if(q(b)){for(var f=0;f<b.length;f++)Ub(a,b[f],c,d,e);return null}c=Vb(c);if(a&&a[J])a=a.j(b,c,d,e);else{if(!b)throw Error("Invalid event type");var f=!!d,g=P(a);g||(a[Rb]=g=new nb(a));c=ob(g,b,c,d,e);if(!c.a){d=Wb();c.a=d;d.src=a;d.listener=c;if(a.addEventListener)a.addEventListener(b.toString(),d,f);else if(a.attachEvent)a.attachEvent(Xb(b.toString()),d);else throw Error("addEventListener and attachEvent are unavailable.");Tb++}a=c}return a}
function Wb(){var a=Yb,b=Gb?function(c){return a.call(b.src,b.listener,c)}:function(c){c=a.call(b.src,b.listener,c);if(!c)return c};return b}function Zb(a,b,c,d,e){if(q(b))for(var f=0;f<b.length;f++)Zb(a,b[f],c,d,e);else c=Vb(c),a&&a[J]?a.P(b,c,d,e):a&&(a=P(a))&&(b=rb(a,b,c,!!d,e))&&$b(b)}
function $b(a){if("number"!=typeof a&&a&&!a.C){var b=a.src;if(b&&b[J])qb(b.b,a);else{var c=a.type,d=a.a;b.removeEventListener?b.removeEventListener(c,d,a.K):b.detachEvent&&b.detachEvent(Xb(c),d);Tb--;(c=P(b))?(qb(c,a),c.b||(c.src=null,b[Rb]=null)):mb(a)}}}function Xb(a){return a in Sb?Sb[a]:Sb[a]="on"+a}function ac(a,b,c,d){var e=!0;if(a=P(a))if(b=a.a[b.toString()])for(b=b.concat(),a=0;a<b.length;a++){var f=b[a];f&&f.K==c&&!f.C&&(f=bc(f,d),e=e&&!1!==f)}return e}
function bc(a,b){var c=a.listener,d=a.M||a.src;a.J&&$b(a);return c.call(d,b)}
function Yb(a,b){if(a.C)return!0;if(!Gb){var c;if(!(c=b))a:{c=["window","event"];for(var d=m,e;e=c.shift();)if(null!=d[e])d=d[e];else{c=null;break a}c=d}e=c;c=new O(e,this);d=!0;if(!(0>e.keyCode||void 0!=e.returnValue)){a:{var f=!1;if(!e.keyCode)try{e.keyCode=-1;break a}catch(l){f=!0}if(f||void 0==e.returnValue)e.returnValue=!0}e=[];for(f=c.a;f;f=f.parentNode)e.push(f);for(var f=a.type,g=e.length-1;0<=g;g--){c.a=e[g];var k=ac(e[g],f,!0,c),d=d&&k}for(g=0;g<e.length;g++)c.a=e[g],k=ac(e[g],f,!1,c),d=
d&&k}return d}return bc(a,new O(b,this))}function P(a){a=a[Rb];return a instanceof nb?a:null}var cc="__closure_events_fn_"+(1E9*Math.random()>>>0);function Vb(a){if("function"==n(a))return a;a[cc]||(a[cc]=function(b){return a.handleEvent(b)});return a[cc]};function Q(){I.call(this);this.b=new nb(this);this.W=this;this.O=null}v(Q,I);Q.prototype[J]=!0;Q.prototype.removeEventListener=function(a,b,c,d){Zb(this,a,b,c,d)};
function dc(a,b){var c,d=a.O;if(d)for(c=[];d;d=d.O)c.push(d);var d=a.W,e=b,f=e.type||e;if(r(e))e=new K(e,d);else if(e instanceof K)e.target=e.target||d;else{var g=e,e=new K(f,d);Ea(e,g)}var g=!0,k;if(c)for(var l=c.length-1;0<=l;l--)k=e.a=c[l],g=ec(k,f,!0,e)&&g;k=e.a=d;g=ec(k,f,!0,e)&&g;g=ec(k,f,!1,e)&&g;if(c)for(l=0;l<c.length;l++)k=e.a=c[l],g=ec(k,f,!1,e)&&g}
Q.prototype.h=function(){Q.I.h.call(this);if(this.b){var a=this.b,b=0,c;for(c in a.a){for(var d=a.a[c],e=0;e<d.length;e++)++b,mb(d[e]);delete a.a[c];a.b--}}this.O=null};Q.prototype.j=function(a,b,c,d){return ob(this.b,String(a),b,c,d)};Q.prototype.P=function(a,b,c,d){var e;e=this.b;a=String(a).toString();if(a in e.a){var f=e.a[a];b=pb(f,b,c,d);-1<b?(mb(f[b]),Array.prototype.splice.call(f,b,1),f.length||(delete e.a[a],e.b--),e=!0):e=!1}else e=!1;return e};
function ec(a,b,c,d){b=a.b.a[String(b)];if(!b)return!0;b=b.concat();for(var e=!0,f=0;f<b.length;++f){var g=b[f];if(g&&!g.C&&g.K==c){var k=g.listener,l=g.M||g.src;g.J&&qb(a.b,g);e=!1!==k.call(l,d)&&e}}return e&&0!=d.ba};function R(a,b){Q.call(this);this.g=a||1;this.c=b||m;this.i=ja(this.B,this);this.o=u()}v(R,Q);R.prototype.f=!1;R.prototype.a=null;function fc(a,b){a.g=b;a.a&&a.f?(gc(a),hc(a)):a.a&&gc(a)}R.prototype.B=function(){if(this.f){var a=u()-this.o;0<a&&a<.8*this.g?this.a=this.c.setTimeout(this.i,this.g-a):(this.a&&(this.c.clearTimeout(this.a),this.a=null),dc(this,"tick"),this.f&&(this.a=this.c.setTimeout(this.i,this.g),this.o=u()))}};function hc(a){a.f=!0;a.a||(a.a=a.c.setTimeout(a.i,a.g),a.o=u())}
function gc(a){a.f=!1;a.a&&(a.c.clearTimeout(a.a),a.a=null)}R.prototype.h=function(){R.I.h.call(this);gc(this);delete this.c};function S(a){I.call(this);this.b=a;this.a={}}v(S,I);var ic=[];S.prototype.j=function(a,b,c,d){q(b)||(b&&(ic[0]=b.toString()),b=ic);for(var e=0;e<b.length;e++){var f=Ub(a,b[e],c||this.handleEvent,d||!1,this.b||this);if(!f)break;this.a[f.$]=f}return this};
S.prototype.P=function(a,b,c,d,e){if(q(b))for(var f=0;f<b.length;f++)this.P(a,b[f],c,d,e);else c=c||this.handleEvent,e=e||this.b||this,c=Vb(c),d=!!d,b=a&&a[J]?rb(a.b,String(b),c,d,e):a?(a=P(a))?rb(a,b,c,d,e):null:null,b&&($b(b),delete this.a[b.$]);return this};function jc(a){Ca(a.a,function(a,c){this.a.hasOwnProperty(c)&&$b(a)},a);a.a={}}S.prototype.h=function(){S.I.h.call(this);jc(this)};S.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented");};function kc(a,b){for(var c=[a],d=b.length-1;0<=d;--d)c.push(typeof b[d],b[d]);return c.join("\x0B")};function lc(){return!(E("iPad")||E("Android")&&!E("Mobile")||E("Silk"))&&(E("iPod")||E("iPhone")||E("Android")||E("IEMobile"))};function mc(){K.call(this,"navigate")}v(mc,K);var nc=!L||9<=Number(Fb);function oc(a){var b=document;return r(a)?b.getElementById(a):a}function pc(a,b){Ca(b,function(b,d){"style"==d?a.style.cssText=b:"class"==d?a.className=b:"for"==d?a.htmlFor=b:qc.hasOwnProperty(d)?a.setAttribute(qc[d],b):d.lastIndexOf("aria-",0)&&d.lastIndexOf("data-",0)?a[d]=b:a.setAttribute(d,b)})}
var qc={cellpadding:"cellPadding",cellspacing:"cellSpacing",colspan:"colSpan",frameborder:"frameBorder",height:"height",maxlength:"maxLength",nonce:"nonce",role:"role",rowspan:"rowSpan",type:"type",usemap:"useMap",valign:"vAlign",width:"width"};
function rc(a,b,c){var d=arguments,e=document,f=String(d[0]),g=d[1];if(!nc&&g&&(g.name||g.type)){f=["<",f];g.name&&f.push(' name="',oa(g.name),'"');if(g.type){f.push(' type="',oa(g.type),'"');var k={};Ea(k,g);delete k.type;g=k}f.push(">");f=f.join("")}f=e.createElement(f);g&&(r(g)?f.className=g:q(g)?f.className=g.join(" "):pc(f,g));2<d.length&&sc(e,f,d);return f}
function sc(a,b,c){function d(c){c&&b.appendChild(r(c)?a.createTextNode(c):c)}for(var e=2;e<c.length;e++){var f=c[e];!ea(f)||fa(f)&&0<f.nodeType?d(f):Ga(tc(f)?Ha(f):f,d)}}function uc(a){return a.contentDocument||a.contentWindow.document}function tc(a){if(a&&"number"==typeof a.length){if(fa(a))return"function"==typeof a.item||"string"==typeof a.item;if("function"==n(a))return"function"==typeof a.item}return!1};function T(a,b,c,d){Q.call(this);if(a&&!b)throw Error("Can't use invisible history without providing a blank page.");var e;if(c)e=c;else{e="history_state"+vc;var f=eb("input",{type:"text",name:e,id:e,style:Na("display:none")});document.write(G(f));e=oc(e)}this.H=e;c=c?(c=9==c.nodeType?c:c.ownerDocument||c.document)?c.parentWindow||c.defaultView:window:window;this.a=c;this.B=b;L&&!b&&(this.B="https"==window.location.protocol?Xa(Ma(Na("https:///"))):Xa(Ma(Na('javascript:""'))));this.c=new R(wc);b=la(jb,
this.c);this.v?b():(this.m||(this.m=[]),this.m.push(b));this.u=!a;this.f=new S(this);if(a||U){var g;if(d)g=d;else{a="history_iframe"+vc;c=this.B;d={id:a,style:Na("display:none"),sandbox:void 0};c&&Wa(c);b={};b.src=c||null;b.srcdoc=null;c={sandbox:""};e={};for(g in b)e[g]=b[g];for(g in c)e[g]=c[g];for(g in d){f=g.toLowerCase();if(f in b)throw Error('Cannot override "'+f+'" attribute, got "'+g+'" with value "'+d[g]+'"');f in c&&delete e[f];e[g]=d[g]}g=fb("iframe",e,void 0);document.write(G(g));g=oc(a)}this.i=
g;this.V=!0}U&&(this.f.j(this.a,"load",this.fa),this.U=this.o=!1);this.u?xc(this,V(this),!0):X(this,this.H.value);vc++}v(T,Q);T.prototype.F=!1;T.prototype.g=!1;T.prototype.w=null;var yc=function(a,b){var c=b||kc;return function(){var b=this||m,b=b.closure_memoize_cache_||(b.closure_memoize_cache_={}),e=c(a[t]||(a[t]=++ga),arguments);return b.hasOwnProperty(e)?b[e]:b[e]=a.apply(this,arguments)}}(function(){return L?8<=Number(Fb):"onhashchange"in m}),U=L&&!(8<=Number(Fb));h=T.prototype;h.A=null;
h.h=function(){T.I.h.call(this);this.f.R();zc(this,!1)};function zc(a,b){if(b!=a.F)if(U&&!a.o)a.U=b;else if(b)if(tb?a.f.j(a.a.document,Ac,a.ia):vb&&a.f.j(a.a,"pageshow",a.ha),yc()&&a.u)a.f.j(a.a,"hashchange",a.ga),a.F=!0,dc(a,new mc(V(a)));else{if(!L||lc()||a.o)a.f.j(a.c,"tick",ja(a.X,a,!0)),a.F=!0,U||(a.w=V(a),dc(a,new mc(V(a)))),hc(a.c)}else a.F=!1,jc(a.f),gc(a.c)}h.fa=function(){this.o=!0;this.H.value&&X(this,this.H.value,!0);zc(this,this.U)};
h.ha=function(a){a.b.persisted&&(zc(this,!1),zc(this,!0))};h.ga=function(){var a=Bc(this.a);a!=this.w&&Cc(this,a)};function V(a){return null!=a.A?a.A:a.u?Bc(a.a):Dc(a)||""}function Bc(a){a=a.location.href;var b=a.indexOf("#");return 0>b?"":a.substring(b+1)}function xc(a,b,c){a=a.a.location;var d=a.href.split("#")[0],e=-1!=a.href.indexOf("#");if(U||e||b)d+="#"+b;d!=a.href&&(c?a.replace(d):a.href=d)}
function X(a,b,c,d){if(a.V||b!=Dc(a))if(a.V=!1,b=encodeURIComponent(String(b)),L){var e=uc(a.i);e.open("text/html",c?"replace":void 0);c=gb(eb("title",{},d||a.a.document.title),eb("body",{},b));e.write(G(c));e.close()}else if(e=Wa(a.B)+"#"+b,a=a.i.contentWindow)c?a.location.replace(e):a.location.href=e}
function Dc(a){if(L)return a=uc(a.i),a.body?decodeURIComponent(a.body.innerHTML.replace(/\+/g," ")):null;var b=a.i.contentWindow;if(b){var c;try{c=decodeURIComponent(Bc(b).replace(/\+/g," "))}catch(d){return a.g||(1!=a.g&&fc(a.c,Ec),a.g=!0),null}a.g&&(0!=a.g&&fc(a.c,wc),a.g=!1);return c||null}return null}h.X=function(){if(this.u){var a=Bc(this.a);a!=this.w&&Cc(this,a)}if(!this.u||U)if(a=Dc(this)||"",null==this.A||a==this.A)this.A=null,a!=this.w&&Cc(this,a)};
function Cc(a,b){a.w=a.H.value=b;a.u?(U&&X(a,b),xc(a,b)):X(a,b);dc(a,new mc(V(a)))}h.ia=function(){gc(this.c);hc(this.c)};var Ac=["mousedown","keydown","mousemove"],vc=0,wc=150,Ec=1E4;var Fc={j:["BC","AD"],f:["Before Christ","Anno Domini"],g:"JFMAMJJASOND".split(""),U:"JFMAMJJASOND".split(""),m:"January February March April May June July August September October November December".split(" "),P:"January February March April May June July August September October November December".split(" "),o:"Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "),W:"Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "),oa:"Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "),
ma:"Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "),O:"Sun Mon Tue Wed Thu Fri Sat".split(" "),la:"Sun Mon Tue Wed Thu Fri Sat".split(" "),v:"SMTWTFS".split(""),V:"SMTWTFS".split(""),B:["Q1","Q2","Q3","Q4"],i:["1st quarter","2nd quarter","3rd quarter","4th quarter"],a:["AM","PM"],b:["EEEE, MMMM d, y","MMMM d, y","MMM d, y","M/d/yy"],na:["h:mm:ss a zzzz","h:mm:ss a z","h:mm:ss a","h:mm a"],c:["{1} 'at' {0}","{1} 'at' {0}","{1}, {0}","{1}, {0}"],ca:6,pa:[5,6],da:5},Gc=Fc,Gc=Fc;function Hc(a,b,c){"number"==typeof a?(this.a=Ic(a,b||0,c||1),Jc(this,c||1)):fa(a)?(this.a=Ic(a.getFullYear(),a.getMonth(),a.getDate()),Jc(this,a.getDate())):(this.a=new Date(u()),a=this.a.getDate(),this.a.setHours(0),this.a.setMinutes(0),this.a.setSeconds(0),this.a.setMilliseconds(0),Jc(this,a))}function Ic(a,b,c){b=new Date(a,b,c);0<=a&&100>a&&b.setFullYear(b.getFullYear()-1900);return b}h=Hc.prototype;h.Y=Gc.ca;h.Z=Gc.da;h.clone=function(){var a=new Hc(this.a);a.Y=this.Y;a.Z=this.Z;return a};
h.getFullYear=function(){return this.a.getFullYear()};h.getMonth=function(){return this.a.getMonth()};h.getDate=function(){return this.a.getDate()};h.getTime=function(){return this.a.getTime()};h.set=function(a){this.a=new Date(a.getFullYear(),a.getMonth(),a.getDate())};h.toString=function(){return[this.getFullYear(),xa(this.getMonth()+1),xa(this.getDate())].join("")+""};function Jc(a,b){a.getDate()!=b&&a.a.setUTCHours(a.a.getUTCHours()+(a.getDate()<b?1:-1))}h.valueOf=function(){return this.a.valueOf()};var Kc=new Date(2016,8,8),Lc=null,Mc=[],Nc=null,Oc="";function Pc(){for(var a=V(Lc).split(";"),b={},c=0,d;d=a[c++];)if(!(0>d.indexOf(":"))){var e=d.indexOf(":");0>e||(b[d.substring(0,e)]=d.substring(e+1))}return b}function Qc(a,b){return a.D>b.D?1:a.D==b.D?0:-1}function Rc(a,b){return(0<=a.L.indexOf("Final")?1:0)-(0<=b.L.indexOf("Final")?1:0)}function Sc(a,b){return b.T-a.T}
function Tc(){var a;(a=Pc().week)||(new Hc,a=""+Math.min(Math.floor((new Date-Kc)/6048E5)+1,17));Oc&&Nc.ref(Oc).off();Oc=a="/score/2016/"+a;Nc.ref(a).on("value",function(a){document.getElementById("status").textContent="Listening for updates.";(a=a.val())&&a instanceof Object&&(Mc=Object.values(a),Uc())})}function Uc(){var a=Pc().sort,a=a?a.split(","):[];Vc(a);document.getElementById("updatetime").textContent=new Date}
function Vc(a){var b=Mc;a=a||[];a.length||(a=["active","score"]);var b=b.map(Wc).map(function(a){var b=a;a=b;if("proj"==(Pc().score||"proj")){var c;a:{c=""+b.game_time;var d=c.match(/([^ ]*) - ([1-4])/);if(d)c=d[2],d=d[1],-1<d.indexOf(":")?(d=d.split(":"),d=60*parseInt(d[0],10)+parseInt(d[1],10)):d=0;else if(d=c.match(/End.*([1-4])../))c=parseInt(d[1],10),d=0;else if(-1<c.toLowerCase().indexOf("half"))c=2,d=0;else{c=1;break a}c=(900*c-d)/3600}var d={},l;for(l in b)d[l]=l in Xc&&1>c?Math.round(parseInt(b[l],
10)+(1-c)*Xc[l]):b[l];b=d}l=Yc(b);return new Zc(b.team,b.opponent||"",b.boxscore_url||"javascript:void(0);",b.game_time,ya(a.completions+"/"+a.attempts+", ",a.pass_yards+" yd, ",a.pass_tds+" TD, ",a.interceptions_td+a.interceptions_notd+" INT"),l)}),c=a.length-1;for(;0<=c;c--){var d;"team"==a[c]?d=Qc:"active"==a[c]?d=Rc:"score"==a[c]&&(d=Sc);d&&Ka(b,d)}d=b.map(function(a){for(var b=[],c=0,d;d=a.ja[c++];)d.N&&b.push('<tr class="scorerow">  <td class="scoredesc">'+d.a+'</td>  <td class="scorepoints">'+
$c(d.N)+"</td></tr>");c="";a.aa&&(c="(vs. "+a.aa+")");a=['<div class="team'+(0<=a.L.indexOf("Final")?"":" active")+'">','  <div class="teamheader">','    <img class="teamlogo" src="images/'+a.D+'.png" ','        width="48" height="32">','    <span class="teamname">'+a.D+"</span>",'    <span class="teampoints">'+$c(a.T)+"</span>","  </div>",'  <div class="statline">'+a.ka+"</div>",'  <div class="gamestatus">','    <a href="'+a.ea+'">'+a.L+"</a>","    "+c,"  </div>",'  <table class="scoretable">'];
a=a.concat(b);a=a.concat(["  </table>","</div>"]);return a.join("\n")});document.getElementById("bqblscores").innerHTML="";for(a=0;a<d.length;a++)document.getElementById("bqblscores").innerHTML+=d[a]}function Wc(a){for(var b in a)if(r(a[b])){var c;c=""+a[b];var d=Number(c);c=!d&&/^[\s\xa0]*$/.test(c)?NaN:d;isNaN(c)||(a[b]=c)}return a}function Zc(a,b,c,d,e,f){this.D=a;this.aa=b;this.ea=c;this.L=d;this.ka=e;this.ja=f;this.T=f.map(function(a){return a.N}).reduce(function(a,b){return a+b},0)}
function Y(a,b){this.N=a;this.a=b}function $c(a){return 0>a?'<span class="neg">&minus;'+-1*a+"</span>":0<a?"+"+a:""+a}function Z(a,b,c){b=b||0;1!=b&&(c=b+"x "+c);return new Y(b*a,c)}
function Yc(a){var b=[Z(25,a.interceptions_td,"INT returned for TD"),Z(5,a.interceptions_notd,"INT"),Z(25,a.fumbles_lost_td,"fumble lost for TD"),Z(5,a.fumbles_lost_notd,"fumble lost"),Z(2,a.fumbles_kept,"fumble kept"),ad(a),bd(a.pass_tds+a.rush_tds),cd(a.pass_yards),dd(a.completions,a.attempts),Z(1,a.sacks,"sacked"),Z(20,a.safeties,"QB at fault for safety"),Z(35,a.benchings,"QB benched"),Z(20,a.street_free_agent,"free agent starter")];25>a.long_pass&&b.push(new Y(10,"no pass of 25+ yards"));75<=
a.rush_yards&&b.push(new Y(-8,"75+ rushing yards"));a.game_losing_taint&&b.push(new Y(50,"game-losing pick six in OT"));return b.filter(function(a){return 0!=a.N})}function ad(a){a=a.interceptions_notd+a.interceptions_td+a.fumbles_lost_notd+a.fumbles_lost_td;var b=0;3==a?b=10:4==a?b=20:5<=a&&(b=32);for(var c=6;c<=a;c++)b+=b/2;return new Y(b,a+"-turnover game")}
function cd(a){var b;100>a?(a=25,b="under 100"):150>a?(a=12,b="under 150"):200>a?(a=6,b="under 200"):300>a?(a=0,b="under 300"):350>a?(a=-6,b="300+"):400>a?(a=-9,b="350+"):(a=-12,b="400+");return new Y(a,b+" passing yards")}function dd(a,b){var c=a/b,d;.3>c?(c=25,d="under 30%"):.4>c?(c=15,d="under 40%"):.5>c?(c=5,d="under 50%"):(c=0,d="50%+");return new Y(c,d+" completion rate")}function bd(a){var b;b=0==a?10:3>a?0:-5;for(var c=4;c<=a;c++)b*=2;return new Y(b,a+"-touchdown game")}
var Xc={pass_yards:250,pass_tds:1.6,completions:22,attempts:35,long_pass:40};da("bqbl.init",function(){firebase.initializeApp({apiKey:"AIzaSyCVbZ7U5Y4ZO-tsQpsZgIf7ROPJdpAXLuE",databaseURL:"https://bqbl-591f3.firebaseio.com"});Nc=firebase.database();Lc=new T;zc(Lc,!0);Ub(Lc,"navigate",function(){return setTimeout(Uc,0)});Tc()});
da("bqbl.registerListeners",function(){function a(a,b,c){a&&Ub(a,"click",function(a){var d=Pc(),e;for(e in b)d[e]=b[e];e=Lc;var f=[],y;for(y in d)f.push(y+":"+d[y]);d=f.join(";");V(e)!=d&&(e.u?(xc(e,d,!1),yc()||L&&!lc()&&X(e,d,!1,void 0),e.F&&e.X()):(X(e,d,!1),e.A=e.w=e.H.value=d,dc(e,new mc)));c&&Tc();a.preventDefault()})}a(document.getElementById("sortbyactive"),{sort:["active","team"]});a(document.getElementById("sortbyscore"),{sort:["score","team"]});a(document.getElementById("sortbyteam"),{sort:["team"]});
var b=document.getElementById("weekselectors");b.appendChild(document.createTextNode("Week: "));for(var c=1;17>=c;c++){var d=rc("a",{href:"#"},document.createTextNode(String(""+c)));b.appendChild(d);if(17!=c){var e=rc("span");e.innerHTML="&nbsp;&middot;&nbsp;";b.appendChild(e)}a(d,{week:c},!0)}a(document.getElementById("scoresreal"),{score:"real"});a(document.getElementById("scoresprojected"),{score:"proj"})});
