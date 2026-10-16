import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import { useGSAP } from '@gsap/react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { useLang } from '../i18n';
import type { ProjectId, ShowcaseProject } from '../content';
import { gsap, reducedMotion } from '../motion';
import c3Landing from '../assets/projects/codice3-landing.jpg';
import c3Call from '../assets/projects/codice3-call.jpg';
import c3Services from '../assets/projects/codice3-services.jpg';
import c3Equip from '../assets/projects/codice3-equip.jpg';
import c3Wonders from '../assets/projects/codice3-wonders.jpg';
import c3PhoneMap from '../assets/projects/codice3-game-map.jpg';
import c3PhoneManual from '../assets/projects/codice3-game-manual.jpg';
import alHome from '../assets/projects/albion-home.jpg';
import alRoutes from '../assets/projects/albion-routes.jpg';
import alItems from '../assets/projects/albion-items.jpg';
import alFlipper from '../assets/projects/albion-flipper.jpg';
import alMap from '../assets/projects/albion-world-map.jpg';
import alBuilds from '../assets/projects/albion-builds.jpg';

const MEDIA: Record<ProjectId, { shots: string[]; phone: string[]; accent: string }> = {
  codice3: { shots: [c3Landing, c3Call, c3Services, c3Equip, c3Wonders], phone: [c3PhoneMap, c3PhoneManual], accent: '#3b82f6' },
  albion: { shots: [alHome, alRoutes, alItems, alFlipper, alMap, alBuilds], phone: [], accent: '#d1a24a' },
};

const CYCLE_MS = 4200;

function useCycle(length: number, active: boolean, paused: boolean) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (reducedMotion || !active || paused || length < 2) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % length), CYCLE_MS);
    return () => window.clearInterval(id);
  }, [length, active, paused]);
  return [index, setIndex] as const;
}

const fade = reducedMotion
  ? { initial: false as const, animate: { opacity: 1 }, exit: { opacity: 0 } }
  : {
      initial: { opacity: 0, scale: 1.04 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] as const },
    };

function Showcase({ p, active }: { p: ShowcaseProject; active: boolean }) {
  const media = MEDIA[p.id];
  const [hovered, setHovered] = useState(false);
  const [shot, setShot] = useCycle(media.shots.length, active, hovered);
  const [phone] = useCycle(media.phone.length, active, false);
  const [first, ...rest] = p.name.split(' ');

  return (
    <div className="showcase">
      <div className="show-copy">
        <p className="show-badge mono">
          <span className="lamp-sq is-on" aria-hidden />
          {p.badge}
        </p>
        <h3 className={`show-name${p.name.split(' ').some((w) => w.length > 6) ? ' is-long' : ''}`}>
          {first}
          {rest.length > 0 && (rest.join(' ').length <= 2 ? '\u00a0' : ' ')}
          {rest.length > 0 && <span>{rest.join(' ')}</span>}
        </h3>
        <p className="show-tagline">{p.tagline}</p>
        <p className="show-body">{p.body}</p>
        <ul className="show-specs">
          {p.specs.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
        <ul className="tags">
          {p.tech.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
        {p.url ? (
          <a className="show-cta" href={p.url} target="_blank" rel="noreferrer">
            {p.cta}
            <ArrowUpRight size={18} strokeWidth={2} aria-hidden />
          </a>
        ) : (
          <span className="show-cta is-pending">{p.cta}</span>
        )}
      </div>

      <div
        className={`show-stage${media.phone.length ? '' : ' no-phone'}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <figure className="show-browser">
          <div className="browser-bar" aria-hidden>
            <span />
            <span />
            <span />
            <p className="mono">{p.domain}</p>
          </div>
          <div className="browser-view">
            {media.shots.length ? (
              <AnimatePresence initial={false}>
                <motion.img key={shot} src={media.shots[shot]} alt={p.shots[shot]} {...fade} />
              </AnimatePresence>
            ) : (
              <div className="browser-empty mono">{p.name}</div>
            )}
          </div>
          {p.shots[shot] && <figcaption className="mono">{p.shots[shot]}</figcaption>}
        </figure>

        {media.phone.length > 0 && (
          <figure className="show-phone">
            <div className="phone-view">
              <AnimatePresence initial={false}>
                <motion.img key={phone} src={media.phone[phone]} alt={p.phone[phone]} {...fade} />
              </AnimatePresence>
            </div>
            <figcaption className="mono">{p.phone[phone]}</figcaption>
          </figure>
        )}

        {media.shots.length > 1 && (
          <div className="show-thumbs" role="group" aria-label={p.name}>
            {media.shots.map((src, i) => (
              <button
                key={src}
                type="button"
                aria-pressed={i === shot}
                aria-label={p.shots[i]}
                className="show-thumb"
                onClick={() => setShot(i)}
              >
                <img src={src} alt="" loading="lazy" />
                <span className="show-thumb-bar" aria-hidden />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Projects() {
  const { t } = useLang();
  const items = t.projects.items;
  const section = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  const [current, setCurrent] = useState<ProjectId>(items[0].id);
  const project = items.find((p) => p.id === current)!;

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.15 });
    io.observe(section.current!);
    return () => io.disconnect();
  }, []);

  useGSAP(
    () => {
      if (reducedMotion) return;
      gsap.fromTo(
        '.show-panel',
        { '--py': '14%' },
        { '--py': '-10%', ease: 'none', scrollTrigger: { trigger: '.show-panel', start: 'top bottom', end: 'bottom top', scrub: true } },
      );
    },
    { scope: section },
  );

  const onKey = (e: KeyboardEvent, i: number) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const next = items[(i + (e.key === 'ArrowRight' ? 1 : items.length - 1)) % items.length];
    setCurrent(next.id);
    document.getElementById(`tab-${next.id}`)?.focus();
  };

  return (
    <section id="projects" ref={section} className="section projects" aria-labelledby="projects-title">
      <header className="section-head">
        <h2 id="projects-title">{t.projects.title}</h2>
        <p>{t.projects.intro}</p>
      </header>

      <div className="project-tabs" role="tablist" aria-label={t.projects.title}>
        {items.map((p, i) => (
          <button
            key={p.id}
            id={`tab-${p.id}`}
            type="button"
            role="tab"
            aria-selected={p.id === current}
            aria-controls="project-panel"
            tabIndex={p.id === current ? 0 : -1}
            className="project-tab"
            style={{ '--accent': MEDIA[p.id].accent } as CSSProperties}
            onClick={() => setCurrent(p.id)}
            onKeyDown={(e) => onKey(e, i)}
          >
            <span className="project-tab-lamp" aria-hidden />
            <span className="project-tab-name">{p.name}</span>
            <span className="project-tab-kicker mono">{p.kicker}</span>
          </button>
        ))}
      </div>

      <div
        id="project-panel"
        role="tabpanel"
        aria-labelledby={`tab-${current}`}
        className="show-panel"
        style={{ '--accent': MEDIA[current].accent } as CSSProperties}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={current}
            initial={reducedMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -16 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            <Showcase p={project} active={inView} />
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
