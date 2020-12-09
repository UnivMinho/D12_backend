const express = require("express");
const router = express.Router();
const audits = require('../controllers/audits.controller.js');

router.get('/', audits.read);
router.post('/', audits.save);
router.get('/:audit_id', audits.readById);
router.put('/:audit_id', audits.update);
router.delete('/:audit_id', audits.deleteID);

module.exports = router;