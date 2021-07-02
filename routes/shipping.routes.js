const express = require("express");
const router = express.Router();

const _shippingController = require("../controllers/shipping.js");


router.post("/shipping", _shippingController.createShipping);
router.get("/shippings", _shippingController.getShippings)
router.get("/shipping/:id", _shippingController.getShipping);
router.put("/shipping/:id", _shippingController.updateShipping);
router.delete("/shipping/:id", _shippingController.deleteShipping);




module.exports = router;