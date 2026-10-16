import { useEffect } from 'react';
import { useLang } from './i18n';
import { ScrollTrigger, startSmoothScroll } from './motion';
import Nav from './sections/Nav';
import Hero from './sections/Hero';
import About from './sections/About';
import Stack from './sections/Stack';
import Flow from './sections/Flow';
import Agents from './sections/Agents';
import Projects from './sections/Projects';
import Logbook from './sections/Logbook';
import Contact from './sections/Contact';

export default function App() {
  const { lang } = useLang();

  useEffect(() => {
    startSmoothScroll();
  }, []);

  useEffect(() => {
    // Copy length changes with the language, so pinned sections must re-measure
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [lang]);

  return (
    <>
      <Nav />
      <main>
        <Hero />
        <About />
        <Stack />
        <Flow />
        <Agents />
        <Projects />
        <Logbook />
        <Contact />
      </main>
      <footer className="footer">
        <p className="mono">© {new Date().getFullYear()}</p>
      </footer>
    </>
  );
}
