import bcrypt from  "bcryptjs";
import { error } from "console";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET
const TOKEN_EXPIRY = process.env.TOKEN_SECRET 

export class AuthService{
    constructor(userStore){
        this.userStore = userStore;
    }
    async registerUser(username,password){
        const existingUser = await this.userStore.getUser(username);
        if (existingUser) throw new Error("User Already Exists");

        const salt = await bcrypt.genSalt(10);
        const hashedPassword =  await bcrypt.hash(password,salt);

        await this.userStore.saveuser({username,password:hashedPassword});
        return {"message":"User Successfully Registered"};

    }

    async loginUser(username,password){
        const user = await this.userStore.getUser(username);
        if (!user) throw new Error("Username does not exist. Please register user or check Username.");


        const matchPwd = await bcrypt.compare(password,user.password);
        if (!matchPwd) throw new Error("Password Incorrect.");

        const token = jwt.sign({username},JWT_SECRET,{expiresIn:TOKEN_EXPIRY});
        return {token};
            
    }

    authenticateToken(req,res,next){
        const authHeader =  req.headers['authorization'];
        const token = authHeader && authHeader.split(" ")[1];
        if (!token) return res.status(401).json({error:"Token missing"});
        
        jwt.verify(token,JWT_SECRET,(err,user)=>{
            if (err) return res.status(403).json({error:'Invalid Token'});
            req.user = user;
            next();
        });
    }
}
