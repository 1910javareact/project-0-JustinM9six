import express from 'express';
import bodyparser from 'body-parser';
import { getEmployeeLogin } from './services/user-service';
import { userRouter } from './routers/user-router';
import { reimbursementRouter } from './routers/reimbursement-router';
import { sessionMiddleware } from './middleware/session';
import { corsFilter } from './middleware/cors-middleware';

const app = express();
app.use(bodyparser.json());
app.use(corsFilter);
app.use(sessionMiddleware);

app.post(`/login`, async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        res.status(400).send(`Please enter a username and password`);
    } else {
        try {
            const user = await getEmployeeLogin(username, password);
            req.session.user = user;
            res.json(user);
        } catch (e) {
            res.status(e.status).send(e.message);
        }
    }
});

app.use(`/user`, userRouter);

app.use(`/reimbursement`, reimbursementRouter);

app.listen(1101, () => {
    console.log(`app has started`);

});