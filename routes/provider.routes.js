const express = require("express");
const router = express.Router();

const _providerController = require("../controllers/providers.js");


router.post("/provider", _providerController.createProvider);
router.get("/providers", _providerController.getProviders)
router.get("/provider/:id", _providerController.getProvider);
router.put("/provider/:id", _providerController.updateProvider);
router.delete("/provider/:id", _providerController.deleteProvider);




module.exports = router;