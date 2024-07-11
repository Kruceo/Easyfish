import Sequelize from 'sequelize';
import cfg from "../../config/config.json" assert { type: "json" }

/**
 * @type {import('sequelize').Sequelize}
 */
const dbserver = new Sequelize({
    database: cfg.database.database,
    schema: cfg.database.schema,
    host: cfg.database.host,
    port: cfg.database.port,
    password: cfg.database.password,
    username: cfg.database.username,
    dialect: cfg.database.dialect,
    logging: false,
});

await dbserver.query(`CREATE SCHEMA IF NOT EXISTS ${cfg.database.schema};`);

export default dbserver