const Provider=require("../models/Provider");
const { generateSearchText } = require("../utils/searchText");

const getProviders=async (req,res,next)=>{
    try{
const providers=await Provider.find();
res.status(200).json(providers);
    }
    catch(error){
        next(error)
    }
}
const getProviderById = async (req, res, next) =>{
try{
const provider=await Provider.findById(req.params.id)
if(!provider){
    return res.status(404).json({
        message:"Provider not found"
    })
}
res.status(200).json(provider);
}
catch(error){
    next(error);
}
}
const createProvider = async (req, res, next) => {
  try {
    const { name, phones, groups, categories,aliases } = req.body||{};

    if (!name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({
        message: "Provider name is required"
      });
    }

    if (phones !== undefined && !Array.isArray(phones)) {
      return res.status(400).json({
        message: "phones must be an array"
      });
    }

    if (groups !== undefined && !Array.isArray(groups)) {
      return res.status(400).json({
        message: "groups must be an array"
      });
    }

    if (categories !== undefined && !Array.isArray(categories)) {
      return res.status(400).json({
        message: "categories must be an array"
      });
    }
    if (aliases !== undefined && !Array.isArray(aliases)) {
  return res.status(400).json({
    message: "aliases must be an array"
  });
}
const providerData = {
  ...req.body,
  name: name.trim()
};

providerData.searchText = generateSearchText(providerData);

const provider = await Provider.create(providerData);

    res.status(201).json(provider);

  } catch (error) {
    next(error);
  }
};
const updateProvider = async (req, res, next) => {
  try {
    const { name, phones, groups, categories,aliases } = req.body || {};

    if (name !== undefined) {
      if (typeof name !== "string" || !name.trim()) {
        return res.status(400).json({
          message: "Provider name cannot be empty"
        });
      }
    }

    if (phones !== undefined && !Array.isArray(phones)) {
      return res.status(400).json({
        message: "phones must be an array"
      });
    }

    if (groups !== undefined && !Array.isArray(groups)) {
      return res.status(400).json({
        message: "groups must be an array"
      });
    }

    if (categories !== undefined && !Array.isArray(categories)) {
      return res.status(400).json({
        message: "categories must be an array"
      });
    }
    if (aliases !== undefined && !Array.isArray(aliases)) {
  return res.status(400).json({
    message: "aliases must be an array"
  });
}

    // Get current provider first
    const existingProvider = await Provider.findById(req.params.id);

    if (!existingProvider) {
      return res.status(404).json({
        message: "Provider not found"
      });
    }

    // Data that will actually be updated
    const updateData = {
      ...req.body
    };

    if (name !== undefined) {
      updateData.name = name.trim();
    }

    // Build searchText using new values when provided,
    const searchData = {
      name: updateData.name ?? existingProvider.name,
      phones: updateData.phones ?? existingProvider.phones,
      groups: updateData.groups ?? existingProvider.groups,
      categories: updateData.categories ?? existingProvider.categories,
      description: updateData.description ?? existingProvider.description,
      area: updateData.area ?? existingProvider.area,
      aliases: updateData.aliases ?? existingProvider.aliases
    };

    updateData.searchText = generateSearchText(searchData);

    const provider = await Provider.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json(provider);

  } catch (error) {
    next(error);
  }
};
const deleteProvider = async (req, res, next) => {
  try {
    const provider = await Provider.findByIdAndDelete(
      req.params.id
    );

    if (!provider) {
      return res.status(404).json({
        message: "Provider not found"
      });
    }

    res.status(200).json({
      message: "Provider deleted successfully",
      provider
    });

  } catch (error) {
    next(error);
  }
};


module.exports = {
  getProviders,
  getProviderById,
  createProvider,
  updateProvider,
  deleteProvider
};