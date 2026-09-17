(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  const profile = window.MIKINCH_PROFILE || {};
  $$("[data-profile-name]").forEach(el => el.textContent = profile.name || "Mikinch");
  $$("[data-profile-location]").forEach(el => el.textContent = profile.location || "Uzbekistan");
  $$("[data-profile-role]").forEach(el => el.textContent = profile.role || "Digital creator");
  $$("[data-profile-intro]").forEach(el => el.textContent = profile.intro || "");
  $$("[data-profile-bio]").forEach(el => el.textContent = profile.bio || "");
  $$("[data-profile-headline]").forEach(el => el.textContent = profile.headline || "");
  $$("[data-profile-description]").forEach(el => el.textContent = profile.description || "");

  // Active nav
  const current = document.body.dataset.page;
  $$("[data-page-link]").forEach(a => {
    if (a.dataset.pageLink === current) a.classList.add("active");
  });

  // Clock
  const clock = $("#hud-clock");
  const tickClock = () => {
    if (!clock) return;
    const d = new Date();
    clock.textContent = [d.getHours(), d.getMinutes(), d.getSeconds()].map(v => String(v).padStart(2, "0")).join(":");
  };
  tickClock(); setInterval(tickClock, 1000);

  // Mobile nav
  const toggle = $(".nav-toggle");
  const nav = $(".nav");
  toggle?.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  $$(".nav a").forEach(a => a.addEventListener("click", () => {
    nav?.classList.remove("open");
    toggle?.setAttribute("aria-expanded", "false");
  }));

  // Boot overlay
  const boot = $(".boot-overlay");
  const bar = $("[data-boot-bar]");
  const state = $("[data-boot-state]");
  const lines = $$("[data-boot-line]");
  const linePool = [
    "mount /creative",
    "scan /memory",
    "open /visual",
    "check /tools",
    "index /ideas",
    "route /signal",
    "warm /terminal",
    "sync /offline",
    "build /personality",
    "patch /mood",
    "load /music",
    "spawn /chaos"
  ];
  let bootDone = false;

  function bootRun(route = false) {
    if (!boot || !bar) return Promise.resolve();
    state.textContent = route ? "ROUTE" : "LOCAL";
    boot.classList.remove("done");
    document.body.classList.remove("page-ready");
    let progress = 0;
    const started = performance.now();
    const total = route ? 560 : 780;

    return new Promise(resolve => {
      function frame(now) {
        const elapsed = now - started;
        const target = Math.min(100, elapsed / total * 100);
        progress = Math.min(target, progress + Math.random() * 18 + 6);
        bar.style.width = `${progress}%`;
        lines.forEach((line, index) => {
          if (Math.random() < .06) {
            line.textContent = linePool[(index + Math.floor(Math.random()*linePool.length)) % linePool.length];
          }
        });
        if (progress >= 100 || elapsed >= total) {
          bar.style.width = "100%";
          setTimeout(() => {
            boot.classList.add("done");
            document.body.classList.add("page-ready");
            bootDone = true;
            resolve();
          }, route ? 70 : 150);
          return;
        }
        requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    });
  }
  bootRun(false);

  // Internal navigation
  $$("[data-transition]").forEach(link => {
    link.addEventListener("click", async e => {
      const url = new URL(link.href, location.href);
      if (url.origin !== location.origin || url.pathname === location.pathname || link.target === "_blank") return;
      e.preventDefault();
      if (!bootDone) return;
      document.body.classList.add("body-glitch");
      setTimeout(() => document.body.classList.remove("body-glitch"), 180);
      await bootRun(true);
      location.href = url.href;
    });
  });

  // Typewriter terminals: multiple environments and less repetitive logs.
  const terminalSets = {
    home: [
      ["cmd", "C:\\MIKINCH> whoami", "Mikinch", "ok"],
      ["cmd", "C:\\MIKINCH> tree /a /f", "creative\\", "ok"],
      ["dim", "├── art", "   ├── anime", "dim"],
      ["dim", "├── code", "   ├── bots", "dim"],
      ["dim", "├── decks", "   └── visuals", "dim"],
      ["warn", "C:\\MIKINCH> tasklist | findstr \"boring\"", "INFO: no matching processes.", "warn"],
      ["cmd", "C:\\MIKINCH> echo %MOOD%", "curious", "ok"]
    ],
    manifesto: [
      ["cmd", "$ uname -a", "Mikinch.local / creative-node / 2026", "ok"],
      ["cmd", "$ ps aux | grep music", "mikinch   2048   0.2   8.8   listening", "dim"],
      ["cmd", "$ python mood.py --verbose", "mood = focused + mildly chaotic", "ok"],
      ["warn", "$ sudo make-it-boring", "permission denied", "warn"],
      ["ok", "$ ./make-it-interesting", "done.", "ok"]
    ],
    code: [
      ["cmd", "C:\\project> git status", "On branch main", "ok"],
      ["dim", "  modified:  ui.js", "  modified:  styles.css", "dim"],
      ["cmd", "C:\\project> npm run build", "vite v6.0  building...", "ok"],
      ["ok", "✓ 48 modules transformed.", "✓ dist/ ready.", "ok"],
      ["cmd", "C:\\project> git diff --stat", "3 files changed, 117 insertions(+)", "dim"],
      ["warn", "C:\\project> deploy", "not today.", "warn"]
    ],
    support: [
      ["cmd", "PS C:\\support> Get-Date", "09/17/2026 00:00:00", "dim"],
      ["cmd", "PS C:\\support> Get-Content note.txt", "listen first. answer second.", "ok"],
      ["cmd", "PS C:\\support> Resolve-Conflict", "step 1: separate facts from panic", "ok"],
      ["dim", "PS C:\\support> Write-Host \"no pressure\"", "no pressure", "dim"],
      ["warn", "PS C:\\support> Force-Decision", "command not found", "warn"]
    ],
    portfolio: [
      ["cmd", "$ git branch --show-current", "portfolio", "ok"],
      ["cmd", "$ find ./works -maxdepth 1 -type f", "0 files", "dim"],
      ["err", "$ cat showcase.json", "cat: showcase.json: No such file", "err"],
      ["warn", "$ echo \"waiting for author\"", "waiting for author", "warn"],
      ["cmd", "$ exit", "contact the creator for private examples.", "ok"]
    ],
    about: [
      ["cmd", "C:\\MIKINCH> type personality.txt", "curious / visual / stubborn / nocturnal", "ok"],
      ["cmd", "C:\\MIKINCH> type hobbies.txt", "games / music / anime", "dim"],
      ["cmd", "C:\\MIKINCH> findstr /i \"optimize\"", "hardware.exe: struggling", "warn"],
      ["ok", "C:\\MIKINCH> choice", "still playing anyway.", "ok"]
    ],
    contact: [
      ["cmd", "$ ./probe channels", "telegram........ reachable", "ok"],
      ["dim", "                         tiktok.......... reachable", "pinterest....... reachable", "dim"],
      ["cmd", "$ curl -I https://t.me/mikinch", "HTTP/2 200", "ok"],
      ["cmd", "$ echo \"send message\"", "channel open.", "ok"]
    ],
    contact2: [
      ["cmd", "$ git remote -v", "origin  public-contact-node", "dim"],
      ["cmd", "$ netstat -an | grep OPEN", "telegram   OPEN", "ok"],
      ["cmd", "$ ping tiktok", "signal stable", "ok"],
      ["cmd", "$ ping pinterest", "signal stable", "ok"]
    ]
  };

  async function typeTerminal(term, linesToPrint) {
    const body = $(".terminal-body", term);
    if (!body || term.dataset.typed === "1") return;
    term.dataset.typed = "1";
    for (const row of linesToPrint) {
      const line = document.createElement("div");
      line.className = row[3] || "dim";
      line.innerHTML = `<span class="typed"></span>`;
      body.appendChild(line);
      const target = line.querySelector(".typed");
      const text = `${row[0] === "cmd" ? "" : ""}${row[1]}${row[2] ? "  " + row[2] : ""}`;
      for (const char of text) {
        target.textContent += char;
        await new Promise(r => setTimeout(r, 4 + Math.random() * 8));
      }
      await new Promise(r => setTimeout(r, 45 + Math.random()*120));
    }
  }

  $$(".terminal[data-terminal]").forEach(term => {
    const key = term.dataset.terminal;
    const data = terminalSets[key] || terminalSets.home;
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            typeTerminal(term, data);
            io.unobserve(term);
          }
        });
      }, { threshold: .2 });
      io.observe(term);
    } else typeTerminal(term, data);
  });

  // Rare glitch bursts
  const glitch = $(".glitch-layer");
  if (glitch && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const fire = () => {
      glitch.classList.remove("fire");
      void glitch.offsetWidth;
      glitch.classList.add("fire");
      document.body.classList.add("body-glitch");
      setTimeout(() => document.body.classList.remove("body-glitch"), 180);
      setTimeout(fire, 5200 + Math.random()*8500);
    };
    setTimeout(fire, 4200 + Math.random()*5000);
  }
})();