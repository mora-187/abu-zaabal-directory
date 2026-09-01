const Provider=require("../models/Provider.js");
const searchProvider= async(req ,res ,next)=>{
    try {   
        const {search,group, category, page, limit}=req.query;
        const _page= Math.max(parseInt(page,10)||1)
        const _limit=Math.max(parseInt(limit,10)||15)
        const skip=(_page-1)*_limit;
        const results=await Provider.find({
            $or:[
                {searchText:search},
                {groups:group},
                {categories:category}
            ]
        }).sort({createdAt:-1}).skip(skip).limit(_limit);
        const totalDoc=await Provider.countDocuments();
        const pages = Math.ceil(totalDoc / _limit);
        return res.status(200).json({results,total:totalDoc,page:_page,pages,limit:_limit})
    }catch(err){
        return res.status(405).json({message:message.err})
    }
}
module.exports= searchProvider;