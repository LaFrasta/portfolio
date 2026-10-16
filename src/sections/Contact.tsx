import { useEffect, useRef, useState, type CSSProperties, type FormEvent } from 'react';
import { Mail, MessageSquare, ArrowUpRight } from 'lucide-react';
import linkedinIcon from 'devicon/icons/linkedin/linkedin-plain.svg?url';
import githubIcon from 'simple-icons/icons/github.svg?url';
import { useLang } from '../i18n';
import { LINKS } from '../content';
import { reducedMotion } from '../motion';

type Line = { id: number; kind: 'out' | 'cmd' | 'ok'; text: string; href?: string };

const EMAIL = LINKS.email.replace('mailto:', '');

function Brand({ src }: { src: string }) {
  return <span className="ch-brand" style={{ '--m': `url("${src}")` } as CSSProperties} aria-hidden />;
}

export default function Contact() {
  const { t } = useLang();
  const c = t.contact;
  const section = useRef<HTMLElement>(null);
  const screen = useRef<HTMLDivElement>(null);
  const nextId = useRef(0);
  const [lines, setLines] = useState<Line[]>([]);
  const [booted, setBooted] = useState(false);
  const [writing, setWriting] = useState(false);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const push = (items: Omit<Line, 'id'>[]) =>
    setLines((ls) => [...ls, ...items.map((l) => ({ ...l, id: nextId.current++ }))].slice(-9));

  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        setBooted(true);
      },
      { threshold: 0.3 },
    );
    io.observe(section.current!);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!booted) return;
    setLines([]);
    if (reducedMotion) {
      push(c.boot.map((text) => ({ kind: 'out' as const, text })));
      return;
    }
    const timers = c.boot.map((text, i) => window.setTimeout(() => push([{ kind: 'out', text }]), 250 + i * 550));
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [booted, c.boot]);

  useEffect(() => {
    screen.current?.scrollTo({ top: screen.current.scrollHeight, behavior: reducedMotion ? 'auto' : 'smooth' });
  }, [lines, writing]);

  const log = (cmd: string, text: string, href?: string) => push([{ kind: 'cmd', text: cmd }, { kind: 'ok', text, href }]);

  const send = (e: FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Portfolio · ${name || 'contatto'}`);
    const body = encodeURIComponent(message);
    window.location.href = `${LINKS.email}?subject=${subject}&body=${body}`;
    setWriting(false);
    log(`${c.write.toLowerCase()} --da "${name}"`, c.form.ready);
    setName('');
    setMessage('');
  };

  return (
    <section id="contact" ref={section} className="section contact" aria-labelledby="contact-title">
      <div className="contact-grid">
        <div className="contact-copy">
          <h2 id="contact-title">{c.title}</h2>
          <p>{c.body}</p>
        </div>

        <div className="console">
          <div className="console-head">
            <span className="lamp-sq is-on" aria-hidden />
            <span className="mono">{c.console}</span>
            <span className="console-status mono">{c.online}</span>
          </div>

          <div className="console-screen" ref={screen} aria-live="polite">
            {lines.map((l) => (
              <p key={l.id} className={`cl cl-${l.kind}`}>
                {l.kind === 'cmd' && <span className="cl-prompt">em&gt;</span>}
                {l.href ? (
                  <a href={l.href} target={l.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
                    {l.text}
                  </a>
                ) : (
                  l.text
                )}
              </p>
            ))}

            {writing ? (
              <form className="console-form" onSubmit={send}>
                <label>
                  <span className="cl-prompt">{c.form.name}&gt;</span>
                  <input value={name} onChange={(e) => setName(e.target.value)} autoFocus required autoComplete="name" />
                </label>
                <label className="is-area">
                  <span className="cl-prompt">{c.form.message}&gt;</span>
                  <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder={c.form.prompt} rows={3} required />
                </label>
                <button type="submit" className="console-send">
                  {c.form.send}
                  <ArrowUpRight size={16} strokeWidth={2} aria-hidden />
                </button>
              </form>
            ) : (
              <p className="cl cl-cmd">
                <span className="cl-prompt">em&gt;</span>
                <span className="caret" aria-hidden />
              </p>
            )}
          </div>

          <div className="channels">
            <a
              className="channel"
              href={LINKS.linkedin}
              target="_blank"
              rel="noreferrer"
              onClick={() => log('open linkedin', `linkedin.com/in/emanuele-manniti · ${c.opened}`, LINKS.linkedin)}
            >
              <Brand src={linkedinIcon} />
              <span className="channel-name">LinkedIn</span>
              <span className="channel-handle mono">emanuele-manniti</span>
            </a>
            <a
              className="channel"
              href={LINKS.github}
              target="_blank"
              rel="noreferrer"
              onClick={() => log('open github', `github.com/LaFrasta · ${c.opened}`, LINKS.github)}
            >
              <Brand src={githubIcon} />
              <span className="channel-name">GitHub</span>
              <span className="channel-handle mono">LaFrasta</span>
            </a>
            <a className="channel" href={LINKS.email} onClick={() => log('mail', `${EMAIL} · ${c.mailOpened}`, LINKS.email)}>
              <Mail className="ch-icon" size={26} strokeWidth={1.75} aria-hidden />
              <span className="channel-name">Email</span>
              <span className="channel-handle mono">{EMAIL}</span>
            </a>
            <button type="button" className={`channel${writing ? ' is-active' : ''}`} aria-pressed={writing} onClick={() => setWriting((w) => !w)}>
              <MessageSquare className="ch-icon" size={26} strokeWidth={1.75} aria-hidden />
              <span className="channel-name">{c.write}</span>
              <span className="channel-handle mono">{c.form.message}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
