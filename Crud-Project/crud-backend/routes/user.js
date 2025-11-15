import {create, getAll, getOne, update, remove} from '../controller/user.js';
import express from 'express';
const router = express.Router();

router.post('/create', create);
router.get('/getall', getAll);
router.get('/getone/:id', getOne);
router.put('/update/:id', update);
router.delete('/remove/:id', remove);

export default router;