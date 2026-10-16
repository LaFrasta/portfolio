import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type MouseEvent } from 'react';
import { useLang } from '../i18n';
import { scrollToId } from '../motion';
import type { Lang } from '../content';

const ITEMS = [
  { id: 'grid', it: 'home.tsx', en: 'home.tsx', c: '#f2f5ef' },
  { id: 'about', it: 'chi-sono.md', en: 'about.md', c: '#aec1b7' },
  { id: 'stack', it: 'stack.tsx', en: 'stack.tsx', c: '#3fd68a' },
  { id: 'flow', it: 'esperienza.tsx', en: 'experience.tsx', c: '#ff4a36' },
  { id: 'agents', it: 'agenti.ts', en: 'agents.ts', c: '#c79bff' },
  { id: 'projects', it: 'progetti.tsx', en: 'projects.tsx', c: '#3b82f6' },
  { id: 'log', it: 'percorso.md', en: 'path.md', c: '#ffb21e' },
  { id: 'contact', it: 'contatti.ts', en: 'contact.ts', c: '#7ee2a8' },
] as const;

type NavId = (typeof ITEMS)[number]['id'];

export default function Nav() {
  const { t, lang, setLang } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [current, setCurrent] = useState<NavId>('grid');
  const [booted, setBooted] = useState(false);
  const [bar, setBar] = useState({ left: 0, width: 0 });
  const tabsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // The hero's code sequence types the nav into existence; the fallback covers reduced motion and late loads
    const show = () => setBooted(true);
    const hide = () => setBooted(false);
    const id = window.setTimeout(show, 4000);
    window.addEventListener('hero:nav', show);
    window.addEventListener('hero:typing', hide);
    return () => {
      window.clearTimeout(id);
      window.removeEventListener('hero:nav', show);
      window.removeEventListener('hero:typing', hide);
    };
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setCurrent(e.target.id as NavId)),
      { rootMargin: '-45% 0px -50% 0px' },
    );
    ITEMS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => {
      window.removeEventListener('scroll', onScroll);
      io.disconnect();
    };
  }, []);

  useLayoutEffect(() => {
    const tabs = tabsRef.current;
    const tab = tabs?.querySelector<HTMLElement>(`[data-id="${current}"]`);
    if (!tabs || !tab) return;
    setBar({ left: tab.offsetLeft, width: tab.offsetWidth });
    if (tab.offsetLeft < tabs.scrollLeft || tab.offsetLeft + tab.offsetWidth > tabs.scrollLeft + tabs.clientWidth) {
      tabs.scrollTo({ left: tab.offsetLeft - 40, behavior: 'smooth' });
    }
  }, [current, lang]);

  const go = (id: string) => (e: MouseEvent) => {
    e.preventDefault();
    scrollToId(id);
  };

  return (
    <header className={`nav${scrolled ? ' is-scrolled' : ''}${booted || scrolled ? ' is-booted' : ''}`}>
      <span className="nav-dots" aria-hidden>
        <i />
        <i />
        <i />
      </span>
      <a className="nav-brand" href="#grid" onClick={go('grid')}>
        <b>~/</b>emanuele-manniti
      </a>
      <nav className="nav-tabs" ref={tabsRef} aria-label={t.nav.label}>
        {ITEMS.map((item) => (
          <a
            key={item.id}
            data-id={item.id}
            href={`#${item.id}`}
            className={`nav-tab${current === item.id ? ' is-on' : ''}`}
            style={{ '--c': item.c } as CSSProperties}
            onClick={go(item.id)}
            aria-current={current === item.id ? 'location' : undefined}
            title={t.nav[item.id]}
          >
            <span className="nav-ic" aria-hidden />
            {item[lang]}
            <span className="nav-x" aria-hidden>
              ×
            </span>
          </a>
        ))}
        <span className="nav-bar" style={{ left: bar.left, width: bar.width }} aria-hidden />
      </nav>
      <div className="nav-lang" role="radiogroup" aria-label={t.langLabel}>
        <span className="nav-lang-key" aria-hidden>
          lang:
        </span>
        {(['it', 'en'] as Lang[]).map((l, i) => (
          <span key={l}>
            {i > 0 && <span className="nav-lang-sep">|</span>}
            <button type="button" role="radio" aria-checked={lang === l} onClick={() => setLang(l)}>
              "{l}"
            </button>
          </span>
        ))}
      </div>
    </header>
  );
}
