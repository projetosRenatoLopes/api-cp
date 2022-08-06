const express = require('express');
const router = express.Router();
const backup = require('../src/repositories/backup.repository');

router.get('/', backup.getBackup);

module.exports = router;