export const authorizeRoles = (...roles) =>{
    return (req, res, next)=>{
        console.log(req.user.role);
        console.log(roles);
        if(!roles.includes(req.user.role)){
            return res.status(403).json({success: false, message: "Unauthorized access"});
        }
        next();
    }
}