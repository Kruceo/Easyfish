import jsPDF from "jspdf";
import backend from "../../../../constants/backend/backend";
import { openPDF, writeHeader, writeTable } from "./libraryReports";
import { getSigles } from "../../../../constants/stringUtils";

export async function boatEntryComparation(d1: Date, d2: Date, status: number) {

    const resTransactionItens = await backend.get("transacao_item", {
        include: "transacao[]{bote[]{fornecedor[]}},produto[]",
        group: "bote_nome,produto.nome,transacao.tipo",
        attributes: "(concat)transacao.bote.fornecedor.nome+\"-\"+transacao.bote.nome,produto.nome,(sum)valor_total,transacao.tipo",
        "transacao.createdAt":">"+d1.toISOString()+",<"+d2.toISOString(),
        "transacao.status": status,
        order:"bote_nome,ASC"
    })

    if (resTransactionItens.data.error || !resTransactionItens.data.data) return console.error(resTransactionItens.data.message)

    const data = resTransactionItens.data.data as unknown as { bote_nome: string, produto_nome: string, valor_total: number, transacao_tipo: boolean }[]
    const initProducts = {
        ...data.reduce((acum, next) => {
            if (!next.transacao_tipo) {
                acum[next.produto_nome] = 0
            }
            return acum
        }, {} as any),
        Subtotal: 0,
        ...data.reduce((acum, next) => {
            if (next.transacao_tipo) {
                acum[next.produto_nome] = 0
            }
            return acum
        }, {} as any),
        Total: 0
    }
    const totals: any = { ...initProducts }
    const reduced = data.reduce((acum, next) => {
        if (!acum[next.bote_nome]) acum[next.bote_nome] = { ...initProducts }
        acum[next.bote_nome][next.produto_nome] = next.valor_total

        if (next.transacao_tipo === false) {
            acum[next.bote_nome]["Subtotal"] += next.valor_total
            acum[next.bote_nome]["Total"] += next.valor_total
            totals["Subtotal"] += next.valor_total
            totals["Total"] += next.valor_total
        }
        else {
            acum[next.bote_nome]["Total"] -= next.valor_total
            totals["Total"] -= next.valor_total
        }

        totals[next.produto_nome] += next.valor_total
       
        return acum
    }, {} as any)

    const table = Object.entries(reduced).map((each: [string, unknown]) => {
        return [each[0], ...Object.values(each[1] as Object)]
    })

    const totalsTable: (number | string)[] = ["Total", ...Object.values(totals) as number[]]

    const pdf = new jsPDF({orientation:"landscape"})
    
    const productsKeys = Object.keys(initProducts)
    const styleDisposition = ["bold"]
    
    styleDisposition[productsKeys.indexOf("Subtotal") + 1] = "bold"
    styleDisposition[productsKeys.length] = "bold"

    let lastTable = writeHeader(pdf,"",d1,d2)
    let fontSize = 18.5 - productsKeys.length
    if(fontSize < 5) fontSize = 5
    pdf.setFontSize(fontSize)
    const header = ["Botes", ...getSigles(productsKeys)]
    
    lastTable = writeTable(pdf, table, lastTable.x,lastTable.y2+6,header , [4], styleDisposition)
    
    lastTable = writeTable(pdf,[], lastTable.x, lastTable.y2+6, totalsTable as string[], [4], styleDisposition)

    openPDF(pdf)
}

