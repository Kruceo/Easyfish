import axios from "axios"
import { get } from './get'
import { create, bulkCreate } from "./create"
import { edit, bulkEdit } from "./edit"
import { remove, bulkRemove } from "./remove"
import config from "../../../config.json" assert {type: "json"}

export const api_address = config.api_address
export const api_protocol = config.api_protocol
export const api_port = config.api_port
export const api_v = "v1"

let _backendAxiosCached = axios.create({ withCredentials: true, headers: { Authorization: `bearer ${window.localStorage.getItem("auth-token")}` } })

export const backendAxios = () => {
    const currentLoadedToken = window.localStorage.getItem("auth-token")
    const currentAuthorizationHeader = _backendAxiosCached.defaults.headers.Authorization?.toString() ?? ""
    if (!currentLoadedToken || !currentAuthorizationHeader.includes(currentLoadedToken)) {
        console.warn("Mudando backend Axios automaticamente, o token de autorização mudou!")
        _backendAxiosCached = axios.create({ withCredentials: true, headers: { Authorization: `bearer ${window.localStorage.getItem("auth-token")}` } })
    }

    return _backendAxiosCached
}

interface BackendResponse<T> {
    error?: boolean,
    message?: string
    data?: T
}

function filterUsingID(data: allTableTypes[], id: number) {
    const result = data.filter(each => { if (each.id == id) return each })
    return result[0]
}

function removeAttributeFromAll<T>(data: T[], attribute: string): Partial<T>[] {
    const newData = data.map(each => {
        const item: any = { ...each }
        delete item[attribute]
        return item
    })
    return newData
}

async function login(user: string, password: string) {
    const full_address = `${api_protocol}://${api_address}:${api_port}/auth/login`
    try {
        const response = await axios.post(full_address, { user, password })
        return response.data
    } catch (error: any) {
        return error.response.data
    }
}

const auth = {
    login
}

const utils = {
    filterUsingID,
    removeAttributeFromAll
}

export { get, create, bulkCreate, bulkEdit, remove, bulkRemove, edit, utils, auth }
export default { get, bulkCreate, bulkEdit, create, bulkRemove, remove, edit, utils, auth }

export type { BackendResponse }
