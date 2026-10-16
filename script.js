"use strict";

document.documentElement.classList.add("js");
document.getElementById("year").textContent = new Date().getFullYear();
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

// Anchors still work without JavaScript. Enhance the small-screen menu.
const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.getElementById("site-nav");
function closeMenu() {
  siteNav.classList.remove("open");
  navToggle.setAttribute("aria-expanded", "false");
}
navToggle.addEventListener("click", () => {
  const open = navToggle.getAttribute("aria-expanded") !== "true";
  siteNav.classList.toggle("open", open);
  navToggle.setAttribute("aria-expanded", String(open));
});
siteNav.addEventListener("click", (event) => {
  if (event.target.closest("a")) closeMenu();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && siteNav.classList.contains("open")) {
    closeMenu();
    navToggle.focus();
  }
});
document.addEventListener("click", (event) => {
  if (!event.target.closest(".header-inner")) closeMenu();
});
const desktopNav = window.matchMedia("(min-width: 761px)");
function syncNavigation() {
  navToggle.hidden = desktopNav.matches;
  closeMenu();
}
desktopNav.addEventListener("change", syncNavigation);
syncNavigation();

// Load third-party players only on request. Keep direct links as fallbacks.
const player = document.getElementById("video-player");
document.addEventListener("click", (event) => {
  const link = event.target.closest("a[data-video]");
  if (!link || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const videoId = link.dataset.video;
  if (!/^[a-zA-Z0-9_-]{11}$/.test(videoId)) return;
  event.preventDefault();
  const card = link.closest(".episode-card");
  const title = link.dataset.title;
  const divider = title.lastIndexOf(" | ");
  document.getElementById("featured-title").textContent = divider > -1 ? title.slice(0, divider) : title;
  document.getElementById("featured-guest").textContent = divider > -1 ? title.slice(divider + 3) : "Metascience Matters";
  document.getElementById("featured-youtube").href = link.href;
  if (card) {
    document.getElementById("featured-notes").href = card.querySelector(".episode-notes").href;
    document.querySelector(".feature-kicker").firstElementChild.textContent = "Now watching";
    document.querySelector(".feature-kicker").lastElementChild.textContent = card.querySelector("time").textContent;
  }
  const iframe = document.createElement("iframe");
  iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`;
  iframe.title = title;
  iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
  iframe.allowFullscreen = true;
  iframe.referrerPolicy = "strict-origin-when-cross-origin";
  player.replaceChildren(iframe);
  document.getElementById("player-status").textContent = `Video player loaded: ${title}. If playback is unavailable, use the Open on YouTube link below.`;
  if (card) player.scrollIntoView({ behavior: reduceMotion.matches ? "instant" : "smooth", block: "center" });
  player.focus({ preventScroll: true });
});

const spotifyButton = document.getElementById("load-spotify");
spotifyButton.hidden = false;
spotifyButton.addEventListener("click", () => {
  const iframe = document.createElement("iframe");
  iframe.src = "https://open.spotify.com/embed/show/7coSExbjL2LnlBZh89BDZG?utm_source=generator&theme=0";
  iframe.title = "Metascience Matters episodes on Spotify";
  iframe.allow = "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture";
  document.getElementById("spotify-player").replaceChildren(iframe);
  iframe.focus({ preventScroll: true });
});

// HTML contains the complete archive for search engines and no-script visitors.
const cards = Array.from(document.querySelectorAll(".episode-card"));
const search = document.getElementById("episode-search");
const showMore = document.getElementById("show-more");
const emptyState = document.getElementById("empty-state");
const resultsStatus = document.getElementById("results-status");
let expanded = false;
const pageSize = 6;
function normalize(value) {
  return value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}
const searchableText = new Map(cards.map((card) => [card, normalize(`${card.textContent} ${card.dataset.keywords || ""}`)]));
function updateEpisodes(announce = true) {
  const query = normalize(search.value);
  const searching = query.length > 0;
  const matching = cards.filter((card) => !query || searchableText.get(card).includes(query));
  const visible = new Set(!searching && !expanded ? matching.slice(0, pageSize) : matching);
  cards.forEach((card) => { card.hidden = !visible.has(card); });
  showMore.hidden = searching || expanded || matching.length <= pageSize;
  emptyState.hidden = matching.length > 0;
  if (announce) resultsStatus.textContent = `${visible.size} of ${matching.length} ${matching.length === 1 ? "episode" : "episodes"} shown.`;
}
search.addEventListener("input", () => updateEpisodes());
showMore.addEventListener("click", () => {
  expanded = true;
  updateEpisodes();
  cards[pageSize]?.querySelector("a").focus({ preventScroll: true });
});
document.getElementById("clear-search").addEventListener("click", () => {
  search.value = "";
  updateEpisodes();
  search.focus({ preventScroll: true });
});
document.getElementById("episode-tools").hidden = false;
updateEpisodes(false);
