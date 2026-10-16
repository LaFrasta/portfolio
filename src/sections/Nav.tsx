import { useEffect, useState, type MouseEvent } from 'react';
import { useLang } from '../i18n';
import { scrollToId } from '../motion';
import type { Lang } from '../content';

const ITEMS = ['grid', 'stack', 'flow', 'agents', 'projects', 'log', 'contact'] as const;

export default function Nav() {
  const { t, lang, setLang } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [current, setCurrent] = useState<string>('grid');
  const [booted, setBooted] = useState(false);

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
      (entries) => entries.forEach((e) => e.isIntersecting && setCurrent(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    );
    ITEMS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => {
      window.removeEventListener('scroll', onScroll);
      io.disconnect();
    };
  }, []);

  const go = (id: string) => (e: MouseEvent) => {
    e.preventDefault();
    scrollToId(id);
  };

  return (
    <header className={`nav${scrolled ? ' is-scrolled' : ''}${booted || scrolled ? ' is-booted' : ''}`}>
      <a className="nav-mark" href="#grid" onClick={go('grid')} aria-label="Emanuele Manniti">
        <svg viewBox="0 0 32 32" aria-hidden>
          <path d="M4 22h24M10 22V10M22 22V10M10 10h12" />
          <rect x="13" y="7" width="6" height="6" />
        </svg>
        <span>E. Manniti</span>
      </a>
      <nav aria-label="Sezioni">
        <ul>
          {ITEMS.map((id) => (
            <li key={id}>
              <a href={`#${id}`} onClick={go(id)} aria-current={current === id ? 'location' : undefined}>
                <span className="nav-lamp" aria-hidden />
                {t.nav[id]}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <div className="keyswitch" role="radiogroup" aria-label={t.langLabel}>
        {(['it', 'en'] as Lang[]).map((l) => (
          <button key={l} type="button" role="radio" aria-checked={lang === l} onClick={() => setLang(l)}>
            {l.toUpperCase()}
          </button>
        ))}
        <span className={`keyswitch-knob${lang === 'en' ? ' is-right' : ''}`} aria-hidden />
      </div>
    </header>
  );
}
