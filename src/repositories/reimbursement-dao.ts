import { Reimbursement } from '../models/reimbursement';
import { PoolClient } from 'pg';
import { connectionPool } from '.';
import { multireimburseDTOtoReimburse, reimburseDTOtoReimburse } from '../util/Reimbursement-to-Object';

//Get reimbursement by Status
export async function daoGetRByStatus(id: number): Promise<Reimbursement[]> {
    let client: PoolClient;
    try {
        client = await connectionPool.connect();
        const result = await client.query(`SELECT * FROM project_0.reimbursement r full outer join project_0.reimbursement_status s on r.status = s.status_id full outer join project_0.reimbursement_type t on r."type" = t.type_id WHERE r.status = $1;`, [id]);
        if (result.rowCount > 0) {
            return multireimburseDTOtoReimburse(result.rows);
        } else {
            throw 'There are no reimbursements with this status';
        }
        //catch and throw any errors that occur after javascript has connected to the database
    } catch (e) {
        throw {
            status: 500,
            message: 'Internal Server Error'
        };
        //Closing the connection
    } finally {
        client && client.release();
    }
}

//Get reimbursement by author
export async function daoGetRByUser(id: number): Promise<Reimbursement[]> {
    let client: PoolClient;
    try {
        client = await connectionPool.connect();
        const result = await client.query(`SELECT * FROM project_0.reimbursement r full outer join project_0.reimbursement_status s on r.status = s.status_id full outer join project_0.reimbursement_type t on r."type" = t.type_id WHERE r.author = $1;`, [id]);
        if (result.rowCount > 0) {
            return multireimburseDTOtoReimburse(result.rows);
        } else {
            throw 'There are no reimbursements from this user';
        }
        //Catch and throw any errors created after javascript has connected to the database
    } catch (e) {
        throw {
            status: 500,
            message: 'Internal Server Error'
        };
        //Closing the connection
    } finally {
        client && client.release();
    }
}

//Submit a reimbursement
export async function daoSubmitR(r: Reimbursement): Promise<Reimbursement> {
    let client: PoolClient;
    client = await connectionPool.connect();
    try {
        let id = await client.query(`select max(reimbursement_id) from project_0.reimbursement;`);
        id = id.rows[0].max + 1;
        await client.query(`INSERT INTO project_0.reimbursement(reimbursement_id, author, amount, date_submitted, date_resolved, description, resolver, status, "type") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING reimbursement_id;`,
            [id, r.author, r.amount, r.date_submitted, r.date_resolved, r.description, r.resolver, r.status, r.type]);
        return r;
        //If we catch an error we need to rollback any changes we may have made in the try block
    } catch (e) {
        throw {
            status: 500,
            message: `Internal Server Error`
        };
        //Closing the connection
    } finally {
        client && client.release();
    }
}

//Update a reimbursement
export async function doaUpdateR(id: number, r: Reimbursement): Promise<Reimbursement> {
    let client: PoolClient;
    client = await connectionPool.connect();
    try {
        //Getting all values from the reimbursement currently in the database
        const temp = await client.query(`SELECT * FROM project_0.reimbursement WHERE reimbursement_id = $1`, [id]);
        if (temp.rows.length === 0) {
            throw {
                status: 404,
                message: `There are no reimbursements with this id`
            };
        }
        const tempReimburse = reimburseDTOtoReimburse(temp.rows);
        //Setting any undefined values to the value that was already in the database
        for (const key in r) {
            if (r[key] === undefined) {
                r[key] = tempReimburse[key];
            }
        }
        await client.query(`UPDATE project_0.reimbursement SET reimbursement_id = $1,
            author = $2, amount = $3, date_submitted = $4, date_resolved = $5, description = $6,
            resolver = $7, status = $8, type = $9 WHERE reimbursement_id = $10;`,
            [r.reimbursement_id, r.author, r.amount, r.date_submitted, r.date_resolved, r.description, r.resolver, r.status, r.type, id]);
        return r;
    } catch (e) {
        if (e.status !== 404) {
            throw {
                status: 500,
                message: `Internal Server Error`
            };
        } else {
            throw e;
        }
        //Closing the connection
    } finally {
        client && client.release();
    }
}