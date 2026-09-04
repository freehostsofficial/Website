// Theme init snippet, inlined in <head> to apply the theme before first
// paint (mirrors getTheme() in components/ThemeProvider.tsx — keep in sync).
// Read-only: safe regardless of consent (persistence itself is gated).
import { THEME_STORAGE_KEY } from "./cookies";

export const THEME_INIT_SNIPPET = `(function(){try{var t=localStorage.getItem('${THEME_STORAGE_KEY}')||(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`;
