// ── Mobile Nav Toggle ────────────────────────────────────
const menuToggle = document.querySelector(".menu-toggle");
const mobileNav = document.querySelector("#mobile-nav");

menuToggle?.addEventListener("click", () => {
  const isOpen = mobileNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

mobileNav?.addEventListener("click", (e) => {
  if (e.target instanceof HTMLAnchorElement) {
    mobileNav.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
  }
});

// ── Copy Buttons ─────────────────────────────────────────
document.querySelectorAll("[data-copy]").forEach((btn) => {
  btn.addEventListener("click", async () => {
    const value = btn.getAttribute("data-copy");
    if (!value) return;

    try {
      await navigator.clipboard.writeText(value);
      const svg = btn.querySelector("svg");
      if (svg) {
        const original = svg.outerHTML;
        btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`;
        setTimeout(() => {
          btn.innerHTML = original;
        }, 1500);
      }
    } catch {
      // Clipboard API not available
    }
  });
});

// ── Header scroll shadow ─────────────────────────────────
const header = document.getElementById("site-header");
let lastScroll = 0;

window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;
  header?.classList.toggle("scrolled", scrollY > 10);
  lastScroll = scrollY;
}, { passive: true });

// ── Active nav link tracking ─────────────────────────────
const navLinks = document.querySelectorAll(".desktop-nav a");
const sections = [...navLinks]
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const navObserver = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((e) => e.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;

    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${visible.target.id}`);
    });
  },
  {
    rootMargin: "-20% 0px -55% 0px",
    threshold: [0.1, 0.35, 0.6],
  }
);

sections.forEach((s) => navObserver.observe(s));

// ── Scroll Reveal ────────────────────────────────────────
const revealTargets = document.querySelectorAll(
  ".crew-card, .cmd-card, .feature-card, .pipeline-step, .install-grid, .section-header, .compare-table-wrapper, .faq-item"
);

revealTargets.forEach((el) => el.classList.add("reveal"));

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    rootMargin: "0px 0px -60px 0px",
    threshold: 0.1,
  }
);

revealTargets.forEach((el) => revealObserver.observe(el));

// ── Staggered reveal for grid children ───────────────────
document.querySelectorAll(".crew-grid, .command-grid, .feature-grid, .pipeline, .faq-accordion-list").forEach((grid) => {
  const children = grid.children;
  for (let i = 0; i < children.length; i++) {
    children[i].style.transitionDelay = `${i * 80}ms`;
  }
});

// ── Interactive FAQ Accordion ─────────────────────────────
document.querySelectorAll(".faq-trigger").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const expanded = trigger.getAttribute("aria-expanded") === "true";
    trigger.setAttribute("aria-expanded", String(!expanded));
    
    const content = trigger.nextElementSibling;
    if (content) {
      content.hidden = expanded;
    }
  });
});

// ── Terminal Mock Logs database ───────────────────────────
const terminalLogs = {
  setup: `
    <code><span class="t-prompt">$</span> npx grokgoblin@latest setup</code>
    <code><span class="t-prompt">$</span> grok login</code>
    <code class="t-output">Authenticating shell session with xAI...</code>
    <code class="t-success">✓ Shell logged in successfully.</code>
    <code><span class="t-prompt">$</span> gg setup</code>
    <code class="t-output">Initializing GrokGoblin local orchestrator...</code>
    <code class="t-output">Downloading core skills (dig, quest, ralph, tdd, review)...</code>
    <code class="t-success">✓ Setup complete. 10 specialist agents configured.</code>
  `,
  sniffer: `
    <code><span class="t-prompt">$</span> gg forage <span class="t-string">"where is the database initialized?"</span></code>
    <code class="t-output"><span class="t-label">[SNIFFER]</span> status → scan files</code>
    <code class="t-output">&gt; read → package.json, src/index.ts, src/db.ts</code>
    <code class="t-output">&gt; trace → db connection pool initialized at src/db.ts:L24</code>
    <code class="t-output">&gt; facts → config loaded from environment variables (DB_URL)</code>
    <code class="t-success">✓ Found match at src/db.ts line 24.</code>
  `,
  schemer: `
    <code><span class="t-prompt">$</span> gg plan <span class="t-string">"add user profiles schema"</span></code>
    <code class="t-output"><span class="t-label">[SCHEMER]</span> status → drafting implementation plan</code>
    <code class="t-output">&gt; analysis → need new table 'profiles', relationship user_id -> users(id)</code>
    <code class="t-output">&gt; files → [NEW] migrations/012_profiles.sql, [MODIFY] src/models/profile.ts</code>
    <code class="t-output">&gt; verification → run migrations and assert seed data succeeds</code>
    <code class="t-success">✓ Plan created and saved to .grokgoblin/plans/012_plan.md</code>
  `,
  basher: `
    <code><span class="t-prompt">$</span> gg exec <span class="t-string">"implement profile model"</span></code>
    <code class="t-output"><span class="t-label">[BASHER]</span> status → executing scoped changes</code>
    <code class="t-output">&gt; modify → src/models/profile.ts (add class UserProfile)</code>
    <code class="t-output">&gt; write → add getProfileByUserId and updateProfile methods</code>
    <code class="t-output">&gt; scope check → edits verified strictly inside src/models/</code>
    <code class="t-success">✓ Code implemented. 48 lines added, 0 warnings.</code>
  `,
  squasher: `
    <code><span class="t-prompt">$</span> gg ralph <span class="t-string">"fix NullPointerException in profile fetch"</span></code>
    <code class="t-output"><span class="t-label">[SQUASHER]</span> status → debugging stacktrace</code>
    <code class="t-output">&gt; trace → profile.ts:L45 called profile.avatar without null check</code>
    <code class="t-output">&gt; isolate → user avatar can be null if not uploaded</code>
    <code class="t-output">&gt; patch → add optional chaining profile?.avatar or default empty string</code>
    <code class="t-success">✓ Root cause fixed. Tests passing.</code>
  `,
  warden: `
    <code><span class="t-prompt">$</span> gg exec --check <span class="t-string">"review security parameters"</span></code>
    <code class="t-output"><span class="t-label">[WARDEN]</span> status → scanning trust boundaries</code>
    <code class="t-output">&gt; audit → check profile.ts SQL queries for raw interpolations</code>
    <code class="t-output">&gt; verify → parameterized query verified, no SQLi vulnerability detected</code>
    <code class="t-output">&gt; secrets → zero credentials found in uncommitted local files</code>
    <code class="t-success">✓ Security audit passed. Code marked safe.</code>
  `,
  prover: `
    <code><span class="t-prompt">$</span> gg exec --test</code>
    <code class="t-output"><span class="t-label">[PROVER]</span> status → running tests & checklists</code>
    <code class="t-output">&gt; exec → npm run test:unit</code>
    <code class="t-output">&gt; output → ✓ profile model suite passed (12 tests)</code>
    <code class="t-output">&gt; exec → npm run test:integration</code>
    <code class="t-output">&gt; output → ✓ database connection integration test passed</code>
    <code class="t-success">✓ Verification complete. Build fully correct.</code>
  `
};

const terminalBody = document.getElementById("sandbox-terminal-body");
const tabs = document.querySelectorAll(".term-tab");
const copyBtn = document.getElementById("terminal-copy-btn");
const crewCards = document.querySelectorAll(".interactive-card");

// Update copy button state depending on active terminal session command
function updateCopyButtonCommand(commandKey) {
  let commandStr = "npx grokgoblin@latest setup";
  if (commandKey === "sniffer") commandStr = 'gg forage "where is the database initialized?"';
  else if (commandKey === "schemer") commandStr = 'gg plan "add user profiles schema"';
  else if (commandKey === "basher") commandStr = 'gg exec "implement profile model"';
  else if (commandKey === "squasher") commandStr = 'gg ralph "fix NullPointerException in profile fetch"';
  else if (commandKey === "warden") commandStr = 'gg exec --check "review security parameters"';
  else if (commandKey === "prover") commandStr = 'gg exec --test';
  
  copyBtn?.setAttribute("data-copy", commandStr);
}

// Function to run a terminal sandbox output
function runTerminalOutput(commandKey) {
  if (!terminalBody) return;
  
  // Set tab active state
  tabs.forEach(tab => {
    tab.classList.toggle("active", tab.getAttribute("data-cmd") === commandKey);
  });
  
  // Set crew card active state
  crewCards.forEach(card => {
    card.classList.toggle("active", card.getAttribute("data-agent") === commandKey);
  });

  // Inject content with fade animation
  terminalBody.style.opacity = "0.2";
  setTimeout(() => {
    terminalBody.innerHTML = terminalLogs[commandKey] || terminalLogs.setup;
    terminalBody.style.opacity = "1";
    updateCopyButtonCommand(commandKey);
  }, 1500);
}

// Bind tabs clicks
tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    const cmd = tab.getAttribute("data-cmd");
    if (cmd) runTerminalOutput(cmd);
  });
});

// Bind crew card clicks to terminal output updates
crewCards.forEach(card => {
  card.addEventListener("click", () => {
    const agent = card.getAttribute("data-agent");
    if (agent) {
      runTerminalOutput(agent);
      // Smooth scroll back up to terminal preview
      document.getElementById("overview")?.scrollIntoView({ behavior: "smooth" });
    }
  });
});

// ── Background Scroll Frame Controller ─────────────────────
const totalFrames = 145;
const frameImages = [];
const framePath = (index) => `assets/frames/frame_${String(index).padStart(4, "0")}.jpg`;

// Preload all background frames for smooth scrubbing
for (let i = 1; i <= totalFrames; i++) {
  const img = new Image();
  img.src = framePath(i);
  frameImages.push(img);
}

const frameImgElement = document.getElementById("scroll-bg-frame");

window.addEventListener("scroll", () => {
  const scrollTop = window.scrollY;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const scrollFraction = maxScroll > 0 ? scrollTop / maxScroll : 0;
  
  // Map scrollFraction (0 to 1) to frame index (1 to 145)
  const frameIndex = Math.min(
    totalFrames,
    Math.max(1, Math.floor(scrollFraction * totalFrames) + 1)
  );
  
  if (frameImgElement) {
    frameImgElement.src = framePath(frameIndex);
  }
}, { passive: true });
