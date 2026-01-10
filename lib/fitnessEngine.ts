// Helper: Calculate BMI
const getBMI = (weight: number, height: number) => {
  // Height is in cm, convert to meters
  const heightM = height / 100;
  return weight / (heightM * heightM);
};

// 1. Calculate Initial Calories & Macros
export const calculateInitialTargets = (
  weight: number, // kg
  height: number, // cm
  age: number,
  gender: string,
  frequency: number,
  goal: string,
  experience: string 
) => {
  // BMR (Mifflin-St Jeor)
  let bmr = 10 * weight + 6.25 * height - 5 * age;
  bmr += gender.toLowerCase() === "male" ? 5 : -161;

  // Activity Factor
  const activityMap: any = { 2: 1.35, 3: 1.45, 4: 1.55, 5: 1.65, 6: 1.75 };
  const tdee = bmr * (activityMap[frequency] || 1.35);

  const bmi = getBMI(weight, height);
  let targetCalories = tdee;

  // --- REALISTIC CALORIE ADJUSTMENT LOGIC ---
  
  // Base Deficit/Surplus
  let deficitPct = 0.20; // Standard 20% deficit
  let surplusPct = 0.10; // Standard 10% surplus

  // 1. BMI Adjustments (Higher BMI = Safer to have larger deficits)
  if (bmi > 30) {
    deficitPct = 0.30; // Obese: Aggressive 30% deficit
  } else if (bmi > 25) {
    deficitPct = 0.25; // Overweight: Moderate 25% deficit
  }

  // 2. Experience Adjustments (Beginners adapt faster)
  if (experience === "beginner") {
    // Beginners can burn fat faster without muscle loss
    if (bmi > 25) deficitPct += 0.05; 
    
    // Beginners have "newbie gains" potential, so we can push surplus slightly
    surplusPct = 0.15; 
  }

  // Calculate Final Calories
  if (goal === "lose_fat") {
    targetCalories = tdee * (1 - deficitPct);
  } else if (goal === "gain_muscle") {
    targetCalories = tdee * (1 + surplusPct);
  } else if (goal === "recomp") {
    // Recomp is usually maintenance or very slight deficit
    targetCalories = tdee * 0.95;
  }

  return calculateMacros(targetCalories, weight, goal, age, experience);
};

// 2. Macro Distribution Logic (Updated for Age/Exp)
export const calculateMacros = (
  calories: number, 
  weight: number, 
  goal: string, 
  age: number, 
  experience: string
) => {
  
  // --- REALISTIC PROTEIN LOGIC ---
  // Standard Anchors: Lose (2.2g), Gain (1.8g)
  let proteinFactor = goal === "lose_fat" ? 2.2 : 1.8;

  // Constraint: Age > 30 OR Beginner
  // Rationale: Older individuals have lower anabolic resistance threshold (need less extreme protein),
  // and beginners typically have less muscle mass to support, so 2.2g is overkill.
  if (age > 30 || experience === "beginner") {
    // Reduce range to ~1.6g - 2.0g
    proteinFactor = goal === "lose_fat" ? 1.6 : 1.6;
  }

  const protein = Math.round(weight * proteinFactor);

  // Fat Floor (Hormonal Health)
  // 0.8g per kg is a safe standard floor
  const fat = Math.round(Math.max(0.7 * weight, 0.8 * weight)); 

  // Carbs fill the rest of the energy bucket
  const proteinCal = protein * 4;
  const fatCal = fat * 9;
  const remainingCal = calories - (proteinCal + fatCal);
  
  // Ensure carbs don't go negative (edge case for very low cal diets)
  const carbs = Math.round(Math.max(0, remainingCal / 4));

  return { 
    calories: Math.round(calories), 
    protein, 
    fat, 
    carbs 
  };
};

// 3. Weekly Adjustment Decision Tree (Updated for Single Weekly Entries)
export const adjustMacros = (
  currentMacros: any,
  currentWeight: number,
  history: any[],
  goal: string,
  experience: string,
  age: number
) => {
  // Sort history by date ensuring we have chronological order
  const sortedHistory = [...history].sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // We need at least 2 entries to compare (Current + Previous)
  if (sortedHistory.length < 2) return { newMacros: currentMacros, message: "Week 1 Baseline Set" };

  const currentLog = sortedHistory[sortedHistory.length - 1]; // The one just added
  const previousLog = sortedHistory[sortedHistory.length - 2]; // The previous entry

  // Check Time Difference
  const diffTime = Math.abs(new Date(currentLog.date).getTime() - new Date(previousLog.date).getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // If logs are too close (e.g., user weighed in yesterday and today), don't adjust yet.
  if (diffDays < 5) {
     return { newMacros: currentMacros, message: "Gathering weekly data..." };
  }

  // Calculate Compliance from the LATEST log only
  const compliance = ((currentLog.dietAdherence || 0) * 0.7 + (currentLog.trainingAdherence || 0) * 0.3) / 100;

  // % Change in Weight between the two specific points
  const weightDiff = currentLog.weight - previousLog.weight;
  const percentChange = (weightDiff / previousLog.weight) * 100;

  // Logic Gate: Check Compliance First
  if (compliance < 0.8) {
    return { newMacros: currentMacros, message: "⚠️ Consistency too low to adjust." };
  }

  // Adjustment Sensitivity (Advanced users need smaller nudges)
  const sensitivity: any = { beginner: 0.07, intermediate: 0.05, advanced: 0.03 };
  const changePct = sensitivity[experience] || 0.05;
  
  let newCalories = currentMacros.calories;
  let message = "On Track";

  // --- DECISION TREE ---
  if (goal === "lose_fat") {
    if (percentChange > -0.25) { 
       // Losing too slow (or gaining) -> Decrease Calories
       newCalories -= newCalories * changePct;
       message = "Plateau Detected: Calories Decreased";
    } else if (percentChange < -1.0) { 
       // Losing too fast (> 1% BW per week) -> Increase Calories to spare muscle
       newCalories += newCalories * changePct;
       message = "Losing too fast: Calories Increased";
    }
  } else if (goal === "gain_muscle") {
    if (percentChange < 0.25) { 
       // Gaining too slow -> Increase Calories
       newCalories += newCalories * changePct;
       message = "Gaining too slow: Calories Increased";
    } else if (percentChange > 0.75) { 
       // Gaining too fast (likely fat) -> Decrease Calories
       newCalories -= newCalories * changePct;
       message = "Gaining too fast: Calories Decreased";
    }
  }

  // Recalculate Macros with new Calorie Target
  // We pass 'age' and 'experience' to maintain the protein constraints
  const newMacros = calculateMacros(newCalories, currentWeight, goal, age, experience);
  
  return { newMacros, message };
};