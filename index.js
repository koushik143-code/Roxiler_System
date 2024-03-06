const express =  require("express");
const { connection } = require("./db");

require('dotenv').config()

const {productsRouter} = require('./Routes/Products.routes');

const {searchRouter} = require('./Routes/Search.routes')

const { statisticsRouter } = require("./Routes/Statistics.routes");

const { barChartRouter } = require("./Routes/BarChart.routes");

const { pieChartRouter } = require("./Routes/PieChart.routes");

const { combinedDataRouter } = require("./Routes/Combine.routes");


const { specs, swaggerUi } = require('./swagger');


const app = express();
app.use(express.json());

var cors = require('cors');
app.use(cors())


// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.get("/",(req,res)=>{
    res.send("HOME PAGE")
})

// Initialize database with seed data from third party API
app.use("/products",productsRouter)
app.use("/search",searchRouter)
app.use("/statistics",statisticsRouter)
app.use("/barChart",barChartRouter)
app.use("/pieChart",pieChartRouter)
app.use("/combinedData",combinedDataRouter)

app.listen(process.env.port, async()=>{
    try{
        await connection
        console.log("connection");
     }catch(err){
        console.log("not connected");
        console.log(err);
    }
    console.log(`Server is running on port ${process.env.port}`)
})