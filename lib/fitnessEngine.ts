// 1. Calculate Initial Calories & Macros
export const calculateInitialTargets = (
  weight: number, // kg
  height: number, // cm
  age: number,
  gender: string,
  frequency: number,
  goal: string
) => {
  // BMR (Mifflin-St Jeor)
  let bmr = 10 * weight + 6.25 * height - 5 * age;
  bmr += gender.toLowerCase() === "male" ? 5 : -161;

  // Activity Factor
  const activityMap: any = { 2: 1.35, 3: 1.45, 4: 1.55, 5: 1.65, 6: 1.75 };
  const tdee = bmr * (activityMap[frequency] || 1.35);

  // Goal Adjustment
  let targetCalories = tdee;
  if (goal === "lose_fat") targetCalories = tdee * 0.80; // 20% deficit
  if (goal === "gain_muscle") targetCalories = tdee * 1.10; // 10% surplus
  if (goal === "recomp") targetCalories = tdee * 0.95; // Slight deficit

  return calculateMacros(targetCalories, weight, goal);
};

// 2. Macro Distribution Logic (Reusable)
export const calculateMacros = (calories: number, weight: number, goal: string) => {
  // Protein Anchor
  let proteinFactor = 1.8;
  if (goal === "lose_fat") proteinFactor = 2.2;
  const protein = Math.round(weight * proteinFactor);

  // Fat Floor
  const fat = Math.round(Math.max(0.7 * weight, 0.8 * weight)); // Using 0.8 from prompt

  // Carbs fill remainder
  const proteinCal = protein * 4;
  const fatCal = fat * 9;
  const remainingCal = calories - (proteinCal + fatCal);
  const carbs = Math.round(Math.max(0, remainingCal / 4));

  return { 
    calories: Math.round(calories), 
    protein, 
    fat, 
    carbs 
  };
};

// 3. Weekly Adjustment Decision Tree
export const adjustMacros = (
  currentMacros: any,
  currentWeight: number,
  history: any[],
  goal: string,
  experience: string
) => {
  // Need at least 14 days of data to compare two full weeks, but we'll try with what we have
  if (history.length < 7) return { newMacros: currentMacros, message: "Gathering data..." };

  // Get last 7 entries (Current Week)
  const currentWeekLogs = history.slice(-7);
  const currentAvg = currentWeekLogs.reduce((acc:any, cur:any) => acc + cur.weight, 0) / currentWeekLogs.length;

  // Calculate Compliance
  const lastLog = history[history.length - 1];
  const compliance = ((lastLog.dietAdherence || 0) * 0.7 + (lastLog.trainingAdherence || 0) * 0.3) / 100;

  // Calculate Previous Week Avg (Entries 8-14 days ago)
  const prevWeekLogs = history.slice(-14, -7);
  if (prevWeekLogs.length === 0) return { newMacros: currentMacros, message: "Week 1 Baseline Set" };
  
  const prevAvg = prevWeekLogs.reduce((acc:any, cur:any) => acc + cur.weight, 0) / prevWeekLogs.length;

  // % Change
  const weightDiff = currentAvg - prevAvg;
  const percentChange = (weightDiff / prevAvg) * 100;

  // Logic Gates
  if (compliance < 0.8) {
    return { newMacros: currentMacros, message: "⚠️ Consistency too low to adjust." };
  }

  // Adjustment Sensitivity
  const sensitivity: any = { beginner: 0.07, intermediate: 0.05, advanced: 0.03 };
  const changePct = sensitivity[experience] || 0.05;
  let newCalories = currentMacros.calories;
  let message = "On Track";

  // Decision Tree
  if (goal === "lose_fat") {
    if (percentChange > -0.25) { // Losing too slow (< 0.25%)
       newCalories -= newCalories * changePct;
       message = "Plateau Detected: Calories Decreased";
    } else if (percentChange < -1.0) { // Losing too fast (> 1%)
       newCalories += newCalories * changePct;
       message = "Losing too fast: Calories Increased";
    }
  } else if (goal === "gain_muscle") {
    if (percentChange < 0.25) { // Gaining too slow
       newCalories += newCalories * changePct;
       message = "Gaining too slow: Calories Increased";
    } else if (percentChange > 0.75) { // Gaining too fast (fat risk)
       newCalories -= newCalories * changePct;
       message = "Gaining too fast: Calories Decreased";
    }
  }

  // Recalculate Macros based on new calories
  const newMacros = calculateMacros(newCalories, currentWeight, goal);
  return { newMacros, message };
};