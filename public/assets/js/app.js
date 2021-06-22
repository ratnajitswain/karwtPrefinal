


! function(s) {
    "use strict";

    function n() {
        for (var e = document.getElementById("topnav-menu-content").getElementsByTagName("a"), t = 0, a = e.length; t < a; t++) "nav-item dropdown active" === e[t].parentElement.getAttribute("class") && (e[t].parentElement.classList.remove("active"), e[t].nextElementSibling.classList.remove("show"))
    }

    function t(e) {
        1 == s("#light-mode-switch").prop("checked") && "light-mode-switch" === e ? (s("html").removeAttr("dir"), s("#dark-mode-switch").prop("checked", !1), s("#rtl-mode-switch").prop("checked", !1), s("#bootstrap-style").attr("href", "/assets/css/bootstrap.min.css"), s("#app-style").attr("href", "/assets/css/app.min.css"), sessionStorage.setItem("is_visited", "light-mode-switch")) : 1 == s("#dark-mode-switch").prop("checked") && "dark-mode-switch" === e ? (s("html").removeAttr("dir"), s("#light-mode-switch").prop("checked", !1), s("#rtl-mode-switch").prop("checked", !1), s("#bootstrap-style").attr("href", "assets/css/bootstrap-dark.min.css"), s("#app-style").attr("href", "assets/css/app-dark.min.css"), sessionStorage.setItem("is_visited", "dark-mode-switch")) : 1 == s("#rtl-mode-switch").prop("checked") && "rtl-mode-switch" === e && (s("#light-mode-switch").prop("checked", !1), s("#dark-mode-switch").prop("checked", !1), s("#bootstrap-style").attr("href", "assets/css/bootstrap-rtl.min.css"), s("#app-style").attr("href", "assets/css/app-rtl.min.css"), s("html").attr("dir", "rtl"), sessionStorage.setItem("is_visited", "rtl-mode-switch"))
    }

    function e() {
        document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenElement || (console.log("pressed"), s("body").removeClass("fullscreen-enable"))
    }
    var a;
    s("#side-menu").metisMenu(), s(".vertical-menu-btn").on("click", function(e) {
            e.preventDefault(), s("body").toggleClass("sidebar-enable"), 992 <= s(window).width() ? s("body").toggleClass("vertical-collpsed") : s("body").removeClass("vertical-collpsed")
        }), s("#sidebar-menu a").each(function() {
            var e = window.location.href.split(/[?#]/)[0];
            this.href == e && (s(this).addClass("active"), s(this).parent().addClass("mm-active"), s(this).parent().parent().addClass("mm-show"), s(this).parent().parent().prev().addClass("mm-active"), s(this).parent().parent().parent().addClass("mm-active"), s(this).parent().parent().parent().parent().addClass("mm-show"), s(this).parent().parent().parent().parent().parent().addClass("mm-active"))
        }), s(document).ready(function() {
            var e;
            0 < s("#sidebar-menu").length && 0 < s("#sidebar-menu .mm-active .active").length && (300 < (e = s("#sidebar-menu .mm-active .active").offset().top) && (e -= 300, s(".simplebar-content-wrapper").animate({
                scrollTop: e
            }, "slow")))
        }), s('[data-toggle="fullscreen"]').on("click", function(e) {
            e.preventDefault(), s("body").toggleClass("fullscreen-enable"), document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement ? document.cancelFullScreen ? document.cancelFullScreen() : document.mozCancelFullScreen ? document.mozCancelFullScreen() : document.webkitCancelFullScreen && document.webkitCancelFullScreen() : document.documentElement.requestFullscreen ? document.documentElement.requestFullscreen() : document.documentElement.mozRequestFullScreen ? document.documentElement.mozRequestFullScreen() : document.documentElement.webkitRequestFullscreen && document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT)
        }), document.addEventListener("fullscreenchange", e), document.addEventListener("webkitfullscreenchange", e), document.addEventListener("mozfullscreenchange", e), s(".navbar-nav a").each(function() {
            var e = window.location.href.split(/[?#]/)[0];
            this.href == e && (s(this).addClass("active"), s(this).parent().addClass("active"), s(this).parent().parent().addClass("active"), s(this).parent().parent().parent().addClass("active"), s(this).parent().parent().parent().parent().addClass("active"), s(this).parent().parent().parent().parent().parent().addClass("active"))
        }), s(".right-bar-toggle").on("click", function(e) {
            s("body").toggleClass("right-bar-enabled")
        }), s(document).on("click", "body", function(e) {
            0 < s(e.target).closest(".right-bar-toggle, .right-bar").length || s("body").removeClass("right-bar-enabled")
        }),
        function() {
            if (document.getElementById("topnav-menu-content")) {
                for (var e = document.getElementById("topnav-menu-content").getElementsByTagName("a"), t = 0, a = e.length; t < a; t++) e[t].onclick = function(e) {
                    "#" === e.target.getAttribute("href") && (e.target.parentElement.classList.toggle("active"), e.target.nextElementSibling.classList.toggle("show"))
                };
                window.addEventListener("resize", n)
            }
        }(),
        function() {
            [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]')).map(function(e) {
                return new bootstrap.Tooltip(e)
            }), [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]')).map(function(e) {
                return new bootstrap.Popover(e)
            });
            var a = s(this).attr("data-delay") ? s(this).attr("data-delay") : 100,
                n = s(this).attr("data-time") ? s(this).attr("data-time") : 1200;
            s('[data-plugin="counterup"]').each(function(e, t) {
                s(this).counterUp({
                    delay: a,
                    time: n
                })
            })
        }(), window.sessionStorage && ((a = sessionStorage.getItem("is_visited")) ? (s(".right-bar input:checkbox").prop("checked", !1), s("#" + a).prop("checked", !0), t(a)) : sessionStorage.setItem("is_visited", "light-mode-switch")), s("#light-mode-switch, #dark-mode-switch, #rtl-mode-switch").on("change", function(e) {
            t(e.target.id)
        }), s("#header-chart-1").sparkline([8, 6, 4, 7, 10, 12, 7, 4, 9, 12, 13, 11, 12], {
            type: "bar",
            height: "32",
            barWidth: "5",
            barSpacing: "3",
            barColor: "#7A6FBE"
        }), s("#header-chart-2").sparkline([8, 6, 4, 7, 10, 12, 7, 4, 9, 12, 13, 11, 12], {
            type: "bar",
            height: "32",
            barWidth: "5",
            barSpacing: "3",
            barColor: "#29bbe3"
        }), s(window).on("load", function() {
            s("#status").fadeOut(), s("#preloader").delay(350).fadeOut("slow")
        }), Waves.init()
}(jQuery);