import { createPool } from 'mysql2/promise';
import { db_database, db_host, db_password, db_port, db_user } from './db.config.js';

export const pool = createPool({
    host: db_host,
    user: db_user,
    password: db_password,
    port: db_port,
    database: db_database    
});
