import { DataTypes } from "sequelize"
import dbserver from "./connection.mjs"

const _ID = {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    unique: true
}

const Usuario = dbserver.define("usuario", {
    id: _ID,
    nome: { type: DataTypes.STRING, allowNull: false, unique: true },
    senha: { type: DataTypes.STRING, allowNull: false }
}, {
    tableName: "usuarios",
    freezeTableName: true
})

const Bote = dbserver.define("bote", {
    id: _ID,
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: "botes",
    freezeTableName: true,
    name: {
        plural: "botes",
        singular: "bote"
    }
})

const Fornecedor = dbserver.define("fornecedor", {
    id: _ID,
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    bote_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: Bote, key: 'id' }
    },
    integracao_id: {
        type: DataTypes.INTEGER
    }
}, {
    tableName: "fornecedores",
    freezeTableName: true,
    name: {
        plural: "fornecedores",
        singular: "fornecedor"
    }
})

const Produto = dbserver.define("produto", {
    id: _ID,
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    preco: {
        type: DataTypes.FLOAT,
        allowNull: false
    }
}, {
    tableName: "produtos",
    freezeTableName: true,
    name: {
        plural: "produtos",
        singular: "produto"
    }
})

const Entrada = dbserver.define("entrada", {
    id: _ID,
    data: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    obs: {
        type: DataTypes.STRING
    },
    status: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    fornecedor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: Fornecedor, key: 'id' }
    },
    bote_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: Bote, key: 'id' }
    },
    usuario_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: Usuario, key: 'id' }
    }
}, {
    tableName: "entradas",
    freezeTableName: true,
    name: {
        plural: "entradas",
        singular: "entrada"
    }
})

const Entrada_item = dbserver.define("entrada_item", {
    id: _ID,
    peso: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    preco: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    desconto: {
        type: DataTypes.BOOLEAN
    },
    produto_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: Produto, key: "id" }
    },
    entrada_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: Entrada, key: "id" }
    },
}, {
    tableName: "entrada_items",
    freezeTableName: true,
    name: {
        plural: "entrada_item",
        singular: "entrada_items"
    }
})

await Bote.sync({ force: false })
await Fornecedor.sync({ force: false })
await Produto.sync({ force: false })
await Entrada.sync({ force: false })
await Entrada_item.sync({ force: false })
await Usuario.sync({ force: false })

/** Setup relations */

//cada esquerdo tem uma chave de bote_id
Fornecedor.belongsTo(Bote, { foreignKey: 'bote_id' })
//tem muitos do direito com uma chave de bote_id
Bote.hasMany(Fornecedor, { foreignKey: 'bote_id' })

Entrada_item.belongsTo(Entrada, { foreignKey: 'entrada_id' })
Entrada.hasMany(Entrada_item, { foreignKey: 'entrada_id' })

Entrada_item.belongsTo(Produto, { foreignKey: 'produto_id' })
Produto.hasMany(Entrada_item, { foreignKey: 'produto_id' })

Entrada.belongsTo(Fornecedor, { foreignKey: "fornecedor_id" })
Fornecedor.hasMany(Entrada, { foreignKey: 'fornecedor_id' })

Entrada.belongsTo(Usuario, { foreignKey: "usuario_id" })
Usuario.hasMany(Entrada, { foreignKey: 'usuario_id' })

export default {
    Bote, Fornecedor, Produto, Entrada, Entrada_item, Usuario
}
export {
    Bote, Fornecedor, Produto, Entrada, Entrada_item, Usuario
}