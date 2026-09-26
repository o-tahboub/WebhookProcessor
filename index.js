const express = require('express');
//const logger = require('morgan');

//const { accessLogStream } = require('./utilities/log');

const app = express();

//app.use(logger('combined', { stream: accessLogStream }));
app.use((req, res, next) => {
    if (!req.query.token) {
        return res.sendStatus(404);
    }

    if (req.query.token !== process.env.AUTH_KEY) {
        return res.sendStatus(404);
    }

    next();
})
app.use(express.json());

app.post('/webhook', async (req, res) => {

    console.log(`request received, ${req.body['Import IDs']}`);

    await handleRecord(req.body);

    return res.sendStatus(200);
})

async function handleRecord(data) {
    try {
        const res = await fetch(process.env.ENDPOINT_URL, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + process.env.ENDPOINT_SECRET
            },
            body: JSON.stringify(data),
        })
        if (!res.ok) {
            console.error(`Downstream API error ${res.status}:`, await res.text());
        }
    } catch (err) {
        console.error("handleRecord fetch failed:", err.stack || err.message);
    }
}

app.listen(process.env.PORT);