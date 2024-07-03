import { AxiosResponse } from "axios"
import { api_protocol, api_address, api_port, api_v, backendAxios, BackendResponse } from "./backend"

async function get(tables: allTableNames,    where: any): Promise<AxiosResponse<BackendResponse<any[]>>>
async function get(tables: "bote",           where: any): Promise<AxiosResponse<BackendResponse<boteProps[]>>>
async function get(tables: "transacao",      where: any): Promise<AxiosResponse<BackendResponse<transacaoProps[]>>>
async function get(tables: "transacao_item", where: any): Promise<AxiosResponse<BackendResponse<transacaoitemProps[]>>>
async function get(tables: "produto",        where: any): Promise<AxiosResponse<BackendResponse<produtoProps[]>>>
async function get(tables: "usuario",        where: any): Promise<AxiosResponse<BackendResponse<usuarioProps[]>>>
async function get(tables: "fornecedor",     where: any): Promise<AxiosResponse<BackendResponse<fornecedorProps[]>>>

async function get(tables: allTableNames,
    where: any): Promise<AxiosResponse<BackendResponse<any[]>>> {

    const whereClause = { ...where }

    const full_address = `${api_protocol}://${api_address}:${api_port}/${api_v}/${tables}?${obj2URLQuery(whereClause)}`
    try {
        const response = await backendAxios().get(full_address)

        return response
    }

    catch (error: any) {
        return error.response
    }

}


function obj2URLQuery(obj: Object) {
    let query = ''

    Object.entries(obj).forEach(each => {
        if (each[1] != undefined)
            query += `${each[0]}=${each[1]}&`
    })
    return query.slice(0, query.length - 1)
}

export { get }