import { useContext, useState } from "react";
import backend from "../../../constants/backend/backend";
import OverPageForm, { RequiredLabel } from "../../OverPageForm/OverPageForm";
import FormInput from "../../OverPageForm/FormInput";
import FormSelection from "../../OverPageForm/FormSelection";
import { GlobalPopupsContext } from "../../GlobalContexts/PopupContext";

export default function BoatCreationForm(props: {
    onCancel: Function,
    mode: "creation" | "editing"
    afterSubmit?: Function,
    defaultValues?: Partial<boteProps>
}) {
    const [error, setError] = useState('')
    const { simpleSpawnInfo } = useContext(GlobalPopupsContext)
    const { onCancel, mode, afterSubmit, defaultValues } = props

    const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const data = new FormData(e.currentTarget)
        const nome = data.get("nome")
        const fornecedor_id = data.get("fornecedor_id")

        if (!nome) {
            setError("nome")
            return;
        }

        if (!fornecedor_id) {
            setError("fornecedor_id")
            return;
        }

        let response = null
        if (mode == 'creation') {
            response = await backend.create("bote", {
                nome: nome.toString(),
                fornecedor_id: parseInt(fornecedor_id.toString())
            })
        }
        if (mode == 'editing' && defaultValues && defaultValues.id) {
            const id = defaultValues.id
            response = await backend.edit("bote", id, {
                nome: data.get("nome")?.toString(),
                fornecedor_id: parseInt(fornecedor_id.toString())
            } as boteProps)
        }
        // Tratamento de erro
        if (response && response.data.error && response.data.message) {
            simpleSpawnInfo(response.data.message)
        }
        // EXIT if exists
        afterSubmit ? afterSubmit() : null
        onCancel()
    }

    return <>
        <OverPageForm
            onCancel={onCancel}
            title="Criação de Bote"
            onSubmit={submitHandler}
        >
            <RequiredLabel htmlFor="nome">Nome</RequiredLabel>
            <FormInput name="nome" type="text" placeholder="E.g Barco Penha" autoFocus defaultValue={defaultValues ? defaultValues.nome : undefined} errored={(error == "nome")} />

            <RequiredLabel>Fornecedor</RequiredLabel>

            <FormSelection name="fornecedor_id" defaultValue={defaultValues?.fornecedor_id} useTable="fornecedor" useTableWhere={{order:"nome,ASC"}} errored={error == "fornecedor_id"} />

            <FormInput value="Pronto" type="submit" errored={error == "submit"} />
        </OverPageForm>
    </>
}

