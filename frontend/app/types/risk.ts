export interface RiskAnalysis {
  risk_score: number;
  risk_level: string;
  prediction: string;
}

export interface RiskTrendItem {
  date: string;
  risk_score: number;
}
