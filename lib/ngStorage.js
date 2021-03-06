/*! ngStorage 0.3.0 | Copyright (c) 2014 Gias Kay Lee | MIT License */ ! function () {
  "use strict";

  function a(a) {
    var b = {
      prefix: "ngStorage-",
      prefixLength: 10
    };
    return {
      setPrefix: function (a) {
        b.prefix = a, b.prefixLength = a.length
      },
      $get: ["$rootScope", "$window", "$log", "$timeout", function (c, d, e, f) {
        function g() {
          var b = d[a];
          if (b && "localStorage" === a) {
            var c = "__" + Math.round(1e7 * Math.random());
            try {
              b.setItem(c, c), b.removeItem(c)
            } catch (f) {
              e.warn("This browser does not support Web Storage!"), b = void 0
            }
          }
          return b
        }
        var h, i, j = g(),
          k = {
            $default: function (a) {
              for (var b in a) angular.isDefined(k[b]) || (k[b] = a[b]);
              return k
            },
            $reset: function (a) {
              for (var b in k) "$" === b[0] || delete k[b];
              return k.$default(a)
            },
            $save: function () {
              if (f.cancel(i), !angular.equals(k, h)) {
                angular.forEach(k, function (a, c) {
                  angular.isDefined(a) && "$" !== c[0] && j.setItem(b.prefix + c, angular.toJson(a)), delete h[c]
                });
                for (var a in h) j.removeItem(b.prefix + a);
                h = angular.copy(k)
              }
            },
            $supported: !!j
          };
        if (!j) {
          var l, m = {};
          j = {
            setItem: function (a, b) {
              return m[a] = String(b)
            },
            getItem: function (a) {
              return m.hasOwnProperty(a) ? m[a] : l
            },
            removeItem: function (a) {
              return delete m[a]
            },
            clear: function () {
              return m = {}
            },
            length: 0
          }
        }
        for (var n, o = 0, p = j.length; p > o; o++)(n = j.key(o)) && b.prefix === n.slice(0, b.prefixLength) && (k[n.slice(b.prefixLength)] = angular.fromJson(j.getItem(n)));
        return h = angular.copy(k), c.$watch(function () {
          i || (i = f(function () {
            k.$save()
          }, 100))
        }), "localStorage" === a && d.addEventListener && d.addEventListener("storage", function (a) {
          b.prefix === a.key.slice(0, b.prefixLength) && (a.newValue ? k[a.key.slice(b.prefixLength)] = angular.fromJson(a.newValue) : delete k[a.key.slice(b.prefixLength)], h = angular.copy(k), c.$apply())
        }), k
      }]
    }
  }
  angular.module("ngStorage", []).provider("$localStorage", a("localStorage")).provider("$sessionStorage", a("sessionStorage"))
}();