import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom'
import Bar from "../../Layout/Bar";
import Content from "../../Layout/Content";
import FormInput from "../../OverPageForm/FormInput";
import SideBar from "../../Layout/SideBar";
import backend from "../../../constants/backend/backend";
import { saveEntryStack } from "./internal";
import { GlobalPopupsContext } from "../../GlobalContexts/PopupContext";
import beautyNumber from "../../../constants/numberUtils";
import FormPrevisionInput from "../../OverPageForm/FormPrevisionInput";
import { RequiredLabel } from "../../OverPageForm/OverPageForm";
import Table from "../../table/Table";
import TransitionItemAdder from "./TransitionAdder";
import Button from "../../Layout/Button";
import { SinglePageInputMapContext } from "../../GlobalContexts/SinglePageInputMap";
import HelpButton from "../../Layout/HelpButton";

export default function CreateEntry(props: { type: 0 | 1 }) {

    const navigate = useNavigate()
    const { simpleSpawnInfo } = useContext(GlobalPopupsContext)
    const { setPathKeyHandler } = useContext(SinglePageInputMapContext)
    const [addedTransitionItensData, setAddedTransitionItensData] = useState<transacaoitemProps[]>([])
    const [transitionBoat, setTransitionBoat] = useState<boteProps>()
    const [obs, setObs] = useState("")

    // adiciona um transacao item á lista de adicionados
    const addTransitionItem = (Transação_item: transacaoitemProps) => setAddedTransitionItensData([...addedTransitionItensData, { ...Transação_item, id: addedTransitionItensData.length + 1 }])

    // remove um ou mais transacao item da lista de adicionados
    const removeTransitionItem = (...Transação_item_ids: number[]) => setAddedTransitionItensData(addedTransitionItensData.filter(each => !Transação_item_ids.includes(each.id ?? -1)))

    // soma o valor total de todos os transacao itens 
    const sumValor = () => {
        return addedTransitionItensData.reduce((acum, next) => {
            return acum + (next.valor_total ?? 0)
        }, 0)
    }
    // soma o peso de todos os transacao itens 
    const sumPeso = () => addedTransitionItensData.reduce((acum, next) => {
        return acum + (next.peso ?? 0)
    }, 0)

    const tableContextMenuButtons = [
        { element: <><i>&#xe9ac;</i>Remover</>, handler: removeTransitionItem }
    ]
    //listener para a tecla f8 finalizar a transacao
    const keyListenerHandler: React.KeyboardEventHandler = (e) => {
        // console.log("#",e)
        switch (e.key) {
            case "F8":
                if (!transitionBoat) {
                    console.log("breaked")
                    break
                };
                window.document.body.focus()
                submitHandler(addedTransitionItensData, transitionBoat.id)
                break;

            default:
                break;
        }
    }

    useEffect(() => setPathKeyHandler(keyListenerHandler), [transitionBoat, addedTransitionItensData])

    /** Funcao que finaliza a transacao */
    async function submitHandler(addedItens: transacaoitemProps[], boatID?: number) {

        if (boatID == undefined) return simpleSpawnInfo("É necessario selecionar um bote.")
        if (addedItens.length === 0) return simpleSpawnInfo("É necessario adicionar algum item à transação.")

        const response = await saveEntryStack(boatID, obs, sumValor(), sumPeso(), props.type, backend.utils.removeAttributeFromAll<transacaoitemProps>(addedItens, "id") as transacaoitemProps[])

        if (response.error || !response.data)
            return simpleSpawnInfo(response.message ?? "Houve um problema desconhecido ao criar uma Transação.")
        if (!Array.isArray(response.data)) {
            // printSingleEntry(response.data.transacao_id ?? -1)
            if (response.data.transacao_id)
                navigate('/print/transacao/?id=' + response.data.transacao_id)
        }
    }

    return <>
        <Bar />
        <SideBar />
        <Content>
            <HelpButton content="F8 - Finalizar transação" className="absolute left-full -translate-x-full z-50"/>
            <section className="py-8 px-4 border-b border-borders relative flex w-full">
                <h2>Nova {props.type == 0 ? "Entrada" : "Saída"}</h2>
            </section>

            <section className="py-8 px-4 border-b border-borders flex relative">
                <div>
                    <RequiredLabel>Bote</RequiredLabel>
                    <FormPrevisionInput
                        className="w-64"
                        placeholder="Insira o codigo do bote"
                        onChange={(value: boteProps) => {
                            setTransitionBoat(value ?? undefined)
                        }}
                        autoFocus={true}
                        searchInTable="bote"
                        where={{ include: 'fornecedor', limit: 5 }}
                        itemHandler={(item: boteProps) => `${item.id} - ${item.nome} | ${item.fornecedor?.nome}`}
                        onSubmit={() => null}
                        next="input[name=product]"
                    />
                </div>
            </section>

            <section className="py-0 pl-4 border-b border-borders">
                <div className="grid grid-cols-3">
                    <div className="col-span-1 border-r border-borders pr-4 py-8">
                        {/* Altera o where dos produtos do transitionItemAdder de acordo se é venda ou compra "type == 0" ou "type == 1"*/}
                        {
                            props.type ?
                                <TransitionItemAdder key={"transitionAdderBuy"} productWhere={{ tipo: 1 }} onSubmit={(item) => addTransitionItem(item)} />
                                : <TransitionItemAdder key={"transitionAdderSell"} productWhere={{ tipo: 0 }} onSubmit={(item) => addTransitionItem(item)} />
                        }

                    </div>
                    <div className="col-span-2">
                        <Table
                            contextMenu={{ buttons: tableContextMenuButtons }}
                            data={addedTransitionItensData}
                            disposition={[]}
                            tableHeader={['Produto', "Preço", "Peso", "Total"]}
                            tableItemHandler={(item) => [
                                item.produto?.nome,
                                <p className="text-end">{beautyNumber(item.preco ?? -1)}</p>,
                                <p className="text-end">{beautyNumber(item.peso ?? -1)}</p>,
                                <p className="text-end">{beautyNumber(item.valor_total ?? -1)}</p>]}
                        />
                    </div>
                </div>
            </section>

            <section className="py-8 px-4 border-b border-borders flex flex-col">
                <h2 className="mb-4">Resumo</h2>
                <div>
                    <p>
                        <i>&#xea3b;</i> Valor Total: R$ {sumValor().toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </p>
                    <p>
                        <i>&#xe9b0;</i> Peso Total: {sumPeso().toLocaleString()} KG
                    </p>
                </div>
            </section>

            <section className="py-8 px-4 border-b border-borders">
                <div>
                    <RequiredLabel className="block">Observação</RequiredLabel>
                    <FormInput className="block w-full"
                        placeholder="Insira uma observação"
                        onChange={(e) => setObs(e.currentTarget.value)
                        }
                        next="#submitTransaction"
                    />
                </div>
            </section>
            <section className="py-8 px-4 border-b border-borders">
                <Button
                    id="submitTransaction"
                    onClick={() => submitHandler(addedTransitionItensData, transitionBoat?.id)}
                >
                    <i>&#xe962;</i> Finalizar
                </Button>
            </section>
        </Content>
    </>
}
