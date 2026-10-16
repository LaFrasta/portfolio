import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { useLang } from '../i18n';
import { SKILLS, type SkillLayer } from '../content';
import { reducedMotion } from '../motion';
import { highlight } from '../highlight';
import { STACK_ICONS } from './stackIcons';
import SNIPPETS from '../data/snippets.json';

const LAYERS: { id: SkillLayer; color: string }[] = [
  { id: 'frontend', color: 'var(--v220)' },
  { id: 'backend', color: 'var(--v400)' },
  { id: 'data', color: 'var(--hvdc)' },
  { id: 'platform', color: 'var(--busbar)' },
];

const FLAT = LAYERS.flatMap((l) => SKILLS.filter((s) => s.layer === l.id).map((s) => ({ name: s.name, color: l.color })));
const snippetOf = (name: string) => (SNIPPETS as Record<string, { file: string; code: string }>)[name];

function Monitor({ name, color }: { name: string; color: string }) {
  const snippet = snippetOf(name);
  const tokens = useMemo(() => highlight(snippet.code), [snippet.code]);
  const [typed, setTyped] = useState(reducedMotion ? snippet.code.length : 0);

  useEffect(() => {
    if (reducedMotion) {
      setTyped(snippet.code.length);
      return;
    }
    setTyped(0);
    const id = window.setInterval(() => {
      setTyped((n) => {
        const next = Math.min(snippet.code.length, n + 3);
        if (next >= snippet.code.length) window.clearInterval(id);
        return next;
      });
    }, 18);
    return () => window.clearInterval(id);
  }, [snippet.code]);

  let left = typed;
  const visible = tokens.map(([kind, text], i) => {
    if (left <= 0) return null;
    const part = text.slice(0, left);
    left -= part.length;
    return kind ? (
      <span key={i} className={`tk-${kind}`}>
        {part}
      </span>
    ) : (
      part
    );
  });

  return (
    <aside className="monitor" style={{ '--mv': color } as CSSProperties} aria-live="polite">
      <div className="mon-head">
        <span className="mon-lamp" aria-hidden />
        <span className="mono">{snippet.file}</span>
        <span className="mon-skill">{name}</span>
      </div>
      <div className="screen">
        <pre aria-label={snippet.code}>
          <code aria-hidden>
            {visible}
            <span className="caret" />
          </code>
        </pre>
      </div>
    </aside>
  );
}

export default function Stack() {
  const { t } = useLang();
  const ref = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState(reducedMotion);
  const [inView, setInView] = useState(false);
  const [current, setCurrent] = useState(0);
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    const io = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting) setLive(true);
      },
      { threshold: 0.2 },
    );
    io.observe(ref.current!);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (reducedMotion || pinned || !inView || !live) return;
    const id = window.setInterval(() => setCurrent((c) => (c + 1) % FLAT.length), 5200);
    return () => window.clearInterval(id);
  }, [pinned, inView, live]);

  const selected = FLAT[current];

  return (
    <section id="stack" className="section stack" aria-labelledby="stack-title">
      <header className="section-head">
        <h2 id="stack-title">{t.stack.title}</h2>
        <p>{t.stack.intro}</p>
      </header>

      <div className="stack-layout">
        <div ref={ref} className={`sld${live ? ' is-live' : ''}`}>
          {LAYERS.map((layer, row) => (
            <div className="bus" key={layer.id} style={{ '--v': layer.color, '--row': row } as CSSProperties}>
              <div className="bus-head">
                <h3 className="bus-name">{t.stack.layers[layer.id]}</h3>
              </div>
              <div className="bus-bar" aria-hidden />
              <ul className="bays">
                {SKILLS.filter((s) => s.layer === layer.id).map((s, i) => {
                  const idx = FLAT.findIndex((f) => f.name === s.name);
                  return (
                    <li key={s.name} style={{ '--i': i } as CSSProperties}>
                      <button
                        type="button"
                        className="bay"
                        aria-pressed={idx === current}
                        onMouseEnter={() => !pinned && setCurrent(idx)}
                        onFocus={() => !pinned && setCurrent(idx)}
                        onClick={() => {
                          setPinned(true);
                          setCurrent(idx);
                        }}
                      >
                        <span className="bay-drop" aria-hidden />
                        <span className="bay-tile" aria-hidden>
                          <span className="bay-logo" style={{ '--m': `url("${STACK_ICONS[s.name]}")` } as CSSProperties} />
                        </span>
                        <span className="bay-drop bay-drop-low" aria-hidden />
                        <span className="bay-name">{s.name}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <Monitor name={selected.name} color={selected.color} />
      </div>

    </section>
  );
}
