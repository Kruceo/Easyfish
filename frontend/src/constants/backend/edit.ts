import { AxiosResponse } from "axios"
import { BackendResponse, api_protocol, api_address, api_port, api_v, backendAxios } from "./backend"

async function edit(tables: "bote",           where: number, content: Partial<boteProps>): Promise<AxiosResponse<BackendResponse<undefined>>>
async function edit(tables: "transacao",      where: number, content: Partial<transacaoProps>): Promise<AxiosResponse<BackendResponse<undefined>>>
async function edit(tables: "transacao_item", where: number, content: Partial<transacaoitemProps>): Promise<AxiosResponse<BackendResponse<undefined>>>
async function edit(tables: "produto",        where: number, content: Partial<produtoProps>): Promise<AxiosResponse<BackendResponse<undefined>>>
async function edit(tables: "usuario",        where: number, content: Partial<usuarioProps>): Promise<AxiosResponse<BackendResponse<undefined>>>
async function edit(tables: "fornecedor",     where: number, content: Partial<fornecedorProps>): Promise<AxiosResponse<BackendResponse<undefined>>>

async function edit(tables: allTableNames, id: number, content: Partial<allTableTypes>): Promise<AxiosResponse<BackendResponse<undefined>>> {
    const full_address = `${api_protocol}://${api_address}:${api_port}/${api_v}/${tables}/${id}`

    try {
        const response = await backendAxios().put(full_address, content)
        return response
    } catch (error: any) {
        return error.response
    }

}

async function bulkEdit(tables: "bote", data: boteProps[]): Promise<AxiosResponse<BackendResponse<boteProps[]>>>
async function bulkEdit(tables: "transacao", data: transacaoProps[]): Promise<AxiosResponse<BackendResponse<transacaoProps[]>>>
async function bulkEdit(tables: "transacao_item", data: transacaoitemProps[]): Promise<AxiosResponse<BackendResponse<transacaoitemProps[]>>>
async function bulkEdit(tables: "produto", data: produtoProps[]): Promise<AxiosResponse<BackendResponse<produtoProps[]>>>
async function bulkEdit(tables: "usuario", data: usuarioProps[]): Promise<AxiosResponse<BackendResponse<usuarioProps[]>>>
async function bulkEdit(tables: "fornecedor", data: fornecedorProps[]): Promise<AxiosResponse<BackendResponse<fornecedorProps[]>>>

async function bulkEdit(tables: string, data: any[]): Promise<AxiosResponse<BackendResponse<any>>> {
    const full_address = `${api_protocol}://${api_address}:${api_port}/${api_v}/${tables}/bulk`
    try {
        const response = await backendAxios().put(full_address, data)
        return response
    } catch (error: any) {
        return error.response
    }
}

export { edit,bulkEdit }