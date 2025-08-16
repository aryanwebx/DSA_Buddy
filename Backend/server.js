const express = require('express')
const app = express()
const cors = require('cors');
const main = require('./DSA');

app.use(cors());
app.use(express.json());

app.post('/chatbot', async (req, res) => {
    try {
        const {userQues,session}=req.body;
        res.setHeader('Content-Type', 'text/plain');
        res.setHeader('Transfer-Encoding', 'chunked');
        const stream = main(userQues, session);

        for await (const chunk of stream){
            
            res.write(chunk);
        }
        res.end();
    } catch (err) {
        res.status(500).send("Internal Server Error");
    }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running and listening on port ${PORT}`);
})