export interface Result {
    periodLength: number;
    trainingDays: number;
    success: boolean;
    rating: number;
    ratingDescription: string;
    target: number;
    average: number;
}

export function calculateExercises(dailyHours: number[], target: number): Result {
    const periodLength = dailyHours.length;
    const trainingDays = dailyHours.filter(day => day > 0).length;
    const totalHours = dailyHours.reduce((total, hours) => total + hours, 0);
    const average = totalHours / periodLength;
    const success = average >= target;

    let rating: number;
    let ratingDescription: string;

    if (average >= target) {
        rating = 3;
        ratingDescription = "Great job! You've met your target.";
    } else if (average >= target * 0.75) {
        rating = 2;
        ratingDescription = "Not too bad but could be better.";
    } else {
        rating = 1;
        ratingDescription = "You need to work harder.";
    }

    return {
        periodLength,
        trainingDays,
        success,
        rating,
        ratingDescription,
        target,
        average
    };
}

// const args = process.argv.slice(2);

// if (args.length < 2) {
//     console.log("Please provide the target and at least one day of exercise hours as arguments.");
// } else {
//     const target = Number(args[0]);
//     const dailyHours = args.slice(1).map(Number);

//     if (isNaN(target) || dailyHours.some(isNaN)) {
//         console.log("All arguments should be numbers.");
//     } else {
//         console.log(calculateExercises(dailyHours, target));
//     }
// }