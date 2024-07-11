import jsPDF from "jspdf";
import { openPDF, writeHeader, writeTable } from "./libraryReports";
import backend from "../../../../constants/backend/backend";
import beautyNumber from "../../../../constants/numberUtils";
export default async function monthTransComparation(date1: Date, date2: Date, status: number) {
    const pdf = new jsPDF()

    const res = await backend.get('transacao', {
        attributes: "(max)createdAt,(month)createdAt,(year)createdAt,tipo,(sum)peso,(sum)valor",
        group: "createdAt_month,createdAt_year,tipo",
        order: "createdAt,ASC",
        status: status,
        createdAt: ">" + date1.toISOString() + ',<' + date2.toISOString(),
    })

    if (res.data.error || !res.data.data || !Array.isArray(res.data.data)) return alert('error 001');

    let f: any = {}

    res.data.data.forEach((each: any) => {
        const { createdAt_month, createdAt_year, tipo, peso, valor } = each
        const junction = `${createdAt_month}/${createdAt_year}`.padStart(7, '0')

        if (!f[junction]) f[junction] = { peso: 0,valor: 0 }

        if (tipo == 1) {
            f[junction].valor -= valor
        } else {
            f[junction].valor += valor
            f[junction].peso += peso
        }
    })

    const table = Object.entries(f).map(each => [each[0], ...Object.values(each[1] as any)])
    console.log(table)
    let lastBoundingBox = writeHeader(pdf, new Date().toLocaleDateString().slice(0, 5), date1, date2)
    pdf.setFontSize(12)
    lastBoundingBox = writeTable(pdf, table as any, lastBoundingBox.x, lastBoundingBox.y2 + 7, ["Mês/Ano", "Peso", "Valor"], [1, 3, 3])

    let all_weight = 0
    let all_value = 0
    table.forEach(each => {
        all_weight += each[1] as number
        all_value += each[2] as number
    })

    writeTable(pdf, [], lastBoundingBox.x, lastBoundingBox.y2 + 7, ["-", beautyNumber(all_weight), beautyNumber(all_value)],[1,3,3])

    openPDF(pdf)
}
