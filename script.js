/* ============================================
   MIKINCH — Personal Digital Node
   Vanilla JS: boot, terminals, glitch, nav
   ============================================ */

(function () {
  "use strict";

  const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------- BOOT ----------
  function runBoot(isRoute) {
    const boot = document.getElementById("boot-screen");
    if (!boot) return Promise.resolve();

    const bar = boot.querySelector(".boot-bar");
    const log = boot.querySelector(".boot-log");
    const lines = isRoute
      ? [
          "routing…",
          "loading module",
          "ok"
        ]
      : [
          "node wake",
          "loading personal interface",
          "mounting modules",
          "terminals online",
          "ready"
        ];

    boot.classList.remove("hidden");
    let progress = 0;
    let lineIdx = 0;

    return new Promise((resolve) => {
      if (REDUCED) {
        boot.classList.add("hidden");
        resolve();
        return;
      }

      const tick = () => {
        progress += Math.random() * 28 + 8;
        if (progress > 100) progress = 100;
        if (bar) bar.style.width = progress + "%";

        if (lineIdx < lines.length && Math.random() > 0.35) {
          if (log) log.innerHTML = `<span>&gt;</span> ${lines[lineIdx]}`;
          lineIdx++;
        }

        if (progress < 100) {
          setTimeout(tick, isRoute ? 40 + Math.random() * 50 : 60 + Math.random() * 90);
        } else {
          if (log) log.innerHTML = `<span>&gt;</span> ${lines[lines.length - 1] || "ready"}`;
          setTimeout(() => {
            boot.classList.add("hidden");
            resolve();
          }, isRoute ? 120 : 280);
        }
      };
      tick();
    });
  }

  // ---------- CLOCK ----------
  function updateClock() {
    const el = document.getElementById("header-time");
    if (!el) return;
    const now = new Date();
    const h = String(now.getHours()).padStart(2, "0");
    const m = String(now.getMinutes()).padStart(2, "0");
    const s = String(now.getSeconds()).padStart(2, "0");
    el.textContent = `${h}:${m}:${s}`;
  }

  // ---------- NAV ----------
  function initNav() {
    const toggle = document.querySelector(".nav-toggle");
    const nav = document.querySelector(".site-nav");
    if (toggle && nav) {
      toggle.addEventListener("click", () => {
        nav.classList.toggle("open");
        toggle.setAttribute("aria-expanded", nav.classList.contains("open"));
      });
    }

    // Active link
    const path = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".site-nav a").forEach((a) => {
      const href = a.getAttribute("href");
      if (href === path || (path === "" && href === "index.html")) {
        a.classList.add("active");
      }
    });

    // Soft page transition on internal links
    document.querySelectorAll('a[href$=".html"]').forEach((a) => {
      a.addEventListener("click", (e) => {
        const href = a.getAttribute("href");
        if (!href || href.startsWith("http") || href.startsWith("#")) return;
        e.preventDefault();
        runBoot(true).then(() => {
          window.location.href = href;
        });
      });
    });
  }

  // ---------- TERMINALS ----------
  const TERMINAL_SETS = {
    cmd: [
      { prompt: "C:\\MIK>", cmd: "whoami", out: "mikinch" },
      { prompt: "C:\\MIK>", cmd: "dir /a", out: "CODE  ART  SLIDES  LIFE" },
      { prompt: "C:\\MIK>", cmd: "echo %MOOD%", out: "mildly chaotic" },
      { prompt: "C:\\MIK>", cmd: "tasklist", out: "curiosity.exe  running\nboring.exe     not found" },
      { prompt: "C:\\MIK>", cmd: "ping localhost", out: "Reply from 127.0.0.1: time<1ms" }
    ],
    powershell: [
      { prompt: "PS MIK>", cmd: "Get-Date", out: new Date().toISOString().slice(0, 19) },
      { prompt: "PS MIK>", cmd: "Write-Host 'status'", out: "ONLINE / ANONYMOUS" },
      { prompt: "PS MIK>", cmd: "Get-Process curiosity", out: "Id  Name\n42  curiosity" },
      { prompt: "PS MIK>", cmd: "Test-Path ./soul", out: "True" },
      { prompt: "PS MIK>", cmd: "Resolve-Conflict", out: "not today." }
    ],
    bash: [
      { prompt: "mik@node:~$", cmd: "uname -a", out: "DigitalNode 1.0 mikinch" },
      { prompt: "mik@node:~$", cmd: "ps aux | grep focus", out: "art code slides support" },
      { prompt: "mik@node:~$", cmd: "echo $MOOD", out: "carefully chaotic" },
      { prompt: "mik@node:~$", cmd: "./run.sh", out: "permission denied\n(try kindness)" },
      { prompt: "mik@node:~$", cmd: "curl -s localhost/status", out: '{"status":"online"}' }
    ],
    git: [
      { prompt: "mik@repo:~$", cmd: "git status", out: "On branch main\nnothing to commit" },
      { prompt: "mik@repo:~$", cmd: "git branch", out: "* main\n  experiments" },
      { prompt: "mik@repo:~$", cmd: "git log --oneline -3", out: "a1b2c3d  personal node\ne4f5g6h  quiet update\ni7j8k9l  initial" },
      { prompt: "mik@repo:~$", cmd: "git diff", out: "waiting for author" }
    ],
    network: [
      { prompt: "net>", cmd: "probe channels", out: "telegram  UP\ntiktok    UP\npinterest UP\ngithub    UP" },
      { prompt: "net>", cmd: "ping mikinch", out: "alive  latency low" },
      { prompt: "net>", cmd: "netstat -an", out: "listening on personal ports" },
      { prompt: "net>", cmd: "curl -I https://t.me/mikinch", out: "HTTP/2 200" }
    ]
  };

  function typeTerminal(el, setKey) {
    const body = el.querySelector(".terminal-body");
    if (!body) return;
    const set = TERMINAL_SETS[setKey] || TERMINAL_SETS.bash;
    let idx = 0;
    body.innerHTML = "";

    function typeLine() {
      if (idx >= set.length) {
        // restart after pause
        setTimeout(() => {
          body.innerHTML = "";
          idx = 0;
          typeLine();
        }, 4000 + Math.random() * 2000);
        return;
      }

      const item = set[idx];
      const line = document.createElement("div");
      line.className = "line";
      body.appendChild(line);

      const promptSpan = document.createElement("span");
      promptSpan.className = "prompt";
      promptSpan.textContent = item.prompt + " ";
      line.appendChild(promptSpan);

      const cmdSpan = document.createElement("span");
      cmdSpan.className = "cmd";
      line.appendChild(cmdSpan);

      let ci = 0;
      function typeCmd() {
        if (ci < item.cmd.length) {
          cmdSpan.textContent += item.cmd[ci];
          ci++;
          setTimeout(typeCmd, REDUCED ? 0 : 18 + Math.random() * 30);
        } else {
          setTimeout(() => {
            const out = document.createElement("div");
            out.className = "line out";
            if (item.out.includes("not found") || item.out.includes("denied") || item.out.includes("not today")) {
              out.classList.add("err");
            }
            out.textContent = item.out;
            body.appendChild(out);
            body.scrollTop = body.scrollHeight;
            idx++;
            setTimeout(typeLine, REDUCED ? 100 : 600 + Math.random() * 400);
          }, REDUCED ? 50 : 200);
        }
      }
      typeCmd();
    }

    typeLine();
  }

  function initTerminals() {
    document.querySelectorAll(".terminal[data-shell]").forEach((el) => {
      const key = el.getAttribute("data-shell");
      typeTerminal(el, key);
    });
  }

  // ---------- GLITCH ----------
  function initGlitch() {
    if (REDUCED) return;
    const flash = document.createElement("div");
    flash.className = "glitch-flash";
    document.body.appendChild(flash);

    function trigger() {
      flash.classList.add("active");
      setTimeout(() => flash.classList.remove("active"), 200);
      // next in 8–25s
      setTimeout(trigger, 8000 + Math.random() * 17000);
    }
    setTimeout(trigger, 5000 + Math.random() * 8000);
  }

  // ---------- REVEAL ----------
  function initReveal() {
    const els = document.querySelectorAll(".reveal");
    if (!els.length) return;
    if (REDUCED) {
      els.forEach((e) => e.classList.add("visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("visible");
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((e) => io.observe(e));
  }

  // ---------- AVATAR FALLBACK ----------
  function initAvatar() {
    document.querySelectorAll(".avatar-wrap img").forEach((img) => {
      img.addEventListener("error", () => {
        const wrap = img.parentElement;
        img.remove();
        const fb = document.createElement("div");
        fb.className = "avatar-fallback";
        fb.textContent = "M";
        wrap.appendChild(fb);
      });
    });
  }

  // ---------- PROFILE DATA (optional injection) ----------
  function injectProfile() {
    if (typeof PROFILE === "undefined") return;
    // Can be extended if needed; most content is static for simplicity
  }

  // ---------- INIT ----------
  document.addEventListener("DOMContentLoaded", () => {
    const isFirst = !sessionStorage.getItem("mik_visited");
    sessionStorage.setItem("mik_visited", "1");

    runBoot(!isFirst).then(() => {
      updateClock();
      setInterval(updateClock, 1000);
      initNav();
      initTerminals();
      initGlitch();
      initReveal();
      initAvatar();
      injectProfile();
    });
  });
})();
