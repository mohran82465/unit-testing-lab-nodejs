const jwt=require('jsonwebtoken')
 var {promisify} =require('util')

//authentication
async function auth(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(401).json({ message: "you don't have persmission , please login first" })
    }

    try{
        var decoded = await promisify(jwt.verify)(req.headers.authorization,process.env.SECRET)
        req.id=decoded.id
    
    }catch(err){

       return res.status(401).json({message:"sory i can't know you who are you "})
    }
 
    next()
}

module.exports = auth