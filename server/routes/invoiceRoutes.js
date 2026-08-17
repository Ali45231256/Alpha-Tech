const express = require("express");
const router = express.Router();

const {
  downloadInvoice,
} = require("../controllers/invoiceController");

router.get("/:id", downloadInvoice);

module.exports = router;