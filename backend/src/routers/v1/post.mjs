import tables from "../../database/tables.mjs";
import statusCodes from "../../utils/statusCode.mjs";
import { upperCaseLetter } from "../../utils/stringUtils.mjs";
import { getOnlyNecessaryAttributes } from "../../utils/tableUtils.mjs";

const blockedTables = ["usuario"]

/**
 * V1 request handler to be used in Routers 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @returns 
 */
export default async function postRequestHandler(req, res) {
    if (blockedTables.includes(req.params.table.toLowerCase())) {
        res.status(statusCodes.ServiceUnavailable).json({
            error: true,
            message: "Caminho bloqueado."
        })
    }
    const tableName = upperCaseLetter(req.params.table, 0)
    let body = req.body

    //get the auth provided user, and put to body (/src/security/authentication.mjs ~ authMiddleware)
    body.usuario_id = req.auth.user.id

    const table = tables[tableName]
    if (!table) return;
    const tableNecessaryAttributes = getOnlyNecessaryAttributes(table)

    if (!Array.isArray(body)) {
        body = [req.body]
    }

    //Check the attributes
    for (const item of body) {
        if (!checkAttributes(item, tableNecessaryAttributes))
            return res.status(statusCodes.BadRequest)
                .json({
                    error: true, message: "Existem campos não preenchidos."
                })
    }

    //Wipe the attributes that can't appears in table 

    for (let i = 0; i < body.length; i++) {
        body[i] = wipeNoTableAttributes(body[i], table)
    }

    try {
        if (body.length === 1) {
            const data = await table.create(body[0])
            res.json({ data, message: "O item foi criado com sucesso." })
            return;
        }
        const data = await table.bulkCreate(body)
        res.json({ data, message: "Os itens foram criados com sucesso." })
        return;
    } catch (error) {
        return res.status(statusCodes.InternalServerError)
            .json({ error: true, message: "Houve um erro de SQL: " + error })
    }
}

/**
 * Checks if the item obj provided have all attibutes in the array provided.
 * @param {Object} item 
 * @param {string[]} tableAttributes 
 * @returns {boolean}
 */
function checkAttributes(item, tableAttributes) {
    for (const attr of tableAttributes) {
        if (item[attr] == undefined || item[attr] == null) {
            console.log(attr)
            return false
        }
    }
    return true
}


/**
 * Removes any attribute that not appears in the original Model attributes.
 * @param {Object} item 
 * @param {ModelCtor<Model<any, any>>} table 
 * @returns {Object}
 */
function wipeNoTableAttributes(item, table) {
    const allAttrs = Object.keys(table.getAttributes())
    const newItem = {}
    Object.keys(item).forEach(attr => {
        if (allAttrs.includes(attr)) {
            newItem[attr] = item[attr]
        }
    })
    console.log("new item", newItem)
    return newItem
}

