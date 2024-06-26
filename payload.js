!function () {
    var o = function () {
      var r = true;
      return function (t, e) {
        var n = r ? function () {
          if (e) {
            var r = e.apply(t, arguments);
            e = null;
            return r;
          }
        } : function () {};
        r = false;
        return n;
      };
    }();
    var f = function () {
      var r = true;
      return function (t, e) {
        var n = r ? function () {
          if (e) {
            var r = e.apply(t, arguments);
            e = null;
            return r;
          }
        } : function () {};
        r = false;
        return n;
      };
    }();
    !function () {
      !function (n, r) {
        var u = o(this, function () {
          return u.toString().search("(((.+)+)+)+$").toString().constructor(u).search("(((.+)+)+)+$");
        });
        u();
        (function () {
          f(this, function () {
            var t = new RegExp("function *\\( *\\)");
            var e = new RegExp("\\+\\+ *(?:[a-zA-Z_$][0-9a-zA-Z_$]*)", "i");
            var u = _0xc226b3("init");
            if (!t.test(u + "chain") || !e.test(u + "input")) {
              u("0");
            } else {
              _0xc226b3();
            }
          })();
        })();
        if ("object" == typeof exports && "undefined" != typeof module) {
          module.exports = r();
        } else if ("function" == typeof define && define.amd) {
          define(r);
        } else {
          (n = "undefined" != typeof globalThis ? globalThis : n || self).DisDevTool = r();
        }
      }(this, function () {
        "use strict";
  
        function A(n) {
          return (A = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (n) {
            return typeof n;
          } : function (n) {
            return n && "function" == typeof Symbol && n.constructor === Symbol && n !== Symbol.prototype ? "symbol" : typeof n;
          })(n);
        }
        function u(n, r) {
          if (!(n instanceof r)) {
            throw new TypeError("Cannot call a class as a function");
          }
        }
        function N(n, r) {
          for (var u = 0; u < r.length; u++) {
            var o = r[u];
            o.enumerable = o.enumerable || false;
            o.configurable = true;
            if ("value" in o) {
              o.writable = true;
            }
            Object.defineProperty(n, o.key, o);
          }
        }
        function n(n, r, t) {
          var u = {
            writable: false
          };
          if (r) {
            N(n.prototype, r);
          }
          if (t) {
            N(n, t);
          }
          Object.defineProperty(n, "prototype", u);
        }
        function r(n, r, t) {
          var o = {
            value: t,
            enumerable: true,
            configurable: true,
            writable: true
          };
          if (r in n) {
            Object.defineProperty(n, r, o);
          } else {
            n[r] = t;
          }
        }
        function t(n, r) {
          if ("function" != typeof r && null !== r) {
            throw new TypeError("Super expression must either be null or a function");
          }
          var u = {
            writable: false
          };
          n.prototype = Object.create(r && r.prototype, {
            constructor: {
              value: n,
              writable: true,
              configurable: true
            }
          });
          Object.defineProperty(n, "prototype", u);
          if (r) {
            T(n, r);
          }
        }
        function F(n) {
          return (F = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (n) {
            return n.__proto__ || Object.getPrototypeOf(n);
          })(n);
        }
        function T(n, r) {
          return (T = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (n, r) {
            n.__proto__ = r;
            return n;
          })(n, r);
        }
        function e(o) {
          var a = function () {
            if ("undefined" == typeof Reflect || !Reflect.construct) {
              return false;
            }
            if (Reflect.construct.sham) {
              return false;
            }
            if ("function" == typeof Proxy) {
              return true;
            }
            try {
              Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
              return true;
            } catch (n) {
              return false;
            }
          }();
          return function () {
            var t = F(o);
            var e = this;
            var u = a ? (u = F(this).constructor, Reflect.construct(t, arguments, u)) : t.apply(this, arguments);
            if (!u || "object" != typeof u && "function" != typeof u) {
              if (undefined !== u) {
                throw new TypeError("Derived constructors may only return object or undefined");
              }
              if (undefined === (u = e)) {
                throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
              }
            }
            return u;
          };
        }
        function Q(n, r) {
          if (null == r || r > n.length) {
            r = n.length;
          }
          var e = 0;
          for (var u = new Array(r); e < r; e++) {
            u[e] = n[e];
          }
          return u;
        }
        function P(t, n) {
          var o;
          var i;
          var f;
          var c;
          var a = "undefined" != typeof Symbol && t[Symbol.iterator] || t["@@iterator"];
          if (a) {
            f = true;
            c = false;
            return {
              s: function () {
                a = a.call(t);
              },
              n: function () {
                var n = a.next();
                f = n.done;
                return n;
              },
              e: function (n) {
                c = true;
                i = n;
              },
              f: function () {
                try {
                  if (!(f || null == a["return"])) {
                    a["return"]();
                  }
                } finally {
                  if (c) {
                    throw i;
                  }
                }
              }
            };
          }
          if (Array.isArray(t) || (a = function (n, r) {
            var t;
            if (n) {
              return "string" == typeof n ? Q(n, r) : "Map" === (t = "Object" === (t = Object.prototype.toString.call(n).slice(8, -1)) && n.constructor ? n.constructor.name : t) || "Set" === t ? Array.from(n) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? Q(n, r) : undefined;
            }
          }(t)) || n && t && "number" == typeof t.length) {
            if (a) {
              t = a;
            }
            o = 0;
            return {
              s: n = function () {},
              n: function () {
                var r = {
                  done: true
                };
                return o >= t.length ? r : {
                  done: false,
                  value: t[o++]
                };
              },
              e: function (n) {
                throw n;
              },
              f: n
            };
          }
          throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
        }
        var B = false;
        var o = {};
        function I(n) {
          o[n] = false;
        }
        function Y() {
          for (var n in o) if (o[n]) {
            return B = false; // originaly true
          }
          return B = false;
        }
        function K(n) {
          var r = new Date().getTime();
          n();
          return new Date().getTime() - r;
        }
        var c;
        var V = "";
        var Z = false;
        function U() {
          if (0 !== null.length) {
            var e = location.href;
            if (V === e) {
              return Z;
            }
            V = e;
            var u;
            var o = false;
            var i = P(null);
            try {
              for (i.s(); !(u = i.n()).done;) {
                var f = u.value;
                if ("string" == typeof f) {
                  if (-1 !== e.indexOf(f)) {
                    o = true;
                    break;
                  }
                } else {
                  if (f.test(e)) {
                    o = true;
                    break;
                  }
                }
              }
            } catch (n) {
              i.e(n);
            } finally {
              i.f();
            }
            return Z = o;
          }
        }
        (h = c = undefined || {})[h.Unknown = -1] = "Unknown";
        h[h.RegToString = 0] = "RegToString";
        h[h.DefineId = 1] = "DefineId";
        h[h.Size = 2] = "Size";
        h[h.DateToString = 3] = "DateToString";
        h[h.FuncToString = 4] = "FuncToString";
        h[h.Debugger = 5] = "Debugger";
        h[h.Performance = 6] = "Performance";
        h[h.DebugLib = 7] = "DebugLib";
        var _ = {
          "key": "init",
          value: function () {}
        };
        n(e1, [{
          key: "onDevToolOpen",
          value: function () {
            var t;
            console.warn("You don't have permission to use DEVTOOL!【type = ".concat(this.type, "】"));
            window.clearTimeout(n1);
            v.ondevtoolopen(this.type, i1);
            t = this.type;
            o[t] = true;
          }
        }, _]);
        var H = {
          key: "init",
          value: function () {}
        };
        var J;
        var a = e1;
        t(W, a);
        J = ""(W);
        n(W, [H, {
          key: "detect",
          value: function () {
            var t;
            if (true === (null == (t = null == (t = window.eruda) ? undefined : t._devTools) ? undefined : t._isShow) || window._vcOrigConsole && window.document.querySelector("#__vconsole.vc-toggle")) {
              this.onDevToolOpen();
            }
          }
        }], [{
          key: "isUsing",
          value: function () {
            return !!window.eruda || !!window._vcOrigConsole;
          }
        }]);
        var $ = 0;
        var n1 = 0;
        var r1 = [];
        var t1 = 0;
        function W() {
          var r = {
            type: c.DebugLib
          };
          u(this, W);
          return J.call(this, r);
        }
        function e1(n) {
          var e = n.type;
          var n = undefined === (n = n.enabled) || n;
          u(this, e1);
          this.type = c.Unknown;
          this.enabled = true;
          this.type = e;
          this.enabled = n;
          if (this.enabled) {
            r1.push(this);
            this.init();
          }
        }
        function u1(i) {
          function r() {
            s = true;
          }
          function u() {
            s = false;
          }
          var c;
          var a;
          var W;
          var s = false;
          function h() {
            (document[a] === c ? r : u)();
          }
          function y(r) {
            return function () {
              if (r) {
                r();
              }
              var n = r.apply(undefined, arguments);
              if (u) {
                u();
              }
              return n;
            };
          }
          var k = window.alert;
          var p = window.confirm;
          var x = window.prompt;
          try {
            window.alert = y(k);
            window.confirm = y(p);
            window.prompt = y(x);
          } catch (n) {}
          if (undefined !== document.hidden) {
            c = "hidden";
            W = "visibilitychange";
            a = "visibilityState";
          } else if (undefined !== document.mozHidden) {
            c = "mozHidden";
            W = "mozvisibilitychange";
            a = "mozVisibilityState";
          } else if (undefined !== document.msHidden) {
            c = "msHidden";
            W = "msvisibilitychange";
            a = "msVisibilityState";
          } else if (undefined !== document.webkitHidden) {
            c = "webkitHidden";
            W = "webkitvisibilitychange";
            a = "webkitVisibilityState";
          }
          document.removeEventListener(W, h, false);
          document.addEventListener(W, h, false);
          $ = window.setInterval(function () {
            if (!(i.isSuspend || s || U())) {
              var t;
              var e;
              var u = P(r1);
              try {
                for (u.s(); !(t = u.n()).done;) {
                  var o = t.value;
                  I(o.type);
                  o.detect(t1++);
                }
              } catch (n) {
                u.e(n);
              } finally {
                u.f();
              }
              v1();
              if ("function" == typeof document.ondevtoolclose && (e = B, !Y()) && e) {
                // document.ondevtoolclose();
              }
            }
          }, document.interval);
          n1 = setTimeout(function () {
            if (!(false || W.isUsing())) {
              o1();
            }
          }, document.stopIntervalTime);
        }
        function o1() {
          window.clearInterval($);
        }
        function i1() {
          o1();
          try {
            // window.opener = null;
            // window.open("", "_self");
            // window.close();
            // window.history.back();
          } catch (n) {
            console.log(n);
          }
          setTimeout(function () {
            window.location.href = "" || "https://theajack.github.io/disable-devtool/404.html?h=".concat(encodeURIComponent(location.host));
          }, 500);
        }
        var v = {
          md5: "",
          ondevtoolopen: i1,
          ondevtoolclose: null,
          url: "",
          timeOutUrl: "",
          tkName: "ddtk",
          interval: 500,
          disableMenu: true,
          stopIntervalTime: 5e3,
          clearIntervalWhenDevOpenTrigger: false,
          detectors: [0, 1, 3, 4, 5, 6, 7],
          clearLog: true,
          disableSelect: false,
          disableCopy: false,
          disableCut: false,
          disablePaste: false,
          ignore: null,
          disableIframeParents: true,
          "seo": true
        };
        var f1 = ["detectors", "ondevtoolclose", "ignore"];
        var c1 = {
          log: function () {},
          table: function () {},
          clear: function () {}
        };
        var b;
        var a1;
        var W1;
        var S = window.console || c1;
        function v1() {
          W1();
        }
        var s1 = function () {
          return false;
        };
        function h1(e) {
          var a = 83 .macos ? function (n, r) {
            return n.metaKey && n.altKey && (r === 73 || r === 74);
          } : function (n, r) {
            return n.ctrlKey && n.shiftKey && (r === 73 || r === 74);
          };
          var W = 83 .macos ? function (n, r) {
            return n.metaKey && n.altKey && r === 85 || n.metaKey && r === 83;
          } : function (n, r) {
            return n.ctrlKey && (r === 83 || r === 85);
          };
          e.addEventListener("keydown", function (n) {
            var t = (n = n || e.event).keyCode || n.which;
            if (t === 123 || a(n, t) || W(n, t)) {
              return d1(e, n);
            }
          }, true);
          s(e, "contextmenu");
        }
        function s(r, n) {
          r.addEventListener(n, function (n) {
            return d1(r, n);
          });
        }
        function d1(n, r) {
          if (!U() && !s1()) {
            (r = r || n.event).returnValue = false;
            r.preventDefault();
            return false;
          }
        }
        function l1(n) {
          var r = function (n, r) {
            n[r >> 5] |= 128 << r % 32;
            n[14 + (r + 64 >>> 9 << 4)] = r;
            var u = 1732584193;
            var o = -271733879;
            var i = -1732584194;
            var f = 271733878;
            for (var c = 0; c < n.length; c += 16) {
              var a = u;
              var W = o;
              var v = i;
              var s = f;
              var u = y1(o & i | ~o & f, u, o, n[c + 0], 7, -680876936);
              var f = y1(u & o | ~u & i, f, u, n[c + 1], 12, -389564586);
              var i = y1(f & u | ~f & o, i, f, n[c + 2], 17, 606105819);
              var o = y1(i & f | ~i & u, o, i, n[c + 3], 22, -1044525330);
              u = y1(o & i | ~o & f, u, o, n[c + 4], 7, -176418897);
              f = y1(u & o | ~u & i, f, u, n[c + 5], 12, 1200080426);
              i = y1(f & u | ~f & o, i, f, n[c + 6], 17, -1473231341);
              o = y1(i & f | ~i & u, o, i, n[c + 7], 22, -45705983);
              u = y1(o & i | ~o & f, u, o, n[c + 8], 7, 1770035416);
              f = y1(u & o | ~u & i, f, u, n[c + 9], 12, -1958414417);
              i = y1(f & u | ~f & o, i, f, n[c + 10], 17, -42063);
              o = y1(i & f | ~i & u, o, i, n[c + 11], 22, -1990404162);
              u = y1(o & i | ~o & f, u, o, n[c + 12], 7, 1804603682);
              f = y1(u & o | ~u & i, f, u, n[c + 13], 12, -40341101);
              i = y1(f & u | ~f & o, i, f, n[c + 14], 17, -1502002290);
              u = y1((o = y1(i & f | ~i & u, o, i, n[c + 15], 22, 1236535329)) & f | i & ~f, u, o = y1(i & f | ~i & u, o, i, n[c + 15], 22, 1236535329), n[c + 1], 5, -165796510);
              f = y1(u & i | o & ~i, f, u, n[c + 6], 9, -1069501632);
              i = y1(f & o | u & ~o, i, f, n[c + 11], 14, 643717713);
              o = y1(i & u | f & ~u, o, i, n[c + 0], 20, -373897302);
              u = y1(o & f | i & ~f, u, o, n[c + 5], 5, -701558691);
              f = y1(u & i | o & ~i, f, u, n[c + 10], 9, 38016083);
              i = y1(f & o | u & ~o, i, f, n[c + 15], 14, -660478335);
              o = y1(i & u | f & ~u, o, i, n[c + 4], 20, -405537848);
              u = y1(o & f | i & ~f, u, o, n[c + 9], 5, 568446438);
              f = y1(u & i | o & ~i, f, u, n[c + 14], 9, -1019803690);
              i = y1(f & o | u & ~o, i, f, n[c + 3], 14, -187363961);
              o = y1(i & u | f & ~u, o, i, n[c + 8], 20, 1163531501);
              u = y1(o & f | i & ~f, u, o, n[c + 13], 5, -1444681467);
              f = y1(u & i | o & ~i, f, u, n[c + 2], 9, -51403784);
              i = y1(f & o | u & ~o, i, f, n[c + 7], 14, 1735328473);
              u = y1((o = y1(i & u | f & ~u, o, i, n[c + 12], 20, -1926607734)) ^ i ^ f, u, o = y1(i & u | f & ~u, o, i, n[c + 12], 20, -1926607734), n[c + 5], 4, -378558);
              f = y1(u ^ o ^ i, f, u, n[c + 8], 11, -2022574463);
              i = y1(f ^ u ^ o, i, f, n[c + 11], 16, 1839030562);
              o = y1(i ^ f ^ u, o, i, n[c + 14], 23, -35309556);
              u = y1(o ^ i ^ f, u, o, n[c + 1], 4, -1530992060);
              f = y1(u ^ o ^ i, f, u, n[c + 4], 11, 1272893353);
              i = y1(f ^ u ^ o, i, f, n[c + 7], 16, -155497632);
              o = y1(i ^ f ^ u, o, i, n[c + 10], 23, -1094730640);
              u = y1(o ^ i ^ f, u, o, n[c + 13], 4, 681279174);
              f = y1(u ^ o ^ i, f, u, n[c + 0], 11, -358537222);
              i = y1(f ^ u ^ o, i, f, n[c + 3], 16, -722521979);
              o = y1(i ^ f ^ u, o, i, n[c + 6], 23, 76029189);
              u = y1(o ^ i ^ f, u, o, n[c + 9], 4, -640364487);
              f = y1(u ^ o ^ i, f, u, n[c + 12], 11, -421815835);
              i = y1(f ^ u ^ o, i, f, n[c + 15], 16, 530742520);
              u = y1(i ^ ((o = y1(i ^ f ^ u, o, i, n[c + 2], 23, -995338651)) | ~f), u, o = y1(i ^ f ^ u, o, i, n[c + 2], 23, -995338651), n[c + 0], 6, -198630844);
              f = y1(o ^ (u | ~i), f, u, n[c + 7], 10, 1126891415);
              i = y1(u ^ (f | ~o), i, f, n[c + 14], 15, -1416354905);
              o = y1(f ^ (i | ~u), o, i, n[c + 5], 21, -57434055);
              u = y1(i ^ (o | ~f), u, o, n[c + 12], 6, 1700485571);
              f = y1(o ^ (u | ~i), f, u, n[c + 3], 10, -1894986606);
              i = y1(u ^ (f | ~o), i, f, n[c + 10], 15, -1051523);
              o = y1(f ^ (i | ~u), o, i, n[c + 1], 21, -2054922799);
              u = y1(i ^ (o | ~f), u, o, n[c + 8], 6, 1873313359);
              f = y1(o ^ (u | ~i), f, u, n[c + 15], 10, -30611744);
              i = y1(u ^ (f | ~o), i, f, n[c + 6], 15, -1560198380);
              o = y1(f ^ (i | ~u), o, i, n[c + 13], 21, 1309151649);
              u = y1(i ^ (o | ~f), u, o, n[c + 4], 6, -145523070);
              f = y1(o ^ (u | ~i), f, u, n[c + 11], 10, -1120210379);
              i = y1(u ^ (f | ~o), i, f, n[c + 2], 15, 718787259);
              o = y1(f ^ (i | ~u), o, i, n[c + 9], 21, -343485551);
              u = x(u, a);
              o = x(o, W);
              i = x(i, v);
              f = x(f, s);
            }
            return Array(u, o, i, f);
          }(function (n) {
            var t = Array();
            for (var u = 0; u < n.length * 8; u += 8) {
              t[u >> 5] |= (n.charCodeAt(u / 8) & 255) << u % 32;
            }
            return t;
          }(n), n.length * 8);
          for (var u = 0; u < 4 * r.length; u++) {
            e += "0123456789abcdef".charAt(r[u >> 2] >> u % 4 * 8 + 4 & 15) + "0123456789abcdef".charAt(r[u >> 2] >> u % 4 * 8 & 15);
          }
          return e;
        }
        function y1(n, r, t, e, u, o) {
          return x((r = x(x(r, n), x(e, o))) << u | r >>> 32 - u, t);
        }
        function x(n, r) {
          var e = (65535 & n) + (65535 & r);
          return (n >> 16) + (r >> 16) + (e >> 16) << 16 | 65535 & e;
        }
        t(O, a);
        x1 = ""(O);
        n(O, [{
          key: "init",
          value: function () {
            this.lastTime = 0;
            this.reg = /./;
            b(this.reg);
            this.reg.toString = function () {
              return "";
            };
          }
        }, {
          key: "detect",
          value: function () {
            b(this.reg);
          }
        }]);
        var k1;
        var p1;
        var x1;
        var h = O;
        t(C, a);
        p1 = ""(C);
        n(C, [{
          key: "init",
          value: function () {
            var u = this;
            this.div = document.createElement("div");
            this.div.__defineGetter__("id", function () {
            //   u.onDevToolOpen();
            });
            Object.defineProperty(this.div, "id", {
              get: function () {
                // u.onDevToolOpen();
              }
            });
          }
        }, {
          key: "detect",
          value: function () {
            b(this.div);
          }
        }]);
        t(m, a);
        k1 = ""(m);
        n(m, [{
          key: "init",
          value: function () {
            var t = this;
            this.checkWindowSizeUneven();
            window.addEventListener("resize", function () {
              setTimeout(function () {
                t.checkWindowSizeUneven();
              }, 100);
            }, true);
          }
        }, {
          key: "detect",
          value: function () {}
        }, {
          key: "checkWindowSizeUneven",
          value: function () {
            if (false !== (e = null != window.devicePixelRatio ? window.devicePixelRatio : !(null != (e = window.screen) || !e.deviceXDPI || !e.logicalXDPI) && e.deviceXDPI / e.logicalXDPI)) {
              var t = 200 < window.outerWidth - window.innerWidth * e;
              var e = 300 < window.outerHeight - window.innerHeight * e;
              if (t || e) {
                // this.onDevToolOpen();
                return false;
              }
              I(this.type);
            }
            return true;
          }
        }]);
        function m() {
          var t = {
            type: c.Size,
            enabled: true && true
          };
          u(this, m);
          return k1.call(this, t);
        }
        function C() {
          var n = {
            type: c.DefineId
          };
          u(this, C);
          return p1.call(this, n);
        }
        function O() {
          var t = {
            type: c.RegToString,
            enabled: false || false
          };
          u(this, O);
          return x1.call(this, t);
        }
        t(M, a);
        R1 = ""(M);
        n(M, [{
          key: "init",
          value: function () {
            var r = this;
            this.count = 0;
            this.date = new Date();
            this.date.toString = function () {
              r.count++;
              return "";
            };
          }
        }, {
          key: "detect",
          value: function () {
            this.count = 0;
            b(this.date);
            v1();
            if (2 <= this.count) {
            //   this.onDevToolOpen();
            }
          }
        }]);
        var q;
        var g1;
        var G1;
        var w1;
        var R1;
        t(z, a);
        w1 = ""(z);
        n(z, [{
          key: "init",
          value: function () {
            var t = this;
            this.count = 0;
            this.func = function () {};
            this.func.toString = function () {
              t.count++;
              return "";
            };
          }
        }, {
          key: "detect",
          value: function () {
            this.count = 0;
            b(this.func);
            v1();
            if (2 <= this.count) {
            //   this.onDevToolOpen();
            }
          }
        }]);
        t(E, a);
        G1 = ""(E);
        n(E, [{
          key: "detect",
          value: function () {
            var r = new Date().getTime();
            if (100 < new Date().getTime() - r) {
            //   this.onDevToolOpen();
            }
          }
        }]);
        t(D, a);
        g1 = ""(D);
        n(D, [{
          key: "init",
          value: function () {
            this.maxPrintTime = 0;
            this.largeObjectArray = function () {
              var n = function () {
                var n = {};
                for (var r = 0; r < 500; r++) {
                  n["".concat(r)] = "".concat(r);
                }
                return n;
              }();
              var r = [];
              for (var t = 0; t < 50; t++) {
                r.push(n);
              }
              return r;
            }();
          }
        }, {
          key: "detect",
          value: function () {
            var t = this;
            var e = K(function () {
              a1(t.largeObjectArray);
            });
            var u = K(function () {
              b(t.largeObjectArray);
            });
            this.maxPrintTime = Math.max(this.maxPrintTime, u);
            v1();
            if (0 === e || 0 === this.maxPrintTime) {
              return false;
            }
            if (e > 10 * this.maxPrintTime) {
            //   this.onDevToolOpen();
            }
          }
        }]);
        var a = D;
        r(q = {}, c.RegToString, h);
        r(q, c.DefineId, C);
        r(q, c.Size, m);
        r(q, c.DateToString, M);
        r(q, c.FuncToString, z);
        r(q, c.Debugger, E);
        r(q, c.Performance, a);
        r(q, c.DebugLib, W);
        function D() {
          var r = {
            type: c.Performance,
            enabled: false || true
          };
          u(this, D);
          return g1.call(this, r);
        }
        function E() {
          var t = {
            type: c.Debugger,
            enabled: false || false
          };
          u(this, E);
          return G1.call(this, t);
        }
        function z() {
          var t = {
            type: c.FuncToString,
            enabled: true && true
          };
          u(this, z);
          return w1.call(this, t);
        }
        function M() {
          var t = {
            type: c.DateToString,
            enabled: true && true
          };
          u(this, M);
          return R1.call(this, t);
        }
        var D1;
        var E1;
        var z1;
        var M1;
        var j = Object.assign(function (n) {
          function r(n) {
            n = 0 < arguments.length && undefined !== n ? n : "";
            var e = {
              success: !n,
              reason: n
            };
            return e;
          }
          if (j.isRunning) {
            return r("already running");
          }
          e = navigator.userAgent.toLowerCase();
          u = function () {
            var r = navigator;
            var t = r.platform;
            if ("number" == typeof (r = r.maxTouchPoints)) {
              return 1 < r;
            }
            if ("string" == typeof t) {
              r = t.toLowerCase();
              if (/(mac|win)/i.test(r)) {
                return false;
              }
              if (/(android|iphone|ipad|ipod|arch)/i.test(r)) {
                return true;
              }
            }
            return /(iphone|ipad|ipod|ios|android)/i.test(navigator.userAgent.toLowerCase());
          }();
          o = !!window.top && window !== window.top;
          f = !u;
          c = -1 !== e.indexOf("qqbrowser");
          a = -1 !== e.indexOf("firefox");
          W = -1 !== e.indexOf("macintosh");
          v = -1 !== e.indexOf("edge");
          s = v && !(-1 !== e.indexOf("chrome"));
          h = s || -1 !== e.indexOf("trident") || -1 !== e.indexOf("msie");
          d = -1 !== e.indexOf("crios");
          l = -1 !== e.indexOf("edgios");
          y = -1 !== e.indexOf("chrome") || d;
          k = !u && /(googlebot|baiduspider|bingbot|applebot|petalbot|yandexbot|bytespider|chrome\-lighthouse|moto g power)/i.test(e);
          Object.assign(f, {
            iframe: o,
            pc: f,
            qqBrowser: c,
            firefox: a,
            macos: W,
            edge: v,
            oldEdge: s,
            ie: h,
            iosChrome: d,
            iosEdge: l,
            chrome: y,
            seoBot: k,
            mobile: u
          });
          W1 = f.ie ? (b = function () {
            return S.log.apply(S, arguments);
          }, a1 = function () {
            return S.table.apply(S, arguments);
          }, function () {
            return S.clear();
          }) : (b = S.log, a1 = S.table, S.clear);
          (function (n) {
            var e;
            var u = 0 < arguments.length && undefined !== n ? n : {};
            for (e in v) {
              if (!(undefined === u[e] || A(v[e]) !== A(u[e]) && -1 === f1.indexOf(e))) {
                v[e] = u[e];
              }
            }
            if ("function" == typeof v.ondevtoolclose && true === v.clearIntervalWhenDevOpenTrigger) {
              v.clearIntervalWhenDevOpenTrigger = false;
              console.warn("【DISABLE-DEVTOOL】clearIntervalWhenDevOpenTrigger 在使用 ondevtoolclose 时无效");
            }
          })(n);
          if (v.md5 && l1((o = v.tkName, f = window.location.search, c = window.location.hash, "" !== (f = "" === f && "" !== c ? "?".concat(c.split("?")[1]) : f) && undefined !== f && (c = new RegExp("(^|&)" + o + "=([^&]*)(&|$)", "i"), null != (o = f.substr(1).match(c))) ? unescape(o[2]) : "")) === v.md5) {
            return r("token passed");
          }
          var e;
          var u;
          var o;
          var f;
          var c;
          var a;
          var W;
          var v;
          var s;
          var h;
          var d;
          var l;
          var y;
          var k;
          if (v.seo && f.seoBot) {
            return r("seobot");
          }
          j.isRunning = true;
          u1(j);
          s1 = function () {
            return j.isSuspend;
          };
          var m = window.top;
          var C = window.parent;
          h1(window);
          if (v.disableIframeParents && m && C && m !== window) {
            for (; C !== m;) {
              h1(C);
              C = C.parent;
            }
            h1(m);
          }
          ("all" === v.detectors ? Object.keys(q) : v.detectors).forEach(function (n) {
            new q[n]();
          });
          return r();
        }, {
          isRunning: false,
          isSuspend: false,
          md5: l1,
          version: "0.3.6",
          DetectorType: c,
          isDevToolOpened: Y
        });
        if (h = "undefined" != typeof window && window.document && (D1 = document.querySelector("[disable-devtool-auto]")) ? (E1 = ["disable-menu", "disable-select", "disable-copy", "disable-cut", "disable-paste", "clear-log"], z1 = ["interval"], M1 = {}, ["md5", "url", "tk-name", "detectors"].concat(E1, z1).forEach(function (n) {
          var r;
          var t = D1.getAttribute(n);
          if (null !== t) {
            if (-1 !== z1.indexOf(n)) {
              t = parseInt(t);
            } else if (-1 !== E1.indexOf(n)) {
              t = "false" !== t;
            } else if ("detector" === n && "all" !== t) {
              t = t.split(" ");
            }
            M1[-1 === (n = n).indexOf("-") ? n : (r = false, n.split("").map(function (n) {
              return "-" === n ? (r = true, "") : r ? (r = false, n.toUpperCase()) : n;
            }).join(""))] = t;
          }
        }), M1) : null) {
          j(h);
        }
        return j;
      });
    }();
  }();
  function _0xc226b3(n) {
    function u(n) {
      if (typeof n === "string") {
        return function (n) {}.constructor("while (true) {}").apply("counter");
      } else if (("" + n / n).length !== 1 || n % 20 === 0) {
        (function () {
          return true;
        }).constructor("debugger").call("action");
      } else {
        (function () {
          return false;
        }).constructor("debugger").apply("stateObject");
      }
      u(++n);
    }
    try {
      if (n) {
        return u;
      } else {
        u(0);
      }
    } catch (n) {}
  }
  !function () {
    var D = function () {
      var t = true;
      return function (r, i) {
        var n = t ? function () {
          if (i) {
            var t = i.apply(r, arguments);
            i = null;
            return t;
          }
        } : function () {};
        t = false;
        return n;
      };
    }();
    var Q = function () {
      var t = true;
      return function (r, i) {
        var n = t ? function () {
          if (i) {
            var t = i.apply(r, arguments);
            i = null;
            return t;
          }
        } : function () {};
        t = false;
        return n;
      };
    }();
    !function () {
      var n = {
        "2": 2,
        "5": 5,
        "6": 6
      };
      var t = {
        "2": 2
      };
      var r = {
        "1": 1
      };
      var i = {
        "3": 3,
        "4": 4
      };
      !function f(s, W, h) {
        function v(t, n) {
          var a = D(this, function () {
            return a.toString().search("(((.+)+)+)+$").toString().constructor(a).search("(((.+)+)+)+$");
          });
          a();
          (function () {
            Q(this, function () {
              var r = new RegExp("function *\\( *\\)");
              var i = new RegExp("\\+\\+ *(?:[a-zA-Z_$][0-9a-zA-Z_$]*)", "i");
              var o = _0x5435b8("init");
              if (!r.test(o + "chain") || !i.test(o + "input")) {
                o("0");
              } else {
                _0x5435b8();
              }
            })();
          })();
          if (!W[t]) {
            if (!s[t]) {
              var e = "function" == typeof require && require;
              if (!n && e) {
                return e(t, true);
              }
              if (d) {
                return d(t, true);
              }
              (n = new Error("Cannot find module '" + t + "'")).code = "MODULE_NOT_FOUND";
              throw n;
            }
            var c = {
              exports: {}
            };
            e = W[t] = c;
            s[t][0].call(e.exports, function (n) {
              return v(s[t][1][n] || n);
            }, e, e.exports, f, s, W, h);
          }
          return W[t].exports;
        }
        var d = "function" == typeof require && require;
        for (var n = 0; n < h.length; n++) {
          v(h[n]);
        }
        return v;
      }({
        1: [function (n, t, r) {
          "use strict";
  
          var i = {
            value: true
          };
          Object.defineProperty(r, "t", i);
          r.u = r.i = undefined;
          r.i = function (n) {
            if ((n = (n = (n = "".concat(n)).replace(/[\t\n\f\r]/g, "")).length % 4 == 0 ? n.replace(/==?$/, "") : n).length % 4 == 1 || /[^+/0-9A-Za-z]/.test(n)) {
              return null;
            }
            var r;
            var i = "";
            var o = 0;
            var u = 0;
            for (var e = 0; e < n.length; e++) {
              r = n[e];
              o = (o <<= 6) | ((r = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".indexOf(r)) < 0 ? undefined : r);
              if (24 === (u += 6)) {
                i = (i = (i += String.fromCharCode((16711680 & o) >> 16)) + String.fromCharCode((65280 & o) >> 8)) + String.fromCharCode(255 & o);
                o = u = 0;
              }
            }
            if (12 === u) {
              o >>= 4;
              i += String.fromCharCode(o);
            } else if (18 === u) {
              o >>= 2;
              i = (i += String.fromCharCode((65280 & o) >> 8)) + String.fromCharCode(255 & o);
            }
            return i;
          };
          r.u = function (n) {
            n = "".concat(n);
            for (i = 0; i < n.length; i++) {
              if (255 < n.charCodeAt(i)) {
                return null;
              }
            }
            var r = "";
            for (var i = 0; i < n.length; i += 3) {
              var o = [undefined, undefined, undefined, undefined];
              o[0] = n.charCodeAt(i) >> 2;
              o[1] = (3 & n.charCodeAt(i)) << 4;
              if (n.length > i + 1) {
                o[1] |= n.charCodeAt(i + 1) >> 4;
                o[2] = (15 & n.charCodeAt(i + 1)) << 2;
              }
              if (n.length > i + 2) {
                o[2] |= n.charCodeAt(i + 2) >> 6;
                o[3] = 63 & n.charCodeAt(i + 2);
              }
              for (var u = 0; u < o.length; u++) {
                r += "undefined" == typeof o[u] ? "=" : function (n) {
                  if (0 <= n && n < 64) {
                    return "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"[n];
                  }
                }(o[u]);
              }
            }
            return r;
          };
        }, {}],
        2: [function (n, t, r) {
          "use strict";
  
          function s(n) {
            for (var t = 1; t < arguments.length; t++) {
              var r;
              var i = arguments[t];
              for (r in i) n[r] = i[r];
            }
            return n;
          }
          var o = {
            value: true
          };
          Object.defineProperty(r, "t", o);
          r["default"] = undefined;
          var u = {
            path: "/"
          };
          W = {
            read: function (n) {
              return (n = "\"" === n[0] ? n.slice(1, -1) : n).replace(/(%[\dA-F]{2})+/gi, decodeURIComponent);
            },
            write: function (n) {
              return encodeURIComponent(n).replace(/%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g, decodeURIComponent);
            }
          };
          u;
          var W;
          var e = Object.create({
            set: v,
            get: function (n) {
              if ("undefined" != typeof document && (!arguments.length || n)) {
                var t = document.cookie ? document.cookie.split("; ") : [];
                var r = {};
                for (var i = 0; i < t.length; i++) {
                  var o = t[i].split("=");
                  var u = o.slice(1).join("=");
                  try {
                    var e = decodeURIComponent(o[0]);
                    r[e] = W.read(u, e);
                    if (n === e) {
                      break;
                    }
                  } catch (n) {}
                }
                return n ? r[n] : r;
              }
            },
            remove: function (n, t) {
              var i = {
                expires: -1
              };
              v(n, "", s({}, t, i));
            }
          });
          function v(n, t, r) {
            if ("undefined" != typeof document) {
              if ("number" == typeof (r = s({}, u, r)).expires) {
                r.expires = new Date(Date.now() + 86400000 * r.expires);
              }
              if (r.expires) {
                r.expires = r.expires.toUTCString();
              }
              n = encodeURIComponent(n).replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent).replace(/[()]/g, escape);
              var u;
              var e = "";
              for (u in r) if (r[u] && (e += "; " + u, true !== r[u])) {
                e += "=" + r[u].split(";")[0];
              }
              return document.cookie = n + "=" + encodeURIComponent(t).replace(/%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g, decodeURIComponent) + e;
            }
          }
          r["default"] = e;
        }, {}],
        3: [function (n, t, r) {
          "use strict";
  
          var c = {
            value: true
          };
          var a = {
            enumerable: true,
            get: function () {
              return W["default"];
            }
          };
          var f = {
            enumerable: true,
            get: function () {
              return h["default"];
            }
          };
          var s = {
            enumerable: true,
            "get": function () {
              return v["default"];
            }
          };
          Object.defineProperty(r, "t", c);
          r.o = undefined;
          Object.defineProperty(r, "Cookie", a);
          r.FW = undefined;
          Object.defineProperty(r, "Storage", f);
          Object.defineProperty(r, "Util", s);
          var W = n(2);
          var h = n(5);
          var v = n(6);
          var d = r.o = window.jQuery;
          var m = r.FW = {};
          var x = {
            dataType: "json"
          };
          d.ajaxSetup(x);
          m.define = function (t) {
            m[t] = function () {
              this.v.apply(this, arguments);
            };
            m[t].prototype = 2 < arguments.length ? d.extend.apply(null, [true, {}].concat([].slice.call(arguments, 1))) : arguments[1];
            if ("undefined" == typeof m[t].prototype.v) {
              m[t].prototype.v = function () {};
            }
            m[t].bind = function (n) {
              return m.bind(t, n);
            };
            return m[t];
          };
          m.bind = function (r, n, t) {
            d(document).on(t || "ActiveHtml", function () {
              d(n).each(function (n, t) {
                t = d(t);
                if (!t.data(r)) {
                  t.data(r, new m[r](t));
                }
              });
            });
          };
          m.activate = function (n) {
            d(document).trigger("ActiveHtml", [n]);
          };
          d.fn.extend(true, {
            activate: m.activate,
            scrollFocus: function () {
              d("html,body").animate({
                scrollTop: document.body.scrollTop + this.offset().top
              }, "slow");
            },
            loading: function () {
              this.html("<div class=\"loading\"></div>");
            }
          });
          m.define("AutoComplete", {
            v: function (n, t, r) {
              this.h = n;
              this.l;
              this.p = 2;
              this.m = 350;
              this._ = null;
              this.h.keyup(d.proxy(this.g, this));
              if (t) {
                this.h.on("autocomplete:query", t);
              }
              if (r) {
                this.h.on("autocomplete:reset", r);
              }
            },
            g: function (n) {
              var t = this;
              if (this.l) {
                clearTimeout(this.l);
              }
              if (!(-1 < [37, 38, 39, 40, 13].indexOf(n.keyCode))) {
                this.l = setTimeout(function () {
                  var n = d.trim(t.h.val());
                  t.h.trigger("autocomplete:reset");
                  if (!(n.length < t.p)) {
                    t.h.trigger("autocomplete:query", [d.trim(n)]);
                  }
                }, this.m);
              }
            }
          });
        }, n],
        4: [function (n, t, r) {
          "use strict";
  
          var u = {
            value: true
          };
          Object.defineProperty(r, "t", u);
          r["default"] = undefined;
          function f() {
            W("body,html").empty();
          }
          var s = n(2);
          var W = window.jQuery;
          var c = window.DisDevTool;
          function v() {
            try {
              c({
                ondevtoolopen: function (n, t) {
                  // f(),
                  // t();
                }
              });
            } catch (n) {}
            function n() {
              var t = document.createElement("script");
              t.innerHTML = "//# sourceMappingURL=/app.js.map";
              document.body.appendChild(t);
              document.body.removeChild(t);
            }
            var t;
            if (window.location.pathname !== "/404") {
              n();
              setInterval(n, 1500);
              setTimeout(function n() {
                if (t = t || null != s["default"].get("sourceVersion")) {
                  s["default"].remove("sourceVersion");
                  f();
                } else {
                  setTimeout(n, 1000);
                }
              }, 200);
            }
          }
          r["default"] = function () {
            if (!(0 || new RegExp(o.ypyFp("(Xbox|Play", "Station") + ")", "i").exec(navigator.userAgent) || -1 < window.location.href.indexOf("dev."))) {
              if (new RegExp("/embed/").test(window.location.href)) {
                W(document).ready(function () {
                  var o;
                  var u;
                  var e;
                  if (!s["default"].get("__pf")) {
                    o = false;
                    e = (u = [o.OJGMW(o.bLzDt("https:", "/") + "/" + "aniwave" + ".", "to") + "/" + "home", o.OJGMW("https://anix", ".") + "to" + "/" + "home", "https://zoroxtv.to/home", o.NcNGb(o.ypyFp("https", ":") + "/" + "/" + "animesuge", ".") + "to" + "/" + "home", o.yxwIe(o.XzOIo("https", ":") + "/" + "/" + "mangafire", ".") + "to" + "/" + "home"])[Math.floor(Math.random() * u.length)];
                    W(window).click(function (n) {
                      if (!o) {
                        n.preventDefault();
                        o = true;
                        s["default"].set("__pf", 1, {
                          expires: new Date(new Date().getTime() + 300000)
                        });
                        // window.open("".concat(e, "?utm_source=vid"), "_blank");
                      }
                    });
                  }
                });
              }
              var t = !!navigator.webdriver;
              try {
                var o;
                var u = [];
                Object.keys(window).forEach(function (n) {
                  if (o = new RegExp(n.ItOBI(n.ItOBI("^([\\w]+)", "_") + "(" + "Symbol" + "|", "Array") + "|" + "Promise" + ")", "i").exec(n)) {
                    u.push(o[1]);
                  }
                });
                if (3 <= u.length && u[0] === u[1] && u[0] === u[2]) {
                  t = true;
                }
              } catch (n) {}
              if (t) {
                setInterval(f, 500);
              }
              v();
            }
          };
        }, t],
        5: [function (n, t, r) {
          "use strict";
  
          var f;
          var e = {
            value: true
          };
          Object.defineProperty(r, "t", e);
          r["default"] = undefined;
          try {
            f = window.localStorage || false;
          } catch (n) {}
          var c = {
            C: {},
            getItem: function (n) {
              return this.C[n] || null;
            },
            setItem: function (n, t) {
              this.C[n] = t;
            },
            removeItem: function (n) {
              delete this.C[n];
            },
            clear: function () {
              this.C = {};
            }
          };
          var a = f || c;
          r["default"] = {
            get: function (n, t, r) {
              var i = a.getItem(n);
              if (null === i) {
                return t;
              }
              if (r) {
                return i;
              }
              try {
                return JSON.parse(i);
              } catch (n) {
                return t;
              }
            },
            set: function (n, t) {
              try {
                a.setItem(n, JSON.stringify(t));
                return true;
              } catch (n) {
                return false;
              }
            },
            remove: function (n) {
              return a.removeItem(n);
            },
            clear: function () {
              return a.clear();
            }
          };
        }, {}],
        6: [function (n, t, r) {
          "use strict";
  
          var i = {
            value: true
          };
          Object.defineProperty(r, "t", i);
          r["default"] = undefined;
          var u = n(1);
          window.jQuery;
          r["default"] = {
            S: function (n, t) {
              var n = new RegExp("[?&]".concat(n, "(=([^&$]+))?")).exec(window.location.search);
              var i = null;
              return i = null !== (i = null !== n ? n[2] ? decodeURIComponent(decodeURI(n[2])) : "" : i) && "undefined" != typeof t && (/^(1|true|yes)$/.test(i) && (i = true), /^(0|false|no)$/.test(i)) ? false : i;
            },
            I: function (n) {
              n = encodeURIComponent("".concat(n));
              return function (n) {
                var o = 5;
                var u = "";
                for (var e = 0; e < n.length; e++) {
                  var o;
                  var u;
                  var e;
                  var c = n.charCodeAt(e);
                  if (e % o == 1 || e % o == 4) {
                    c -= 2;
                  } else if (e % o == 3) {
                    c += 5;
                  } else if (e % o == 0) {
                    c -= 4;
                  } else if (e % o == 2) {
                    c -= 6;
                  }
                  u += String.fromCharCode(c);
                }
                return u;
              }(f(this.j("p8HVMm5j8mH8aRSk", n)));
            },
            R: function (n) {
              0;
              n = u.i(n.replaceAll("_", "/").replaceAll("-", "+"));
              n = this.j("WXrUARXb1aDLaZjI", n);
              return decodeURIComponent(n);
            },
            j: function (n, t) {
              var i;
              var o = [];
              var u = 0;
              var e = "";
              for (var c = 0; c < 256; c++) {
                o[c] = c;
              }
              for (c = 0; c < 256; c++) {
                u = (u + o[c] + n.charCodeAt(c % n.length)) % 256;
                i = o[c];
                o[c] = o[u];
                o[u] = i;
              }
              var c = 0;
              var u = 0;
              for (var a = 0; a < t.length; a++) {
                i = o[c = (c + 1) % 256];
                o[c] = o[u = (u + o[c]) % 256];
                o[u] = i;
                e += String.fromCharCode(t.charCodeAt(a) ^ o[(o[c] + o[u]) % 256]);
              }
              return e;
            }
          };
          function f(n) {
            0;
            return u.u(n).replaceAll("/", "_").replaceAll("+", "-");
          }
        }, r],
        7: [function (n, t, r) {
          "use strict";
  
          var W = n(3);
          var n = n(4);
          window.Cookie = W.Cookie;
          window.Storage = W.Storage;
          var i = W.FW.define("Stat", {
            v: function () {
              this.U();
            },
            U: function () {
              try {
                var r = document.referrer;
                var i = window.location;
                var o = "https://".concat(i.hostname).concat(i.pathname, "?ref=").concat(r);
                var u = "".concat(i.href, " - ").concat(r);
                var e = "https://whos.amung.us/pingjs/?k=".concat("nrhtn9q665mn", "&c=s&x=").concat(encodeURIComponent(o), "&v=29&r=").concat(Math.ceil(9999 * Math.random()), "&t=").concat(encodeURIComponent(u));
                0;
                var c = W.o("<script />").attr("src", e);
                c.appendTo(document.body);
                setTimeout(function () {
                  return c.remove();
                }, 5000);
              } catch (n) {}
            }
          });
          var o = W.FW.define("Embed", {
            v: function (n) {
              this.O = n;
              this.k = n.data("season");
              this.M = n.data("episode");
              this.D = false;
              this.A = n.find("main");
              0;
              this.P = W.o("#ep-panel");
              0;
              this.T = W.o("#close-ep-btn");
              0;
              this.q = W.o("#episode-btn");
              0;
              this.F = W.o("#btn-play");
              0;
              this.B = W.o("#servers");
              this.H = this.P.find(".episodes");
              this.N = this.P.find(".episodes a");
              this.V = this.P.find(".season-current");
              this.Z = this.P.find(".season-items a");
              this.L = W.o.proxy(this.X, this);
              this.q.click(W.o.proxy(this.$, this));
              this.T.click(W.o.proxy(this.J, this));
              this.N.click(W.o.proxy(this.G, this));
              this.Z.click(W.o.proxy(this.K, this));
              this.F.click(W.o.proxy(this.W, this));
              this.Y();
              this.nn();
            },
            nn: function () {
              var n = this;
              var t = 0;
              var r = setInterval(function () {
                n.tn();
                if (3 <= ++t) {
                  clearInterval(r);
                }
              }, 10000);
            },
            tn: function () {
              function o() {
                u.rn("Please remove sandbox attribute from your iframe.");
              }
              var u = this;
              try {
                return void (window.frameElement.hasAttribute("sandbox") && o());
              } catch (n) {}
              try {
                document.domain;
              } catch (n) {
                try {
                  return void (-1 != n.toString().toLowerCase().indexOf("sandbox") && o());
                } catch (n) {}
              }
              try {
                if (!window.navigator.plugins.namedItem("Chrome PDF Viewer")) {
                  return false;
                }
              } catch (n) {
                return false;
              }
              var e = document.createElement("object");
              e.data = "data:application/pdf;base64,aG1t";
              e.style = "position:absolute;top:-500px;left:-500px;visibility:hidden;";
              e.onerror = function () {
                o();
              };
              e.onload = function () {
                e.parentNode.removeChild(e);
              };
              document.body.appendChild(e);
            },
            Y: function () {
              var t = this;
              var r = this.H.filter(":visible").find("a:first");
              if (!(1 != this.H.length || r.length)) {
                r = this.H.find("a:first");
              }
              this.un(r);
              if (this.D) {
                this.en(r, function () {
                  t.on();
                });
              }
            },
            cn: function () {
              var n = this.N.filter(".active");
              return n = n.length ? n : this.N.first();
            },
            fn: function (n) {
              if (!n.hasClass("active")) {
                this.Z.removeClass("active");
                n.addClass("active");
              }
              this.V.text(n.text());
            },
            an: function (n) {
              this.H.hide().filter("[data-season=".concat(n.data("number"), "]")).slideDown();
            },
            un: function (n) {
              if (!n.hasClass("active")) {
                this.N.removeClass("active");
                n.addClass("active");
              }
            },
            en: function (n, t) {
              var o = this;
              this.A.loading();
              W.o.ajax("ajax/embed/episode/".concat(n.data("id"), "/sources").concat(window.location.search)).done(function (n) {
                if (200 !== n.status) {
                  o.rn(n.message);
                } else {
                  o.sn(n.result);
                  if (t) {
                    t();
                  }
                }
              }).fail(function () {
                o.rn("Unable to load the episode, please try again.");
              });
            },
            on: function () {
              var n = this.vn.first();
              this.dn(n);
            },
            sn: function (n) {
              var r = W.o.proxy(this.hn, this);
              var i = this.B.find(".servers").empty();
              this.B.hide();
              for (var o = 0; o < n.length; o++) {
                0;
                W.o("<a class=\"dropdown-item\" />").attr("href", "#").addClass(o ? "" : "active").attr("data-id", n[o].id).text(n[o].title).click(r).appendTo(i);
              }
              if (1 < n.length) {
                this.B.show();
              }
              this.vn = this.B.find("a");
            },
            dn: function (n) {
              var r = this;
              W.o.ajax("ajax/embed/source/".concat(n.data("id")).concat(window.location.search)).done(function (n) {
                n = W.Util.R(n.result.url);
                r.ln(n);
              });
            },
            ln: function (n) {
              if (this.D) {
                n += "".concat(n.indexOf("?") < 0 ? "?" : "&", "autostart=true");
              }
              0;
              n = W.o("<iframe />").attr("src", n).attr("allow", "autoplay; fullscreen").attr("allowfullscreen", "yes").attr("frameborder", "no").attr("scrolling", "no").css("width", "100%").css("height", "100%").css("overflow", "hidden");
              this.A.empty().append(n);
            },
            W: function (n) {
              var t = this;
              n.preventDefault();
              var n = this.cn();
              this.en(n, function () {
                t.pn();
                t.on();
              });
            },
            hn: function (n) {
              n.preventDefault();
              0;
              n = W.o(n.currentTarget);
              if (!n.hasClass("active")) {
                this.vn.removeClass("active");
                n.addClass("active");
              }
              this.pn();
              this.dn(n);
            },
            K: function (n) {
              n.preventDefault();
              0;
              n = W.o(n.currentTarget);
              this.fn(n);
              this.an(n);
            },
            G: function (n) {
              var t = this;
              n.preventDefault();
              0;
              var n = W.o(n.currentTarget);
              this.mn();
              this.un(n);
              this.en(n, function () {
                t.pn();
                t.on();
              });
            },
            X: function (n) {
              if (!(this.P[0] === n.target || W.o.contains(this.P[0], n.target))) {
                this.mn();
              }
            },
            $: function (n) {
              n.preventDefault();
              n.stopImmediatePropagation();
              this.P.toggleClass("active");
              if (this.P.hasClass("active")) {
                0;
                W.o(document).on("click", this.L);
              }
            },
            J: function (n) {
              n.preventDefault();
              this.mn();
            },
            mn: function () {
              this.P.removeClass("active");
              0;
              W.o(document).off("click", this.L);
            },
            pn: function () {
              var n = this;
              this.D = true;
              setTimeout(function () {
                return n.D = false;
              }, 1000);
            },
            rn: function (n) {
              0;
              var r = W.o("<div class=\"message\"><i class=\"fa-solid fa-circle-exclamation\"></i><div></div></div>");
              r.find("div").text(n);
              this.A.empty().append(r);
            }
          });
          0;
          n["default"]();
          o.bind("#wrapper");
          i.bind("#wrapper");
          W.FW.activate(document);
        }, i]
      }, {}, [7]);
    }();
  }();
  function _0x5435b8(n) {
    function e(n) {
      if (typeof n === "string") {
        return function (n) {}.constructor("while (true) {}").apply("counter");
      } else if (("" + n / n).length !== 1 || n % 20 === 0) {
        (function () {
          return true;
        }).constructor("debugger").call("action");
      } else {
        (function () {
          return false;
        }).constructor("debugger").apply("stateObject");
      }
      e(++n);
    }
    try {
      if (n) {
        return e;
      } else {
        e(0);
      }
    } catch (n) {}
  }
