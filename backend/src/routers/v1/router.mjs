import { Router } from "express";
import postRequestHandler from "./post.mjs";
import deleteRequestHandler from "./delete.mjs";
import putRequestHandler from "./put.mjs";
import getRequestHandler from "./get.mjs";
import bulkPutRequestHandler from "./bulkPut.mjs";
import bulkPostRequestHandler from "./bulkPost.mjs";
import bulkDeleteRequestHandler from "./bulkDelete.mjs";

/**
 * @type {Router}
 */
const universalRouter = new Router()

/**
 * 
 * @param {*} req 
 * @param {Response} res 
 * @param {*} next 
 */
const databaseProtectionMiddleware = (req, res, next) => {
    console.log("[V1]",req.method.padEnd(7, ' ') + req.originalUrl.padEnd(20, ' '), req.body)
    // const path = req.originalUrl.includes("usuario")
    // if (path)
    //     return res.status(statusCodes.NotImplemented).json({
    //         error: true,
    //         message: "Essa rota não é permitida"
    //     })
    next()
}

universalRouter.use(databaseProtectionMiddleware)

universalRouter.get(`/:table`, getRequestHandler)

universalRouter.post(`/:table/bulk`,bulkPostRequestHandler)
universalRouter.post(`/:table`, postRequestHandler)

universalRouter.delete(`/:table/bulk`, bulkDeleteRequestHandler)
universalRouter.delete(`/:table/:id`, deleteRequestHandler)

universalRouter.put(`/:table/bulk`, bulkPutRequestHandler)
universalRouter.put(`/:table/:id`, putRequestHandler)

export default universalRouter