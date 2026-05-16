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

const MATRIX_DISTANCE_SCALE = 0.95;

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
  const preferenceMatrixPoint = deriveMatrixPoint(preferenceProfile);
  const projectedUserMatrixPoint = deriveMatrixPoint(userProfile);
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
      preference: preferenceMatrixPoint,
      user: applyCompatibilityDistanceToMatrixPoint(
        projectedUserMatrixPoint,
        preferenceMatrixPoint,
        overallCompatibility,
      ),
    },
    overallCompatibility,
    strongestAlignments,
    summaryLabel: getCompatibilitySummary(overallCompatibility),
  };
}

function applyCompatibilityDistanceToMatrixPoint(
  userPoint: MatrixPoint,
  preferencePoint: MatrixPoint,
  compatibility: number,
): MatrixPoint {
  const xDistance = userPoint.x - preferencePoint.x;
  const yDistance = userPoint.y - preferencePoint.y;
  const currentDistance = Math.hypot(xDistance, yDistance);
  const targetDistance = (100 - compatibility) * MATRIX_DISTANCE_SCALE;

  if (currentDistance >= targetDistance) {
    return userPoint;
  }

  const direction =
    currentDistance > 0
      ? { x: xDistance / currentDistance, y: yDistance / currentDistance }
      : { x: 1 / Math.SQRT2, y: 1 / Math.SQRT2 };

  return {
    x: clampPercentage(preferencePoint.x + direction.x * targetDistance),
    y: clampPercentage(preferencePoint.y + direction.y * targetDistance),
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
  if (score >= 85) return "Your answers are highly aligned with their preferences.";
  if (score >= 70) return "Your answers show strong overall alignment, with a few differences.";
  if (score >= 50) return "Your answers show mixed alignment. Some values match closely, while others differ.";
  if (score >= 30) return "Your answers differ from their preferences in several areas.";
  return "Your answers show a very different value profile from their preferences.";
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
    x: clampPercentage(50 + individual - community),
    y: clampPercentage(50 + structure - openness),
  };
}

function average(values: number[]) {
  if (values.length === 0) return 0;
  return values.reduce((total, value) => total + value, 0) / values.length;
}
