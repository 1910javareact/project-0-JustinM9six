import express from 'express';
import { getRByStatus, getRByUser, submitR } from '../services/reimbursement-service';
import { Reimbursement } from '../models/reimbursement';
import { authorization } from '../middleware/authentication';
import { updateR } from '../services/reimbursement-service';

export const reimbursementRouter = express.Router();

//Get reimbursement by Status
reimbursementRouter.get('/status/:statusId', [authorization(['Admin', 'Finance-Manager', 'User']), async (req, res) => {
    const id = +req.params.statusId;
    //If they entered an id that was not a number
    if (isNaN(id)) {
        res.status(400).send(`Please enter a valid Status id`);
    } else {
        try {
            const reimbursements = await getRByStatus(id);
            res.json(reimbursements);
        } catch (e) {
            res.status(e.status).send(e.message);
        }
    }
}]);

reimbursementRouter.get('/author/userId/:userId', [authorization(['Admin', 'Finance-Manager', 'User']), async (req, res) => {
    const id = +req.params.userId;
    if (isNaN(id)) {
        res.status(400).send(`Please enter a valid User id`);
    } else {
        try {
            const reimbursements = await getRByUser(id);
            res.json(reimbursements);
        } catch (e) {
            res.status(e.status).send(e.message);
        }
    }
}]);

reimbursementRouter.post('', [authorization(['Admin', 'Finance-Manager', 'User']), async (req, res) => {
    const{body} = req;
    //let{author} = body
    const newR = new Reimbursement(0, 0, 0, 0, 0, ``, 0, 0, 0);
    for (const key in newR) {
        if (body[key] === undefined) {
            res.status(400).send(`Please include all required fields`);
            break;
        } else {
            newR[key] = body[key];
        }
    }
    try {
        const result = await submitR(newR);
        if (result) {
            res.status(201).json('created');
        }
    } catch (e) {
        res.status(e.status).send(e.message);
    }
}]);

reimbursementRouter.patch('', [authorization(['Admin', 'Finance-Manager']), async (req, res) => {
    //let id = +req.params.id
    const { body } = req;
    // if(isNaN(id)) {
    //     res.status(400).send(`Please enter a valid reimbursement id`)
    // }
    //Creating a new reimbursement object and setting any unentered values to undefined
    const reimburse = new Reimbursement(0, 0, 0 , 0, 0, ``, 0, 0, 0);
    for (const key in reimburse) {
        if (body[key] === undefined) {
            reimburse[key] = undefined;
        } else {
            reimburse[key] = body[key];
        }
    }
    const id = reimburse.reimbursement_id;
    //Return an error if the user did not enter an id
    if (isNaN(id)) {
        res.status(400).send(`Please enter a valid reimbursement id`);
    }
    try {
        const result = await updateR(id, reimburse);
        res.status(201).json(result);
    } catch (e) {
        res.status(e.status).send(e.message);
    }
}]);