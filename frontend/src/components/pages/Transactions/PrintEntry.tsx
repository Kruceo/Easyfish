import { useEffect } from "react";
import backend from "../../../constants/backend/backend";
import Bar from "../../Layout/Bar";
import Content from "../../Layout/Content";
import SideBar from "../../Layout/SideBar";
import thermalPrinter from "../../../constants/thermalPrinter";
import Button from "../../Layout/Button";
import beautyNumber from "../../../constants/numberUtils";
import { getSigles } from "../../../constants/stringUtils";
import { Link } from "react-router-dom";

export default function PrintEntry() {
    const url = new URL(window.location.href)
    const id = url.search.replace("?", "").split('=')[1]

    if (!id) return "Essa página funciona com a referência de um ID. (?id=10)"
    localStorage.removeItem('printerSessionLocker')
    useEffect(() => {
        printSingleEntry(id)
    }, [])

    return <>
        <Bar />
        <SideBar />
        <Content>
            <div className="p-4">
                <h2 className="my-4">Impressão de transação</h2>
                <div className="flex">
                    <Button autoFocus onClick={() => printSingleEntry(id)}><i>&#xe954;</i> Imprimir Cupom </Button>

                    <Link to={"/create/entrada"} className="ml-auto mr-4">
                        <Button >
                            <i>&#xea3b;</i> Ir para Nova Entrada
                        </Button>
                    </Link>
                    <Link to={"/create/saida"}>
                        <Button onClick={() => printSingleEntry(id)}>
                            <i>&#xea3d;</i> Ir para Nova Saída
                        </Button>
                    </Link>
                </div>
            </div>
        </Content >
    </>
}



export async function printSingleEntry(id: number | string) {

    if (localStorage.getItem("printerSessionLocker")) return
    localStorage.setItem("printerSessionLocker", "true")
    const width: number = (await thermalPrinter.getWidth()).data.width
    const chunkSize = width / 4
    const d = await backend.get('transacao', { include: "bote{fornecedor},transacao_item{produto[nome]}", id })
    if (d.data.error || !d.data.data || !Array.isArray(d.data.data)) return console.error(d.data.message);

    const queries: string[][] = []
    const item: transacaoProps = d.data.data[0]
    const itemDate = new Date(item.createdAt)
    const itemDateString = itemDate.toLocaleDateString() + ' ' + itemDate.toLocaleTimeString()

    queries.push(['println', `Transacao ${item.id}`.padEnd(chunkSize * 4 - itemDateString.length) + itemDateString])
    queries.push(['left'])
    queries.push(['println', '-'.repeat(width)])

    queries.push(['println', `Tipo: ${!item.tipo ? "Entrada" : "Saída"}`])
    queries.push(['println', `Nome: ${item.bote?.fornecedor?.nome}`])
    queries.push(['println', `Bote: ${item.bote?.nome}`])

    queries.push(['println', ""])
    queries.push(['println', ""])

    queries.push(['println', `${"Produto".padEnd(chunkSize, ' ')} ${"Peso".padStart(chunkSize - 1, " ")} ${"Preço".padStart(chunkSize - 1, " ")} ${"Total".padStart(chunkSize - 1, " ")}`])
    queries.push(['println', '-'.repeat(width)])

    item.transacao_itens?.forEach(each => {
        const { produto, preco, peso, valor_total } = each

        queries.push([
            'println',
            `\
${getSigles(produto?.nome?.toString() ?? "Não Definido").toString().padEnd(chunkSize, ' ')} \
${beautyNumber(peso ?? -1).toString().padStart(chunkSize - 1, ' ')} \
${beautyNumber(preco ?? -1).toString().padStart(chunkSize - 1, ' ')} \
${beautyNumber(valor_total ?? -1).toString().padStart(chunkSize - 1, ' ')}`
        ])
    })
    queries.push(['println', '-'.repeat(width)])
    queries.push(['println', ''])
    queries.push(['println', `${" ".repeat(chunkSize * 2)}Peso: ` + (beautyNumber(item.peso ?? -1).padStart(chunkSize * 2 - 6, ' '))])
    queries.push(['println', `${" ".repeat(chunkSize * 2)}Valor: ` + (beautyNumber(item.valor ?? -1).padStart(chunkSize * 2 - 7, ' '))])

    queries.push(['println', ""])
    queries.push(['println', ""])
    queries.push(['println', ""])
    queries.push(['println', ""])
    queries.push(['center', ""])
    queries.push(['println', "Visto:" + "_".repeat(chunkSize * 3 - 1)])


    queries.push(['cut'])
    // setQ(queries)
    thermalPrinter.print(queries)
    localStorage.removeItem("printerSessionLocker")

}
