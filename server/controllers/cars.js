import { pool } from '../config/database.js';

export const getCars = async (req, res) => {
    let results;

    try{
        results = await pool.query(`SELECT * FROM cars ORDER BY id ASC`);
    }
    catch (err) {
        console.log('Error getting cars: ', err);
    }

    res.status(200).json(results.rows);
}

export const getCarById = async (req, res) => {
    let results;
    try {
        const id = parseInt(req.params.id);
        results = await pool.query('SELECT * FROM cars WHERE id = $1', [id]);

    }
    catch (err) {
        console.log('Error getting car by id', err)
    }

    res.status(200).json(results.rows[0]);
}

export const createCar = async (req, res) => {
    try {
        const { name, wheels, exterior, interior, roof, totalcost } = req.body;
        const results = await pool.query(`
        INSERT INTO cars (name, wheels, exterior, interior, roof, totalcost)
        VALUES($1, $2, $3, $4, $5, $6)
        RETURNING *`,
        [name, wheels, exterior, interior, roof, totalcost]
    )

    res.status(200).json(results.rows)
    }
    catch (err) {
        console.log(err);
    }
}

export const updateCar = async (req, res) => {
    try {
        const id = parseInt(req.params.id) // need id to know what to edit!
        const { name, wheels, exterior, interior, roof, totalcost } = req.body;
        const results = await pool.query(`
            UPDATE cars SET name = $1, wheels = $2, exterior = $3, interior = $4,
            roof = $5, totalcost = $6 WHERE id = $7 `,
            [name, wheels, exterior, interior, roof, totalcost, id]
        )

        res.status(200).json(results.rows[0]);
    }
    catch (err) {
        console.log(err);
    }
}

export const deleteCar = async (req, res) => {
    try {
        const id = parseInt(req.params.id) // need id to know what to edit!

        const results = await pool.query(`
            DELETE FROM cars WHERE id = $1`, [id]
        )

        res.status(200).json(results.rows);
    }
    catch (err) {
        console.log(err);
    }
}