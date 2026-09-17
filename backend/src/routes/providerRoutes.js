const express=require("express");
const router=express.Router();

const {
    getProviders,
    getProviderById,
    createProvider,
    updateProvider,
    deleteProvider,
    getProviderContact
}=require("../controllers/providerController");
const searchProvider= require('../controllers/searchController.js');
const { protect, adminOnly } = require("../middleware/auth");
router.get("/",getProviders);
router.get('/search',searchProvider);
router.get("/:id/contact", getProviderContact);
router.get("/:id",getProviderById);
router.post("/", protect, adminOnly, createProvider);
router.put("/:id", protect, adminOnly, updateProvider);
router.delete("/:id", protect, adminOnly, deleteProvider);
module.exports=router;