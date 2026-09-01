const searchProvider= async(req ,res ,next)=>{
    try {   
        const {search,group, category, page, limit}=req.query;
        
    }catch(err){
        return res.status(405).json({message:message.err})
    }
}