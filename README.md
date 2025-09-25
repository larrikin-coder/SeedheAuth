# Installation Process

- Seedhe Installation 
```bash
npm i seedhe-auth
```
- Configs for .env file
```env
PORT=5000 # your server port
# Generate your JWT secret
JWT_SECRET=ddeb598b6e1777a8840ff5f4cbace542cf88001dacbe0a669f9e8ad5f63ebb099536f3092b659d8227c3aa82147a366858e1b5ba5ec03b61aed1b587c247224a

DB_TYPE:"mongo"||"postgres" # default : "memory"

MONGO_URI=mongodb:your_mongo_db_url
POSTGRES_URI=postgresql:your_postgresql_db_url


GOOGLE_CLIENT_ID=google client id
GOOGLE_CLIENT_SECRET=google client secret
GOOGLE_CALLBACK_URL=callback url for google

GITHUB_CLIENT_ID=your_github_client_id_here
GITHUB_CLIENT_SECRET=your_github_client_secret_here
GITHUB_CALLBACK_URL= call back url for github

```


- Add following script in your server.js 
```js
import {initAuth} from "seedhe-auth";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";

const app = next({ dev });
const handle = app.getRequestHandler();

async function start(){
    await app.prepare();
    const server = express();

    server.use(express.json());
    server.use(cookieParser());

    const {authService,authRoutes} = await initAuth();
    server.use("/auth",authRoutes);

    server.get("/api/secret",(req,res)=>{
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({message:"Not Logged In"});
        }

        try{
            const decoded = jwt.verify(token,process.env.JWT_SECRET);
            res.json({
                id: decoded.id,
                provider: decoded.provider,
                name: decoded.name,
                email: decoded.photo,
                message: "JWT Decoded Successful"
            });
        }catch(err){
            console.log("error:",err.message);
            return res.status(403).json(message:"Unauthorized");
        }
    });
}
```
