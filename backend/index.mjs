import express from 'express'
import cfg from "./config/config.json" assert { type: "json" }
import authRouter from './src/routers/auth/loginRouter.mjs'
import { authenticationMiddleware } from './src/security/authentication.mjs'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import universalRouter from './src/routers/v1/router.mjs'

const app = express()

app.use(express.json({ limit: "2mb" }))
app.use(cookieParser())

app.use(cors({
    origin: (origin, callback) => {
        if (cfg.server.cors.sameFromRequest) {
            callback(null, true)
            return
        }
        if (!origin || cfg.server.cors.origin.includes(origin)) {
            callback(null, true)
            return
        }
        callback("", false)
    },
    credentials: cfg.server.cors.credentials
}));

app.use('/v1',
    authenticationMiddleware,
    universalRouter
)
app.use(authRouter)

app.get("/status", (req, res) => {
    res.send("OK")
})



app.listen(cfg.server.port, () => console.log(`Server running in ${cfg.server.port}`))