export const THEME_STORAGE_KEY = "theme";

// Runs before first paint (injected in the root layout) so a dark-mode user
// never sees a flash of the light theme. Kept outside the client theme provider
// so the server layout can import the string directly.
export const themeInitScript = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t!=="light"&&t!=="dark"){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}var r=document.documentElement;r.classList.remove("light","dark");r.classList.add(t);r.style.colorScheme=t}catch(e){}})();`;
