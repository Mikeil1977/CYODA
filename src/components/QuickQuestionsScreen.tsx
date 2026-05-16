import { useEffect, useRef, useState } from "react";
import {
  compatibilityDimensionWeights,
  compatibilityQuestions,
  myCompatibilityProfile,
} from "../data/myCompatibilityProfile";
import {
  calculateDimensionScores,
  calculateCompatibilityResult,
  type AgreementValue,
  type CompatibilityAnswers,
  type CompatibilityResult,
  type DimensionCompatibility,
} from "../engine/compatibility";

const agreementScale: Array<{ label: string; value: AgreementValue }> = [
  { label: "Strongly disagree", value: 1 },
  { label: "Disagree", value: 2 },
  { label: "Neutral / unsure", value: 3 },
  { label: "Agree", value: 4 },
  { label: "Strongly agree", value: 5 },
];

const ANSWER_ADVANCE_DELAY_MS = 280;

type QuickQuestionsScreenProps = {
  devMode: boolean;
  onBack: () => void;
};

export function QuickQuestionsScreen({ devMode, onBack }: QuickQuestionsScreenProps) {
  const [answers, setAnswers] = useState<Partial<CompatibilityAnswers>>({});
  const [questionIndex, setQuestionIndex] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [isAdvancing, setIsAdvancing] = useState(false);
  const advanceTimerRef = useRef<number | null>(null);
  const question = compatibilityQuestions[questionIndex];
  const selectedAnswer = answers[question.id];
  const isLastQuestion = questionIndex === compatibilityQuestions.length - 1;
  const allAnswered = compatibilityQuestions.every((item) => answers[item.id]);

  const clearAdvanceTimer = () => {
    if (advanceTimerRef.current !== null) {
      window.clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = null;
    }
  };

  useEffect(() => clearAdvanceTimer, []);

  const selectAnswer = (value: AgreementValue) => {
    if (isAdvancing) return;

    clearAdvanceTimer();
    setAnswers((current) => ({ ...current, [question.id]: value }));
    setIsAdvancing(true);

    const activeElement = document.activeElement;
    if (activeElement instanceof HTMLElement) {
      activeElement.blur();
    }

    advanceTimerRef.current = window.setTimeout(() => {
      advanceTimerRef.current = null;

      if (isLastQuestion) {
        setShowResults(true);
      } else {
        setQuestionIndex((current) => current + 1);
      }

      setIsAdvancing(false);
    }, ANSWER_ADVANCE_DELAY_MS);
  };

  const goPrevious = () => {
    if (isAdvancing) return;

    if (questionIndex === 0) {
      onBack();
      return;
    }

    setQuestionIndex((current) => current - 1);
  };

  const reset = () => {
    clearAdvanceTimer();
    setAnswers({});
    setQuestionIndex(0);
    setIsAdvancing(false);
    setShowResults(false);
  };

  if (showResults && allAnswered) {
    const result = calculateCompatibilityResult(
      compatibilityQuestions,
      answers as CompatibilityAnswers,
      myCompatibilityProfile,
      compatibilityDimensionWeights,
    );

    return (
      <QuickQuestionsResults
        answers={answers as CompatibilityAnswers}
        devMode={devMode}
        result={result}
        onBack={onBack}
        onReset={reset}
      />
    );
  }

  return (
    <main className="app">
      <section key={question.id} className="card quiz-card">
        <p className="meta quiz-progress">
          Question {questionIndex + 1} of {compatibilityQuestions.length}
        </p>
        <h2>{question.prompt}</h2>
        {question.example ? <p className="question-example">{question.example}</p> : null}

        <fieldset key={question.id} className="scale-fieldset">
          <legend className="sr-only">{question.prompt}</legend>
          {agreementScale.map((option) => (
            <label
              key={option.value}
              className={`scale-option ${selectedAnswer === option.value ? "selected" : ""}`}
            >
              <input
                checked={selectedAnswer === option.value}
                disabled={isAdvancing}
                name={`question-${question.id}`}
                type="radio"
                value={option.value}
                onChange={() => selectAnswer(option.value)}
              />
              <span className="scale-number">{option.value}</span>
              <span>{option.label}</span>
            </label>
          ))}
        </fieldset>

        <p className="selection-hint">Choose an answer to continue.</p>

        <div className="quiz-nav quiz-nav-single">
          <button type="button" className="secondary-button" disabled={isAdvancing} onClick={goPrevious}>
            {questionIndex === 0 ? "Back to games" : "Previous"}
          </button>
        </div>
      </section>
    </main>
  );
}

type QuickQuestionsResultsProps = {
  answers: CompatibilityAnswers;
  devMode: boolean;
  onBack: () => void;
  onReset: () => void;
  result: CompatibilityResult;
};

function QuickQuestionsResults({ answers, devMode, onBack, onReset, result }: QuickQuestionsResultsProps) {
  return (
    <main className="app">
      <section className="card results-card">
        <p className="meta quiz-progress">Quick questions</p>
        <h2>Compatibility</h2>

        <div className="overall-score">
          <span>{formatPercent(result.overallCompatibility)}%</span>
          <strong>{result.summaryLabel}</strong>
        </div>

        <p className="result-copy">{result.explanation}</p>

        <CompatibilityMatrix result={result} />
        <CategoryBars results={result.dimensionResults} />

        <div className="result-columns">
          <ResultList title="Strongest alignment" items={result.strongestAlignments} />
          <ResultList title="Biggest differences" items={result.biggestDifferenceAreas} />
        </div>

        {devMode ? <DevSelections answers={answers} result={result} /> : null}

        <div className="choices">
          <button type="button" onClick={onReset}>Take again</button>
          <button type="button" className="secondary-button" onClick={onBack}>Back to games</button>
        </div>
      </section>
    </main>
  );
}

type CompatibilityMatrixProps = {
  result: CompatibilityResult;
};

function CompatibilityMatrix({ result }: CompatibilityMatrixProps) {
  return (
    <section className="matrix-section" aria-labelledby="matrix-title">
      <h3 id="matrix-title">Compatibility matrix</h3>
      <div className="matrix-wrap">
        <p className="matrix-axis-label matrix-axis-top">Personal freedom / openness</p>
        <div
          className="matrix-plot"
          aria-label="A two dimensional compatibility matrix comparing your answers with their preferences."
          role="img"
        >
          <span className="matrix-line matrix-line-vertical" />
          <span className="matrix-line matrix-line-horizontal" />
          <span
            className="matrix-point matrix-point-user"
            aria-label="You"
            style={{ left: `${result.matrix.user.x}%`, top: `${result.matrix.user.y}%` }}
            title="You"
          />
          <span
            className="matrix-point matrix-point-preference"
            aria-label="Their preferences"
            style={{ left: `${result.matrix.preference.x}%`, top: `${result.matrix.preference.y}%` }}
            title="Their preferences"
          />
        </div>
        <div className="matrix-legend" aria-hidden="true">
          <span><i className="legend-dot legend-dot-user" />You</span>
          <span><i className="legend-dot legend-dot-preference" />Their preferences</span>
        </div>
        <div className="matrix-axis-row">
          <span>Community / shared responsibility</span>
          <span>Individual autonomy / self-reliance</span>
        </div>
        <p className="matrix-axis-label matrix-axis-bottom">Structure / tradition / order</p>
      </div>
    </section>
  );
}

type CategoryBarsProps = {
  results: DimensionCompatibility[];
};

function CategoryBars({ results }: CategoryBarsProps) {
  return (
    <section className="category-section" aria-labelledby="category-title">
      <h3 id="category-title">Category compatibility</h3>
      <div className="category-bars">
        {results.map((result) => (
          <div className="category-row" key={result.dimension}>
            <div className="category-row-label">
              <span>{result.label}</span>
              <strong>{formatPercent(result.compatibility)}%</strong>
            </div>
            <div className="score-track" aria-hidden="true">
              <span style={{ width: `${formatPercent(result.compatibility)}%` }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

type ResultListProps = {
  items: DimensionCompatibility[];
  title: string;
};

function ResultList({ items, title }: ResultListProps) {
  return (
    <section className="result-list-block">
      <h3>{title}</h3>
      <ul className="result-list">
        {items.map((item) => (
          <li key={item.dimension}>
            <span>{item.label}</span>
            <strong>{formatPercent(item.compatibility)}%</strong>
          </li>
        ))}
      </ul>
    </section>
  );
}

type DevSelectionsProps = {
  answers: CompatibilityAnswers;
  result: CompatibilityResult;
};

function DevSelections({ answers, result }: DevSelectionsProps) {
  const profileFromAnswers = calculateDimensionScores(compatibilityQuestions, answers);
  const profileText = result.dimensionResults
    .map((item) => `  ${item.dimension}: ${formatPercent(profileFromAnswers[item.dimension])},`)
    .join("\n");

  return (
    <section className="dev-calibration" aria-labelledby="dev-selections-title">
      <h3 id="dev-selections-title">Your selections</h3>
      <p>
        Dev mode only. Use this to calibrate the saved compatibility profile after answering as yourself.
      </p>

      <h4>Profile from these answers</h4>
      <pre>{`myCompatibilityProfile: {\n${profileText}\n}`}</pre>

      <h4>Question answers</h4>
      <ol className="dev-answer-list">
        {compatibilityQuestions.map((question, index) => {
          const answer = answers[question.id];
          const answerLabel = agreementScale.find((item) => item.value === answer)?.label ?? "No answer";

          return (
            <li key={question.id}>
              <strong>{index + 1}. {question.prompt}</strong>
              <span>{answer}: {answerLabel}</span>
              <small>{question.dimensions.join(", ")}{question.reverseScore ? " · reverse scored" : ""}</small>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function formatPercent(value: number) {
  return Math.round(value);
}
