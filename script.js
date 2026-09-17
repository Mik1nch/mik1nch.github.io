(() => {
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];


  // ---------------------------------------------------------
  // Boot screen / fast-jolt progress
  // ---------------------------------------------------------
  const boot = document.querySelector(".boot-screen");
  const bootBar = document.querySelector(".boot-progress span");
  const bootPercent = document.querySelector(".boot-percent");
  const bootLine = document.querySelector(".boot-live-line");
  const bootState = document.querySelector(".boot-state");

  const bootLines = [
    "initializing creative node...",
    "loading interface fragments...",
    "mounting /visual /code /ai...",
    "checking local modules...",
    "warming up terminal...",
    "opening portfolio shell...",
    "routing signal...",
    "calibrating chaos...",
    "assembling interface...",
    "almost there..."
  ];

  function runBoot(isNavigation = false) {
    if (!boot || !bootBar || !bootPercent) return Promise.resolve();
    document.body.classList.add(isNavigation ? "is-leaving" : "is-booting");
    boot.classList.remove("is-done");
    boot.setAttribute("aria-hidden", "false");
    if (bootState) bootState.textContent = isNavigation ? "ROUTE" : "INIT";

    let progress = 0;
    let lastLine = -1;
    const started = performance.now();
    const totalTime = isNavigation ? 620 : 760;

    return new Promise(resolve => {
      function tick(now) {
        const elapsed = now - started;
        // Uneven, very fast jumps rather than a smooth fake loader.
        const target = Math.min(100, (elapsed / totalTime) * 100);
        const jump = target > progress
          ? Math.min(target, progress + (Math.random() * 17 + 7))
          : progress;
        progress = Math.min(100, jump);

        bootBar.style.width = `${progress}%`;
        bootPercent.textContent = `${String(Math.round(progress)).padStart(2,"0")}%`;

        if (bootLine && (lastLine === -1 || Math.random() < .13)) {
          const next = Math.floor(Math.random() * bootLines.length);
          if (next !== lastLine) {
            bootLine.textContent = bootLines[next];
            lastLine = next;
          }
        }

        if (progress >= 100 || elapsed >= totalTime) {
          bootBar.style.width = "100%";
          bootPercent.textContent = "100%";
          if (bootLine) bootLine.textContent = "interface ready.";
          setTimeout(() => {
            boot.classList.add("is-done");
            document.body.classList.remove("is-booting");
            resolve();
          }, isNavigation ? 70 : 150);
          return;
        }
        requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }

  if (boot) runBoot(false);

  // ---------------------------------------------------------
  // Same-origin page transition
  // ---------------------------------------------------------
  const sameOriginLink = a => {
    if (!a.href) return false;
    const url = new URL(a.href, location.href);
    return url.origin === location.origin &&
      url.pathname !== location.pathname &&
      !a.target &&
      !a.download &&
      !a.hasAttribute("data-no-transition");
  };

  $$("a").forEach(link => {
    link.addEventListener("click", async e => {
      if (!sameOriginLink(link)) return;
      if (document.body.classList.contains("is-leaving")) {
        e.preventDefault();
        return;
      }
      e.preventDefault();
      const url = link.href;
      document.body.classList.add("is-leaving");
      await runBoot(true);
      window.location.href = url;
    });
  });

  // ---------------------------------------------------------
  // Ambient glitch bursts: cherry / dark green / purple.
  // Rare, brief, and intentionally uneven.
  // ---------------------------------------------------------
  const flash = document.querySelector(".glitch-flash");
  const glitchBody = document.body;
  if (flash && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const palettes = ["cherry", "green", "purple"];

    const scheduleGlitch = () => {
      const delay = 4500 + Math.random() * 8200;
      setTimeout(() => {
        const kind = palettes[Math.floor(Math.random() * palettes.length)];
        flash.dataset.kind = kind;
        flash.classList.remove("active");
        void flash.offsetWidth;
        flash.classList.add("active");
        glitchBody.classList.add("glitch-active");
        setTimeout(() => glitchBody.classList.remove("glitch-active"), 220);
        scheduleGlitch();
      }, delay);
    };
    scheduleGlitch();
  }

  // Year
  $$("#year").forEach(el => el.textContent = new Date().getFullYear());

  // Profile data
  if (window.MIKINCH_PROFILE) {
    const p = window.MIKINCH_PROFILE;
    $$("[data-profile-name]").forEach(el => el.textContent = p.name);
    $$("[data-profile-location]").forEach(el => el.textContent = p.location);
    $$("[data-profile-intro]").forEach(el => el.textContent = p.intro);
    $$("[data-profile-bio]").forEach(el => el.textContent = p.bio);
    $$("[data-profile-headline]").forEach(el => el.textContent = p.headline);
    $$("[data-profile-description]").forEach(el => el.textContent = p.description);

    $$("[data-contact]").forEach(el => {
      const type = el.dataset.contact;
      const value = p.contacts?.[type] || "#";
      el.href = value;
      if (value === "#") {
        el.addEventListener("click", e => e.preventDefault());
      }
    });
  }

  // Active navigation
  const current = document.body.dataset.page;
  $$("[data-nav]").forEach(link => {
    if (link.dataset.nav === current) link.classList.add("active");
  });

  // Mobile menu
  const menuToggle = $(".menu-toggle");
  const nav = $(".main-nav");
  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      const opened = menuToggle.classList.toggle("open");
      nav.classList.toggle("open", opened);
      menuToggle.setAttribute("aria-expanded", opened ? "true" : "false");
      document.body.classList.toggle("menu-open", opened);
    });
    $$(".main-nav a").forEach(link => link.addEventListener("click", () => {
      menuToggle.classList.remove("open");
      nav.classList.remove("open");
      document.body.classList.remove("menu-open");
    }));
  }

  // Cursor glow — desktop only
  const glow = $(".cursor-glow");
  if (glow && window.matchMedia("(pointer:fine)").matches) {
    window.addEventListener("pointermove", e => {
      glow.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
    }, { passive: true });
  }

  // Reveal
  const revealItems = $$(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach(el => io.observe(el));
  } else {
    revealItems.forEach(el => el.classList.add("visible"));
  }

  // Tilt cards
  if (window.matchMedia("(pointer:fine)").matches) {
    $$(".tilt-card").forEach(card => {
      const strength = 7;
      card.addEventListener("pointermove", e => {
        const r = card.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width) * 2 - 1;
        const y = ((e.clientY - r.top) / r.height) * 2 - 1;
        card.style.transform = `perspective(900px) rotateX(${(-y * strength).toFixed(2)}deg) rotateY(${(x * strength).toFixed(2)}deg) translateZ(0)`;
      });
      card.addEventListener("pointerleave", () => {
        card.style.transform = "";
      });
    });
  }

  // Magnetic buttons
  if (window.matchMedia("(pointer:fine)").matches) {
    $$(".magnetic").forEach(el => {
      el.addEventListener("pointermove", e => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - (r.left + r.width / 2);
        const y = e.clientY - (r.top + r.height / 2);
        el.style.transform = `translate(${(x * 0.08).toFixed(2)}px, ${(y * 0.08).toFixed(2)}px)`;
      });
      el.addEventListener("pointerleave", () => {
        el.style.transform = "";
      });
    });
  }

  // Smooth local anchors
  $$('a[href^="#"]').forEach(link => {
    link.addEventListener("click", e => {
      const target = document.querySelector(link.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  // Decorative terminal simulations — visual only, nothing is executed.
  // Each window has its own little personality instead of repeating the same phrases.
  const terminalScripts = {
    cmd: [
      ['command', 'C:\\MIKINCH> mode con: cols=92 lines=28'],
      ['system', '[CONSOLE] ANSI sequence enabled.'],
      ['command', 'C:\\MIKINCH> tree /f /a .\\creative'],
      ['output', 'art\\anime\ncode\\bots\nai\\prompts\nslides\\decks'],
      ['command', 'C:\\MIKINCH> tasklist | findstr "creative.exe"'],
      ['output', 'creative.exe            4208   Console   1   84,112 K'],
      ['command', 'C:\\MIKINCH> ping localhost -n 3'],
      ['output', 'Reply from 127.0.0.1: time<1ms\nReply from 127.0.0.1: time<1ms\nReply from 127.0.0.1: time<1ms'],
      ['warn', '[WARN] boredom.exe not found. Good.'],
      ['command', 'C:\\MIKINCH> echo READY.'],
      ['ok', 'READY.'],
      ['command', 'C:\\MIKINCH> _']
    ],
    bash: [
      ['command', '$ uname -a'],
      ['output', 'MIKINCH_STUDIO 5.0 creative-core x86_64'],
      ['command', '$ find ./ideas -maxdepth 2 -type f | shuf | head'],
      ['output', './ideas/website.md\n./ideas/visual-01.png\n./ideas/odd-ui.txt\n./ideas/playlist.m3u'],
      ['command', '$ grep -R "make it cooler" ./projects'],
      ['output', './projects/site/style.css:42: make it cooler'],
      ['command', '$ python3 ./mood.py --today'],
      ['output', 'mood = curious\nenergy = 73%\nnoise = pleasantly chaotic'],
      ['command', '$ curl -s localhost:1337/status'],
      ['ok', '{ "status": "alive", "taste": "questionable but intentional" }'],
      ['command', '$ _']
    ],
    powershell: [
      ['command', 'PS C:\\Mikinch> Get-Process | Sort CPU -Descending | Select -First 4'],
      ['output', 'Code        31.4\nBrowser     18.8\nPhotoshop    7.2\nBrain       99.9'],
      ['command', 'PS C:\\Mikinch> Get-ChildItem .\\drafts -Recurse | Measure-Object'],
      ['output', 'Count : 47\nStatus: several of them are "almost finished"'],
      ['command', 'PS C:\\Mikinch> Test-Path .\\perfect_idea.ps1'],
      ['output', 'False'],
      ['warn', 'PS C:\\Mikinch> Write-Warning "Maybe after coffee."'],
      ['ok', 'WARNING: actually, the idea is still good.'],
      ['command', 'PS C:\\Mikinch> ./ship-it.ps1 -Force'],
      ['ok', 'Deployment window opened. Panic level: 0%.'],
      ['command', 'PS C:\\Mikinch> _']
    ],
    git: [
      ['command', '$ git status --short'],
      ['output', ' M styles.css\n M index.html\n?? idea-that-suddenly-became-a-feature.txt'],
      ['command', '$ git diff --stat'],
      ['output', ' 3 files changed\n 118 insertions(+)\n 21 deletions(-)'],
      ['command', '$ git log --oneline -4'],
      ['output', '7f4c2a1 make it cooler\nbeef042 add tiny chaos\n0a11d9f move that thing 4px\nc0ffee9 initial commit'],
      ['command', '$ git add -A && git commit -m "ship questionable masterpiece"'],
      ['ok', '[main] ship questionable masterpiece'],
      ['command', '$ git push origin main'],
      ['ok', 'Counting objects... done.\nEverything up-to-date.'],
      ['command', '$ _']
    ]
  };

  const typeTerminal = async (el, key) => {
    const script = terminalScripts[key];
    if (!script) return;
    const caret = el.querySelector('.terminal-caret');
    for (const [kind, text] of script) {
      const line = document.createElement('div');
      line.className = kind;
      el.insertBefore(line, caret);
      for (const ch of text) {
        line.textContent += ch;
        await new Promise(r => setTimeout(r, 6 + Math.random()*20));
      }
      await new Promise(r => setTimeout(r, 80 + Math.random()*150));
    }
  };

  const terminalObserver = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting || entry.target.dataset.terminalStarted) return;
      entry.target.dataset.terminalStarted = '1';
      const caret = entry.target.querySelector('.terminal-caret');
      entry.target.innerHTML = '';
      entry.target.appendChild(caret || Object.assign(document.createElement('span'), {className:'terminal-caret', textContent:'█'}));
      typeTerminal(entry.target, entry.target.dataset.terminal);
    });
  }, {threshold:.15}) : null;
  $$('[data-terminal]').forEach(el => terminalObserver ? terminalObserver.observe(el) : typeTerminal(el, el.dataset.terminal));

})();
