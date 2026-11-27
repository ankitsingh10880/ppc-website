/* Public Policy Club, FMS Delhi — site behaviour.
   The site works without JavaScript; this file adds the mobile menu,
   the Publications dropdown, form handling and analytics impressions. */
(function () {
  "use strict";
  document.documentElement.classList.add("js");

  /* ---------- Sticky header ----------
     Keeps --header-h equal to the header's real height (it changes with zoom,
     font loading and screen width), so anchor links and keyboard focus land
     below the header instead of behind it. Adds a shadow once the page scrolls. */
  var header = document.querySelector(".site-header");
  if (header) {
    var setH = function () {
      document.documentElement.style.setProperty("--header-h", header.offsetHeight + "px");
    };
    setH();
    if ("ResizeObserver" in window) new ResizeObserver(setH).observe(header);
    else window.addEventListener("resize", setH);
    var onScroll = function () { header.classList.toggle("is-scrolled", window.scrollY > 4); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- Mobile menu ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      nav.classList.toggle("is-open", !open);
    });
  }

  /* ---------- Publications dropdown (disclosure pattern) ---------- */
  document.querySelectorAll("[data-submenu]").forEach(function (btn) {
    var menu = document.getElementById(btn.getAttribute("aria-controls"));
    if (!menu) return;
    function setOpen(open) {
      btn.setAttribute("aria-expanded", String(open));
      menu.hidden = !open;
    }
    setOpen(false);
    btn.addEventListener("click", function () {
      setOpen(btn.getAttribute("aria-expanded") !== "true");
    });
    btn.parentElement.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && btn.getAttribute("aria-expanded") === "true") {
        setOpen(false);
        btn.focus();
      }
    });
    document.addEventListener("click", function (e) {
      if (!btn.parentElement.contains(e.target)) setOpen(false);
    });
    btn.parentElement.addEventListener("focusout", function (e) {
      if (e.relatedTarget && !btn.parentElement.contains(e.relatedTarget)) setOpen(false);
    });
  });

  /* ---------- Forms ----------
     Each form posts to the URL in its action attribute. Until a real form
     service is connected (see README, "Forms"), the action contains
     YOUR_FORM_ENDPOINT and the form shows a message instead of failing.
     Google Forms (action ending in /formResponse) don't let other sites read
     their reply, so for those the post is sent "no-cors" and counted as sent
     unless the network itself fails. */
  var CLUB_EMAIL = document.body.getAttribute("data-club-email") || "";
  document.querySelectorAll("form[data-js-form]").forEach(function (form) {
    var status = form.querySelector(".form-status");
    function say(msg, isError) {
      if (!status) return;
      status.textContent = msg;
      status.classList.toggle("is-error", !!isError);
    }
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        var bad = form.querySelector(":invalid");
        say("Check the highlighted field: " + (bad && bad.labels && bad.labels[0] ? bad.labels[0].textContent.replace("*", "").trim() : "a required field") + ".", true);
        if (bad) bad.focus();
        return;
      }
      if ((form.getAttribute("action") || "").indexOf("YOUR_FORM_ENDPOINT") !== -1) {
        say("This form is not connected yet. Email us at " + CLUB_EMAIL + " instead.", true);
        return;
      }
      var btn = form.querySelector("[type=submit]");
      var label = btn ? btn.textContent : "";
      if (btn) { btn.disabled = true; btn.textContent = "Sending…"; }
      var isGoogle = form.action.indexOf("docs.google.com/forms/") !== -1;
      var data = new FormData(form);
      if (isGoogle) data.delete("form");
      var req = isGoogle
        ? fetch(form.action, { method: "POST", mode: "no-cors", body: new URLSearchParams(data) })
        : fetch(form.action, { method: "POST", body: data, headers: { Accept: "application/json" } });
      req
        .then(function (r) {
          if (!isGoogle && !r.ok) throw new Error(r.status);
          form.reset();
          say(form.getAttribute("data-success") || "Sent. Thank you.", false);
          track(form.getAttribute("data-umami-event") || "form-submit");
        })
        .catch(function () {
          say("That didn't go through. Try again, or email us at " + CLUB_EMAIL + ".", true);
        })
        .finally(function () {
          if (btn) { btn.disabled = false; btn.textContent = label; }
        });
    });
  });

  /* ---------- Analytics (Umami) ----------
     Page views and clicks on elements with data-umami-event are tracked by
     Umami itself. Below adds "impressions": a section or card counts once
     per page load when at least half of it has been on screen.
     Nothing happens until the Umami script is switched on in each page. */
  function track(name, data) {
    if (window.umami && typeof window.umami.track === "function") {
      window.umami.track(name, data);
    }
  }
  var seen = document.querySelectorAll("[data-impression]");
  if (seen.length && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          track("impression", { item: entry.target.getAttribute("data-impression"), page: location.pathname });
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    seen.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Footer year ---------- */
  var y = document.querySelector("[data-year]");
  if (y) y.textContent = new Date().getFullYear();
})();
