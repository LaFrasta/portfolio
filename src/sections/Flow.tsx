import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { useLang } from '../i18n';
import { gsap, reducedMotion, ScrollTrigger } from '../motion';

export default function Flow() {
  const { t } = useLang();
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const packet = useRef<HTMLDivElement>(null);
  const liveLine = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(reducedMotion ? 99 : -1);
  const stages = t.flow.stages;

  useGSAP(
    () => {
      if (reducedMotion) return;
      const mm = gsap.matchMedia();

      mm.add('(min-width: 900px)', () => {
        const el = track.current!;
        const distance = () => el.scrollWidth - window.innerWidth;
        const anchor = () => window.innerWidth * 0.24;
        const cards = gsap.utils.toArray<HTMLElement>('.stage', el);

        const st = ScrollTrigger.create({
          trigger: '.flow-pin',
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
          animation: gsap.to(el, { x: () => -distance(), ease: 'none' }),
          onUpdate: (self) => {
            const x = anchor() + self.progress * distance();
            gsap.set(packet.current, { x });
            gsap.set(liveLine.current, { scaleX: x / el.scrollWidth });
            let idx = -1;
            cards.forEach((c, i) => {
              if (c.offsetLeft - 40 <= x) idx = i;
            });
            setCurrent(idx);
          },
        });
        return () => st.kill();
      });

      mm.add('(max-width: 899px)', () => {
        const cards = gsap.utils.toArray<HTMLElement>('.stage', track.current);
        const triggers = cards.map((c, i) =>
          ScrollTrigger.create({
            trigger: c,
            start: 'top 70%',
            onEnter: () => setCurrent((v) => Math.max(v, i)),
            onLeaveBack: () => setCurrent(i - 1),
          }),
        );
        return () => triggers.forEach((s) => s.kill());
      });
    },
    { scope: section, dependencies: [t] },
  );

  return (
    <section id="flow" ref={section} className="flow" aria-labelledby="flow-title">
      <div className="flow-pin">
        <header className="flow-head">
          <div className="flow-role">
            <h2 id="flow-title">{t.flow.title}</h2>
            <p className="flow-role-meta">
              <span className="flow-role-name">{t.flow.role}</span>
              <span>{t.flow.company}</span>
              <span className="mono">{t.flow.period}</span>
              <span>{t.flow.place}</span>
            </p>
          </div>
          <p className="flow-intro">{t.flow.intro}</p>
        </header>

        <div className="flow-track" ref={track}>
          <div className="flow-line" aria-hidden>
            <div className="flow-line-live" ref={liveLine} />
          </div>
          <div className="flow-packet" ref={packet} aria-hidden>
            <span />
          </div>
          <ol className="stages">
            {stages.map((s, i) => (
              <li className={`stage${i <= current ? ' is-live' : ''}${i === current ? ' is-current' : ''}`} key={s.code}>
                <span className="stage-node" aria-hidden>
                  <span>{s.code}</span>
                </span>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
                <ul className="tags">
                  {s.tech.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
