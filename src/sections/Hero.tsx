import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import { useLang } from '../i18n';
import { reducedMotion } from '../motion';

interface HeroProps {
  name: string | null;
  role: string | null;
  tagline: string | null;
  accent: string | null;
  stack: string[] | null;
  ok: boolean;
}

const NAME = 'Emanuele Manniti';
const STACK = ['java', 'spring', 'node', 'react', 'kafka'];
const ACCENT = '#ff4a36';

function buildSource(role: string, tagline: string) {
  return [
    'export function Portfolio() {',
    '  return (',
    '    <Hero',
    `      name="${NAME}"`,
    `      role="${role}"`,
    `      tagline="${tagline}"`,
    `      accent="${ACCENT}"`,
    `      stack={[${STACK.map((s) => `"${s}"`).join(', ')}]}`,
    '    />',
    '  );',
    '}',
  ].join('\n');
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Tags every string literal with data-s so the animation can fly text out of the exact token
function highlight(code: string) {
  const re = /\b(export|function|return)\b|\b(Portfolio)\b|(<\/?[A-Z][A-Za-z]*|\/>)|([a-z]+)(?==)|("[^"\n]*"?)|([\s\S])/g;
  let out = '';
  let i = 0;
  for (const m of code.matchAll(re)) {
    if (m[1]) out += `<span class="tk-kw">${m[1]}</span>`;
    else if (m[2]) out += `<span class="tk-fn">${m[2]}</span>`;
    else if (m[3]) out += `<span class="tk-tag">${esc(m[3])}</span>`;
    else if (m[4]) out += `<span class="tk-attr">${m[4]}</span>`;
    else if (m[5]) out += `<span class="tk-str" data-s="${i++}">${esc(m[5])}</span>`;
    else out += /[={}[\](),;]/.test(m[6]) ? `<span class="tk-punc">${esc(m[6])}</span>` : esc(m[6]);
  }
  return out;
}

function parse(code: string): HeroProps {
  const get = (k: string) => code.match(new RegExp(`${k}="([^"]*)"`))?.[1] ?? null;
  const st = code.match(/stack=\{\[([^\]]*)\]\}/);
  const stack = st ? (st[1].match(/"([^"]*)"/g) ?? []).map((s) => s.slice(1, -1)).filter(Boolean) : null;
  let accent = get('accent');
  if (accent && !/^#[0-9a-fA-F]{3,8}$/.test(accent)) accent = null;
  return { name: get('name'), role: get('role'), tagline: get('tagline'), accent, stack, ok: /<Hero[\s\S]*\/>/.test(code) };
}

function burst(x: number, y: number, n: number) {
  for (let i = 0; i < n; i++) {
    const s = document.createElement('span');
    s.className = 'hero-spark';
    s.style.left = `${x}px`;
    s.style.top = `${y}px`;
    document.body.appendChild(s);
    const a = Math.random() * Math.PI * 2;
    const d = 20 + Math.random() * 40;
    s.animate(
      [
        { transform: 'translate(0,0)', opacity: 1 },
        { transform: `translate(${Math.cos(a) * d}px,${Math.sin(a) * d}px) scale(.2)`, opacity: 0 },
      ],
      { duration: 600, easing: 'cubic-bezier(.16,1,.3,1)' },
    ).onfinish = () => s.remove();
  }
}

interface FlyOptions {
  delay?: number;
  duration?: number;
  stroke?: boolean;
  spin?: number;
  sparks?: number;
  done?: () => void;
}

function fly(from: Element | null, to: HTMLElement, text: string, o: FlyOptions) {
  if (!from) return o.done?.();
  const a = from.getBoundingClientRect();
  const b = to.getBoundingClientRect();
  const cs = getComputedStyle(to);
  const f = document.createElement('span');
  f.className = 'hero-flyer';
  f.textContent = text;
  Object.assign(f.style, { font: cs.font, fontStretch: cs.fontStretch, letterSpacing: cs.letterSpacing, textTransform: cs.textTransform, color: cs.color, left: `${b.left}px`, top: `${b.top}px` });
  if (o.stroke) f.style.webkitTextStroke = cs.webkitTextStroke;
  document.body.appendChild(f);
  const fb = f.getBoundingClientRect();
  const s = Math.min(a.width / (fb.width || 1), a.height / (fb.height || 1));
  const dx = a.left - b.left;
  const dy = a.top - b.top;
  const anim = f.animate(
    [
      { transform: `translate(${dx}px,${dy}px) scale(${s})`, color: '#7ee2a8' },
      { transform: `translate(${dx * 0.5}px,${dy * 0.5 - 80}px) scale(${(s + 1) / 2}) rotate(${o.spin ?? 0}deg)`, offset: 0.5 },
      { transform: 'translate(0,0) scale(1)', color: cs.color },
    ],
    { duration: o.duration ?? 1000, delay: o.delay ?? 0, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'both' },
  );
  anim.onfinish = () => {
    f.remove();
    burst(b.left + b.width / 2, b.top + b.height / 2, o.sparks ?? 0);
    o.done?.();
  };
}

export default function Hero() {
  const { t, lang } = useLang();
  const section = useRef<HTMLElement>(null);
  const pre = useRef<HTMLPreElement>(null);
  const input = useRef<HTMLTextAreaElement>(null);
  const nameEl = useRef<HTMLHeadingElement>(null);
  const roleEl = useRef<HTMLParagraphElement>(null);
  const tagEl = useRef<HTMLParagraphElement>(null);
  const stackEl = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);
  const [hero, setHero] = useState<HeroProps>(() => parse(buildSource(t.hero.role, t.hero.short)));
  const [code, setCode] = useState('');
  const [typing, setTyping] = useState(!reducedMotion);
  const [revealed, setRevealed] = useState(reducedMotion);
  const [flooded, setFlooded] = useState(reducedMotion);
  const [status, setStatus] = useState<'typing' | 'live' | 'error'>(reducedMotion ? 'live' : 'typing');
  const [flood, setFloodAt] = useState({ x: 70, y: 55 });
  const [run, setRun] = useState(0);

  const source = buildSource(t.hero.role, t.hero.short);
  const lines = code.split('\n');

  useEffect(() => {
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
    const src = buildSource(t.hero.role, t.hero.short);
    setHero(parse(src));
    if (reducedMotion) {
      setCode(src);
      setTyping(false);
      setRevealed(true);
      setFlooded(true);
      setStatus('live');
      return;
    }
    section.current?.querySelectorAll('.is-in').forEach((el) => el.classList.remove('is-in'));
    setTyping(true);
    setRevealed(false);
    setFlooded(false);
    setStatus('typing');
    window.dispatchEvent(new CustomEvent('hero:typing'));
    const ends = src.split('\n').map((_, i, arr) => arr.slice(0, i + 1).join('\n').length);
    const fired = new Set<number>();
    let n = 0;
    const str = (i: number) => pre.current?.querySelector(`[data-s="${i}"]`) ?? null;
    const onLine = (li: number) => {
      if (li === 2) window.dispatchEvent(new CustomEvent('hero:nav'));
      if (li === 3) {
        nameEl.current?.querySelectorAll<HTMLElement>('.hero-ch').forEach((ch, k) =>
          fly(str(0), ch, ch.textContent ?? '', { delay: k * 50, duration: 1100, stroke: true, spin: (k % 2 ? 1 : -1) * 18, sparks: 3, done: () => ch.classList.add('is-in') }),
        );
      }
      if (li === 4 && roleEl.current) fly(str(1), roleEl.current, roleEl.current.textContent ?? '', { duration: 950, sparks: 6, done: () => roleEl.current?.classList.add('is-in') });
      if (li === 5 && tagEl.current) fly(str(2), tagEl.current, tagEl.current.textContent ?? '', { duration: 950, done: () => tagEl.current?.classList.add('is-in') });
      if (li === 6) {
        const r = str(3)?.getBoundingClientRect();
        if (r) setFloodAt({ x: (r.left / window.innerWidth) * 100, y: (r.top / window.innerHeight) * 100 });
        setFlooded(true);
      }
      if (li === 7) {
        stackEl.current?.querySelectorAll<HTMLElement>('.hero-chip').forEach((c, k) =>
          fly(str(4 + k), c, c.textContent ?? '', { delay: k * 110, duration: 900, sparks: 4, done: () => c.classList.add('is-in') }),
        );
      }
    };
    const type = () => {
      n = Math.min(src.length, n + 2);
      setCode(src.slice(0, n));
      // Wait one frame so the freshly highlighted tokens exist before measuring them
      requestAnimationFrame(() => ends.forEach((e, li) => n >= e && !fired.has(li) && (fired.add(li), onLine(li))));
      if (n < src.length) timers.current.push(window.setTimeout(type, 26));
      else
        timers.current.push(
          window.setTimeout(() => {
            setTyping(false);
            setRevealed(true);
            setStatus('live');
          }, 900),
        );
    };
    timers.current.push(window.setTimeout(type, 500));
    return () => timers.current.forEach(window.clearTimeout);
    // The birth runs once per mount/replay; language changes are handled below without replaying
  }, [run]);

  useEffect(() => {
    if (typing) return;
    setCode(source);
    setHero(parse(source));
    setStatus('live');
  }, [lang]);

  const onInput = (value: string) => {
    setCode(value);
    const p = parse(value);
    if (!p.ok || !p.name) return setStatus('error');
    setStatus('live');
    setHero(p);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== 'Tab') return;
    e.preventDefault();
    const el = e.currentTarget;
    const s = el.selectionStart;
    const next = `${el.value.slice(0, s)}  ${el.value.slice(el.selectionEnd)}`;
    onInput(next);
    requestAnimationFrame(() => el.setSelectionRange(s + 2, s + 2));
  };

  const words = (hero.name ?? '').split(/\s+/).filter(Boolean);
  const cur = lines.length;
  const statusText = status === 'typing' ? t.hero.editor.typing : status === 'error' ? t.hero.editor.error : t.hero.editor.live;

  return (
    <section
      id="grid"
      ref={section}
      className={`hero${flooded ? ' is-flooded' : ''}${revealed ? ' is-revealed' : ''}`}
      style={{ '--accent': hero.accent ?? ACCENT, '--fx': `${flood.x}%`, '--fy': `${flood.y}%` } as CSSProperties}
      aria-labelledby="hero-title"
    >
      <div className="hero-grid" aria-hidden />
      <div className="hero-flood" aria-hidden />

      <div className="hero-id">
        <h1 id="hero-title" className="hero-name" ref={nameEl} aria-label={hero.name ?? NAME}>
          {words.map((w, wi) => (
            <span className="hero-word" key={`${w}-${wi}`} aria-hidden>
              {[...w].map((c, i) => (
                <span className="hero-ch" key={i}>
                  {c}
                </span>
              ))}
            </span>
          ))}
        </h1>
        <p className="hero-role" ref={roleEl}>
          {hero.role}
        </p>
        <p className="hero-tag" ref={tagEl}>
          {hero.tagline}
        </p>
        <div className="hero-stack" ref={stackEl}>
          {(hero.stack ?? []).map((s, i) => (
            <span className="hero-chip" key={`${s}-${i}`}>
              {s}
            </span>
          ))}
        </div>
      </div>

      <div className={`editor${typing ? '' : ' is-live'}`}>
        <div className="ed-tabs" aria-hidden>
          <span className="ed-dots">
            <i />
            <i />
            <i />
          </span>
          <span className="ed-tab is-on">Portfolio.tsx</span>
          <span className="ed-tab">Hero.tsx</span>
          <span className="ed-tab">Stack.tsx</span>
        </div>
        <div className="ed-body">
          <div className="ed-gutter" aria-hidden>
            {lines.map((_, i) => (
              <span key={i} className={typing && i === cur - 1 ? 'is-cur' : undefined}>
                {i + 1}
              </span>
            ))}
          </div>
          <div className="ed-code">
            <pre ref={pre} className="ed-pre" aria-hidden dangerouslySetInnerHTML={{ __html: highlight(code) + (typing ? '<span class="ed-caret"></span>' : '') }} />
            {!typing && (
              <textarea
                ref={input}
                className="ed-input"
                value={code}
                spellCheck={false}
                aria-label={t.hero.editor.label}
                onChange={(e) => onInput(e.target.value)}
                onKeyDown={onKeyDown}
              />
            )}
          </div>
          <div className="ed-mini" aria-hidden>
            {source.split('\n').map((l, i) => (
              <span
                key={i}
                className={typing && i === cur - 1 ? 'is-cur' : undefined}
                style={{ width: `${Math.min(100, l.trim().length * 2.2)}%`, marginLeft: `${(l.length - l.trimStart().length) * 3}%` }}
              />
            ))}
          </div>
        </div>
        <div className="ed-status">
          <span>⎇ main</span>
          <span>TSX</span>
          <span>
            Ln {cur}, Col {(lines[cur - 1] ?? '').length + 1}
          </span>
          <span className={`ed-live${status === 'error' ? ' is-err' : ''}`} aria-live="polite">
            ● {statusText}
          </span>
        </div>
      </div>

      {!typing && !reducedMotion && (
        <button type="button" className="hero-replay" onClick={() => setRun((r) => r + 1)}>
          {t.hero.editor.replay}
        </button>
      )}
    </section>
  );
}
