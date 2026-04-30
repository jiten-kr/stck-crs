/**
 * Curriculum topics for the trading masterclass
 * Used by LiveTradingClass and other components
 */

export interface CurriculumTopic {
  id: string;
  title: string;
  points: string[];
}

export const CURRICULUM_TOPICS: CurriculumTopic[] = [
  {
    id: "entry-strategy",
    title: "Proper Entry Strategy",
    points: [
      "How to identify high-probability entries",
      "When not to enter (most important rule)",
      "Avoid chasing and FOMO trades",
    ],
  },
  {
    id: "stop-loss",
    title: "Stop-Loss That Actually Works",
    points: [
      "Logical stop-loss placement (not random points)",
      "How to protect capital first, profits second",
      "Why most stop-losses fail—and how to fix it",
    ],
  },
  {
    id: "target-setting",
    title: "Target Setting Like a Pro",
    points: [
      "How to define targets before entering a trade",
      "Holding winners instead of exiting early",
      "Scaling out without destroying risk-reward",
    ],
  },
  {
    id: "risk-reward",
    title: "Risk-Reward Ratio: Minimum 1:5",
    points: [
      "Why low risk-reward kills accounts",
      "How to structure trades for asymmetric returns",
      "Fewer trades, higher impact results",
    ],
  },
  {
    id: "universal-strategy",
    title: "Universal Strategy – All Markets",
    points: [
      "Same logic for stocks, crypto & commodities",
      "Market-independent decision making",
      "Adapt strategy, not emotions",
    ],
  },
  {
    id: "psychology",
    title: "Trading Psychology & Discipline",
    points: [
      "How to follow rules under pressure",
      "Eliminate over-trading and revenge trades",
      "Build consistency, not luck",
    ],
  },
];

/**
 * Advanced curriculum topics for EnrollLiveTradingClass
 * Comprehensive masterclass curriculum with detailed trading methodologies
 */
export const ENROLL_CURRICULUM_TOPICS: CurriculumTopic[] = [
  {
    id: "price-action",
    title: "Price Action from Scratch to Advanced",
    points: [
      "Market structure, support/resistance, trend behavior",
      "Entry, exit, and trade confirmation techniques",
      "Reading price action without relying on indicators",
    ],
  },
  {
    id: "swing-positional",
    title: "Positional & Swing Trading",
    points: [
      "How to capture medium-term moves with proper timing",
      "Stock selection and trade planning",
      "Multi-day and multi-week trade management",
    ],
  },
  {
    id: "fundamental-analysis",
    title: "Fundamental Analysis (Practical Approach)",
    points: [
      "How to evaluate stocks for short-term and long-term trades",
      "Key financial metrics that actually matter",
      "Combining fundamentals with technical analysis",
    ],
  },
  {
    id: "intraday-strategies",
    title: "Intraday & Swing Trading Strategies",
    points: [
      "6 structured strategies with clear entry/exit rules",
      "Focus on risk-reward, not random signals",
      "Real-time execution and risk management",
    ],
  },
  {
    id: "options-trading",
    title: "Options Trading (Buying & Selling)",
    points: [
      "A rule-based approach to options buying",
      "Capital-efficient option selling strategy",
      "How to manage risk even with smaller capital",
    ],
  },
];
