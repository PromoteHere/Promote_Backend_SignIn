const express = require('express'); 
const app = express(); 
const bodyParser = require('body-parser');
const Routes = require('./Routes/routes');
const emailRoutes = require('./Routes/emailRoute');
const APILogs = require('./Routes/service')
const cors = require('cors');

let APIlogsdata = []
const PORT = 8080; 

app.use(bodyParser.json());
app.use(cors({
    origin: "*"
}));

app.get('/', (req, res)=>{  // to check whether server is running or not
    res.status(200); 
    res.send("Server is up & running!"); 
}); 
app.use((req, res, next) => { //function to collect API logs and stores it in Server memory
    APIlogsdata = APILogs(req, res);
    next();
})

app.use('/ApiLogs', (req, res) => { //to view the API Logs
    res.json(JSON.stringify(APIlogsdata))
})
app.use('/API', Routes);

app.use('/email', emailRoutes);

app.listen(PORT, ()=>console.log('Server is running!!!!')); 