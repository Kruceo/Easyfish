import { useContext, useEffect, useState } from "react";
import Bar from "../../Bar";
import Content from "../../Content";
import SideBar from "../../SideBar";
import backend, { BackendTableComp } from "../../../constants/backend";
import CreationForm from "./FormProdutos";
import { globalPopupsContext } from "../../../App";
import { simpleSpawnInfo } from "../../OverPageInfo";
import Table, { TableOrderEvent } from "../../table/Table";
import { bDate } from "../../../constants/dateUtils";
import TableToolBar from "../../table/TableToolBar";

export default function ViewProdutos() {

    const { setGlobalPupupsByKey } = useContext(globalPopupsContext)
    const [data, setData] = useState<BackendTableComp[]>([]);
    const [update, setUpdate] = useState(true)
    const [selected, setSelected] = useState<number[]>([])
    const [where, setWhere] = useState<any>({})

    const setWhereKey = (key: string, value: string) => {
        const mockup = { ...where }
        mockup[key] = value
        setWhere(mockup)
    }

    const table_to_manage = "produto"

    const data_getter = async () => await backend.get(table_to_manage, where)

    useEffect(() => {
        (async () => {
            const d = await data_getter()
            if (!d.data) return;
            setData(d.data)
        })()
    }, [update])


    // Quando é alterado a ordem
    const orderHandler = (e: TableOrderEvent) => {
        setWhereKey("order", `${e.key},${e.order.toUpperCase()}`)
        setUpdate(!update)
    }

    // Quando é clicado no botão "pesquisar"
    const searchHandler = (search: string) => {
        setWhereKey("nome", "^" + search)
        setUpdate(!update)
    }

    // Quando é clicado no botão "criar"
    const createHandler = () => {
        setGlobalPupupsByKey(0,
            <CreationForm
                key={"creationForm"}
                mode="creation"
                onCancel={() => setGlobalPupupsByKey(0, null)}
                afterSubmit={() => setUpdate(!update)}
            />
        )
    }

    // Quando é clicado no botão "editar"
    const editHandler = () => {
        const search = backend.utils.filterUsingID(data, selected[0])
        if (!search)
            return simpleSpawnInfo("Não é possivel selecionar o item escolhido.", setGlobalPupupsByKey);

        const { nome, id, preco } = search
        setGlobalPupupsByKey(1,
            <CreationForm
                key={'editingForm'}
                mode="editing"
                defaultValues={{ id, nome, preco }}
                onCancel={() => setGlobalPupupsByKey(1, null)}
                afterSubmit={() => setUpdate(!update)}
            />
        )
    }

    // Quando é clicado no botão "deletar"
    const deleteHandler = () => {
        selected.forEach(async (each, index) => {
            const response = await backend.remove(table_to_manage, each)
            if (response.error)
                simpleSpawnInfo(
                    response.message.includes("violates foreign key constraint")
                        ? "Existem itens no banco de dados que dependem deste."
                        : response.message,
                    setGlobalPupupsByKey)

        })
        setSelected([])
        setTimeout(() => {
            setUpdate(!update)
        }, 500)

    }



    return <>
        <Bar />
        <SideBar />
        <Content>
            <TableToolBar
                selected={selected}
                createHandler={createHandler}
                deleteHandler={deleteHandler}
                editHandler={editHandler}
                searchHandler={searchHandler}
            />
            <div className="w-full h-full mt-[6.5rem]">
                <Table
                    onOrderChange={orderHandler}
                    selected={selected} onSelect={setSelected}
                    data={data}
                    disposition={[1, 6, 4, 4]}
                    tableItemHandler={(item) => [
                        item.id, item.nome, "R$ " + (item.preco ?? 0).toFixed(2), bDate(item.updatedAt)
                    ]}
                    tableHeader={[
                        "ID", "Nome", "Preço", "Ultima Atualização"
                    ]}
                />
            </div>
        </Content>
    </>
}