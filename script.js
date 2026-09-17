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

  // ---------- TERMINALS (endless slow stream, no reset) ----------
  const TERMINAL_SETS = {
    cmd: [
      { prompt: "C:\\MIK>", cmd: "whoami", out: "mikinch" },
      { prompt: "C:\\MIK>", cmd: "dir /a", out: "CODE  ART  SLIDES  LIFE" },
      { prompt: "C:\\MIK>", cmd: "echo %MOOD%", out: "mildly chaotic" },
      { prompt: "C:\\MIK>", cmd: "tasklist", out: "curiosity.exe  running" },
      { prompt: "C:\\MIK>", cmd: "ping localhost", out: "Reply from 127.0.0.1: time<1ms" },
      { prompt: "C:\\MIK>", cmd: "findstr cozy", out: "1 match found" },
      { prompt: "C:\\MIK>", cmd: "echo %STATUS%", out: "online · personal" }
    ],
    powershell: [
      { prompt: "PS MIK>", cmd: "Get-Date", out: () => new Date().toISOString().slice(0, 19) },
      { prompt: "PS MIK>", cmd: "Write-Host status", out: "ONLINE / ANONYMOUS" },
      { prompt: "PS MIK>", cmd: "Get-Process curiosity", out: "Id 42  Name curiosity" },
      { prompt: "PS MIK>", cmd: "Test-Path ./soul", out: "True" },
      { prompt: "PS MIK>", cmd: "Resolve-Conflict", out: "not today." },
      { prompt: "PS MIK>", cmd: "Get-Content mood.log", out: "carefully chaotic" }
    ],
    bash: [
      { prompt: "mik@node:~$", cmd: "uname -a", out: "DigitalNode 1.0 mikinch" },
      { prompt: "mik@node:~$", cmd: "ps aux | grep focus", out: "art code slides support" },
      { prompt: "mik@node:~$", cmd: "echo $MOOD", out: "carefully chaotic" },
      { prompt: "mik@node:~$", cmd: "./run.sh", out: "permission denied (try kindness)" },
      { prompt: "mik@node:~$", cmd: "curl -s localhost/status", out: '{"status":"online"}' },
      { prompt: "mik@node:~$", cmd: "cat notes.txt", out: "make it strange. keep it clear." }
    ],
    git: [
      { prompt: "mik@repo:~$", cmd: "git status", out: "On branch main · clean" },
      { prompt: "mik@repo:~$", cmd: "git branch", out: "* main\n  experiments" },
      { prompt: "mik@repo:~$", cmd: "git log --oneline -2", out: "a1b2c3d  personal node\ne4f5g6h  quiet update" },
      { prompt: "mik@repo:~$", cmd: "git diff", out: "waiting for author" },
      { prompt: "mik@repo:~$", cmd: "git stash list", out: "stash@{0}: doodles" }
    ],
    network: [
      { prompt: "net>", cmd: "probe channels", out: "telegram  UP\ntiktok    UP\ngithub    UP" },
      { prompt: "net>", cmd: "ping mikinch", out: "alive · latency low" },
      { prompt: "net>", cmd: "netstat -an", out: "listening on personal ports" },
      { prompt: "net>", cmd: "curl -I t.me/mikinch", out: "HTTP/2 200" }
    ]
  };

  const MAX_TERM_LINES = 14;

  function typeTerminal(el, setKey) {
    const body = el.querySelector(".terminal-body");
    if (!body) return;
    const set = TERMINAL_SETS[setKey] || TERMINAL_SETS.bash;
    let idx = 0;
    body.innerHTML = "";

    function trimOld() {
      while (body.children.length > MAX_TERM_LINES) {
        body.removeChild(body.firstChild);
      }
    }

    function typeLine() {
      const item = set[idx % set.length];
      idx++;

      const line = document.createElement("div");
      line.className = "line";
      body.appendChild(line);
      trimOld();

      const promptSpan = document.createElement("span");
      promptSpan.className = "prompt";
      promptSpan.textContent = item.prompt + " ";
      line.appendChild(promptSpan);

      const cmdSpan = document.createElement("span");
      cmdSpan.className = "cmd";
      line.appendChild(cmdSpan);

      let ci = 0;
      const cmd = item.cmd;

      function typeCmd() {
        if (ci < cmd.length) {
          cmdSpan.textContent += cmd[ci];
          ci++;
          body.scrollTop = body.scrollHeight;
          setTimeout(typeCmd, REDUCED ? 0 : 22 + Math.random() * 40);
        } else {
          setTimeout(() => {
            const outText = typeof item.out === "function" ? item.out() : item.out;
            const out = document.createElement("div");
            out.className = "line out";
            if (/not found|denied|not today/i.test(outText)) out.classList.add("err");
            out.textContent = outText;
            body.appendChild(out);
            trimOld();
            body.scrollTop = body.scrollHeight;
            // slow endless: long pause between commands
            setTimeout(typeLine, REDUCED ? 200 : 1800 + Math.random() * 2200);
          }, REDUCED ? 40 : 280);
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
  }

  // ---------- TIME OF DAY THEME (idea 7) ----------
  function applyTimeTheme() {
    const h = new Date().getHours();
    // night ~ 20–6, evening 18–20, day otherwise
    let theme = "day";
    if (h >= 20 || h < 6) theme = "night";
    else if (h >= 18) theme = "evening";
    document.documentElement.setAttribute("data-theme", theme);
  }

  // ---------- KONAMI / SECRET (light) ----------
  function initKonami() {
    const seq = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];
    let pos = 0;
    window.addEventListener("keydown", (e) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (key === seq[pos] || (seq[pos].length === 1 && key === seq[pos])) {
        pos++;
        if (pos === seq.length) {
          pos = 0;
          showSecret();
        }
      } else {
        pos = 0;
      }
    });
  }

  function showSecret() {
    if (document.getElementById("secret-node")) return;
    const el = document.createElement("div");
    el.id = "secret-node";
    el.className = "secret-node";
    el.innerHTML = `
      <div class="secret-card">
        <div class="secret-title">backdoor</div>
        <p>you found the quiet corner.</p>
        <p class="secret-emoji">₍˄·͈༝·͈˄₎ฅ</p>
        <button type="button" class="secret-close">close</button>
      </div>`;
    document.body.appendChild(el);
    el.querySelector(".secret-close").addEventListener("click", () => el.remove());
    el.addEventListener("click", (e) => { if (e.target === el) el.remove(); });
  }

  // ---------- INIT ----------
  document.addEventListener("DOMContentLoaded", () => {
    const isFirst = !sessionStorage.getItem("mik_visited");
    sessionStorage.setItem("mik_visited", "1");

    applyTimeTheme();
    setInterval(applyTimeTheme, 60 * 1000);

    runBoot(!isFirst).then(() => {
      updateClock();
      setInterval(updateClock, 1000);
      initNav();
      initTerminals();
      initGlitch();
      initReveal();
      initAvatar();
      injectProfile();
      initKonami();
    });
  });
})();
