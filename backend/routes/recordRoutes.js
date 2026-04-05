const express = require('express');
const router = express.Router();
const { getRecords, addRecord, deleteRecord, getDashboardStats } = require('../controllers/recordController');
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  RECORD_READ_ROLES,
  RECORD_WRITE_ROLES,
} = require('../middleware/accessPolicies');

router.use(protect);

router.get('/', authorize(RECORD_READ_ROLES), getRecords);
router.get('/stats', authorize(RECORD_READ_ROLES), getDashboardStats);
router.post('/', authorize(RECORD_WRITE_ROLES), addRecord);
router.delete('/:id', authorize(RECORD_WRITE_ROLES), deleteRecord);

module.exports = router;
