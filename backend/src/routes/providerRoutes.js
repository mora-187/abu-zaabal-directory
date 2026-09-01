const express=require("express");
const router=express.Router();

const {
    getProviders,
    getProviderById,
    createProvider,
    updateProvider,
    deleteProvider
}=require("../controllers/providerController");
const searchProvider= require('../controllers/searchController.js');
router.get("/",getProviders);
router.get('/search',searchProvider);
router.get("/:id",getProviderById);
router.post("/",createProvider);
router.put("/:id",updateProvider);
router.delete("/:id",deleteProvider);
module.exports=router;