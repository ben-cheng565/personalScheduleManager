import express from 'express';
import { Todo } from '../db/schema';
import createDummyData from '../db/dummy-data';
import mongooseCrudify from 'mongoose-crudify';

const router = express.Router();

/**
 * Use default mongoose-crudify to add List, Create, Read, Update, and Delete operations for todo items
 */
router.use('/todos', mongooseCrudify({
    Model: Todo
}));

/**
 * When making a GET request to "/api/init", clear the database and re-add the starting data.
 * 
 * For testing purposes!
 */
router.get('/init', async (req, res) => {
    await createDummyData();
    res.redirect('/api/todos');
});

export default router;