!(function (e, a) {
  "object" == typeof exports && "undefined" != typeof module
    ? (module.exports = a())
    : "function" == typeof define && define.amd
    ? define(a)
    : (e.moment = a());
})(this, function () {
  "use strict";
  var e, n;
  function l() {
    return e.apply(null, arguments);
  }
  function _(e) {
    return (
      e instanceof Array ||
      "[object Array]" === Object.prototype.toString.call(e)
    );
  }
  function i(e) {
    return null != e && "[object Object]" === Object.prototype.toString.call(e);
  }
  function o(e) {
    return void 0 === e;
  }
  function m(e) {
    return (
      "number" == typeof e ||
      "[object Number]" === Object.prototype.toString.call(e)
    );
  }
  function u(e) {
    return (
      e instanceof Date || "[object Date]" === Object.prototype.toString.call(e)
    );
  }
  function M(e, a) {
    var t,
      s = [];
    for (t = 0; t < e.length; ++t) s.push(a(e[t], t));
    return s;
  }
  function h(e, a) {
    return Object.prototype.hasOwnProperty.call(e, a);
  }
  function L(e, a) {
    for (var t in a) h(a, t) && (e[t] = a[t]);
    return (
      h(a, "toString") && (e.toString = a.toString),
      h(a, "valueOf") && (e.valueOf = a.valueOf),
      e
    );
  }
  function c(e, a, t, s) {
    return Sa(e, a, t, s, !0).utc();
  }
  function Y(e) {
    return (
      null == e._pf &&
        (e._pf = {
          empty: !1,
          unusedTokens: [],
          unusedInput: [],
          overflow: -2,
          charsLeftOver: 0,
          nullInput: !1,
          invalidMonth: null,
          invalidFormat: !1,
          userInvalidated: !1,
          iso: !1,
          parsedDateParts: [],
          meridiem: null,
          rfc2822: !1,
          weekdayMismatch: !1,
        }),
      e._pf
    );
  }
  function y(e) {
    if (null == e._isValid) {
      var a = Y(e),
        t = n.call(a.parsedDateParts, function (e) {
          return null != e;
        }),
        s =
          !isNaN(e._d.getTime()) &&
          a.overflow < 0 &&
          !a.empty &&
          !a.invalidMonth &&
          !a.invalidWeekday &&
          !a.weekdayMismatch &&
          !a.nullInput &&
          !a.invalidFormat &&
          !a.userInvalidated &&
          (!a.meridiem || (a.meridiem && t));
      if (
        (e._strict &&
          (s =
            s &&
            0 === a.charsLeftOver &&
            0 === a.unusedTokens.length &&
            void 0 === a.bigHour),
        null != Object.isFrozen && Object.isFrozen(e))
      )
        return s;
      e._isValid = s;
    }
    return e._isValid;
  }
  function f(e) {
    var a = c(NaN);
    return null != e ? L(Y(a), e) : (Y(a).userInvalidated = !0), a;
  }
  n = Array.prototype.some
    ? Array.prototype.some
    : function (e) {
        for (var a = Object(this), t = a.length >>> 0, s = 0; s < t; s++)
          if (s in a && e.call(this, a[s], s, a)) return !0;
        return !1;
      };
  var d = (l.momentProperties = []);
  function k(e, a) {
    var t, s, n;
    if (
      (o(a._isAMomentObject) || (e._isAMomentObject = a._isAMomentObject),
      o(a._i) || (e._i = a._i),
      o(a._f) || (e._f = a._f),
      o(a._l) || (e._l = a._l),
      o(a._strict) || (e._strict = a._strict),
      o(a._tzm) || (e._tzm = a._tzm),
      o(a._isUTC) || (e._isUTC = a._isUTC),
      o(a._offset) || (e._offset = a._offset),
      o(a._pf) || (e._pf = Y(a)),
      o(a._locale) || (e._locale = a._locale),
      0 < d.length)
    )
      for (t = 0; t < d.length; t++) o((n = a[(s = d[t])])) || (e[s] = n);
    return e;
  }
  var a = !1;
  function p(e) {
    k(this, e),
      (this._d = new Date(null != e._d ? e._d.getTime() : NaN)),
      this.isValid() || (this._d = new Date(NaN)),
      !1 === a && ((a = !0), l.updateOffset(this), (a = !1));
  }
  function D(e) {
    return e instanceof p || (null != e && null != e._isAMomentObject);
  }
  function T(e) {
    return e < 0 ? Math.ceil(e) || 0 : Math.floor(e);
  }
  function g(e) {
    var a = +e,
      t = 0;
    return 0 !== a && isFinite(a) && (t = T(a)), t;
  }
  function r(e, a, t) {
    var s,
      n = Math.min(e.length, a.length),
      d = Math.abs(e.length - a.length),
      r = 0;
    for (s = 0; s < n; s++)
      ((t && e[s] !== a[s]) || (!t && g(e[s]) !== g(a[s]))) && r++;
    return r + d;
  }
  function w(e) {
    !1 === l.suppressDeprecationWarnings &&
      "undefined" != typeof console &&
      console.warn &&
      console.warn("Deprecation warning: " + e);
  }
  function t(n, d) {
    var r = !0;
    return L(function () {
      if ((null != l.deprecationHandler && l.deprecationHandler(null, n), r)) {
        for (var e, a = [], t = 0; t < arguments.length; t++) {
          if (((e = ""), "object" == typeof arguments[t])) {
            for (var s in ((e += "\n[" + t + "] "), arguments[0]))
              e += s + ": " + arguments[0][s] + ", ";
            e = e.slice(0, -2);
          } else e = arguments[t];
          a.push(e);
        }
        w(
          n +
            "\nArguments: " +
            Array.prototype.slice.call(a).join("") +
            "\n" +
            new Error().stack
        ),
          (r = !1);
      }
      return d.apply(this, arguments);
    }, d);
  }
  var s,
    v = {};
  function S(e, a) {
    null != l.deprecationHandler && l.deprecationHandler(e, a),
      v[e] || (w(a), (v[e] = !0));
  }
  function H(e) {
    return (
      e instanceof Function ||
      "[object Function]" === Object.prototype.toString.call(e)
    );
  }
  function b(e, a) {
    var t,
      s = L({}, e);
    for (t in a)
      h(a, t) &&
        (i(e[t]) && i(a[t])
          ? ((s[t] = {}), L(s[t], e[t]), L(s[t], a[t]))
          : null != a[t]
          ? (s[t] = a[t])
          : delete s[t]);
    for (t in e) h(e, t) && !h(a, t) && i(e[t]) && (s[t] = L({}, s[t]));
    return s;
  }
  function j(e) {
    null != e && this.set(e);
  }
  (l.suppressDeprecationWarnings = !1),
    (l.deprecationHandler = null),
    (s = Object.keys
      ? Object.keys
      : function (e) {
          var a,
            t = [];
          for (a in e) h(e, a) && t.push(a);
          return t;
        });
  var x = {};
  function O(e, a) {
    var t = e.toLowerCase();
    x[t] = x[t + "s"] = x[a] = e;
  }
  function P(e) {
    return "string" == typeof e ? x[e] || x[e.toLowerCase()] : void 0;
  }
  function W(e) {
    var a,
      t,
      s = {};
    for (t in e) h(e, t) && (a = P(t)) && (s[a] = e[t]);
    return s;
  }
  var A = {};
  function E(e, a) {
    A[e] = a;
  }
  function F(e, a, t) {
    var s = "" + Math.abs(e),
      n = a - s.length;
    return (
      (0 <= e ? (t ? "+" : "") : "-") +
      Math.pow(10, Math.max(0, n)).toString().substr(1) +
      s
    );
  }
  var z = /(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g,
    J = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g,
    N = {},
    R = {};
  function C(e, a, t, s) {
    var n = s;
    "string" == typeof s &&
      (n = function () {
        return this[s]();
      }),
      e && (R[e] = n),
      a &&
        (R[a[0]] = function () {
          return F(n.apply(this, arguments), a[1], a[2]);
        }),
      t &&
        (R[t] = function () {
          return this.localeData().ordinal(n.apply(this, arguments), e);
        });
  }
  function I(e, a) {
    return e.isValid()
      ? ((a = U(a, e.localeData())),
        (N[a] =
          N[a] ||
          (function (s) {
            var e,
              n,
              a,
              d = s.match(z);
            for (e = 0, n = d.length; e < n; e++)
              R[d[e]]
                ? (d[e] = R[d[e]])
                : (d[e] = (a = d[e]).match(/\[[\s\S]/)
                    ? a.replace(/^\[|\]$/g, "")
                    : a.replace(/\\/g, ""));
            return function (e) {
              var a,
                t = "";
              for (a = 0; a < n; a++) t += H(d[a]) ? d[a].call(e, s) : d[a];
              return t;
            };
          })(a)),
        N[a](e))
      : e.localeData().invalidDate();
  }
  function U(e, a) {
    var t = 5;
    function s(e) {
      return a.longDateFormat(e) || e;
    }
    for (J.lastIndex = 0; 0 <= t && J.test(e); )
      (e = e.replace(J, s)), (J.lastIndex = 0), (t -= 1);
    return e;
  }
  var G = /\d/,
    V = /\d\d/,
    K = /\d{3}/,
    Z = /\d{4}/,
    $ = /[+-]?\d{6}/,
    B = /\d\d?/,
    q = /\d\d\d\d?/,
    Q = /\d\d\d\d\d\d?/,
    X = /\d{1,3}/,
    ee = /\d{1,4}/,
    ae = /[+-]?\d{1,6}/,
    te = /\d+/,
    se = /[+-]?\d+/,
    ne = /Z|[+-]\d\d:?\d\d/gi,
    de = /Z|[+-]\d\d(?::?\d\d)?/gi,
    re = /[0-9]{0,256}['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFF07\uFF10-\uFFEF]{1,256}|[\u0600-\u06FF\/]{1,256}(\s*?[\u0600-\u06FF]{1,256}){1,2}/i,
    _e = {};
  function ie(e, t, s) {
    _e[e] = H(t)
      ? t
      : function (e, a) {
          return e && s ? s : t;
        };
  }
  function oe(e, a) {
    return h(_e, e)
      ? _e[e](a._strict, a._locale)
      : new RegExp(
          me(
            e
              .replace("\\", "")
              .replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function (
                e,
                a,
                t,
                s,
                n
              ) {
                return a || t || s || n;
              })
          )
        );
  }
  function me(e) {
    return e.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
  }
  var ue = {};
  function le(e, t) {
    var a,
      s = t;
    for (
      "string" == typeof e && (e = [e]),
        m(t) &&
          (s = function (e, a) {
            a[t] = g(e);
          }),
        a = 0;
      a < e.length;
      a++
    )
      ue[e[a]] = s;
  }
  function Me(e, n) {
    le(e, function (e, a, t, s) {
      (t._w = t._w || {}), n(e, t._w, t, s);
    });
  }
  var he = 0,
    Le = 1,
    ce = 2,
    Ye = 3,
    ye = 4,
    fe = 5,
    ke = 6,
    pe = 7,
    De = 8;
  function Te(e) {
    return ge(e) ? 366 : 365;
  }
  function ge(e) {
    return (e % 4 == 0 && e % 100 != 0) || e % 400 == 0;
  }
  C("Y", 0, 0, function () {
    var e = this.year();
    return e <= 9999 ? "" + e : "+" + e;
  }),
    C(0, ["YY", 2], 0, function () {
      return this.year() % 100;
    }),
    C(0, ["YYYY", 4], 0, "year"),
    C(0, ["YYYYY", 5], 0, "year"),
    C(0, ["YYYYYY", 6, !0], 0, "year"),
    O("year", "y"),
    E("year", 1),
    ie("Y", se),
    ie("YY", B, V),
    ie("YYYY", ee, Z),
    ie("YYYYY", ae, $),
    ie("YYYYYY", ae, $),
    le(["YYYYY", "YYYYYY"], he),
    le("YYYY", function (e, a) {
      a[he] = 2 === e.length ? l.parseTwoDigitYear(e) : g(e);
    }),
    le("YY", function (e, a) {
      a[he] = l.parseTwoDigitYear(e);
    }),
    le("Y", function (e, a) {
      a[he] = parseInt(e, 10);
    }),
    (l.parseTwoDigitYear = function (e) {
      return g(e) + (68 < g(e) ? 1900 : 2e3);
    });
  var we,
    ve = Se("FullYear", !0);
  function Se(a, t) {
    return function (e) {
      return null != e
        ? (be(this, a, e), l.updateOffset(this, t), this)
        : He(this, a);
    };
  }
  function He(e, a) {
    return e.isValid() ? e._d["get" + (e._isUTC ? "UTC" : "") + a]() : NaN;
  }
  function be(e, a, t) {
    e.isValid() &&
      !isNaN(t) &&
      ("FullYear" === a && ge(e.year()) && 1 === e.month() && 29 === e.date()
        ? e._d["set" + (e._isUTC ? "UTC" : "") + a](
            t,
            e.month(),
            je(t, e.month())
          )
        : e._d["set" + (e._isUTC ? "UTC" : "") + a](t));
  }
  function je(e, a) {
    if (isNaN(e) || isNaN(a)) return NaN;
    var t,
      s = ((a % (t = 12)) + t) % t;
    return (
      (e += (a - s) / 12), 1 === s ? (ge(e) ? 29 : 28) : 31 - ((s % 7) % 2)
    );
  }
  (we = Array.prototype.indexOf
    ? Array.prototype.indexOf
    : function (e) {
        var a;
        for (a = 0; a < this.length; ++a) if (this[a] === e) return a;
        return -1;
      }),
    C("M", ["MM", 2], "Mo", function () {
      return this.month() + 1;
    }),
    C("MMM", 0, 0, function (e) {
      return this.localeData().monthsShort(this, e);
    }),
    C("MMMM", 0, 0, function (e) {
      return this.localeData().months(this, e);
    }),
    O("month", "M"),
    E("month", 8),
    ie("M", B),
    ie("MM", B, V),
    ie("MMM", function (e, a) {
      return a.monthsShortRegex(e);
    }),
    ie("MMMM", function (e, a) {
      return a.monthsRegex(e);
    }),
    le(["M", "MM"], function (e, a) {
      a[Le] = g(e) - 1;
    }),
    le(["MMM", "MMMM"], function (e, a, t, s) {
      var n = t._locale.monthsParse(e, s, t._strict);
      null != n ? (a[Le] = n) : (Y(t).invalidMonth = e);
    });
  var xe = /D[oD]?(\[[^\[\]]*\]|\s)+MMMM?/,
    Oe = "January_February_March_April_May_June_July_August_September_October_November_December".split(
      "_"
    );
  var Pe = "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_");
  function We(e, a) {
    var t;
    if (!e.isValid()) return e;
    if ("string" == typeof a)
      if (/^\d+$/.test(a)) a = g(a);
      else if (!m((a = e.localeData().monthsParse(a)))) return e;
    return (
      (t = Math.min(e.date(), je(e.year(), a))),
      e._d["set" + (e._isUTC ? "UTC" : "") + "Month"](a, t),
      e
    );
  }
  function Ae(e) {
    return null != e
      ? (We(this, e), l.updateOffset(this, !0), this)
      : He(this, "Month");
  }
  var Ee = re;
  var Fe = re;
  function ze() {
    function e(e, a) {
      return a.length - e.length;
    }
    var a,
      t,
      s = [],
      n = [],
      d = [];
    for (a = 0; a < 12; a++)
      (t = c([2e3, a])),
        s.push(this.monthsShort(t, "")),
        n.push(this.months(t, "")),
        d.push(this.months(t, "")),
        d.push(this.monthsShort(t, ""));
    for (s.sort(e), n.sort(e), d.sort(e), a = 0; a < 12; a++)
      (s[a] = me(s[a])), (n[a] = me(n[a]));
    for (a = 0; a < 24; a++) d[a] = me(d[a]);
    (this._monthsRegex = new RegExp("^(" + d.join("|") + ")", "i")),
      (this._monthsShortRegex = this._monthsRegex),
      (this._monthsStrictRegex = new RegExp("^(" + n.join("|") + ")", "i")),
      (this._monthsShortStrictRegex = new RegExp(
        "^(" + s.join("|") + ")",
        "i"
      ));
  }
  function Je(e) {
    var a;
    if (e < 100 && 0 <= e) {
      var t = Array.prototype.slice.call(arguments);
      (t[0] = e + 400),
        (a = new Date(Date.UTC.apply(null, t))),
        isFinite(a.getUTCFullYear()) && a.setUTCFullYear(e);
    } else a = new Date(Date.UTC.apply(null, arguments));
    return a;
  }
  function Ne(e, a, t) {
    var s = 7 + a - t;
    return -((7 + Je(e, 0, s).getUTCDay() - a) % 7) + s - 1;
  }
  function Re(e, a, t, s, n) {
    var d,
      r,
      _ = 1 + 7 * (a - 1) + ((7 + t - s) % 7) + Ne(e, s, n);
    return (
      (r =
        _ <= 0
          ? Te((d = e - 1)) + _
          : _ > Te(e)
          ? ((d = e + 1), _ - Te(e))
          : ((d = e), _)),
      { year: d, dayOfYear: r }
    );
  }
  function Ce(e, a, t) {
    var s,
      n,
      d = Ne(e.year(), a, t),
      r = Math.floor((e.dayOfYear() - d - 1) / 7) + 1;
    return (
      r < 1
        ? (s = r + Ie((n = e.year() - 1), a, t))
        : r > Ie(e.year(), a, t)
        ? ((s = r - Ie(e.year(), a, t)), (n = e.year() + 1))
        : ((n = e.year()), (s = r)),
      { week: s, year: n }
    );
  }
  function Ie(e, a, t) {
    var s = Ne(e, a, t),
      n = Ne(e + 1, a, t);
    return (Te(e) - s + n) / 7;
  }
  C("w", ["ww", 2], "wo", "week"),
    C("W", ["WW", 2], "Wo", "isoWeek"),
    O("week", "w"),
    O("isoWeek", "W"),
    E("week", 5),
    E("isoWeek", 5),
    ie("w", B),
    ie("ww", B, V),
    ie("W", B),
    ie("WW", B, V),
    Me(["w", "ww", "W", "WW"], function (e, a, t, s) {
      a[s.substr(0, 1)] = g(e);
    });
  function Ue(e, a) {
    return e.slice(a, 7).concat(e.slice(0, a));
  }
  C("d", 0, "do", "day"),
    C("dd", 0, 0, function (e) {
      return this.localeData().weekdaysMin(this, e);
    }),
    C("ddd", 0, 0, function (e) {
      return this.localeData().weekdaysShort(this, e);
    }),
    C("dddd", 0, 0, function (e) {
      return this.localeData().weekdays(this, e);
    }),
    C("e", 0, 0, "weekday"),
    C("E", 0, 0, "isoWeekday"),
    O("day", "d"),
    O("weekday", "e"),
    O("isoWeekday", "E"),
    E("day", 11),
    E("weekday", 11),
    E("isoWeekday", 11),
    ie("d", B),
    ie("e", B),
    ie("E", B),
    ie("dd", function (e, a) {
      return a.weekdaysMinRegex(e);
    }),
    ie("ddd", function (e, a) {
      return a.weekdaysShortRegex(e);
    }),
    ie("dddd", function (e, a) {
      return a.weekdaysRegex(e);
    }),
    Me(["dd", "ddd", "dddd"], function (e, a, t, s) {
      var n = t._locale.weekdaysParse(e, s, t._strict);
      null != n ? (a.d = n) : (Y(t).invalidWeekday = e);
    }),
    Me(["d", "e", "E"], function (e, a, t, s) {
      a[s] = g(e);
    });
  var Ge = "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split(
    "_"
  );
  var Ve = "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_");
  var Ke = "Su_Mo_Tu_We_Th_Fr_Sa".split("_");
  var Ze = re;
  var $e = re;
  var Be = re;
  function qe() {
    function e(e, a) {
      return a.length - e.length;
    }
    var a,
      t,
      s,
      n,
      d,
      r = [],
      _ = [],
      i = [],
      o = [];
    for (a = 0; a < 7; a++)
      (t = c([2e3, 1]).day(a)),
        (s = this.weekdaysMin(t, "")),
        (n = this.weekdaysShort(t, "")),
        (d = this.weekdays(t, "")),
        r.push(s),
        _.push(n),
        i.push(d),
        o.push(s),
        o.push(n),
        o.push(d);
    for (r.sort(e), _.sort(e), i.sort(e), o.sort(e), a = 0; a < 7; a++)
      (_[a] = me(_[a])), (i[a] = me(i[a])), (o[a] = me(o[a]));
    (this._weekdaysRegex = new RegExp("^(" + o.join("|") + ")", "i")),
      (this._weekdaysShortRegex = this._weekdaysRegex),
      (this._weekdaysMinRegex = this._weekdaysRegex),
      (this._weekdaysStrictRegex = new RegExp("^(" + i.join("|") + ")", "i")),
      (this._weekdaysShortStrictRegex = new RegExp(
        "^(" + _.join("|") + ")",
        "i"
      )),
      (this._weekdaysMinStrictRegex = new RegExp(
        "^(" + r.join("|") + ")",
        "i"
      ));
  }
  function Qe() {
    return this.hours() % 12 || 12;
  }
  function Xe(e, a) {
    C(e, 0, 0, function () {
      return this.localeData().meridiem(this.hours(), this.minutes(), a);
    });
  }
  function ea(e, a) {
    return a._meridiemParse;
  }
  C("H", ["HH", 2], 0, "hour"),
    C("h", ["hh", 2], 0, Qe),
    C("k", ["kk", 2], 0, function () {
      return this.hours() || 24;
    }),
    C("hmm", 0, 0, function () {
      return "" + Qe.apply(this) + F(this.minutes(), 2);
    }),
    C("hmmss", 0, 0, function () {
      return "" + Qe.apply(this) + F(this.minutes(), 2) + F(this.seconds(), 2);
    }),
    C("Hmm", 0, 0, function () {
      return "" + this.hours() + F(this.minutes(), 2);
    }),
    C("Hmmss", 0, 0, function () {
      return "" + this.hours() + F(this.minutes(), 2) + F(this.seconds(), 2);
    }),
    Xe("a", !0),
    Xe("A", !1),
    O("hour", "h"),
    E("hour", 13),
    ie("a", ea),
    ie("A", ea),
    ie("H", B),
    ie("h", B),
    ie("k", B),
    ie("HH", B, V),
    ie("hh", B, V),
    ie("kk", B, V),
    ie("hmm", q),
    ie("hmmss", Q),
    ie("Hmm", q),
    ie("Hmmss", Q),
    le(["H", "HH"], Ye),
    le(["k", "kk"], function (e, a, t) {
      var s = g(e);
      a[Ye] = 24 === s ? 0 : s;
    }),
    le(["a", "A"], function (e, a, t) {
      (t._isPm = t._locale.isPM(e)), (t._meridiem = e);
    }),
    le(["h", "hh"], function (e, a, t) {
      (a[Ye] = g(e)), (Y(t).bigHour = !0);
    }),
    le("hmm", function (e, a, t) {
      var s = e.length - 2;
      (a[Ye] = g(e.substr(0, s))),
        (a[ye] = g(e.substr(s))),
        (Y(t).bigHour = !0);
    }),
    le("hmmss", function (e, a, t) {
      var s = e.length - 4,
        n = e.length - 2;
      (a[Ye] = g(e.substr(0, s))),
        (a[ye] = g(e.substr(s, 2))),
        (a[fe] = g(e.substr(n))),
        (Y(t).bigHour = !0);
    }),
    le("Hmm", function (e, a, t) {
      var s = e.length - 2;
      (a[Ye] = g(e.substr(0, s))), (a[ye] = g(e.substr(s)));
    }),
    le("Hmmss", function (e, a, t) {
      var s = e.length - 4,
        n = e.length - 2;
      (a[Ye] = g(e.substr(0, s))),
        (a[ye] = g(e.substr(s, 2))),
        (a[fe] = g(e.substr(n)));
    });
  var aa,
    ta = Se("Hours", !0),
    sa = {
      calendar: {
        sameDay: "[Today at] LT",
        nextDay: "[Tomorrow at] LT",
        nextWeek: "dddd [at] LT",
        lastDay: "[Yesterday at] LT",
        lastWeek: "[Last] dddd [at] LT",
        sameElse: "L",
      },
      longDateFormat: {
        LTS: "h:mm:ss A",
        LT: "h:mm A",
        L: "MM/DD/YYYY",
        LL: "MMMM D, YYYY",
        LLL: "MMMM D, YYYY h:mm A",
        LLLL: "dddd, MMMM D, YYYY h:mm A",
      },
      invalidDate: "Invalid date",
      ordinal: "%d",
      dayOfMonthOrdinalParse: /\d{1,2}/,
      relativeTime: {
        future: "in %s",
        past: "%s ago",
        s: "a few seconds",
        ss: "%d seconds",
        m: "a minute",
        mm: "%d minutes",
        h: "an hour",
        hh: "%d hours",
        d: "a day",
        dd: "%d days",
        M: "a month",
        MM: "%d months",
        y: "a year",
        yy: "%d years",
      },
      months: Oe,
      monthsShort: Pe,
      week: { dow: 0, doy: 6 },
      weekdays: Ge,
      weekdaysMin: Ke,
      weekdaysShort: Ve,
      meridiemParse: /[ap]\.?m?\.?/i,
    },
    na = {},
    da = {};
  function ra(e) {
    return e ? e.toLowerCase().replace("_", "-") : e;
  }
  function _a(e) {
    var a = null;
    if (!na[e] && "undefined" != typeof module && module && module.exports)
      try {
        (a = aa._abbr), require("./locale/" + e), ia(a);
      } catch (e) {}
    return na[e];
  }
  function ia(e, a) {
    var t;
    return (
      e &&
        ((t = o(a) ? ma(e) : oa(e, a))
          ? (aa = t)
          : "undefined" != typeof console &&
            console.warn &&
            console.warn(
              "Locale " + e + " not found. Did you forget to load it?"
            )),
      aa._abbr
    );
  }
  function oa(e, a) {
    if (null === a) return delete na[e], null;
    var t,
      s = sa;
    if (((a.abbr = e), null != na[e]))
      S(
        "defineLocaleOverride",
        "use moment.updateLocale(localeName, config) to change an existing locale. moment.defineLocale(localeName, config) should only be used for creating a new locale See http://momentjs.com/guides/#/warnings/define-locale/ for more info."
      ),
        (s = na[e]._config);
    else if (null != a.parentLocale)
      if (null != na[a.parentLocale]) s = na[a.parentLocale]._config;
      else {
        if (null == (t = _a(a.parentLocale)))
          return (
            da[a.parentLocale] || (da[a.parentLocale] = []),
            da[a.parentLocale].push({ name: e, config: a }),
            null
          );
        s = t._config;
      }
    return (
      (na[e] = new j(b(s, a))),
      da[e] &&
        da[e].forEach(function (e) {
          oa(e.name, e.config);
        }),
      ia(e),
      na[e]
    );
  }
  function ma(e) {
    var a;
    if ((e && e._locale && e._locale._abbr && (e = e._locale._abbr), !e))
      return aa;
    if (!_(e)) {
      if ((a = _a(e))) return a;
      e = [e];
    }
    return (function (e) {
      for (var a, t, s, n, d = 0; d < e.length; ) {
        for (
          a = (n = ra(e[d]).split("-")).length,
            t = (t = ra(e[d + 1])) ? t.split("-") : null;
          0 < a;

        ) {
          if ((s = _a(n.slice(0, a).join("-")))) return s;
          if (t && t.length >= a && r(n, t, !0) >= a - 1) break;
          a--;
        }
        d++;
      }
      return aa;
    })(e);
  }
  function ua(e) {
    var a,
      t = e._a;
    return (
      t &&
        -2 === Y(e).overflow &&
        ((a =
          t[Le] < 0 || 11 < t[Le]
            ? Le
            : t[ce] < 1 || t[ce] > je(t[he], t[Le])
            ? ce
            : t[Ye] < 0 ||
              24 < t[Ye] ||
              (24 === t[Ye] && (0 !== t[ye] || 0 !== t[fe] || 0 !== t[ke]))
            ? Ye
            : t[ye] < 0 || 59 < t[ye]
            ? ye
            : t[fe] < 0 || 59 < t[fe]
            ? fe
            : t[ke] < 0 || 999 < t[ke]
            ? ke
            : -1),
        Y(e)._overflowDayOfYear && (a < he || ce < a) && (a = ce),
        Y(e)._overflowWeeks && -1 === a && (a = pe),
        Y(e)._overflowWeekday && -1 === a && (a = De),
        (Y(e).overflow = a)),
      e
    );
  }
  function la(e, a, t) {
    return null != e ? e : null != a ? a : t;
  }
  function Ma(e) {
    var a,
      t,
      s,
      n,
      d,
      r = [];
    if (!e._d) {
      var _, i;
      for (
        _ = e,
          i = new Date(l.now()),
          s = _._useUTC
            ? [i.getUTCFullYear(), i.getUTCMonth(), i.getUTCDate()]
            : [i.getFullYear(), i.getMonth(), i.getDate()],
          e._w &&
            null == e._a[ce] &&
            null == e._a[Le] &&
            (function (e) {
              var a, t, s, n, d, r, _, i;
              if (null != (a = e._w).GG || null != a.W || null != a.E)
                (d = 1),
                  (r = 4),
                  (t = la(a.GG, e._a[he], Ce(Ha(), 1, 4).year)),
                  (s = la(a.W, 1)),
                  ((n = la(a.E, 1)) < 1 || 7 < n) && (i = !0);
              else {
                (d = e._locale._week.dow), (r = e._locale._week.doy);
                var o = Ce(Ha(), d, r);
                (t = la(a.gg, e._a[he], o.year)),
                  (s = la(a.w, o.week)),
                  null != a.d
                    ? ((n = a.d) < 0 || 6 < n) && (i = !0)
                    : null != a.e
                    ? ((n = a.e + d), (a.e < 0 || 6 < a.e) && (i = !0))
                    : (n = d);
              }
              s < 1 || s > Ie(t, d, r)
                ? (Y(e)._overflowWeeks = !0)
                : null != i
                ? (Y(e)._overflowWeekday = !0)
                : ((_ = Re(t, s, n, d, r)),
                  (e._a[he] = _.year),
                  (e._dayOfYear = _.dayOfYear));
            })(e),
          null != e._dayOfYear &&
            ((d = la(e._a[he], s[he])),
            (e._dayOfYear > Te(d) || 0 === e._dayOfYear) &&
              (Y(e)._overflowDayOfYear = !0),
            (t = Je(d, 0, e._dayOfYear)),
            (e._a[Le] = t.getUTCMonth()),
            (e._a[ce] = t.getUTCDate())),
          a = 0;
        a < 3 && null == e._a[a];
        ++a
      )
        e._a[a] = r[a] = s[a];
      for (; a < 7; a++)
        e._a[a] = r[a] = null == e._a[a] ? (2 === a ? 1 : 0) : e._a[a];
      24 === e._a[Ye] &&
        0 === e._a[ye] &&
        0 === e._a[fe] &&
        0 === e._a[ke] &&
        ((e._nextDay = !0), (e._a[Ye] = 0)),
        (e._d = (e._useUTC
          ? Je
          : function (e, a, t, s, n, d, r) {
              var _;
              return (
                e < 100 && 0 <= e
                  ? ((_ = new Date(e + 400, a, t, s, n, d, r)),
                    isFinite(_.getFullYear()) && _.setFullYear(e))
                  : (_ = new Date(e, a, t, s, n, d, r)),
                _
              );
            }
        ).apply(null, r)),
        (n = e._useUTC ? e._d.getUTCDay() : e._d.getDay()),
        null != e._tzm && e._d.setUTCMinutes(e._d.getUTCMinutes() - e._tzm),
        e._nextDay && (e._a[Ye] = 24),
        e._w &&
          void 0 !== e._w.d &&
          e._w.d !== n &&
          (Y(e).weekdayMismatch = !0);
    }
  }
  var ha = /^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/,
    La = /^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/,
    ca = /Z|[+-]\d\d(?::?\d\d)?/,
    Ya = [
      ["YYYYYY-MM-DD", /[+-]\d{6}-\d\d-\d\d/],
      ["YYYY-MM-DD", /\d{4}-\d\d-\d\d/],
      ["GGGG-[W]WW-E", /\d{4}-W\d\d-\d/],
      ["GGGG-[W]WW", /\d{4}-W\d\d/, !1],
      ["YYYY-DDD", /\d{4}-\d{3}/],
      ["YYYY-MM", /\d{4}-\d\d/, !1],
      ["YYYYYYMMDD", /[+-]\d{10}/],
      ["YYYYMMDD", /\d{8}/],
      ["GGGG[W]WWE", /\d{4}W\d{3}/],
      ["GGGG[W]WW", /\d{4}W\d{2}/, !1],
      ["YYYYDDD", /\d{7}/],
    ],
    ya = [
      ["HH:mm:ss.SSSS", /\d\d:\d\d:\d\d\.\d+/],
      ["HH:mm:ss,SSSS", /\d\d:\d\d:\d\d,\d+/],
      ["HH:mm:ss", /\d\d:\d\d:\d\d/],
      ["HH:mm", /\d\d:\d\d/],
      ["HHmmss.SSSS", /\d\d\d\d\d\d\.\d+/],
      ["HHmmss,SSSS", /\d\d\d\d\d\d,\d+/],
      ["HHmmss", /\d\d\d\d\d\d/],
      ["HHmm", /\d\d\d\d/],
      ["HH", /\d\d/],
    ],
    fa = /^\/?Date\((\-?\d+)/i;
  function ka(e) {
    var a,
      t,
      s,
      n,
      d,
      r,
      _ = e._i,
      i = ha.exec(_) || La.exec(_);
    if (i) {
      for (Y(e).iso = !0, a = 0, t = Ya.length; a < t; a++)
        if (Ya[a][1].exec(i[1])) {
          (n = Ya[a][0]), (s = !1 !== Ya[a][2]);
          break;
        }
      if (null == n) return void (e._isValid = !1);
      if (i[3]) {
        for (a = 0, t = ya.length; a < t; a++)
          if (ya[a][1].exec(i[3])) {
            d = (i[2] || " ") + ya[a][0];
            break;
          }
        if (null == d) return void (e._isValid = !1);
      }
      if (!s && null != d) return void (e._isValid = !1);
      if (i[4]) {
        if (!ca.exec(i[4])) return void (e._isValid = !1);
        r = "Z";
      }
      (e._f = n + (d || "") + (r || "")), wa(e);
    } else e._isValid = !1;
  }
  var pa = /^(?:(Mon|Tue|Wed|Thu|Fri|Sat|Sun),?\s)?(\d{1,2})\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(\d{2,4})\s(\d\d):(\d\d)(?::(\d\d))?\s(?:(UT|GMT|[ECMP][SD]T)|([Zz])|([+-]\d{4}))$/;
  function Da(e, a, t, s, n, d) {
    var r = [
      (function (e) {
        var a = parseInt(e, 10);
        {
          if (a <= 49) return 2e3 + a;
          if (a <= 999) return 1900 + a;
        }
        return a;
      })(e),
      Pe.indexOf(a),
      parseInt(t, 10),
      parseInt(s, 10),
      parseInt(n, 10),
    ];
    return d && r.push(parseInt(d, 10)), r;
  }
  var Ta = {
    UT: 0,
    GMT: 0,
    EDT: -240,
    EST: -300,
    CDT: -300,
    CST: -360,
    MDT: -360,
    MST: -420,
    PDT: -420,
    PST: -480,
  };
  function ga(e) {
    var a,
      t,
      s,
      n = pa.exec(
        e._i
          .replace(/\([^)]*\)|[\n\t]/g, " ")
          .replace(/(\s\s+)/g, " ")
          .replace(/^\s\s*/, "")
          .replace(/\s\s*$/, "")
      );
    if (n) {
      var d = Da(n[4], n[3], n[2], n[5], n[6], n[7]);
      if (
        ((a = n[1]),
        (t = d),
        (s = e),
        a &&
          Ve.indexOf(a) !== new Date(t[0], t[1], t[2]).getDay() &&
          ((Y(s).weekdayMismatch = !0), !(s._isValid = !1)))
      )
        return;
      (e._a = d),
        (e._tzm = (function (e, a, t) {
          if (e) return Ta[e];
          if (a) return 0;
          var s = parseInt(t, 10),
            n = s % 100;
          return ((s - n) / 100) * 60 + n;
        })(n[8], n[9], n[10])),
        (e._d = Je.apply(null, e._a)),
        e._d.setUTCMinutes(e._d.getUTCMinutes() - e._tzm),
        (Y(e).rfc2822 = !0);
    } else e._isValid = !1;
  }
  function wa(e) {
    if (e._f !== l.ISO_8601)
      if (e._f !== l.RFC_2822) {
        (e._a = []), (Y(e).empty = !0);
        var a,
          t,
          s,
          n,
          d,
          r,
          _,
          i,
          o = "" + e._i,
          m = o.length,
          u = 0;
        for (s = U(e._f, e._locale).match(z) || [], a = 0; a < s.length; a++)
          (n = s[a]),
            (t = (o.match(oe(n, e)) || [])[0]) &&
              (0 < (d = o.substr(0, o.indexOf(t))).length &&
                Y(e).unusedInput.push(d),
              (o = o.slice(o.indexOf(t) + t.length)),
              (u += t.length)),
            R[n]
              ? (t ? (Y(e).empty = !1) : Y(e).unusedTokens.push(n),
                (r = n),
                (i = e),
                null != (_ = t) && h(ue, r) && ue[r](_, i._a, i, r))
              : e._strict && !t && Y(e).unusedTokens.push(n);
        (Y(e).charsLeftOver = m - u),
          0 < o.length && Y(e).unusedInput.push(o),
          e._a[Ye] <= 12 &&
            !0 === Y(e).bigHour &&
            0 < e._a[Ye] &&
            (Y(e).bigHour = void 0),
          (Y(e).parsedDateParts = e._a.slice(0)),
          (Y(e).meridiem = e._meridiem),
          (e._a[Ye] = (function (e, a, t) {
            var s;
            if (null == t) return a;
            return null != e.meridiemHour
              ? e.meridiemHour(a, t)
              : (null != e.isPM &&
                  ((s = e.isPM(t)) && a < 12 && (a += 12),
                  s || 12 !== a || (a = 0)),
                a);
          })(e._locale, e._a[Ye], e._meridiem)),
          Ma(e),
          ua(e);
      } else ga(e);
    else ka(e);
  }
  function va(e) {
    var a,
      t,
      s,
      n,
      d = e._i,
      r = e._f;
    return (
      (e._locale = e._locale || ma(e._l)),
      null === d || (void 0 === r && "" === d)
        ? f({ nullInput: !0 })
        : ("string" == typeof d && (e._i = d = e._locale.preparse(d)),
          D(d)
            ? new p(ua(d))
            : (u(d)
                ? (e._d = d)
                : _(r)
                ? (function (e) {
                    var a, t, s, n, d;
                    if (0 === e._f.length)
                      return (Y(e).invalidFormat = !0), (e._d = new Date(NaN));
                    for (n = 0; n < e._f.length; n++)
                      (d = 0),
                        (a = k({}, e)),
                        null != e._useUTC && (a._useUTC = e._useUTC),
                        (a._f = e._f[n]),
                        wa(a),
                        y(a) &&
                          ((d += Y(a).charsLeftOver),
                          (d += 10 * Y(a).unusedTokens.length),
                          (Y(a).score = d),
                          (null == s || d < s) && ((s = d), (t = a)));
                    L(e, t || a);
                  })(e)
                : r
                ? wa(e)
                : o((t = (a = e)._i))
                ? (a._d = new Date(l.now()))
                : u(t)
                ? (a._d = new Date(t.valueOf()))
                : "string" == typeof t
                ? ((s = a),
                  null === (n = fa.exec(s._i))
                    ? (ka(s),
                      !1 === s._isValid &&
                        (delete s._isValid,
                        ga(s),
                        !1 === s._isValid &&
                          (delete s._isValid, l.createFromInputFallback(s))))
                    : (s._d = new Date(+n[1])))
                : _(t)
                ? ((a._a = M(t.slice(0), function (e) {
                    return parseInt(e, 10);
                  })),
                  Ma(a))
                : i(t)
                ? (function (e) {
                    if (!e._d) {
                      var a = W(e._i);
                      (e._a = M(
                        [
                          a.year,
                          a.month,
                          a.day || a.date,
                          a.hour,
                          a.minute,
                          a.second,
                          a.millisecond,
                        ],
                        function (e) {
                          return e && parseInt(e, 10);
                        }
                      )),
                        Ma(e);
                    }
                  })(a)
                : m(t)
                ? (a._d = new Date(t))
                : l.createFromInputFallback(a),
              y(e) || (e._d = null),
              e))
    );
  }
  function Sa(e, a, t, s, n) {
    var d,
      r = {};
    return (
      (!0 !== t && !1 !== t) || ((s = t), (t = void 0)),
      ((i(e) &&
        (function (e) {
          if (Object.getOwnPropertyNames)
            return 0 === Object.getOwnPropertyNames(e).length;
          var a;
          for (a in e) if (e.hasOwnProperty(a)) return !1;
          return !0;
        })(e)) ||
        (_(e) && 0 === e.length)) &&
        (e = void 0),
      (r._isAMomentObject = !0),
      (r._useUTC = r._isUTC = n),
      (r._l = t),
      (r._i = e),
      (r._f = a),
      (r._strict = s),
      (d = new p(ua(va(r))))._nextDay && (d.add(1, "d"), (d._nextDay = void 0)),
      d
    );
  }
  function Ha(e, a, t, s) {
    return Sa(e, a, t, s, !1);
  }
  (l.createFromInputFallback = t(
    "value provided is not in a recognized RFC2822 or ISO format. moment construction falls back to js Date(), which is not reliable across all browsers and versions. Non RFC2822/ISO date formats are discouraged and will be removed in an upcoming major release. Please refer to http://momentjs.com/guides/#/warnings/js-date/ for more info.",
    function (e) {
      e._d = new Date(e._i + (e._useUTC ? " UTC" : ""));
    }
  )),
    (l.ISO_8601 = function () {}),
    (l.RFC_2822 = function () {});
  var ba = t(
      "moment().min is deprecated, use moment.max instead. http://momentjs.com/guides/#/warnings/min-max/",
      function () {
        var e = Ha.apply(null, arguments);
        return this.isValid() && e.isValid() ? (e < this ? this : e) : f();
      }
    ),
    ja = t(
      "moment().max is deprecated, use moment.min instead. http://momentjs.com/guides/#/warnings/min-max/",
      function () {
        var e = Ha.apply(null, arguments);
        return this.isValid() && e.isValid() ? (this < e ? this : e) : f();
      }
    );
  function xa(e, a) {
    var t, s;
    if ((1 === a.length && _(a[0]) && (a = a[0]), !a.length)) return Ha();
    for (t = a[0], s = 1; s < a.length; ++s)
      (a[s].isValid() && !a[s][e](t)) || (t = a[s]);
    return t;
  }
  var Oa = [
    "year",
    "quarter",
    "month",
    "week",
    "day",
    "hour",
    "minute",
    "second",
    "millisecond",
  ];
  function Pa(e) {
    var a = W(e),
      t = a.year || 0,
      s = a.quarter || 0,
      n = a.month || 0,
      d = a.week || a.isoWeek || 0,
      r = a.day || 0,
      _ = a.hour || 0,
      i = a.minute || 0,
      o = a.second || 0,
      m = a.millisecond || 0;
    (this._isValid = (function (e) {
      for (var a in e)
        if (-1 === we.call(Oa, a) || (null != e[a] && isNaN(e[a]))) return !1;
      for (var t = !1, s = 0; s < Oa.length; ++s)
        if (e[Oa[s]]) {
          if (t) return !1;
          parseFloat(e[Oa[s]]) !== g(e[Oa[s]]) && (t = !0);
        }
      return !0;
    })(a)),
      (this._milliseconds = +m + 1e3 * o + 6e4 * i + 1e3 * _ * 60 * 60),
      (this._days = +r + 7 * d),
      (this._months = +n + 3 * s + 12 * t),
      (this._data = {}),
      (this._locale = ma()),
      this._bubble();
  }
  function Wa(e) {
    return e instanceof Pa;
  }
  function Aa(e) {
    return e < 0 ? -1 * Math.round(-1 * e) : Math.round(e);
  }
  function Ea(e, t) {
    C(e, 0, 0, function () {
      var e = this.utcOffset(),
        a = "+";
      return (
        e < 0 && ((e = -e), (a = "-")),
        a + F(~~(e / 60), 2) + t + F(~~e % 60, 2)
      );
    });
  }
  Ea("Z", ":"),
    Ea("ZZ", ""),
    ie("Z", de),
    ie("ZZ", de),
    le(["Z", "ZZ"], function (e, a, t) {
      (t._useUTC = !0), (t._tzm = za(de, e));
    });
  var Fa = /([\+\-]|\d\d)/gi;
  function za(e, a) {
    var t = (a || "").match(e);
    if (null === t) return null;
    var s = ((t[t.length - 1] || []) + "").match(Fa) || ["-", 0, 0],
      n = 60 * s[1] + g(s[2]);
    return 0 === n ? 0 : "+" === s[0] ? n : -n;
  }
  function Ja(e, a) {
    var t, s;
    return a._isUTC
      ? ((t = a.clone()),
        (s = (D(e) || u(e) ? e.valueOf() : Ha(e).valueOf()) - t.valueOf()),
        t._d.setTime(t._d.valueOf() + s),
        l.updateOffset(t, !1),
        t)
      : Ha(e).local();
  }
  function Na(e) {
    return 15 * -Math.round(e._d.getTimezoneOffset() / 15);
  }
  function Ra() {
    return !!this.isValid() && this._isUTC && 0 === this._offset;
  }
  l.updateOffset = function () {};
  var Ca = /^(\-|\+)?(?:(\d*)[. ])?(\d+)\:(\d+)(?:\:(\d+)(\.\d*)?)?$/,
    Ia = /^(-|\+)?P(?:([-+]?[0-9,.]*)Y)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)W)?(?:([-+]?[0-9,.]*)D)?(?:T(?:([-+]?[0-9,.]*)H)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)S)?)?$/;
  function Ua(e, a) {
    var t,
      s,
      n,
      d = e,
      r = null;
    return (
      Wa(e)
        ? (d = { ms: e._milliseconds, d: e._days, M: e._months })
        : m(e)
        ? ((d = {}), a ? (d[a] = e) : (d.milliseconds = e))
        : (r = Ca.exec(e))
        ? ((t = "-" === r[1] ? -1 : 1),
          (d = {
            y: 0,
            d: g(r[ce]) * t,
            h: g(r[Ye]) * t,
            m: g(r[ye]) * t,
            s: g(r[fe]) * t,
            ms: g(Aa(1e3 * r[ke])) * t,
          }))
        : (r = Ia.exec(e))
        ? ((t = "-" === r[1] ? -1 : 1),
          (d = {
            y: Ga(r[2], t),
            M: Ga(r[3], t),
            w: Ga(r[4], t),
            d: Ga(r[5], t),
            h: Ga(r[6], t),
            m: Ga(r[7], t),
            s: Ga(r[8], t),
          }))
        : null == d
        ? (d = {})
        : "object" == typeof d &&
          ("from" in d || "to" in d) &&
          ((n = (function (e, a) {
            var t;
            if (!e.isValid() || !a.isValid())
              return { milliseconds: 0, months: 0 };
            (a = Ja(a, e)),
              e.isBefore(a)
                ? (t = Va(e, a))
                : (((t = Va(a, e)).milliseconds = -t.milliseconds),
                  (t.months = -t.months));
            return t;
          })(Ha(d.from), Ha(d.to))),
          ((d = {}).ms = n.milliseconds),
          (d.M = n.months)),
      (s = new Pa(d)),
      Wa(e) && h(e, "_locale") && (s._locale = e._locale),
      s
    );
  }
  function Ga(e, a) {
    var t = e && parseFloat(e.replace(",", "."));
    return (isNaN(t) ? 0 : t) * a;
  }
  function Va(e, a) {
    var t = {};
    return (
      (t.months = a.month() - e.month() + 12 * (a.year() - e.year())),
      e.clone().add(t.months, "M").isAfter(a) && --t.months,
      (t.milliseconds = +a - +e.clone().add(t.months, "M")),
      t
    );
  }
  function Ka(s, n) {
    return function (e, a) {
      var t;
      return (
        null === a ||
          isNaN(+a) ||
          (S(
            n,
            "moment()." +
              n +
              "(period, number) is deprecated. Please use moment()." +
              n +
              "(number, period). See http://momentjs.com/guides/#/warnings/add-inverted-param/ for more info."
          ),
          (t = e),
          (e = a),
          (a = t)),
        Za(this, Ua((e = "string" == typeof e ? +e : e), a), s),
        this
      );
    };
  }
  function Za(e, a, t, s) {
    var n = a._milliseconds,
      d = Aa(a._days),
      r = Aa(a._months);
    e.isValid() &&
      ((s = null == s || s),
      r && We(e, He(e, "Month") + r * t),
      d && be(e, "Date", He(e, "Date") + d * t),
      n && e._d.setTime(e._d.valueOf() + n * t),
      s && l.updateOffset(e, d || r));
  }
  (Ua.fn = Pa.prototype),
    (Ua.invalid = function () {
      return Ua(NaN);
    });
  var $a = Ka(1, "add"),
    Ba = Ka(-1, "subtract");
  function qa(e, a) {
    var t = 12 * (a.year() - e.year()) + (a.month() - e.month()),
      s = e.clone().add(t, "months");
    return (
      -(
        t +
        (a - s < 0
          ? (a - s) / (s - e.clone().add(t - 1, "months"))
          : (a - s) / (e.clone().add(t + 1, "months") - s))
      ) || 0
    );
  }
  function Qa(e) {
    var a;
    return void 0 === e
      ? this._locale._abbr
      : (null != (a = ma(e)) && (this._locale = a), this);
  }
  (l.defaultFormat = "YYYY-MM-DDTHH:mm:ssZ"),
    (l.defaultFormatUtc = "YYYY-MM-DDTHH:mm:ss[Z]");
  var Xa = t(
    "moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.",
    function (e) {
      return void 0 === e ? this.localeData() : this.locale(e);
    }
  );
  function et() {
    return this._locale;
  }
  var at = 126227808e5;
  function tt(e, a) {
    return ((e % a) + a) % a;
  }
  function st(e, a, t) {
    return e < 100 && 0 <= e
      ? new Date(e + 400, a, t) - at
      : new Date(e, a, t).valueOf();
  }
  function nt(e, a, t) {
    return e < 100 && 0 <= e ? Date.UTC(e + 400, a, t) - at : Date.UTC(e, a, t);
  }
  function dt(e, a) {
    C(0, [e, e.length], 0, a);
  }
  function rt(e, a, t, s, n) {
    var d;
    return null == e
      ? Ce(this, s, n).year
      : ((d = Ie(e, s, n)) < a && (a = d),
        function (e, a, t, s, n) {
          var d = Re(e, a, t, s, n),
            r = Je(d.year, 0, d.dayOfYear);
          return (
            this.year(r.getUTCFullYear()),
            this.month(r.getUTCMonth()),
            this.date(r.getUTCDate()),
            this
          );
        }.call(this, e, a, t, s, n));
  }
  C(0, ["gg", 2], 0, function () {
    return this.weekYear() % 100;
  }),
    C(0, ["GG", 2], 0, function () {
      return this.isoWeekYear() % 100;
    }),
    dt("gggg", "weekYear"),
    dt("ggggg", "weekYear"),
    dt("GGGG", "isoWeekYear"),
    dt("GGGGG", "isoWeekYear"),
    O("weekYear", "gg"),
    O("isoWeekYear", "GG"),
    E("weekYear", 1),
    E("isoWeekYear", 1),
    ie("G", se),
    ie("g", se),
    ie("GG", B, V),
    ie("gg", B, V),
    ie("GGGG", ee, Z),
    ie("gggg", ee, Z),
    ie("GGGGG", ae, $),
    ie("ggggg", ae, $),
    Me(["gggg", "ggggg", "GGGG", "GGGGG"], function (e, a, t, s) {
      a[s.substr(0, 2)] = g(e);
    }),
    Me(["gg", "GG"], function (e, a, t, s) {
      a[s] = l.parseTwoDigitYear(e);
    }),
    C("Q", 0, "Qo", "quarter"),
    O("quarter", "Q"),
    E("quarter", 7),
    ie("Q", G),
    le("Q", function (e, a) {
      a[Le] = 3 * (g(e) - 1);
    }),
    C("D", ["DD", 2], "Do", "date"),
    O("date", "D"),
    E("date", 9),
    ie("D", B),
    ie("DD", B, V),
    ie("Do", function (e, a) {
      return e
        ? a._dayOfMonthOrdinalParse || a._ordinalParse
        : a._dayOfMonthOrdinalParseLenient;
    }),
    le(["D", "DD"], ce),
    le("Do", function (e, a) {
      a[ce] = g(e.match(B)[0]);
    });
  var _t = Se("Date", !0);
  C("DDD", ["DDDD", 3], "DDDo", "dayOfYear"),
    O("dayOfYear", "DDD"),
    E("dayOfYear", 4),
    ie("DDD", X),
    ie("DDDD", K),
    le(["DDD", "DDDD"], function (e, a, t) {
      t._dayOfYear = g(e);
    }),
    C("m", ["mm", 2], 0, "minute"),
    O("minute", "m"),
    E("minute", 14),
    ie("m", B),
    ie("mm", B, V),
    le(["m", "mm"], ye);
  var it = Se("Minutes", !1);
  C("s", ["ss", 2], 0, "second"),
    O("second", "s"),
    E("second", 15),
    ie("s", B),
    ie("ss", B, V),
    le(["s", "ss"], fe);
  var ot,
    mt = Se("Seconds", !1);
  for (
    C("S", 0, 0, function () {
      return ~~(this.millisecond() / 100);
    }),
      C(0, ["SS", 2], 0, function () {
        return ~~(this.millisecond() / 10);
      }),
      C(0, ["SSS", 3], 0, "millisecond"),
      C(0, ["SSSS", 4], 0, function () {
        return 10 * this.millisecond();
      }),
      C(0, ["SSSSS", 5], 0, function () {
        return 100 * this.millisecond();
      }),
      C(0, ["SSSSSS", 6], 0, function () {
        return 1e3 * this.millisecond();
      }),
      C(0, ["SSSSSSS", 7], 0, function () {
        return 1e4 * this.millisecond();
      }),
      C(0, ["SSSSSSSS", 8], 0, function () {
        return 1e5 * this.millisecond();
      }),
      C(0, ["SSSSSSSSS", 9], 0, function () {
        return 1e6 * this.millisecond();
      }),
      O("millisecond", "ms"),
      E("millisecond", 16),
      ie("S", X, G),
      ie("SS", X, V),
      ie("SSS", X, K),
      ot = "SSSS";
    ot.length <= 9;
    ot += "S"
  )
    ie(ot, te);
  function ut(e, a) {
    a[ke] = g(1e3 * ("0." + e));
  }
  for (ot = "S"; ot.length <= 9; ot += "S") le(ot, ut);
  var lt = Se("Milliseconds", !1);
  C("z", 0, 0, "zoneAbbr"), C("zz", 0, 0, "zoneName");
  var Mt = p.prototype;
  function ht(e) {
    return e;
  }
  (Mt.add = $a),
    (Mt.calendar = function (e, a) {
      var t = e || Ha(),
        s = Ja(t, this).startOf("day"),
        n = l.calendarFormat(this, s) || "sameElse",
        d = a && (H(a[n]) ? a[n].call(this, t) : a[n]);
      return this.format(d || this.localeData().calendar(n, this, Ha(t)));
    }),
    (Mt.clone = function () {
      return new p(this);
    }),
    (Mt.diff = function (e, a, t) {
      var s, n, d;
      if (!this.isValid()) return NaN;
      if (!(s = Ja(e, this)).isValid()) return NaN;
      switch (((n = 6e4 * (s.utcOffset() - this.utcOffset())), (a = P(a)))) {
        case "year":
          d = qa(this, s) / 12;
          break;
        case "month":
          d = qa(this, s);
          break;
        case "quarter":
          d = qa(this, s) / 3;
          break;
        case "second":
          d = (this - s) / 1e3;
          break;
        case "minute":
          d = (this - s) / 6e4;
          break;
        case "hour":
          d = (this - s) / 36e5;
          break;
        case "day":
          d = (this - s - n) / 864e5;
          break;
        case "week":
          d = (this - s - n) / 6048e5;
          break;
        default:
          d = this - s;
      }
      return t ? d : T(d);
    }),
    (Mt.endOf = function (e) {
      var a;
      if (void 0 === (e = P(e)) || "millisecond" === e || !this.isValid())
        return this;
      var t = this._isUTC ? nt : st;
      switch (e) {
        case "year":
          a = t(this.year() + 1, 0, 1) - 1;
          break;
        case "quarter":
          a = t(this.year(), this.month() - (this.month() % 3) + 3, 1) - 1;
          break;
        case "month":
          a = t(this.year(), this.month() + 1, 1) - 1;
          break;
        case "week":
          a =
            t(this.year(), this.month(), this.date() - this.weekday() + 7) - 1;
          break;
        case "isoWeek":
          a =
            t(
              this.year(),
              this.month(),
              this.date() - (this.isoWeekday() - 1) + 7
            ) - 1;
          break;
        case "day":
        case "date":
          a = t(this.year(), this.month(), this.date() + 1) - 1;
          break;
        case "hour":
          (a = this._d.valueOf()),
            (a +=
              36e5 -
              tt(a + (this._isUTC ? 0 : 6e4 * this.utcOffset()), 36e5) -
              1);
          break;
        case "minute":
          (a = this._d.valueOf()), (a += 6e4 - tt(a, 6e4) - 1);
          break;
        case "second":
          (a = this._d.valueOf()), (a += 1e3 - tt(a, 1e3) - 1);
          break;
      }
      return this._d.setTime(a), l.updateOffset(this, !0), this;
    }),
    (Mt.format = function (e) {
      e || (e = this.isUtc() ? l.defaultFormatUtc : l.defaultFormat);
      var a = I(this, e);
      return this.localeData().postformat(a);
    }),
    (Mt.from = function (e, a) {
      return this.isValid() && ((D(e) && e.isValid()) || Ha(e).isValid())
        ? Ua({ to: this, from: e }).locale(this.locale()).humanize(!a)
        : this.localeData().invalidDate();
    }),
    (Mt.fromNow = function (e) {
      return this.from(Ha(), e);
    }),
    (Mt.to = function (e, a) {
      return this.isValid() && ((D(e) && e.isValid()) || Ha(e).isValid())
        ? Ua({ from: this, to: e }).locale(this.locale()).humanize(!a)
        : this.localeData().invalidDate();
    }),
    (Mt.toNow = function (e) {
      return this.to(Ha(), e);
    }),
    (Mt.get = function (e) {
      return H(this[(e = P(e))]) ? this[e]() : this;
    }),
    (Mt.invalidAt = function () {
      return Y(this).overflow;
    }),
    (Mt.isAfter = function (e, a) {
      var t = D(e) ? e : Ha(e);
      return (
        !(!this.isValid() || !t.isValid()) &&
        ("millisecond" === (a = P(a) || "millisecond")
          ? this.valueOf() > t.valueOf()
          : t.valueOf() < this.clone().startOf(a).valueOf())
      );
    }),
    (Mt.isBefore = function (e, a) {
      var t = D(e) ? e : Ha(e);
      return (
        !(!this.isValid() || !t.isValid()) &&
        ("millisecond" === (a = P(a) || "millisecond")
          ? this.valueOf() < t.valueOf()
          : this.clone().endOf(a).valueOf() < t.valueOf())
      );
    }),
    (Mt.isBetween = function (e, a, t, s) {
      var n = D(e) ? e : Ha(e),
        d = D(a) ? a : Ha(a);
      return (
        !!(this.isValid() && n.isValid() && d.isValid()) &&
        ("(" === (s = s || "()")[0]
          ? this.isAfter(n, t)
          : !this.isBefore(n, t)) &&
        (")" === s[1] ? this.isBefore(d, t) : !this.isAfter(d, t))
      );
    }),
    (Mt.isSame = function (e, a) {
      var t,
        s = D(e) ? e : Ha(e);
      return (
        !(!this.isValid() || !s.isValid()) &&
        ("millisecond" === (a = P(a) || "millisecond")
          ? this.valueOf() === s.valueOf()
          : ((t = s.valueOf()),
            this.clone().startOf(a).valueOf() <= t &&
              t <= this.clone().endOf(a).valueOf()))
      );
    }),
    (Mt.isSameOrAfter = function (e, a) {
      return this.isSame(e, a) || this.isAfter(e, a);
    }),
    (Mt.isSameOrBefore = function (e, a) {
      return this.isSame(e, a) || this.isBefore(e, a);
    }),
    (Mt.isValid = function () {
      return y(this);
    }),
    (Mt.lang = Xa),
    (Mt.locale = Qa),
    (Mt.localeData = et),
    (Mt.max = ja),
    (Mt.min = ba),
    (Mt.parsingFlags = function () {
      return L({}, Y(this));
    }),
    (Mt.set = function (e, a) {
      if ("object" == typeof e)
        for (
          var t = (function (e) {
              var a = [];
              for (var t in e) a.push({ unit: t, priority: A[t] });
              return (
                a.sort(function (e, a) {
                  return e.priority - a.priority;
                }),
                a
              );
            })((e = W(e))),
            s = 0;
          s < t.length;
          s++
        )
          this[t[s].unit](e[t[s].unit]);
      else if (H(this[(e = P(e))])) return this[e](a);
      return this;
    }),
    (Mt.startOf = function (e) {
      var a;
      if (void 0 === (e = P(e)) || "millisecond" === e || !this.isValid())
        return this;
      var t = this._isUTC ? nt : st;
      switch (e) {
        case "year":
          a = t(this.year(), 0, 1);
          break;
        case "quarter":
          a = t(this.year(), this.month() - (this.month() % 3), 1);
          break;
        case "month":
          a = t(this.year(), this.month(), 1);
          break;
        case "week":
          a = t(this.year(), this.month(), this.date() - this.weekday());
          break;
        case "isoWeek":
          a = t(
            this.year(),
            this.month(),
            this.date() - (this.isoWeekday() - 1)
          );
          break;
        case "day":
        case "date":
          a = t(this.year(), this.month(), this.date());
          break;
        case "hour":
          (a = this._d.valueOf()),
            (a -= tt(a + (this._isUTC ? 0 : 6e4 * this.utcOffset()), 36e5));
          break;
        case "minute":
          (a = this._d.valueOf()), (a -= tt(a, 6e4));
          break;
        case "second":
          (a = this._d.valueOf()), (a -= tt(a, 1e3));
          break;
      }
      return this._d.setTime(a), l.updateOffset(this, !0), this;
    }),
    (Mt.subtract = Ba),
    (Mt.toArray = function () {
      var e = this;
      return [
        e.year(),
        e.month(),
        e.date(),
        e.hour(),
        e.minute(),
        e.second(),
        e.millisecond(),
      ];
    }),
    (Mt.toObject = function () {
      var e = this;
      return {
        years: e.year(),
        months: e.month(),
        date: e.date(),
        hours: e.hours(),
        minutes: e.minutes(),
        seconds: e.seconds(),
        milliseconds: e.milliseconds(),
      };
    }),
    (Mt.toDate = function () {
      return new Date(this.valueOf());
    }),
    (Mt.toISOString = function (e) {
      if (!this.isValid()) return null;
      var a = !0 !== e,
        t = a ? this.clone().utc() : this;
      return t.year() < 0 || 9999 < t.year()
        ? I(
            t,
            a
              ? "YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]"
              : "YYYYYY-MM-DD[T]HH:mm:ss.SSSZ"
          )
        : H(Date.prototype.toISOString)
        ? a
          ? this.toDate().toISOString()
          : new Date(this.valueOf() + 60 * this.utcOffset() * 1e3)
              .toISOString()
              .replace("Z", I(t, "Z"))
        : I(
            t,
            a ? "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]" : "YYYY-MM-DD[T]HH:mm:ss.SSSZ"
          );
    }),
    (Mt.inspect = function () {
      if (!this.isValid()) return "moment.invalid(/* " + this._i + " */)";
      var e = "moment",
        a = "";
      this.isLocal() ||
        ((e = 0 === this.utcOffset() ? "moment.utc" : "moment.parseZone"),
        (a = "Z"));
      var t = "[" + e + '("]',
        s = 0 <= this.year() && this.year() <= 9999 ? "YYYY" : "YYYYYY",
        n = a + '[")]';
      return this.format(t + s + "-MM-DD[T]HH:mm:ss.SSS" + n);
    }),
    (Mt.toJSON = function () {
      return this.isValid() ? this.toISOString() : null;
    }),
    (Mt.toString = function () {
      return this.clone()
        .locale("en")
        .format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ");
    }),
    (Mt.unix = function () {
      return Math.floor(this.valueOf() / 1e3);
    }),
    (Mt.valueOf = function () {
      return this._d.valueOf() - 6e4 * (this._offset || 0);
    }),
    (Mt.creationData = function () {
      return {
        input: this._i,
        format: this._f,
        locale: this._locale,
        isUTC: this._isUTC,
        strict: this._strict,
      };
    }),
    (Mt.year = ve),
    (Mt.isLeapYear = function () {
      return ge(this.year());
    }),
    (Mt.weekYear = function (e) {
      return rt.call(
        this,
        e,
        this.week(),
        this.weekday(),
        this.localeData()._week.dow,
        this.localeData()._week.doy
      );
    }),
    (Mt.isoWeekYear = function (e) {
      return rt.call(this, e, this.isoWeek(), this.isoWeekday(), 1, 4);
    }),
    (Mt.quarter = Mt.quarters = function (e) {
      return null == e
        ? Math.ceil((this.month() + 1) / 3)
        : this.month(3 * (e - 1) + (this.month() % 3));
    }),
    (Mt.month = Ae),
    (Mt.daysInMonth = function () {
      return je(this.year(), this.month());
    }),
    (Mt.week = Mt.weeks = function (e) {
      var a = this.localeData().week(this);
      return null == e ? a : this.add(7 * (e - a), "d");
    }),
    (Mt.isoWeek = Mt.isoWeeks = function (e) {
      var a = Ce(this, 1, 4).week;
      return null == e ? a : this.add(7 * (e - a), "d");
    }),
    (Mt.weeksInYear = function () {
      var e = this.localeData()._week;
      return Ie(this.year(), e.dow, e.doy);
    }),
    (Mt.isoWeeksInYear = function () {
      return Ie(this.year(), 1, 4);
    }),
    (Mt.date = _t),
    (Mt.day = Mt.days = function (e) {
      if (!this.isValid()) return null != e ? this : NaN;
      var a,
        t,
        s = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
      return null != e
        ? ((a = e),
          (t = this.localeData()),
          (e =
            "string" != typeof a
              ? a
              : isNaN(a)
              ? "number" == typeof (a = t.weekdaysParse(a))
                ? a
                : null
              : parseInt(a, 10)),
          this.add(e - s, "d"))
        : s;
    }),
    (Mt.weekday = function (e) {
      if (!this.isValid()) return null != e ? this : NaN;
      var a = (this.day() + 7 - this.localeData()._week.dow) % 7;
      return null == e ? a : this.add(e - a, "d");
    }),
    (Mt.isoWeekday = function (e) {
      if (!this.isValid()) return null != e ? this : NaN;
      if (null == e) return this.day() || 7;
      var a,
        t,
        s =
          ((a = e),
          (t = this.localeData()),
          "string" == typeof a
            ? t.weekdaysParse(a) % 7 || 7
            : isNaN(a)
            ? null
            : a);
      return this.day(this.day() % 7 ? s : s - 7);
    }),
    (Mt.dayOfYear = function (e) {
      var a =
        Math.round(
          (this.clone().startOf("day") - this.clone().startOf("year")) / 864e5
        ) + 1;
      return null == e ? a : this.add(e - a, "d");
    }),
    (Mt.hour = Mt.hours = ta),
    (Mt.minute = Mt.minutes = it),
    (Mt.second = Mt.seconds = mt),
    (Mt.millisecond = Mt.milliseconds = lt),
    (Mt.utcOffset = function (e, a, t) {
      var s,
        n = this._offset || 0;
      if (!this.isValid()) return null != e ? this : NaN;
      if (null == e) return this._isUTC ? n : Na(this);
      if ("string" == typeof e) {
        if (null === (e = za(de, e))) return this;
      } else Math.abs(e) < 16 && !t && (e *= 60);
      return (
        !this._isUTC && a && (s = Na(this)),
        (this._offset = e),
        (this._isUTC = !0),
        null != s && this.add(s, "m"),
        n !== e &&
          (!a || this._changeInProgress
            ? Za(this, Ua(e - n, "m"), 1, !1)
            : this._changeInProgress ||
              ((this._changeInProgress = !0),
              l.updateOffset(this, !0),
              (this._changeInProgress = null))),
        this
      );
    }),
    (Mt.utc = function (e) {
      return this.utcOffset(0, e);
    }),
    (Mt.local = function (e) {
      return (
        this._isUTC &&
          (this.utcOffset(0, e),
          (this._isUTC = !1),
          e && this.subtract(Na(this), "m")),
        this
      );
    }),
    (Mt.parseZone = function () {
      if (null != this._tzm) this.utcOffset(this._tzm, !1, !0);
      else if ("string" == typeof this._i) {
        var e = za(ne, this._i);
        null != e ? this.utcOffset(e) : this.utcOffset(0, !0);
      }
      return this;
    }),
    (Mt.hasAlignedHourOffset = function (e) {
      return (
        !!this.isValid() &&
        ((e = e ? Ha(e).utcOffset() : 0), (this.utcOffset() - e) % 60 == 0)
      );
    }),
    (Mt.isDST = function () {
      return (
        this.utcOffset() > this.clone().month(0).utcOffset() ||
        this.utcOffset() > this.clone().month(5).utcOffset()
      );
    }),
    (Mt.isLocal = function () {
      return !!this.isValid() && !this._isUTC;
    }),
    (Mt.isUtcOffset = function () {
      return !!this.isValid() && this._isUTC;
    }),
    (Mt.isUtc = Ra),
    (Mt.isUTC = Ra),
    (Mt.zoneAbbr = function () {
      return this._isUTC ? "UTC" : "";
    }),
    (Mt.zoneName = function () {
      return this._isUTC ? "Coordinated Universal Time" : "";
    }),
    (Mt.dates = t("dates accessor is deprecated. Use date instead.", _t)),
    (Mt.months = t("months accessor is deprecated. Use month instead", Ae)),
    (Mt.years = t("years accessor is deprecated. Use year instead", ve)),
    (Mt.zone = t(
      "moment().zone is deprecated, use moment().utcOffset instead. http://momentjs.com/guides/#/warnings/zone/",
      function (e, a) {
        return null != e
          ? ("string" != typeof e && (e = -e), this.utcOffset(e, a), this)
          : -this.utcOffset();
      }
    )),
    (Mt.isDSTShifted = t(
      "isDSTShifted is deprecated. See http://momentjs.com/guides/#/warnings/dst-shifted/ for more information",
      function () {
        if (!o(this._isDSTShifted)) return this._isDSTShifted;
        var e = {};
        if ((k(e, this), (e = va(e))._a)) {
          var a = e._isUTC ? c(e._a) : Ha(e._a);
          this._isDSTShifted = this.isValid() && 0 < r(e._a, a.toArray());
        } else this._isDSTShifted = !1;
        return this._isDSTShifted;
      }
    ));
  var Lt = j.prototype;
  function ct(e, a, t, s) {
    var n = ma(),
      d = c().set(s, a);
    return n[t](d, e);
  }
  function Yt(e, a, t) {
    if ((m(e) && ((a = e), (e = void 0)), (e = e || ""), null != a))
      return ct(e, a, t, "month");
    var s,
      n = [];
    for (s = 0; s < 12; s++) n[s] = ct(e, s, t, "month");
    return n;
  }
  function yt(e, a, t, s) {
    a =
      ("boolean" == typeof e
        ? m(a) && ((t = a), (a = void 0))
        : ((a = e), (e = !1), m((t = a)) && ((t = a), (a = void 0))),
      a || "");
    var n,
      d = ma(),
      r = e ? d._week.dow : 0;
    if (null != t) return ct(a, (t + r) % 7, s, "day");
    var _ = [];
    for (n = 0; n < 7; n++) _[n] = ct(a, (n + r) % 7, s, "day");
    return _;
  }
  (Lt.calendar = function (e, a, t) {
    var s = this._calendar[e] || this._calendar.sameElse;
    return H(s) ? s.call(a, t) : s;
  }),
    (Lt.longDateFormat = function (e) {
      var a = this._longDateFormat[e],
        t = this._longDateFormat[e.toUpperCase()];
      return a || !t
        ? a
        : ((this._longDateFormat[e] = t.replace(/MMMM|MM|DD|dddd/g, function (
            e
          ) {
            return e.slice(1);
          })),
          this._longDateFormat[e]);
    }),
    (Lt.invalidDate = function () {
      return this._invalidDate;
    }),
    (Lt.ordinal = function (e) {
      return this._ordinal.replace("%d", e);
    }),
    (Lt.preparse = ht),
    (Lt.postformat = ht),
    (Lt.relativeTime = function (e, a, t, s) {
      var n = this._relativeTime[t];
      return H(n) ? n(e, a, t, s) : n.replace(/%d/i, e);
    }),
    (Lt.pastFuture = function (e, a) {
      var t = this._relativeTime[0 < e ? "future" : "past"];
      return H(t) ? t(a) : t.replace(/%s/i, a);
    }),
    (Lt.set = function (e) {
      var a, t;
      for (t in e) H((a = e[t])) ? (this[t] = a) : (this["_" + t] = a);
      (this._config = e),
        (this._dayOfMonthOrdinalParseLenient = new RegExp(
          (this._dayOfMonthOrdinalParse.source || this._ordinalParse.source) +
            "|" +
            /\d{1,2}/.source
        ));
    }),
    (Lt.months = function (e, a) {
      return e
        ? _(this._months)
          ? this._months[e.month()]
          : this._months[
              (this._months.isFormat || xe).test(a) ? "format" : "standalone"
            ][e.month()]
        : _(this._months)
        ? this._months
        : this._months.standalone;
    }),
    (Lt.monthsShort = function (e, a) {
      return e
        ? _(this._monthsShort)
          ? this._monthsShort[e.month()]
          : this._monthsShort[xe.test(a) ? "format" : "standalone"][e.month()]
        : _(this._monthsShort)
        ? this._monthsShort
        : this._monthsShort.standalone;
    }),
    (Lt.monthsParse = function (e, a, t) {
      var s, n, d;
      if (this._monthsParseExact)
        return function (e, a, t) {
          var s,
            n,
            d,
            r = e.toLocaleLowerCase();
          if (!this._monthsParse)
            for (
              this._monthsParse = [],
                this._longMonthsParse = [],
                this._shortMonthsParse = [],
                s = 0;
              s < 12;
              ++s
            )
              (d = c([2e3, s])),
                (this._shortMonthsParse[s] = this.monthsShort(
                  d,
                  ""
                ).toLocaleLowerCase()),
                (this._longMonthsParse[s] = this.months(
                  d,
                  ""
                ).toLocaleLowerCase());
          return t
            ? "MMM" === a
              ? -1 !== (n = we.call(this._shortMonthsParse, r))
                ? n
                : null
              : -1 !== (n = we.call(this._longMonthsParse, r))
              ? n
              : null
            : "MMM" === a
            ? -1 !== (n = we.call(this._shortMonthsParse, r))
              ? n
              : -1 !== (n = we.call(this._longMonthsParse, r))
              ? n
              : null
            : -1 !== (n = we.call(this._longMonthsParse, r))
            ? n
            : -1 !== (n = we.call(this._shortMonthsParse, r))
            ? n
            : null;
        }.call(this, e, a, t);
      for (
        this._monthsParse ||
          ((this._monthsParse = []),
          (this._longMonthsParse = []),
          (this._shortMonthsParse = [])),
          s = 0;
        s < 12;
        s++
      ) {
        if (
          ((n = c([2e3, s])),
          t &&
            !this._longMonthsParse[s] &&
            ((this._longMonthsParse[s] = new RegExp(
              "^" + this.months(n, "").replace(".", "") + "$",
              "i"
            )),
            (this._shortMonthsParse[s] = new RegExp(
              "^" + this.monthsShort(n, "").replace(".", "") + "$",
              "i"
            ))),
          t ||
            this._monthsParse[s] ||
            ((d = "^" + this.months(n, "") + "|^" + this.monthsShort(n, "")),
            (this._monthsParse[s] = new RegExp(d.replace(".", ""), "i"))),
          t && "MMMM" === a && this._longMonthsParse[s].test(e))
        )
          return s;
        if (t && "MMM" === a && this._shortMonthsParse[s].test(e)) return s;
        if (!t && this._monthsParse[s].test(e)) return s;
      }
    }),
    (Lt.monthsRegex = function (e) {
      return this._monthsParseExact
        ? (h(this, "_monthsRegex") || ze.call(this),
          e ? this._monthsStrictRegex : this._monthsRegex)
        : (h(this, "_monthsRegex") || (this._monthsRegex = Fe),
          this._monthsStrictRegex && e
            ? this._monthsStrictRegex
            : this._monthsRegex);
    }),
    (Lt.monthsShortRegex = function (e) {
      return this._monthsParseExact
        ? (h(this, "_monthsRegex") || ze.call(this),
          e ? this._monthsShortStrictRegex : this._monthsShortRegex)
        : (h(this, "_monthsShortRegex") || (this._monthsShortRegex = Ee),
          this._monthsShortStrictRegex && e
            ? this._monthsShortStrictRegex
            : this._monthsShortRegex);
    }),
    (Lt.week = function (e) {
      return Ce(e, this._week.dow, this._week.doy).week;
    }),
    (Lt.firstDayOfYear = function () {
      return this._week.doy;
    }),
    (Lt.firstDayOfWeek = function () {
      return this._week.dow;
    }),
    (Lt.weekdays = function (e, a) {
      var t = _(this._weekdays)
        ? this._weekdays
        : this._weekdays[
            e && !0 !== e && this._weekdays.isFormat.test(a)
              ? "format"
              : "standalone"
          ];
      return !0 === e ? Ue(t, this._week.dow) : e ? t[e.day()] : t;
    }),
    (Lt.weekdaysMin = function (e) {
      return !0 === e
        ? Ue(this._weekdaysMin, this._week.dow)
        : e
        ? this._weekdaysMin[e.day()]
        : this._weekdaysMin;
    }),
    (Lt.weekdaysShort = function (e) {
      return !0 === e
        ? Ue(this._weekdaysShort, this._week.dow)
        : e
        ? this._weekdaysShort[e.day()]
        : this._weekdaysShort;
    }),
    (Lt.weekdaysParse = function (e, a, t) {
      var s, n, d;
      if (this._weekdaysParseExact)
        return function (e, a, t) {
          var s,
            n,
            d,
            r = e.toLocaleLowerCase();
          if (!this._weekdaysParse)
            for (
              this._weekdaysParse = [],
                this._shortWeekdaysParse = [],
                this._minWeekdaysParse = [],
                s = 0;
              s < 7;
              ++s
            )
              (d = c([2e3, 1]).day(s)),
                (this._minWeekdaysParse[s] = this.weekdaysMin(
                  d,
                  ""
                ).toLocaleLowerCase()),
                (this._shortWeekdaysParse[s] = this.weekdaysShort(
                  d,
                  ""
                ).toLocaleLowerCase()),
                (this._weekdaysParse[s] = this.weekdays(
                  d,
                  ""
                ).toLocaleLowerCase());
          return t
            ? "dddd" === a
              ? -1 !== (n = we.call(this._weekdaysParse, r))
                ? n
                : null
              : "ddd" === a
              ? -1 !== (n = we.call(this._shortWeekdaysParse, r))
                ? n
                : null
              : -1 !== (n = we.call(this._minWeekdaysParse, r))
              ? n
              : null
            : "dddd" === a
            ? -1 !== (n = we.call(this._weekdaysParse, r))
              ? n
              : -1 !== (n = we.call(this._shortWeekdaysParse, r))
              ? n
              : -1 !== (n = we.call(this._minWeekdaysParse, r))
              ? n
              : null
            : "ddd" === a
            ? -1 !== (n = we.call(this._shortWeekdaysParse, r))
              ? n
              : -1 !== (n = we.call(this._weekdaysParse, r))
              ? n
              : -1 !== (n = we.call(this._minWeekdaysParse, r))
              ? n
              : null
            : -1 !== (n = we.call(this._minWeekdaysParse, r))
            ? n
            : -1 !== (n = we.call(this._weekdaysParse, r))
            ? n
            : -1 !== (n = we.call(this._shortWeekdaysParse, r))
            ? n
            : null;
        }.call(this, e, a, t);
      for (
        this._weekdaysParse ||
          ((this._weekdaysParse = []),
          (this._minWeekdaysParse = []),
          (this._shortWeekdaysParse = []),
          (this._fullWeekdaysParse = [])),
          s = 0;
        s < 7;
        s++
      ) {
        if (
          ((n = c([2e3, 1]).day(s)),
          t &&
            !this._fullWeekdaysParse[s] &&
            ((this._fullWeekdaysParse[s] = new RegExp(
              "^" + this.weekdays(n, "").replace(".", "\\.?") + "$",
              "i"
            )),
            (this._shortWeekdaysParse[s] = new RegExp(
              "^" + this.weekdaysShort(n, "").replace(".", "\\.?") + "$",
              "i"
            )),
            (this._minWeekdaysParse[s] = new RegExp(
              "^" + this.weekdaysMin(n, "").replace(".", "\\.?") + "$",
              "i"
            ))),
          this._weekdaysParse[s] ||
            ((d =
              "^" +
              this.weekdays(n, "") +
              "|^" +
              this.weekdaysShort(n, "") +
              "|^" +
              this.weekdaysMin(n, "")),
            (this._weekdaysParse[s] = new RegExp(d.replace(".", ""), "i"))),
          t && "dddd" === a && this._fullWeekdaysParse[s].test(e))
        )
          return s;
        if (t && "ddd" === a && this._shortWeekdaysParse[s].test(e)) return s;
        if (t && "dd" === a && this._minWeekdaysParse[s].test(e)) return s;
        if (!t && this._weekdaysParse[s].test(e)) return s;
      }
    }),
    (Lt.weekdaysRegex = function (e) {
      return this._weekdaysParseExact
        ? (h(this, "_weekdaysRegex") || qe.call(this),
          e ? this._weekdaysStrictRegex : this._weekdaysRegex)
        : (h(this, "_weekdaysRegex") || (this._weekdaysRegex = Ze),
          this._weekdaysStrictRegex && e
            ? this._weekdaysStrictRegex
            : this._weekdaysRegex);
    }),
    (Lt.weekdaysShortRegex = function (e) {
      return this._weekdaysParseExact
        ? (h(this, "_weekdaysRegex") || qe.call(this),
          e ? this._weekdaysShortStrictRegex : this._weekdaysShortRegex)
        : (h(this, "_weekdaysShortRegex") || (this._weekdaysShortRegex = $e),
          this._weekdaysShortStrictRegex && e
            ? this._weekdaysShortStrictRegex
            : this._weekdaysShortRegex);
    }),
    (Lt.weekdaysMinRegex = function (e) {
      return this._weekdaysParseExact
        ? (h(this, "_weekdaysRegex") || qe.call(this),
          e ? this._weekdaysMinStrictRegex : this._weekdaysMinRegex)
        : (h(this, "_weekdaysMinRegex") || (this._weekdaysMinRegex = Be),
          this._weekdaysMinStrictRegex && e
            ? this._weekdaysMinStrictRegex
            : this._weekdaysMinRegex);
    }),
    (Lt.isPM = function (e) {
      return "p" === (e + "").toLowerCase().charAt(0);
    }),
    (Lt.meridiem = function (e, a, t) {
      return 11 < e ? (t ? "pm" : "PM") : t ? "am" : "AM";
    }),
    ia("en", {
      dayOfMonthOrdinalParse: /\d{1,2}(th|st|nd|rd)/,
      ordinal: function (e) {
        var a = e % 10;
        return (
          e +
          (1 === g((e % 100) / 10)
            ? "th"
            : 1 === a
            ? "st"
            : 2 === a
            ? "nd"
            : 3 === a
            ? "rd"
            : "th")
        );
      },
    }),
    (l.lang = t("moment.lang is deprecated. Use moment.locale instead.", ia)),
    (l.langData = t(
      "moment.langData is deprecated. Use moment.localeData instead.",
      ma
    ));
  var ft = Math.abs;
  function kt(e, a, t, s) {
    var n = Ua(a, t);
    return (
      (e._milliseconds += s * n._milliseconds),
      (e._days += s * n._days),
      (e._months += s * n._months),
      e._bubble()
    );
  }
  function pt(e) {
    return e < 0 ? Math.floor(e) : Math.ceil(e);
  }
  function Dt(e) {
    return (4800 * e) / 146097;
  }
  function Tt(e) {
    return (146097 * e) / 4800;
  }
  function gt(e) {
    return function () {
      return this.as(e);
    };
  }
  var wt = gt("ms"),
    vt = gt("s"),
    St = gt("m"),
    Ht = gt("h"),
    bt = gt("d"),
    jt = gt("w"),
    xt = gt("M"),
    Ot = gt("Q"),
    Pt = gt("y");
  function Wt(e) {
    return function () {
      return this.isValid() ? this._data[e] : NaN;
    };
  }
  var At = Wt("milliseconds"),
    Et = Wt("seconds"),
    Ft = Wt("minutes"),
    zt = Wt("hours"),
    Jt = Wt("days"),
    Nt = Wt("months"),
    Rt = Wt("years");
  var Ct = Math.round,
    It = { ss: 44, s: 45, m: 45, h: 22, d: 26, M: 11 };
  var Ut = Math.abs;
  function Gt(e) {
    return (0 < e) - (e < 0) || +e;
  }
  function Vt() {
    if (!this.isValid()) return this.localeData().invalidDate();
    var e,
      a,
      t = Ut(this._milliseconds) / 1e3,
      s = Ut(this._days),
      n = Ut(this._months);
    (a = T((e = T(t / 60)) / 60)), (t %= 60), (e %= 60);
    var d = T(n / 12),
      r = (n %= 12),
      _ = s,
      i = a,
      o = e,
      m = t ? t.toFixed(3).replace(/\.?0+$/, "") : "",
      u = this.asSeconds();
    if (!u) return "P0D";
    var l = u < 0 ? "-" : "",
      M = Gt(this._months) !== Gt(u) ? "-" : "",
      h = Gt(this._days) !== Gt(u) ? "-" : "",
      L = Gt(this._milliseconds) !== Gt(u) ? "-" : "";
    return (
      l +
      "P" +
      (d ? M + d + "Y" : "") +
      (r ? M + r + "M" : "") +
      (_ ? h + _ + "D" : "") +
      (i || o || m ? "T" : "") +
      (i ? L + i + "H" : "") +
      (o ? L + o + "M" : "") +
      (m ? L + m + "S" : "")
    );
  }
  var Kt = Pa.prototype;
  (Kt.isValid = function () {
    return this._isValid;
  }),
    (Kt.abs = function () {
      var e = this._data;
      return (
        (this._milliseconds = ft(this._milliseconds)),
        (this._days = ft(this._days)),
        (this._months = ft(this._months)),
        (e.milliseconds = ft(e.milliseconds)),
        (e.seconds = ft(e.seconds)),
        (e.minutes = ft(e.minutes)),
        (e.hours = ft(e.hours)),
        (e.months = ft(e.months)),
        (e.years = ft(e.years)),
        this
      );
    }),
    (Kt.add = function (e, a) {
      return kt(this, e, a, 1);
    }),
    (Kt.subtract = function (e, a) {
      return kt(this, e, a, -1);
    }),
    (Kt.as = function (e) {
      if (!this.isValid()) return NaN;
      var a,
        t,
        s = this._milliseconds;
      if ("month" === (e = P(e)) || "quarter" === e || "year" === e)
        switch (((a = this._days + s / 864e5), (t = this._months + Dt(a)), e)) {
          case "month":
            return t;
          case "quarter":
            return t / 3;
          case "year":
            return t / 12;
        }
      else
        switch (((a = this._days + Math.round(Tt(this._months))), e)) {
          case "week":
            return a / 7 + s / 6048e5;
          case "day":
            return a + s / 864e5;
          case "hour":
            return 24 * a + s / 36e5;
          case "minute":
            return 1440 * a + s / 6e4;
          case "second":
            return 86400 * a + s / 1e3;
          case "millisecond":
            return Math.floor(864e5 * a) + s;
          default:
            throw new Error("Unknown unit " + e);
        }
    }),
    (Kt.asMilliseconds = wt),
    (Kt.asSeconds = vt),
    (Kt.asMinutes = St),
    (Kt.asHours = Ht),
    (Kt.asDays = bt),
    (Kt.asWeeks = jt),
    (Kt.asMonths = xt),
    (Kt.asQuarters = Ot),
    (Kt.asYears = Pt),
    (Kt.valueOf = function () {
      return this.isValid()
        ? this._milliseconds +
            864e5 * this._days +
            (this._months % 12) * 2592e6 +
            31536e6 * g(this._months / 12)
        : NaN;
    }),
    (Kt._bubble = function () {
      var e,
        a,
        t,
        s,
        n,
        d = this._milliseconds,
        r = this._days,
        _ = this._months,
        i = this._data;
      return (
        (0 <= d && 0 <= r && 0 <= _) ||
          (d <= 0 && r <= 0 && _ <= 0) ||
          ((d += 864e5 * pt(Tt(_) + r)), (_ = r = 0)),
        (i.milliseconds = d % 1e3),
        (e = T(d / 1e3)),
        (i.seconds = e % 60),
        (a = T(e / 60)),
        (i.minutes = a % 60),
        (t = T(a / 60)),
        (i.hours = t % 24),
        (_ += n = T(Dt((r += T(t / 24))))),
        (r -= pt(Tt(n))),
        (s = T(_ / 12)),
        (_ %= 12),
        (i.days = r),
        (i.months = _),
        (i.years = s),
        this
      );
    }),
    (Kt.clone = function () {
      return Ua(this);
    }),
    (Kt.get = function (e) {
      return (e = P(e)), this.isValid() ? this[e + "s"]() : NaN;
    }),
    (Kt.milliseconds = At),
    (Kt.seconds = Et),
    (Kt.minutes = Ft),
    (Kt.hours = zt),
    (Kt.days = Jt),
    (Kt.weeks = function () {
      return T(this.days() / 7);
    }),
    (Kt.months = Nt),
    (Kt.years = Rt),
    (Kt.humanize = function (e) {
      if (!this.isValid()) return this.localeData().invalidDate();
      var a,
        t,
        s,
        n,
        d,
        r,
        _,
        i,
        o,
        m,
        u,
        l = this.localeData(),
        M =
          ((t = !e),
          (s = l),
          (n = Ua((a = this)).abs()),
          (d = Ct(n.as("s"))),
          (r = Ct(n.as("m"))),
          (_ = Ct(n.as("h"))),
          (i = Ct(n.as("d"))),
          (o = Ct(n.as("M"))),
          (m = Ct(n.as("y"))),
          ((u = (d <= It.ss && ["s", d]) ||
            (d < It.s && ["ss", d]) ||
            (r <= 1 && ["m"]) ||
            (r < It.m && ["mm", r]) ||
            (_ <= 1 && ["h"]) ||
            (_ < It.h && ["hh", _]) ||
            (i <= 1 && ["d"]) ||
            (i < It.d && ["dd", i]) ||
            (o <= 1 && ["M"]) ||
            (o < It.M && ["MM", o]) ||
            (m <= 1 && ["y"]) || ["yy", m])[2] = t),
          (u[3] = 0 < +a),
          (u[4] = s),
          function (e, a, t, s, n) {
            return n.relativeTime(a || 1, !!t, e, s);
          }.apply(null, u));
      return e && (M = l.pastFuture(+this, M)), l.postformat(M);
    }),
    (Kt.toISOString = Vt),
    (Kt.toString = Vt),
    (Kt.toJSON = Vt),
    (Kt.locale = Qa),
    (Kt.localeData = et),
    (Kt.toIsoString = t(
      "toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)",
      Vt
    )),
    (Kt.lang = Xa),
    C("X", 0, 0, "unix"),
    C("x", 0, 0, "valueOf"),
    ie("x", se),
    ie("X", /[+-]?\d+(\.\d{1,3})?/),
    le("X", function (e, a, t) {
      t._d = new Date(1e3 * parseFloat(e, 10));
    }),
    le("x", function (e, a, t) {
      t._d = new Date(g(e));
    }),
    (l.version = "2.24.0"),
    (e = Ha),
    (l.fn = Mt),
    (l.min = function () {
      return xa("isBefore", [].slice.call(arguments, 0));
    }),
    (l.max = function () {
      return xa("isAfter", [].slice.call(arguments, 0));
    }),
    (l.now = function () {
      return Date.now ? Date.now() : +new Date();
    }),
    (l.utc = c),
    (l.unix = function (e) {
      return Ha(1e3 * e);
    }),
    (l.months = function (e, a) {
      return Yt(e, a, "months");
    }),
    (l.isDate = u),
    (l.locale = ia),
    (l.invalid = f),
    (l.duration = Ua),
    (l.isMoment = D),
    (l.weekdays = function (e, a, t) {
      return yt(e, a, t, "weekdays");
    }),
    (l.parseZone = function () {
      return Ha.apply(null, arguments).parseZone();
    }),
    (l.localeData = ma),
    (l.isDuration = Wa),
    (l.monthsShort = function (e, a) {
      return Yt(e, a, "monthsShort");
    }),
    (l.weekdaysMin = function (e, a, t) {
      return yt(e, a, t, "weekdaysMin");
    }),
    (l.defineLocale = oa),
    (l.updateLocale = function (e, a) {
      if (null != a) {
        var t,
          s,
          n = sa;
        null != (s = _a(e)) && (n = s._config),
          ((t = new j((a = b(n, a)))).parentLocale = na[e]),
          (na[e] = t),
          ia(e);
      } else
        null != na[e] &&
          (null != na[e].parentLocale
            ? (na[e] = na[e].parentLocale)
            : null != na[e] && delete na[e]);
      return na[e];
    }),
    (l.locales = function () {
      return s(na);
    }),
    (l.weekdaysShort = function (e, a, t) {
      return yt(e, a, t, "weekdaysShort");
    }),
    (l.normalizeUnits = P),
    (l.relativeTimeRounding = function (e) {
      return void 0 === e ? Ct : "function" == typeof e && ((Ct = e), !0);
    }),
    (l.relativeTimeThreshold = function (e, a) {
      return (
        void 0 !== It[e] &&
        (void 0 === a ? It[e] : ((It[e] = a), "s" === e && (It.ss = a - 1), !0))
      );
    }),
    (l.calendarFormat = function (e, a) {
      var t = e.diff(a, "days", !0);
      return t < -6
        ? "sameElse"
        : t < -1
        ? "lastWeek"
        : t < 0
        ? "lastDay"
        : t < 1
        ? "sameDay"
        : t < 2
        ? "nextDay"
        : t < 7
        ? "nextWeek"
        : "sameElse";
    }),
    (l.prototype = Mt),
    (l.HTML5_FMT = {
      DATETIME_LOCAL: "YYYY-MM-DDTHH:mm",
      DATETIME_LOCAL_SECONDS: "YYYY-MM-DDTHH:mm:ss",
      DATETIME_LOCAL_MS: "YYYY-MM-DDTHH:mm:ss.SSS",
      DATE: "YYYY-MM-DD",
      TIME: "HH:mm",
      TIME_SECONDS: "HH:mm:ss",
      TIME_MS: "HH:mm:ss.SSS",
      WEEK: "GGGG-[W]WW",
      MONTH: "YYYY-MM",
    });

  return (
    l.defineLocale("zh-cn", {
      months: "\u4e00\u6708_\u4e8c\u6708_\u4e09\u6708_\u56db\u6708_\u4e94\u6708_\u516d\u6708_\u4e03\u6708_\u516b\u6708_\u4e5d\u6708_\u5341\u6708_\u5341\u4e00\u6708_\u5341\u4e8c\u6708".split(
        "_"
      ),
      monthsShort: "1\u6708_2\u6708_3\u6708_4\u6708_5\u6708_6\u6708_7\u6708_8\u6708_9\u6708_10\u6708_11\u6708_12\u6708".split(
        "_"
      ),
      weekdays: "\u661f\u671f\u65e5_\u661f\u671f\u4e00_\u661f\u671f\u4e8c_\u661f\u671f\u4e09_\u661f\u671f\u56db_\u661f\u671f\u4e94_\u661f\u671f\u516d".split(
        "_"
      ),
      weekdaysShort: "\u5468\u65e5_\u5468\u4e00_\u5468\u4e8c_\u5468\u4e09_\u5468\u56db_\u5468\u4e94_\u5468\u516d".split(
        "_"
      ),
      weekdaysMin: "\u65e5_\u4e00_\u4e8c_\u4e09_\u56db_\u4e94_\u516d".split(
        "_"
      ),
      longDateFormat: {
        LT: "HH:mm",
        LTS: "HH:mm:ss",
        L: "YYYY/MM/DD",
        LL: "YYYY\u5e74M\u6708D\u65e5",
        LLL: "YYYY\u5e74M\u6708D\u65e5Ah\u70b9mm\u5206",
        LLLL: "YYYY\u5e74M\u6708D\u65e5ddddAh\u70b9mm\u5206",
        l: "YYYY/M/D",
        ll: "YYYY\u5e74M\u6708D\u65e5",
        lll: "YYYY\u5e74M\u6708D\u65e5 HH:mm",
        llll: "YYYY\u5e74M\u6708D\u65e5dddd HH:mm",
      },
      meridiemParse: /\u51cc\u6668|\u65e9\u4e0a|\u4e0a\u5348|\u4e2d\u5348|\u4e0b\u5348|\u665a\u4e0a/,
      meridiemHour: function (e, a) {
        return (
          12 === e && (e = 0),
          "\u51cc\u6668" === a || "\u65e9\u4e0a" === a || "\u4e0a\u5348" === a
            ? e
            : "\u4e0b\u5348" === a || "\u665a\u4e0a" === a
            ? e + 12
            : 11 <= e
            ? e
            : e + 12
        );
      },
      meridiem: function (e, a, t) {
        var s = 100 * e + a;
        return s < 600
          ? "\u51cc\u6668"
          : s < 900
          ? "\u65e9\u4e0a"
          : s < 1130
          ? "\u4e0a\u5348"
          : s < 1230
          ? "\u4e2d\u5348"
          : s < 1800
          ? "\u4e0b\u5348"
          : "\u665a\u4e0a";
      },
      calendar: {
        sameDay: "[\u4eca\u5929]LT",
        nextDay: "[\u660e\u5929]LT",
        nextWeek: "[\u4e0b]ddddLT",
        lastDay: "[\u6628\u5929]LT",
        lastWeek: "[\u4e0a]ddddLT",
        sameElse: "L",
      },
      dayOfMonthOrdinalParse: /\d{1,2}(\u65e5|\u6708|\u5468)/,
      ordinal: function (e, a) {
        switch (a) {
          case "d":
          case "D":
          case "DDD":
            return e + "\u65e5";
          case "M":
            return e + "\u6708";
          case "w":
          case "W":
            return e + "\u5468";
          default:
            return e;
        }
      },
      relativeTime: {
        future: "%s\u5185",
        past: "%s\u524d",
        s: "\u51e0\u79d2",
        ss: "%d \u79d2",
        m: "1 \u5206\u949f",
        mm: "%d \u5206\u949f",
        h: "1 \u5c0f\u65f6",
        hh: "%d \u5c0f\u65f6",
        d: "1 \u5929",
        dd: "%d \u5929",
        M: "1 \u4e2a\u6708",
        MM: "%d \u4e2a\u6708",
        y: "1 \u5e74",
        yy: "%d \u5e74",
      },
      week: { dow: 1, doy: 4 },
    }),
    l.locale("zh-cn"),
    l
  );
});
