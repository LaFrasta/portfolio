import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { useLang } from '../i18n';
import type { AgentId, AgentScenario, AutomationLane, SkillLayer } from '../content';
import { reducedMotion } from '../motion';

const AGENTS: AgentId[] = ['investigator', 'tester', 'reviewer', 'docs'];
const STEP = [0.95, 1.15, 0.8, 1.05];
const TRAVEL = 0.6;
const TASK_TYPE = 1.2;
const RUN_SPEED = 24 / 24; // hours per second while the day runs
const SLOW_SPEED = 0.05; // hours per second while the agents work
const FLASH_HOURS = 0.9;
const LOG_SIZE = 7;

const dispatchAt = (i: number) => 1.6 + i * 0.45;
const lineAt = (i: number, k: number) => dispatchAt(i) + TRAVEL + 0.15 + k * STEP[i];
const doneAt = (i: number) => lineAt(i, 3);
const RESULT_AT = Math.max(...AGENTS.map((_, i) => doneAt(i))) + TRAVEL + 0.2;
const AGENT_END = RESULT_AT + 2.6;

const LAYER_COLOR: Record<SkillLayer, string> = {
  frontend: 'var(--v220)',
  backend: 'var(--v400)',
  data: 'var(--hvdc)',
  platform: 'var(--busbar)',
};

type Ev = { h: number; kind: 'job' | 'alarm' | 'agents'; lane: string; scenario: number };

interface Sim {
  hour: number;
  mode: 'run' | 'agents';
  agentT: number;
  scenario: number;
  done: number[];
  log: Ev[];
}

const START: Sim = { hour: 0, mode: 'run', agentT: 0, scenario: -1, done: [], log: [] };

function jobsBetween(lanes: AutomationLane[], from: number, to: number): Ev[] {
  return lanes
    .flatMap((l) => l.times.filter((h) => h > from && h <= to).map((h) => ({ h, kind: 'job' as const, lane: l.id, scenario: -1 })))
    .sort((a, b) => a.h - b.h);
}

const pushLog = (log: Ev[], items: Ev[]) => [...items.reverse(), ...log].slice(0, LOG_SIZE);

function step(s: Sim, dt: number, lanes: AutomationLane[], scenarios: AgentScenario[]): Sim {
  if (s.mode === 'agents') {
    const agentT = s.agentT + dt;
    const hour = s.hour + dt * SLOW_SPEED;
    if (agentT < AGENT_END) return { ...s, agentT, hour };
    return {
      ...s,
      hour,
      agentT,
      mode: 'run',
      done: [...s.done, s.scenario],
      log: pushLog(s.log, [{ h: hour, kind: 'agents', lane: scenarios[s.scenario].lane, scenario: s.scenario }]),
    };
  }

  const next = s.hour + dt * RUN_SPEED;
  const trig = scenarios.findIndex((sc, i) => !s.done.includes(i) && sc.hour > s.hour && sc.hour <= next);
  if (trig >= 0) {
    const h = scenarios[trig].hour;
    const events = [...jobsBetween(lanes, s.hour, h), { h, kind: 'alarm' as const, lane: scenarios[trig].lane, scenario: trig }];
    return { ...s, hour: h, mode: 'agents', agentT: 0, scenario: trig, log: pushLog(s.log, events) };
  }
  if (next >= 24) return { ...START, hour: next - 24 };
  return { ...s, hour: next, log: pushLog(s.log, jobsBetween(lanes, s.hour, next)) };
}

function finalSim(lanes: AutomationLane[], scenarios: AgentScenario[]): Sim {
  const events: Ev[] = [
    ...jobsBetween(lanes, -1, 23.9),
    ...scenarios.flatMap((sc, i) => [
      { h: sc.hour, kind: 'alarm' as const, lane: sc.lane, scenario: i },
      { h: sc.hour + 0.4, kind: 'agents' as const, lane: sc.lane, scenario: i },
    ]),
  ].sort((a, b) => a.h - b.h);
  return { hour: 23.9, mode: 'run', agentT: AGENT_END, scenario: scenarios.length - 1, done: scenarios.map((_, i) => i), log: pushLog([], events) };
}

const clock = (h: number) => {
  const total = Math.floor(h * 60) % (24 * 60);
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
};

function typed(text: string, t: number, start: number, duration: number) {
  if (t < start) return '';
  return text.slice(0, Math.ceil(text.length * Math.min(1, (t - start) / duration)));
}

export default function Agents() {
  const { t: copy } = useLang();
  const a = copy.agents;
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  const [sim, setSim] = useState<Sim>(() => (reducedMotion ? finalSim(a.lanes, a.scenarios) : START));

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.12 });
    io.observe(ref.current!);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (reducedMotion || !inView) return;
    let last = performance.now();
    const id = window.setInterval(() => {
      const now = performance.now();
      const dt = Math.min(0.2, (now - last) / 1000);
      last = now;
      setSim((s) => step(s, dt, a.lanes, a.scenarios));
    }, 50);
    return () => window.clearInterval(id);
  }, [inView, a.lanes, a.scenarios]);

  const working = sim.mode === 'agents';
  const resting = !working && sim.scenario >= 0 && sim.done.includes(sim.scenario);
  const at = working ? sim.agentT : resting ? AGENT_END : -1;
  const scenario = sim.scenario >= 0 ? a.scenarios[sim.scenario] : null;
  const laneById = Object.fromEntries(a.lanes.map((l) => [l.id, l])) as Record<string, AutomationLane>;
  const resultText = scenario ? typed(scenario.result, at, RESULT_AT, 1.2) : '';
  const orchBusy = working && at >= TASK_TYPE && at < RESULT_AT;

  const logText = (e: Ev) => {
    if (e.kind === 'job') return laneById[e.lane].log;
    if (e.kind === 'alarm') return a.scenarios[e.scenario].alarm;
    return `${a.logAgents} · ${a.scenarios[e.scenario].result}`;
  };

  return (
    <section id="agents" ref={ref} className="section agents" aria-labelledby="agents-title">
      <div className="agents-head">
        <header className="section-head">
          <h2 id="agents-title">{a.title}</h2>
          <p>{a.intro}</p>
        </header>
        <div className="signature">
          <svg viewBox="0 0 32 32" aria-hidden>
            <path d="M4 22h24M10 22V10M22 22V10M10 10h12" />
            <rect x="13" y="7" width="6" height="6" />
          </svg>
          <div>
            <p className="signature-main">{a.credit}</p>
            <p className="signature-sub">{a.creditSub}</p>
          </div>
        </div>
      </div>

      <div className={`room${working ? ' is-working' : ''}`}>
        <div className="room-timeline">
          <ul className="auto-labels">
            <li className="auto-labels-spacer" aria-hidden />
            {a.lanes.map((lane) => {
              const flashing =
                lane.times.some((h) => sim.hour >= h && sim.hour - h < FLASH_HOURS) || (working && scenario?.lane === lane.id);
              return (
                <li key={lane.id} className={`lane-label${flashing ? ' is-flash' : ''}`} style={{ '--v': LAYER_COLOR[lane.layer] } as CSSProperties}>
                  <span className="lamp-sq" aria-hidden />
                  {lane.label}
                </li>
              );
            })}
          </ul>

          <div className="auto-tracks" aria-hidden>
            <div className="auto-scale">
              {[0, 6, 12, 18, 24].map((h) => (
                <span key={h} style={{ left: `${(h / 24) * 100}%` }}>
                  {String(h).padStart(2, '0')}
                </span>
              ))}
            </div>
            {a.lanes.map((lane) => (
              <div className="lane-track" key={lane.id} style={{ '--v': LAYER_COLOR[lane.layer] } as CSSProperties}>
                {lane.times.map((h) => {
                  const state = sim.hour >= h ? (sim.hour - h < FLASH_HOURS ? ' is-flash' : ' is-fired') : '';
                  return <span key={h} className={`lane-job${state}`} style={{ left: `${(h / 24) * 100}%` }} />;
                })}
                {a.scenarios.map((sc, i) => {
                  if (sc.lane !== lane.id) return null;
                  const state = sim.done.includes(i) ? ' is-resolved' : working && sim.scenario === i ? ' is-active' : '';
                  return <span key={`alarm-${i}`} className={`lane-alarm${state}`} style={{ left: `${(sc.hour / 24) * 100}%` }} />;
                })}
              </div>
            ))}
            <div className="playhead" style={{ left: `${(sim.hour / 24) * 100}%` }}>
              <span className="playhead-time mono">{clock(sim.hour)}</span>
            </div>
          </div>
        </div>

        <div className="room-feed" aria-hidden>
          <span />
        </div>

        <div className={`fleet${resting ? ' is-resting' : ''}`}>
          <div className={`orch${orchBusy ? ' is-busy' : ''}${resultText ? ' is-done' : ''}`}>
            <div className="orch-head">
              <span className="lamp-sq" aria-hidden />
              <span className="orch-name">{a.orchestrator}</span>
              <span className="orch-by mono">by E. Manniti</span>
            </div>
            <p className="orch-label mono">
              {scenario ? `${a.incoming} · ${a.triggeredBy} ${laneById[scenario.lane].label.toLowerCase()} · ${clock(scenario.hour)}` : a.incoming}
            </p>
            <p className="orch-task">
              {scenario ? typed(scenario.task, at, 0, TASK_TYPE) : <span className="orch-waiting">{a.waiting}</span>}
              {working && at < TASK_TYPE && <span className="caret" aria-hidden />}
            </p>
            <p className="orch-result mono" aria-live="polite">
              {resultText}
            </p>
          </div>

          <div className="fleet-bus" aria-hidden>
            <span className={orchBusy ? 'is-on' : ''} />
          </div>

          <ul className="agent-row">
            {AGENTS.map((id, i) => {
              const d = dispatchAt(i);
              const done = doneAt(i);
              const status = at < d + TRAVEL ? 'idle' : at < done ? 'running' : 'done';
              let packet: number | null = null;
              if (working && at >= d && at < d + TRAVEL) packet = (at - d) / TRAVEL;
              else if (working && at >= done && at < done + TRAVEL) packet = 1 - (at - done) / TRAVEL;
              return (
                <li key={id} className={`agent is-${status}`}>
                  <span className="agent-drop" aria-hidden>
                    {packet !== null && <span className="agent-packet" style={{ '--p': packet } as CSSProperties} />}
                  </span>
                  <div className="agent-card">
                    <div className="agent-head">
                      <span className="lamp-sq" aria-hidden />
                      <span className="agent-name mono">{id}</span>
                      <span className="agent-status mono">{a.status[status]}</span>
                    </div>
                    <p className="agent-role">{a.roles[id]}</p>
                    <ol className="agent-log mono">
                      {[0, 1, 2].map((k) => {
                        const line = scenario ? scenario.logs[id][k] : '';
                        const text = typed(line, at, lineAt(i, k), 0.45);
                        return (
                          <li key={k} className={`${text ? 'is-shown' : ''}${k === 2 ? ' is-result' : ''}`}>
                            {text || ' '}
                          </li>
                        );
                      })}
                    </ol>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <aside className="auto-log">
          <h3>{a.logTitle}</h3>
          <ol className="mono">
            {sim.log.map((e) => (
              <li
                key={`${e.kind}-${e.lane}-${e.h}`}
                className={`log-${e.kind}`}
                style={{ '--v': LAYER_COLOR[laneById[e.lane].layer] } as CSSProperties}
              >
                <span className="auto-log-time">{clock(e.h)}</span>
                <span className="auto-log-msg">{logText(e)}</span>
              </li>
            ))}
          </ol>
        </aside>
      </div>

    </section>
  );
}
