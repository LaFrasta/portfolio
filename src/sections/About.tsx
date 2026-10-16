import { useLang } from '../i18n';

export default function About() {
  const { t } = useLang();
  const [lead, ...rest] = t.about.paragraphs;
  return (
    <section id="about" className="section about" aria-labelledby="about-title">
      <div className="about-grid">
        <h2 id="about-title">{t.about.title}</h2>
        <div className="about-copy">
          <p className="about-lead">{lead}</p>
          {rest.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
