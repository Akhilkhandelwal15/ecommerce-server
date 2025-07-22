import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next)=>{
    try{
        const token = req.cookies.token;
        if(!token){
            return res.status(401).json({success: false, message:"Unauthorized"});
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("token verified");
        req.user = decoded;
        next();
    }
    catch(error){
        console.log("error", error);
        res.status(403).json({success: false, message: "Internal Server Error"});
    }
}