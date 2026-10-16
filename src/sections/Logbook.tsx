import { useRef, useState, type CSSProperties } from 'react';
import { useGSAP } from '@gsap/react';
import { useLang } from '../i18n';
import type { MilestoneKind } from '../content';
import { reducedMotion, ScrollTrigger } from '../motion';

const KIND_COLOR: Record<MilestoneKind, string> = {
  edu: 'var(--v220)',
  cert: 'var(--hvdc)',
  job: 'var(--v400)',
  now: 'var(--busbar)',
};

export default function Logbook() {
  const { t } = useLang();
  const items = t.log.milestones;
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const fill = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(reducedMotion ? items.length - 1 : 0);

  useGSAP(
    () => {
      if (reducedMotion) return;
      const el = track.current!;
      const nodes = Array.from(el.querySelectorAll<HTMLElement>('.tl-item'));
      const st = ScrollTrigger.create({
        trigger: el,
        start: 'top 62%',
        end: 'bottom 62%',
        scrub: 0.4,
        onUpdate: (self) => {
          const y = self.progress * el.offsetHeight;
          if (fill.current) fill.current.style.transform = `scaleY(${self.progress})`;
          let idx = 0;
          nodes.forEach((n, i) => {
            if (n.offsetTop + 18 <= y + 1) idx = i;
          });
          setActive(idx);
        },
      });
      return () => st.kill();
    },
    { scope: section, dependencies: [t] },
  );

  const current = items[active];

  return (
    <section id="log" ref={section} className="section path" aria-labelledby="log-title">
      <header className="section-head">
        <h2 id="log-title">{t.log.title}</h2>
        <p>{t.log.intro}</p>
      </header>

      <div className="path-grid">
        <div className="path-year" aria-hidden style={{ '--k': KIND_COLOR[current.kind] } as CSSProperties}>
          <div className="path-year-window">
            <span key={active} className="path-year-num">
              {current.year}
            </span>
          </div>
          <p className="path-year-kind mono">{current.kind === 'now' ? current.title : t.log.kinds[current.kind]}</p>
        </div>

        <div className="tl" ref={track}>
          <span className="tl-line" aria-hidden>
            <span ref={fill} className="tl-fill" style={reducedMotion ? { transform: 'scaleY(1)' } : undefined} />
          </span>
          <ol>
          {items.map((m, i) => (
            <li
              key={`${m.date}-${m.title}`}
              className={`tl-item kind-${m.kind}${i <= active ? ' is-live' : ''}${i === active ? ' is-current' : ''}`}
              style={{ '--k': KIND_COLOR[m.kind] } as CSSProperties}
            >
              <span className="tl-node" aria-hidden />
              <div className="tl-body">
                <p className="tl-meta mono">
                  <span>{m.date}</span>
                  {m.kind !== 'now' && <span className="tl-kind">{t.log.kinds[m.kind]}</span>}
                </p>
                <h3>{m.title}</h3>
                <p className="tl-source">{m.source}</p>
                <p className="tl-note">{m.note}</p>
              </div>
            </li>
          ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
