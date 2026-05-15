import {
  compatibilityDimensions,
  dimensionLabels,
  type CompatibilityDimension,
  type CompatibilityProfile,
  type CompatibilityQuestion,
  type CompatibilityWeights,
} from "../data/myCompatibilityProfile";

export type AgreementValue = 1 | 2 | 3 | 4 | 5;

export type CompatibilityAnswers = Record<string, AgreementValue>;

export type DimensionCompatibility = {
  compatibility: number;
  difference: number;
  dimension: CompatibilityDimension;
  label: string;
  preferenceScore: number;
  userScore: number;
  weight: number;
};

export type MatrixPoint = {
  x: number;
  y: number;
};

export type CompatibilityResult = {
  biggestDifferenceAreas: DimensionCompatibility[];
  dimensionResults: DimensionCompatibility[];
  explanation: string;
  matrix: {
    preference: MatrixPoint;
    user: MatrixPoint;
  };
  overallCompatibility: number;
  strongestAlignments: DimensionCompatibility[];
  summaryLabel: string;
};

type ScoreBucket = {
  count: number;
  total: number;
};

export function clampPercentage(value: number) {
  return Math.min(100, Math.max(0, value));
}

export function normalizeAnswer(answer: AgreementValue) {
  return clampPercentage(((answer - 1) / 4) * 100);
}

export function getQuestionScore(answer: AgreementValue, reverseScore = false) {
  const normalized = normalizeAnswer(answer);
  return reverseScore ? 100 - normalized : normalized;
}

export function calculateDimensionScores(
  questions: CompatibilityQuestion[],
  answers: CompatibilityAnswers,
) {
  const buckets = compatibilityDimensions.reduce(
    (acc, dimension) => {
      acc[dimension] = { count: 0, total: 0 };
      return acc;
    },
    {} as Record<CompatibilityDimension, ScoreBucket>,
  );

  questions.forEach((question) => {
    const answer = answers[question.id];
    if (!answer) return;

    const score = getQuestionScore(answer, question.reverseScore);
    question.dimensions.forEach((dimension) => {
      buckets[dimension].count += 1;
      buckets[dimension].total += score;
    });
  });

  return compatibilityDimensions.reduce(
    (acc, dimension) => {
      const bucket = buckets[dimension];
      acc[dimension] = bucket.count > 0 ? clampPercentage(bucket.total / bucket.count) : 50;
      return acc;
    },
    {} as CompatibilityProfile,
  );
}

export function calculateCompatibilityResult(
  questions: CompatibilityQuestion[],
  answers: CompatibilityAnswers,
  preferenceProfile: CompatibilityProfile,
  weights: CompatibilityWeights,
): CompatibilityResult {
  const userProfile = calculateDimensionScores(questions, answers);

  const dimensionResults = compatibilityDimensions.map((dimension) => {
    const userScore = clampPercentage(userProfile[dimension]);
    const preferenceScore = clampPercentage(preferenceProfile[dimension]);
    const difference = Math.abs(userScore - preferenceScore);

    return {
      compatibility: clampPercentage(100 - difference),
      difference,
      dimension,
      label: dimensionLabels[dimension],
      preferenceScore,
      userScore,
      weight: weights[dimension],
    };
  });

  const totalWeight = dimensionResults.reduce((total, result) => total + result.weight, 0);
  const weightedTotal = dimensionResults.reduce(
    (total, result) => total + result.compatibility * result.weight,
    0,
  );
  const overallCompatibility = clampPercentage(weightedTotal / totalWeight);
  const strongestAlignments = [...dimensionResults]
    .sort((a, b) => b.compatibility - a.compatibility)
    .slice(0, 3);
  const biggestDifferenceAreas = [...dimensionResults]
    .sort((a, b) => b.difference - a.difference)
    .slice(0, 3);

  return {
    biggestDifferenceAreas,
    dimensionResults,
    explanation: getResultExplanation(overallCompatibility),
    matrix: {
      preference: deriveMatrixPoint(preferenceProfile),
      user: deriveMatrixPoint(userProfile),
    },
    overallCompatibility,
    strongestAlignments,
    summaryLabel: getCompatibilitySummary(overallCompatibility),
  };
}

export function getCompatibilitySummary(score: number) {
  if (score >= 85) return "Very high compatibility";
  if (score >= 70) return "Strong compatibility";
  if (score >= 50) return "Mixed compatibility";
  if (score >= 30) return "Low compatibility";
  return "Very low compatibility";
}

export function getResultExplanation(score: number) {
  if (score >= 85) return "Your answers are highly aligned with my saved preferences.";
  if (score >= 70) return "Your answers show strong overall alignment, with a few differences.";
  if (score >= 50) return "Your answers show mixed alignment. Some values match closely, while others differ.";
  if (score >= 30) return "Your answers differ from my saved preferences in several areas.";
  return "Your answers show a very different value profile from my saved preferences.";
}

export function deriveMatrixPoint(profile: CompatibilityProfile): MatrixPoint {
  const community = average([
    profile.economicFairness,
    profile.socialResponsibility,
    profile.environmentalPriority,
    profile.empathy,
  ]);
  const individual = average([
    profile.personalFreedom,
    profile.privacyAndCivilLiberties,
    100 - profile.socialResponsibility,
  ]);
  const openness = average([
    profile.personalFreedom,
    profile.privacyAndCivilLiberties,
    profile.traditionVsChange,
    profile.empathy,
  ]);
  const structure = average([
    profile.institutionalTrust,
    100 - profile.traditionVsChange,
    profile.conflictStyle,
  ]);

  return {
    x: clampPercentage(50 + (individual - community) / 2),
    y: clampPercentage(50 + (structure - openness) / 2),
  };
}

function average(values: number[]) {
  if (values.length === 0) return 0;
  return values.reduce((total, value) => total + value, 0) / values.length;
}
