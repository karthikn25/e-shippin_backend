const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { dbConnection } = require('./db.js');
const { userRouter } = require('./Router/userRouter.js');
const path = require('path');
const bodyParser = require('body-parser');


dotenv.config();

const PORT = process.env.PORT || 8000;

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))


dbConnection();



app.use('/api/user',userRouter)

app.listen(PORT,()=>console.log(`server running under localhost:${PORT}`))
