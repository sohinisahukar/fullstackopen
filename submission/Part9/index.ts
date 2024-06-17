import express from 'express';
import { calculateBmi } from './bmiCalculator';
import { calculateExercises, Result } from './exerciseCalculator';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/hello', (_req, res) => {
    res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
    const height = Number(req.query.height);
    const weight = Number(req.query.weight);

    if (isNaN(height) || isNaN(weight)) {
        return res.status(400).json({ error: "malformatted parameters" });
    } else {
        const bmi = calculateBmi(height, weight);
        return res.json({
            weight,
            height,
            bmi
        });
    }
});

app.post('/exercises', (req, res) => {
    const { daily_exercises, target } = req.body;

    if (!daily_exercises || target === undefined) {
        return res.status(400).json({ error: "parameters missing" });
    }

    if (!Array.isArray(daily_exercises) || isNaN(Number(target))) {
        return res.status(400).json({ error: "malformatted parameters" });
    }

    const dailyHours = daily_exercises.map(Number);

    if (dailyHours.some(isNaN)) {
        return res.status(400).json({ error: "malformatted parameters" });
    }

    const result: Result = calculateExercises(dailyHours, Number(target));
    return res.json(result);
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});