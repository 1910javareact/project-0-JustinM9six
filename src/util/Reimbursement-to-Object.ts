import { Reimbursement } from '../models/reimbursement';
import { ReimbursementDTO } from '../DTOs/reimbursement-DTO';

//Convert a query into one reimbursement Object
export function reimburseDTOtoReimburse(rDTO: ReimbursementDTO[]): Reimbursement {
    const status = [];
    const type = [];
    for (const r of rDTO) {
        status.push(r.status);
    }
    for (const r of rDTO) {
        type.push(r.type);
    }
    return new Reimbursement(rDTO[0].reimbursement_id, rDTO[0].author, rDTO[0].amount, rDTO[0].date_submitted, rDTO[0].date_resolved, rDTO[0].description, rDTO[0].resolver, status[0], type[0]);
}

//Convert a query into multiple reimbursements
export function multireimburseDTOtoReimburse(rDTO: ReimbursementDTO[]): Reimbursement[] {
    let currentReimbursement: ReimbursementDTO[] = [];
    const result: Reimbursement[] = [];
    for (const r of rDTO) {
        if (currentReimbursement.length === 0) {
            currentReimbursement.push(r);
        } else if (currentReimbursement[0].reimbursement_id === r.reimbursement_id) {
            currentReimbursement.push(r);
        } else {
            result.push(reimburseDTOtoReimburse(currentReimbursement));
            currentReimbursement = [];
            currentReimbursement.push(r);
        }
    }
    result.push(reimburseDTOtoReimburse(currentReimbursement));
    return result;
}