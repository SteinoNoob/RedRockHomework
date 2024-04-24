/** Support IE9+, Chrome, Firefox, Edge, Safari, & so on
*   Release Date: 20/4/2020, 01:04
*   Go F*ck with your sh*t-like IE!!
*/
(function (window, undefined) {
    "use strict";
	Math.root=function (x,y) {
		var num=Math.pow(1/x,-1/y), lang=Math.round(num)-num;
			if (Math.abs(lang)<1e-16) return Math.round(num);
			else if (x<0 && y%2===1) return -Math.pow(1/-x,-1/y);
			else if (x<0 && y%2===0) throw new Error("负数没有平方根");
			else return num;
	};
	Math.variance=function () {
		var number=0,arr=[];
			for (var t=0;t<arguments.length;t++) { arr.push(arguments[t]); }
			for (var i=0;i<arr.length;i++) { number+=Math.pow(arr[i]-arr.avg(),2); }
		return number/arguments.length;		
	};
	Math.fact=function (num) {
		if (num===0||num===1) return 1;
		if (num<0) throw new Error("计算无效");
		return num*this.fact(num-1);		
	};
	Number.prototype.exFixed=function (x) {
		return Math.round((this + Math.pow(2,-52)) * Math.pow(10,x)) / Math.pow(10,x);
	}; 
	Array.prototype.avg=function () {
		var x=0;
			for (var u=0;u<this.length;u++) { x+=this[u]; }
		return (Math.abs(Math.round(x)-x)<1e-16) ? Math.round(x)/this.length : x/this.length;
	};
	String.prototype.CaeserRotate=function (num=13) {
		var arr=this.split(""),
			obj_skip={32:" ",33:"!",34:"\"",38:"&",39:"\'",44:",",45:"-",46:".",58:":",63:"?",126:"~"};//处理标点符号
			for (var i=0;i<arr.length;i++) {
				var code=arr[i].charCodeAt(0);
				if (arr[i]===obj_skip[code]) continue;
				var trans=code<=90 ? (code+num>90 ? code+num-90+64 : code+num) : (code+num>122 ? code+num-122+96 : code+num);//处理小写or大写字母
				arr[i]=String.fromCharCode(trans);
			}
		return arr.join("");
	};
	/**百度上找的转驼峰方法
     * @param {boolean} mode*/
    String.prototype.toHump = function (mode) {
        var exp = (mode === true) ? new RegExp(/\-(\w)/g) : new RegExp(/\_(\w)/g);
        return this.replace(exp, function ($, $1) { return $1.toUpperCase(); });
    };
    /**首字母大写
     * @return {string}*/
    String.prototype.firstUpp = function () {
        return this.charAt(0).toUpperCase() + this.slice(1);
    };
	String.prototype.copy=function(n){
		var f=""; 
		for (var y=0;y<n;y++) { f+=this; } return f;
	};	
	String.prototype.ban=function () {
		var words=["fuck","shit","bastard","negro","Trump","caonima"], k, str0="";
			for (k=0;k<words.length-1;k++) { str0+=words[k]+"|"; }
		var reg=new RegExp(str0 + words[words.length-1], "gi"), placer="", a=this.split(" ");
			for (k=0;k<a.length;k++) {
				a[k]=a[k].replace(reg, function (v) { return v="*".copy(v.length); });
			}
		return a.join(" ");
	};

    function isObject (obj) {
        return typeof (obj) === "object";
    };
    /**借鉴了CSDN上的Code，是".concat()"方法的优化
     * @param {array} st @param {array|ArrayLike} nd*/
    function merge (st, nd) {
        var fl = st.length, sl = nd.length, u;
        if (typeof sl === "number") {
            for (u = 0; u < sl; u++) { st[fl++] = nd[u]; }
        } else {
            while (nd[j] !== undefined) {
                st[fl++] = nd[u++];
            }
        }
        st.length = fl;
        return st;
    };
    var JQuery = function (se,context) { return new JQuery.fn.init(se,context); };
    JQuery.fn = JQuery.prototype = {
        /**core method of JQuery
         * @param {String|Document|HTMLElement} s a css selector @return {JQuery}*/
        init: function (s,context=document) {
            var arr = [], ret, blk = [], regSingEle = /^<(\w+)>$/g, reg_DOMStr = /^[\s\t\r]*<(\w+)[^\t\r]*>.*<\/\1>[\s\t\r]*$/gs;
            if (!s) { return this; }
			else if (s.nodeType) {
				JQuery.extend.call(s,JQuery.prototype);
				return s;
			}			
			else if (regSingEle.test(s)) {
				var dom = document.createElement(s.replace(regSingEle, function($, $1){ return $1; }));
				JQuery.extend.call(dom,JQuery.prototype);
				return dom;
			}
            else if(reg_DOMStr.test(s)){
                var parser=new DOMParser(), dom=parser.parseFromString(s,"text/html").querySelector("body>:first-child");
                JQuery.extend.call(dom,JQuery.prototype);
                return dom;
            }
            else if(s===window){
                this.push(window); return this;
            }
            else {
                this.selector = s;
                this.context = context;
                var eles = context.querySelectorAll(s), ret;
                for (var y = 0; y < eles.length; y++) { blk.push(eles[y].tagName.toLowerCase()); };
                for (var a = 0; a < eles.length; a++) { arr.push(eles[a]); };
                this.tag = blk;
                ret = merge(this, arr);
					for (var i=0;i<ret.length;i++) {
						JQuery.extend.call(this[i],JQuery.prototype);
					}
			return (!this.selector.match(/^#\S+[\s?>\s?|\s]\.*\w*\-*\S+$/) && this.selector.match("#")) ? ret[0] : (this.selector.match(/^#\S+[\s?>\s?|\s]\#+\w*\-*\S+$/) ? ret[0] : ret);
            }
        },
        selector: "",
        length: 0,
        push: [].push,
        sort: [].sort,
        splice: [].splice,
        each: [].forEach,
        /**get or change the inner HTML of HTML Elements
         * @param {String} msg @return {JQuery|String}*/
        ins: function (msg) {
            if (!msg && msg!=="") {
                return this.innerHTML;
            }
            else {
                this.length ? this.each(function (a) { a.innerHTML = msg; }) : this.innerHTML = msg;
                return this;
            }
        },
        hide: function () { this.css("d", "none"); return this; },
        addClass: function (clsStr) { this.length ? this.each(function (a) { a.classList.add(clsStr) }) : this.classList.add(clsStr); return this; },
        removeClass: function (clsStr) { this.length ? this.each(function (a) { a.classList.remove(clsStr) }) : this.classList.remove(clsStr); return this; },
		toggle: function (kls) { this.length ? this.each(function (a) { a.classList.toggle(kls) }) : this.classList.toggle(kls); return this; },
        /**set the stylesheets of fake JQuery object.
         * @param {String|JSON} x @returns {JQuery}*/
        css: function (x, para2=undefined) {
            var p = "";
            if (isObject(x) && para2 == undefined) {
                var prop_values = function (obj) { var a = [], i; for (i in obj) { a.push(x[i]); } return a; };
                var val = prop_values(x);
                var prop = Object.getOwnPropertyNames(x);   //return an Array
                for (var k = 0; k < prop.length; k++) {
                    this.length ? this.each(function (a) { a.style[prop[k].toHump()] = val[k] }) : this.style[prop[k].toHump()] = val[k];
                }
            } else {
                var short_list = {
                    c: "color",
                    d: "display",
                    w: "width",
                    h: "height",
                    "b-color": "backgroundColor",
                    "f-type": "fontFamily",
                    size: "fontSize",
                    during: "transitionDuration",
                    rad: "borderRadius",
                    xy: "position",
                    dress: "textDecoration",
                    o: "opacity",
                    "v-align": "verticalAlign"
                };
                p = short_list[x] || x;
                this.length ? this.each(function (a) { a.style[p.toHump(true)] = para2; }) : this.style[p.toHump(true)] = arguments[1];
            }
            return this;
        },
        toStr: function () { return this.outerHTML; },
        on: function (eve, fn, capture) {
            	this.length ? this.each(function(a){a.addEventListener(eve, fn, capture);}) : this.addEventListener(eve, fn, capture);
            return this;
        },
        attr: function (a, b) {
			if (isObject(a) && typeof b ==="undefined") {
				var prop_values = function (obj) { var blank = [], i; for (i in obj) { blank.push(a[i]); } return a; },
					val_arr = prop_values(a),
					prop = Object.getOwnPropertyNames(a);
                for (var k = 0; k < prop.length; k++) {
                    this.length ? this.each(function (a) { a.attributes[prop[k]] = val_arr[k]; }) : this.attributes[prop[k]] = val_arr[k];
                }					
			}
			else {
				this.length ? this.each(function (e) { e.setAttribute(a, b) }) : this.setAttribute(a, b);
			}
			return this;
		},
        plus: function (m) { this.length ? this.each(function (a) { a.innerHTML += m; }) : this.innerHTML += m; return this; },
        ready: function (fun) {
            return this === document ? this.addEventListener("DOMContentLoaded", fun) : null;
        },
		clicker: function (func) {
			this.on("click", func); return this;
		},
        val: function (msg) {
            if (!msg && msg!=="") {
                return this.value;
            }
            else {
                this.length ? this.each(function (a) { a.value = msg; }) : this.value = msg;
                return this;
            }
        },
        apd: function (node) {
            if (this.nodeType) {
                node.length ? node.forEach((a) => { this.appendChild(a) }) : this.appendChild(node);
            }
            return this;
        },
    }
    JQuery.version = "v1.2.2 improved by Toaru_Sucial";
    JQuery.font = function (name) {
        var a = "", h = $("head")[0], newStyle = $("<style>");
		for (var t=2;t<arguments.length;t++){ a+=",url(\""+arguments[t]+"\")"; }
		var node = "@font-face{font-family: " + name + "; src: url(\"" + arguments[1] + "\")" + a + ";}";
		h.appendChild(newStyle.ins(node));
    };
    JQuery.extend = JQuery.fn.extend = function () {
        var ftns;
        if ((ftns = arguments[0]) != null) {
            for (var nums in ftns) { this[nums] = ftns[nums]; };
        }
    };
    JQuery.fn.init.prototype = JQuery.fn;
    if (typeof window === "object" && typeof window.document === "object") {
        window.$ = window.JQuery = JQuery;
    }
})(window);