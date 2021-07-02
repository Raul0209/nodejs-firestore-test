const express = require("express");
const _containerController = require("../controllers/container.controller");

const router = express.Router();

router.post("/container", _containerController.createContainer);
router.get("/containers", _containerController.getContainers)
router.get("/container/:id", _containerController.getContainer);
router.put("/container/:id", _containerController.updateContainer);
router.delete("/container/:id", _containerController.deleteContainer);

module.exports = router;