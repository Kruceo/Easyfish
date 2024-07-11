import { Router } from "express";
import statusCodes from "../../utils/statusCode.mjs";
import { authenticateToken, authenticateUser } from "../../security/authentication.mjs";

/**
 * @type {Router}
 */
const authRouter = new Router()

let hosts = new Map()

authRouter.post("/auth/login", async (req, res) => {

    const hostValue = hosts.get(req.hostname)

    if (!hostValue) hosts.set(req.hostname, new Date().getTime() + 500 + ',1')

    else {
        let [hostTime, lvl] = hostValue.split(",").map(each => parseInt(each))
        const today = new Date()
        const hostDate = new Date(hostTime)

        if (today.getTime() < hostDate.getTime()) {
            const newLvl = lvl < 120 ? lvl + 1 : lvl
            hosts.set(req.hostname, hostDate.getTime() + (200 * newLvl) + "," + (newLvl))
            return res.status(statusCodes.Unauthorized).json({ error: true, message: "Endereço bloqueado." });
        }
        hosts.delete(req.hostname)
    }

    const { user, password } = req.body
    if (!user || !password) return res.status(statusCodes.BadRequest)
        .json({ error: true, message: "Falta de informação na requisição." })

    const token = await authenticateUser(user, password)
    if (!token) return res.status(statusCodes.Unauthorized)
        .json({ error: true, message: "Usuário ou senha inválido." })

    res.json(token)
    console.log("[AUTH]",user,"authenticated")
})

authRouter.get("/auth/validate", async (req, res) => {

    const token = req.headers.authorization
    if (!token) return res.status(statusCodes.Unauthorized)
        .json({ error: true, message: "Sem as credenciais necessárias." })

    const resolvedToken = await authenticateToken(token.replace("bearer ", ""))

    if (!resolvedToken) return res.status(statusCodes.Unauthorized)
        .json({ error: true, message: "Autenticação inválida." })

    res.json(resolvedToken)
})

export default authRouter