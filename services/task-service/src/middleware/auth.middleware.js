import jwt from 'jsonwebtoken';

const authMiddleware = (req,res,next) =>{
    const token = req.header('x-auth-token');
    if(!token){
        return res.status(401).json({
            msg: 'No token, authorization denied'
        });
    }
    try {
        const decode = jwt.verify(token,process.env.JWT_SECRET);
        req.user = decode.user;
        next();
    } catch (error) {
        res.status(401).json({
            msg:'Token is invalid'
        });
    }
};

export default authMiddleware;