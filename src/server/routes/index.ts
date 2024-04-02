import express from 'express';
import auth from './auth.js';
import bots from './bots.js';
import servers from './servers.js';

const router = express.Router();

router.use('/auth', auth);
router.use('/bots', bots);
router.use('/bot', bots);
router.use('/servers', servers);
router.use('/server', servers);

export default router;