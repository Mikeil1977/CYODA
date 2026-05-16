export const compatibilityDimensions = [
  "economicFairness",
  "personalFreedom",
  "socialResponsibility",
  "institutionalTrust",
  "privacyAndCivilLiberties",
  "environmentalPriority",
  "pragmatism",
  "empathy",
  "traditionVsChange",
  "conflictStyle",
] as const;

export type CompatibilityDimension = (typeof compatibilityDimensions)[number];

export type CompatibilityProfile = Record<CompatibilityDimension, number>;

export type CompatibilityWeights = Record<CompatibilityDimension, number>;

export type CompatibilityQuestion = {
  id: string;
  example?: string;
  prompt: string;
  dimensions: CompatibilityDimension[];
  reverseScore?: boolean;
};

export const dimensionLabels: Record<CompatibilityDimension, string> = {
  economicFairness: "Money and fairness",
  personalFreedom: "Personal freedom",
  socialResponsibility: "Shared responsibility",
  institutionalTrust: "Rules and accountability",
  privacyAndCivilLiberties: "Privacy and personal rights",
  environmentalPriority: "Environment",
  pragmatism: "Practicality",
  empathy: "Empathy",
  traditionVsChange: "Tradition and change",
  conflictStyle: "Conflict style",
};

export const myCompatibilityProfile: CompatibilityProfile = {
  economicFairness: 100,
  personalFreedom: 100,
  socialResponsibility: 100,
  institutionalTrust: 100,
  privacyAndCivilLiberties: 100,
  environmentalPriority: 100,
  pragmatism: 100,
  empathy: 100,
  traditionVsChange: 100,
  conflictStyle: 100,
};

export const compatibilityDimensionWeights: CompatibilityWeights = {
  economicFairness: 1,
  personalFreedom: 1,
  socialResponsibility: 1,
  institutionalTrust: 1,
  privacyAndCivilLiberties: 1,
  environmentalPriority: 1,
  pragmatism: 1,
  empathy: 1,
  traditionVsChange: 1,
  conflictStyle: 1,
};

export const compatibilityQuestions: CompatibilityQuestion[] = [
  {
    id: "safety_net",
    example: "For example, I am thinking about the tradeoff between keeping taxes or obligations lower and making sure people have support during illness, job loss, or bad luck.",
    prompt: "I usually lean toward a stronger basic safety net, even when it asks more from everyone.",
    dimensions: ["economicFairness"],
  },
  {
    id: "lifestyle_choices",
    example: "For example, this could mean choices about relationships, faith, clothes, or home life, balanced against how much a community expects shared norms.",
    prompt: "I usually lean toward adults having wide freedom to live in ways others may not choose for themselves.",
    dimensions: ["personalFreedom"],
  },
  {
    id: "privacy_security",
    example: "For example, this could mean weighing stronger monitoring or tracking against the risk of losing privacy in everyday life.",
    prompt: "When safety and privacy conflict, I usually lean toward protecting privacy.",
    dimensions: ["privacyAndCivilLiberties"],
  },
  {
    id: "children_starting_points",
    example: "For example, two children may both work hard while having different levels of money, stability, confidence, or support around them.",
    prompt: "I think effort matters, but people's starting points matter too.",
    dimensions: ["economicFairness", "empathy"],
  },
  {
    id: "traditions_and_change",
    example: "For example, family or community habits can carry meaning, while some habits may need updating as people and circumstances change.",
    prompt: "I tend to value traditions, but I am comfortable changing them when they no longer fit.",
    dimensions: ["traditionVsChange", "pragmatism"],
  },
  {
    id: "environment_priority",
    example: "For example, this could mean choosing cleaner options, reducing waste, or accepting some cost now, balanced against convenience and affordability.",
    prompt: "I usually give environmental impact real weight, even when it makes a choice less convenient.",
    dimensions: ["environmentalPriority"],
  },
  {
    id: "circumstances_before_judgement",
    example: "For example, lateness, irritability, or money choices can look different once you know the pressure someone was under.",
    prompt: "Before judging someone's choices, I usually want to understand what they were dealing with.",
    dimensions: ["empathy"],
  },
  {
    id: "institutions_and_accountability",
    example: "For example, schools, workplaces, courts, and public services need rules, but those rules can still need review or challenge.",
    prompt: "I respect useful rules and systems, but I think they should be questioned when they stop working well.",
    dimensions: ["institutionalTrust", "pragmatism"],
  },
  {
    id: "freedom_for_unpopular_views",
    example: "For example, this could mean protecting someone's rights or dignity even when their choices, beliefs, or identity make other people uncomfortable.",
    prompt: "I care about personal freedom most when it also protects people I do not fully understand or agree with.",
    dimensions: ["personalFreedom", "privacyAndCivilLiberties"],
  },
  {
    id: "community_responsibility",
    example: "For example, this could mean checking on a neighbour, keeping noise down, or accepting small limits when they help people nearby.",
    prompt: "I think communities work best when people accept some responsibility for one another.",
    dimensions: ["socialResponsibility"],
  },
  {
    id: "individual_effort",
    example: "For example, hard work can matter a lot, while health, timing, family support, discrimination, and money can also shape what happens.",
    prompt: "I see people's outcomes as shaped by both effort and circumstances.",
    dimensions: ["economicFairness"],
  },
  {
    id: "gradual_change",
    example: "For example, some problems benefit from careful step-by-step change, while others may get worse if everyone waits too long.",
    prompt: "I usually prefer gradual change over pushing for fast change.",
    dimensions: ["traditionVsChange"],
    reverseScore: true,
  },
  {
    id: "parenting_boundaries",
    example: "For example, bedtime can still matter, while a child's feelings or confusion may also need a real hearing.",
    prompt: "With children, I value clear boundaries and being willing to listen.",
    dimensions: ["conflictStyle", "empathy"],
  },
  {
    id: "limits_on_surveillance",
    example: "For example, cameras, tracking, or message access can help solve problems, but they can also create risks if power is misused.",
    prompt: "I usually want strong limits on surveillance, even when surveillance could make some problems easier to catch.",
    dimensions: ["privacyAndCivilLiberties"],
  },
  {
    id: "compromise",
    example: "For example, this is about ordinary needs and preferences, not situations where safety or basic respect is at stake.",
    prompt: "When both people have reasonable needs, I usually prefer compromise over one person's preference deciding the whole outcome.",
    dimensions: ["conflictStyle"],
  },
  {
    id: "fairness_not_sameness",
    example: "For example, giving extra support to one person can feel uneven, but it may also make sense when their situation is different.",
    prompt: "I think fairness can sometimes mean treating people differently because their situations are different.",
    dimensions: ["empathy", "socialResponsibility"],
  },
  {
    id: "parenting_explains_rules",
    example: "For example, a child may still need to stop, but the adult can decide whether explanation or simple authority fits the moment.",
    prompt: "As a parent, I would usually rather explain a rule than rely only on 'because I said so'.",
    dimensions: ["personalFreedom", "traditionVsChange"],
  },
  {
    id: "repair_not_shame",
    example: "For example, if a child breaks something or hurts someone, the response could focus on consequences, repair, learning, or some mix of all three.",
    prompt: "When someone messes up, I care more about repair and learning than punishment.",
    dimensions: ["empathy", "conflictStyle"],
  },
  {
    id: "systems_that_harm",
    example: "For example, a process can work efficiently for most people while creating real problems for a smaller group.",
    prompt: "If a system works for most people but harms a smaller group, I usually lean toward changing the system.",
    dimensions: ["economicFairness", "pragmatism"],
  },
  {
    id: "rights_and_consequences",
    example: "For example, a choice can be personally important while still having effects on partners, children, neighbours, or a wider community.",
    prompt: "I think good decisions weigh both personal rights and the effects on other people.",
    dimensions: ["personalFreedom", "socialResponsibility", "pragmatism"],
  },
];
