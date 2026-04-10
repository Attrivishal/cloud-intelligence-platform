export interface CloudHealth {
  grade: string;
  score: number;
}

export interface DashboardOverview {
  cost: {
    total_cost: number;
  };
  cloud_health: CloudHealth;
}
