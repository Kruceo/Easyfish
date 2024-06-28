import { useContext, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom'
import Bar from "../../Layout/Bar";
import Content from "../../Layout/Content";
import SideBar from "../../Layout/SideBar";
import Table, { TableOrderEvent } from "../../table/Table";
import { bDate } from "../../../constants/dateUtils";
import SubTopBar, { ToolBarButton } from "../../Layout/SubTopBar";
import { changeEntryStatus } from "./internal";
import beautyNumber from "../../../constants/numberUtils";
import { GlobalPopupsContext } from "../../GlobalContexts/PopupContext";
import { TableEngineContext } from "../../GlobalContexts/TableEngineContext";
import { TRANSACTION_CLOSED, TRANSACTION_INVALID, TRANSACTION_OPEN } from "../../../constants/codes";
import FilterEntryForm from "./FilterEntryForm";
import SumOfTrans from "./SumOfTrans";
import backend from "../../../constants/backend/backend";


export default function ViewEntry() {

    const { simpleSpawnInfo, setGlobalPopupByKey } = useContext(GlobalPopupsContext)
    const { defaultDataGet } = useContext(TableEngineContext)
    const navigate = useNavigate()

    const [data, setData] = useState<transacaoProps[]>([]);
    const [selected, setSelected] = useState<number[]>([])
    const [update, setUpdate] = useState(true)
    const blockedWhere = { include: "bote{fornecedor},usuario", limit: 1000 }
    const [where, setWhere] = useState<any>({ ...blockedWhere, status: TRANSACTION_OPEN, order: "updatedAt,DESC" })

    const [loadingData, setLoadingData] = useState(false)

    const setWhereKey = (key: string, value: string) => {
        const mockup = { ...where }
        mockup[key] = value
        setWhere(mockup)
    }

    const table_to_manage = "transacao"
    useEffect(() => {
        setLoadingData(true)
        defaultDataGet(table_to_manage, where, setData).then(() => setLoadingData(false))
        // window.addEventListener("scrollend", () => {
            // if (window.scrollY + window.innerHeight > document.body.scrollHeight) {
                // const limit = parseInt(where.limit) + 100
                // setWhereKey("limit", limit.toString())
            // }
        // })
    }, [update, where])

    // Quando é alterado a ordem
    const orderHandler = (e: TableOrderEvent) => {
        setWhereKey("order", `${e.key},${e.order.toUpperCase()}`)
        setUpdate(!update)
    }

    // Quando é clicado no botão "deletar"
    const invalidEntries = (id: number) => {
        const onAcceptHandler = async () => {
            await changeEntryStatus(id, TRANSACTION_INVALID)
            setTimeout(() => {
                setUpdate(!update)
            }, 150)
        }
        simpleSpawnInfo(`Deseja mesmo invalidar este item?`, onAcceptHandler, () => null)
    }

    // Quando é clicado no botão "Fechamento"
    const closeHandler = () => {
        simpleSpawnInfo("Tem certeza que deseja continuar?", async () => {
            setLoadingData(true)
            await backend.bulkEdit("transacao", selected.map(id => {
                return { id: id, status: TRANSACTION_CLOSED } as transacaoProps
            }))
            setLoadingData(false)
            setSelected([])
            setUpdate(!update)
        }, () => null)
    }


    const tableContextMenuButtons = [
        { element: <><i>&#xe922;</i>Detalhes</>, handler: (id: number) => navigate(`/details/transacao?id=${id}`) },
        { element: <><i>&#xe955;</i>Editar</>, handler: (id: number) => navigate(`/edit/transacao?id=${id}`) },
        { element: <><i>&#xe954;</i>Imprimir</>, handler: (id: number) => navigate(`/print/transacao?id=${id}`) },
        { element: <><i>&#xe9ac;</i>Invalidar</>, handler: invalidEntries }
    ]

    return <>
        <Bar />
        <SideBar />
        <Content includeSubTopBar>
            <SubTopBar leftContent={<>
                <ToolBarButton onClick={() => setGlobalPopupByKey("TransactionFilter",
                    <FilterEntryForm whereSetter={(w) => { setWhere({ ...blockedWhere, ...w }); setSelected([]) }} onCancel={() => setGlobalPopupByKey("TransactionFilter", null)} />
                )}><i title="filtros">&#xe993;</i></ToolBarButton>
                <p>Total: <SumOfTrans where={where} update={update} /></p>
            </>}>
                <ToolBarButton onClick={() => {
                    if (selected.length > 0) setSelected([])
                    else setSelected(data.map(each => each.id ?? -1))
                }}><i>&#xe997;</i> Selecionar Todos</ToolBarButton>
                <ToolBarButton enabled={selected.length > 0} onClick={closeHandler} title={selected.length<1?"Selecione algum item":undefined}>
                    <i>&#xe95e;</i> Fechamento</ToolBarButton>
            </SubTopBar>
            <div className="w-full h-full">
                <Table
                    loading={loadingData}
                    selected={selected}
                    selectedSetter={setSelected}
                    onOrderChange={orderHandler}
                    data={data}
                    disposition={[0.4, 1.5, 1.5, 1, 1, 1, 0.4]}
                    tableItemHandler={(item: typeof data[0]) => [
                        <div>{item.id}</div>,
                        <div>{item.bote?.nome}</div>,
                        <div>{item.bote?.fornecedor?.nome}</div>,
                        <div className="text-right">{beautyNumber(item.peso)}</div>,
                        <div className="text-right">{beautyNumber(item.valor)} </div>,
                        <div>{bDate(item.createdAt)}</div>,
                        <div className="text-right">{item.tipo ? <i title="Saída" className="text-red-600">&#xea3f;</i> : <i title="Entrada" className="text-green-600">&#xea3b;</i>}</div>
                    ]}
                    tableOrderKeys={["id", ["Bote", "nome"], ["Bote", "Fornecedor", "nome"], "peso", "valor", "createdAt", "tipo"]}
                    tableHeader={[
                        "ID", "Bote", "Fornecedor", "Peso (KG)", "Valor", "Data", "Tipo"
                    ]}
                    contextMenu={{ buttons: tableContextMenuButtons }}
                />  
            </div>
        </Content>
    </>
}