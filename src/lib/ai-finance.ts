export const calculateFeeRisk = (balance: number, grade: string) => {
  // AI Logic: High balances in graduating years (Grade 12/Form 4) 
  // are higher risk because of exit timelines.
  const riskFactor = balance > 25000 ? 0.8 : 0.3;
  
  if (balance > 40000) return "CRITICAL";
  if (balance > 15000) return "WARNING";
  return "STABLE";
};

export const forecastRevenue = (students: any[]) => {
  const totalBalance = students.reduce((sum, s) => sum + (s.fee_balance || 0), 0);
  // Predict that only 65% of large balances will be recovered this month
  const predictedRecovery = totalBalance * 0.65;
  return predictedRecovery;
};