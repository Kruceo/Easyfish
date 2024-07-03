import { AxiosResponse } from "axios"
import { BackendResponse, api_address, api_port, api_protocol, api_v, backendAxios } from "./backend"

interface BackendPostResponse {
    data?: allTableTypes | allTableTypes[],
    error?: boolean,
    message?: string
}

async function create(tables: "bote",           data: any ): Promise<AxiosResponse<BackendResponse<boteProps>>>
async function create(tables: "transacao",      data: any ): Promise<AxiosResponse<BackendResponse<transacaoProps>>>
async function create(tables: "transacao_item", data: any ): Promise<AxiosResponse<BackendResponse<transacaoitemProps>>>
async function create(tables: "produto",        data: any ): Promise<AxiosResponse<BackendResponse<produtoProps>>>
async function create(tables: "usuario",        data: any ): Promise<AxiosResponse<BackendResponse<usuarioProps>>>
async function create(tables: "fornecedor",     data: any ): Promise<AxiosResponse<BackendResponse<fornecedorProps>>>

async function create(tables: string, data: any): Promise<AxiosResponse<BackendPostResponse>> {
    const full_address = `${api_protocol}://${api_address}:${api_port}/${api_v}/${tables}`
    try {
        const response = await backendAxios().post(full_address, data)
        return response
    } catch (error: any) {
        return error.response
    }
}

async function bulkCreate(tables: "bote", data: boteProps[]): Promise<AxiosResponse<BackendResponse<boteProps[]>>>
async function bulkCreate(tables: "transacao", data: transacaoProps[]): Promise<AxiosResponse<BackendResponse<transacaoProps[]>>>
async function bulkCreate(tables: "transacao_item", data: transacaoitemProps[]): Promise<AxiosResponse<BackendResponse<transacaoitemProps[]>>>
async function bulkCreate(tables: "produto", data: produtoProps[]): Promise<AxiosResponse<BackendResponse<produtoProps[]>>>
async function bulkCreate(tables: "usuario", data: usuarioProps[]): Promise<AxiosResponse<BackendResponse<usuarioProps[]>>>
async function bulkCreate(tables: "fornecedor", data: fornecedorProps[]): Promise<AxiosResponse<BackendResponse<fornecedorProps[]>>>

async function bulkCreate(tables: string, data: any[]): Promise<AxiosResponse<BackendPostResponse>> {
    const full_address = `${api_protocol}://${api_address}:${api_port}/${api_v}/${tables}/bulk`
    try {
        const response = await backendAxios().post(full_address, data)
        return response
    } catch (error: any) {
        return error.response
    }
}

export { create,bulkCreate }