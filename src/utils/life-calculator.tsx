
// Simplified life expectancy calculation (same as in life-grid.tsx)
export const getLifeExpectancy = (
  nationality: string,
  healthyFood: boolean,
  running: boolean,
  alcohol: boolean,
  smoking: boolean,
) => {
  let baseExpectancy = 80; // Default

  // Adjust based on nationality
  switch (nationality) {
    case 'jp': // Japan
      baseExpectancy = 84;
      break;
    case 'us': // United States
      baseExpectancy = 78;
      break;
    case 'es': // Spain
      baseExpectancy = 83;
      break;
    // Add more countries as needed
    default:
      baseExpectancy = 80;
  }

  // Adjust for lifestyle factors (simplified model)
  if (healthyFood) baseExpectancy += 2;
  if (running) baseExpectancy += 3;
  if (alcohol) baseExpectancy -= 2;
  if (smoking) baseExpectancy -= 5;

  return baseExpectancy;
};
