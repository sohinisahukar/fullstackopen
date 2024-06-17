export function calculateBmi(height: number, weight: number): string {
    // Convert height from centimeters to meters
    let heightInMeters = height / 100;
    // Calculate BMI
    let bmi = weight / (heightInMeters * heightInMeters);

    // Determine BMI category
    if (bmi < 18.5) {
        return "Underweight";
    } else if (bmi >= 18.5 && bmi < 24.9) {
        return "Normal (healthy weight)";
    } else if (bmi >= 25 && bmi < 29.9) {
        return "Overweight";
    } else {
        return "Obese";
    }
}

// Get command-line arguments
// const args = process.argv.slice(2);

// if (args.length !== 2) {
//     console.log("Please provide height (cm) and weight (kg) as arguments.");
// } else {
//     const height = Number(args[0]);
//     const weight = Number(args[1]);

//     if (isNaN(height) || isNaN(weight)) {
//         console.log("Both height and weight should be numbers.");
//     } else {
//         console.log(calculateBmi(height, weight));
//     }
// }
