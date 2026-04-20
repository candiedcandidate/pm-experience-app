import { useMemo, useState } from 'react'
import './App.css'

type Screen = 'welcome' | 'intro' | 'baseline' | 'decision' | 'result'

type Level = 'Low' | 'Medium' | 'High'

type MetricKey =
  | 'risk'
  | 'qualityPressure'
  | 'stakeholderSatisfaction'
  | 'teamOverload'
  | 'deliveryConfidence'

export type OutcomeMetrics = Record<MetricKey, Level>

type DecisionId =
  | 'increaseBudget'
  | 'reduceScope'
  | 'extendTimeline'
  | 'acceptHigherRisk'

export type DecisionOutcome = {
  id: DecisionId
  label: string
  feedback: string
  score: number
  scoreExplanation: string
  metrics: OutcomeMetrics
}

export type BaselineItem = {
  label: string
  value: string
}

export type Scenario = {
  title: string
  description: string
  changeEvent: string
  baselineItems: BaselineItem[]
  baselineMetrics: OutcomeMetrics
  decisions: DecisionOutcome[]
}

const scenario: Scenario = {
  title: 'Product Launch',
  description:
    'You are leading a project to launch a new product. The project is approved, but new requests and constraints will appear. Your job is to keep the project balanced.',
  changeEvent:
    'Commercial asks to add 2 more launch features, but leadership wants to keep the original launch date.',
  baselineItems: [
    { label: 'Scope', value: '10 deliverables' },
    { label: 'Timeline', value: '6 months' },
    { label: 'Budget', value: 'EUR 500,000' },
    { label: 'Quality target', value: 'High' },
    { label: 'Risk level', value: 'Medium' },
  ],
  baselineMetrics: {
    risk: 'Medium',
    qualityPressure: 'Medium',
    stakeholderSatisfaction: 'Medium',
    teamOverload: 'Medium',
    deliveryConfidence: 'Medium',
  },
  decisions: [
    {
      id: 'increaseBudget',
      label: 'Increase budget and add resources',
      score: 78,
      scoreExplanation: 'Strong option, but more expensive.',
      feedback: 'Increasing resources can protect the deadline, but raises cost.',
      metrics: {
        risk: 'Medium',
        qualityPressure: 'Medium',
        stakeholderSatisfaction: 'High',
        teamOverload: 'Medium',
        deliveryConfidence: 'High',
      },
    },
    {
      id: 'reduceScope',
      label: 'Reduce scope elsewhere',
      score: 88,
      scoreExplanation: 'Best overall balance of constraints.',
      feedback: 'Reducing scope is a common way to protect time and cost.',
      metrics: {
        risk: 'Medium',
        qualityPressure: 'Low',
        stakeholderSatisfaction: 'Medium',
        teamOverload: 'Low',
        deliveryConfidence: 'High',
      },
    },
    {
      id: 'extendTimeline',
      label: 'Extend timeline',
      score: 72,
      scoreExplanation: 'Operationally sound, but politically difficult.',
      feedback: 'Extending time reduces pressure, but may not be acceptable to stakeholders.',
      metrics: {
        risk: 'Low',
        qualityPressure: 'Low',
        stakeholderSatisfaction: 'Low',
        teamOverload: 'Low',
        deliveryConfidence: 'High',
      },
    },
    {
      id: 'acceptHigherRisk',
      label: 'Keep everything and accept higher delivery risk',
      score: 45,
      scoreExplanation: 'High-pressure choice with weak delivery balance.',
      feedback: 'Keeping time fixed while increasing scope creates delivery pressure and risk.',
      metrics: {
        risk: 'High',
        qualityPressure: 'High',
        stakeholderSatisfaction: 'Medium',
        teamOverload: 'High',
        deliveryConfidence: 'Low',
      },
    },
  ],
}

const metricLabels: { key: MetricKey; label: string }[] = [
  { key: 'risk', label: 'Risk' },
  { key: 'qualityPressure', label: 'Quality pressure' },
  { key: 'stakeholderSatisfaction', label: 'Stakeholder satisfaction' },
  { key: 'teamOverload', label: 'Team overload' },
  { key: 'deliveryConfidence', label: 'Delivery confidence' },
]

const progressSteps: { id: Screen; label: string }[] = [
  { id: 'welcome', label: 'Welcome' },
  { id: 'intro', label: 'Scenario' },
  { id: 'baseline', label: 'Baseline' },
  { id: 'decision', label: 'Decision' },
  { id: 'result', label: 'Result' },
]

type CardProps = {
  label: string
  value: string
}

function BaselineCard({ label, value }: CardProps) {
  return (
    <article className="card baseline-card">
      <p className="card-label">{label}</p>
      <p className="card-value">{value}</p>
    </article>
  )
}

function StatusBadge({ value }: { value: Level }) {
  const toneClass = `status-${value.toLowerCase()}`
  return <span className={`status-pill ${toneClass}`}>{value}</span>
}

function ProgressStepper({ currentScreen }: { currentScreen: Screen }) {
  return (
    <nav className="progress-stepper" aria-label="Simulation progress">
      {progressSteps.map((step, index) => {
        const isActive = step.id === currentScreen
        const isComplete = progressSteps.findIndex((item) => item.id === currentScreen) > index

        return (
          <div key={step.id} className={`step-item ${isActive ? 'is-active' : ''}`}>
            <span className={`step-dot ${isComplete ? 'is-complete' : ''}`} aria-hidden="true">
              {index + 1}
            </span>
            <span className="step-label">{step.label}</span>
          </div>
        )
      })}
    </nav>
  )
}

function App() {
  const [screen, setScreen] = useState<Screen>('welcome')
  const [selectedDecisionId, setSelectedDecisionId] = useState<DecisionId | null>(null)

  const selectedOutcome = useMemo(
    () => scenario.decisions.find((decision) => decision.id === selectedDecisionId) ?? null,
    [selectedDecisionId],
  )

  const handleDecision = (id: DecisionId) => {
    setSelectedDecisionId(id)
    setScreen('result')
  }

  const restart = () => {
    setSelectedDecisionId(null)
    setScreen('welcome')
  }

  const tryAnotherDecision = () => {
    setSelectedDecisionId(null)
    setScreen('decision')
  }

  const renderScreen = () => {
    if (screen === 'welcome') {
      return (
        <section className="panel hero-panel">
          <ProgressStepper currentScreen={screen} />
          <p className="eyebrow">Interactive Learning</p>
          <h1>PM Experience App</h1>
          <p className="subtitle">Learn project management by making decisions</p>
          <button className="btn btn-primary" onClick={() => setScreen('intro')}>
            Start simulation
          </button>
        </section>
      )
    }

    if (screen === 'intro') {
      return (
        <section className="panel">
          <ProgressStepper currentScreen={screen} />
          <p className="eyebrow">Scenario Intro</p>
          <h2>{scenario.title}</h2>
          <p className="body-text">{scenario.description}</p>
          <button className="btn btn-primary" onClick={() => setScreen('baseline')}>
            Continue
          </button>
        </section>
      )
    }

    if (screen === 'baseline') {
      return (
        <section className="panel">
          <ProgressStepper currentScreen={screen} />
          <p className="eyebrow">Baseline Project</p>
          <h2>Current Plan Snapshot</h2>

          <div className="baseline-grid">
            {scenario.baselineItems.map((item) => (
              <BaselineCard key={item.label} label={item.label} value={item.value} />
            ))}
          </div>

          <div className="constraint-wrap">
            <h3>Triple Constraint</h3>
            <div className="triangle-box" aria-label="Scope, Time, Cost constraint panel">
              <div className="triangle-shape" />
              <span className="triangle-point top">Scope</span>
              <span className="triangle-point left">Time</span>
              <span className="triangle-point right">Cost</span>
            </div>
          </div>

          <button className="btn btn-primary" onClick={() => setScreen('decision')}>
            See change event
          </button>
        </section>
      )
    }

    if (screen === 'decision') {
      return (
        <section className="panel">
          <ProgressStepper currentScreen={screen} />
          <p className="eyebrow">Decision Point</p>
          <h2>Change Event</h2>
          <p className="event-box">{scenario.changeEvent}</p>

          <div className="decision-list">
            {scenario.decisions.map((option) => (
              <button
                key={option.id}
                className="btn btn-option"
                onClick={() => handleDecision(option.id)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </section>
      )
    }

    if (screen === 'result' && selectedOutcome) {
      return (
        <section className="panel">
          <ProgressStepper currentScreen={screen} />
          <p className="eyebrow">Decision Result</p>
          <h2>Impact of Your Decision</h2>

          <div className="reflection-summary card">
            <p className="card-label">Selected decision</p>
            <p className="card-value">{selectedOutcome.label}</p>
            <p className="body-text feedback">{selectedOutcome.feedback}</p>
          </div>

          <div className="metrics-grid">
            {metricLabels.map((metric) => (
              <article key={metric.key} className="card metric-card">
                <p className="card-label">{metric.label}</p>
                <StatusBadge value={selectedOutcome.metrics[metric.key]} />
              </article>
            ))}
          </div>

          <section className="comparison-section card" aria-label="Baseline versus outcome comparison">
            <p className="card-label">Baseline vs outcome comparison</p>
            <div className="comparison-grid">
              {metricLabels.map((metric) => (
                <article key={metric.key} className="comparison-row">
                  <p className="comparison-label">{metric.label}</p>
                  <div className="comparison-values">
                    <span className="comparison-side">
                      <span className="comparison-side-label">Baseline</span>
                      <StatusBadge value={scenario.baselineMetrics[metric.key]} />
                    </span>
                    <span className="comparison-arrow" aria-hidden="true">
                      →
                    </span>
                    <span className="comparison-side">
                      <span className="comparison-side-label">Outcome</span>
                      <StatusBadge value={selectedOutcome.metrics[metric.key]} />
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <div className="score-card">
            <p className="card-label">Balanced delivery score</p>
            <p className="score-value">{selectedOutcome.score} / 100</p>
            <p className="body-text">{selectedOutcome.scoreExplanation}</p>
          </div>

          <div className="actions-row">
            <button className="btn btn-secondary" onClick={tryAnotherDecision}>
              Try another decision
            </button>
            <button className="btn btn-primary" onClick={restart}>
              Restart simulation
            </button>
          </div>
        </section>
      )
    }

    return null
  }

  return (
    <main className="app-shell">
      <div className="app-bg-shape shape-top" aria-hidden="true" />
      <div className="app-bg-shape shape-bottom" aria-hidden="true" />
      {renderScreen()}
    </main>
  )
}

export default App