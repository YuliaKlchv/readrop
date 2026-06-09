import { createContext, useContext, useState } from "react";
import { T } from "../data/i18n.js";

const LangContext = createContext();

function detectLang() {
  const stored = localStorage.getItem("readrop_lang");
  if (stored && T[stored]) return stored;
  const browser = navigator.language?.slice(0, 2).toLowerCase();
  if (browser === "de") return "de";
  if (browser === "tr") return "tr";
  if (browser === "fr") return "fr";
  return "en";
}

export function LangProvider({ children }) {
  const [lang, setLangState] = useState(detectLang);

  const setLang = (code) => {
    if (!T[code]) return;
    setLangState(code);
    localStorage.setItem("readrop_lang", code);
  };

  return (
    <LangContext.Provider value={{ lang, setLang, t: T[lang] }}>
      {children}
    </LangContext.Provider>
  );
}

export const useLang = () => useContext(LangContext);
export const useT   = () => useContext(LangContext).t;
