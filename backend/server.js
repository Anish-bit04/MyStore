import express from 'express'
import dotenv from 'dotenv'
import helmet from 'helmet'
import morgan from 'morgan'
import  productRoutes from './routes/productRoute.js'
const app = express()

dotenv.config()
app.use(express.json())
app.use(helmet())
app.use(morgan('dev'))

const PORT = process.env.PORT

app.use('/api/product',productRoutes)

async function initDB() {
    try{
        await sql`
        CREATE TABLE IF NOT EXISTS products (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            image VARCHAR(255) NOT NULL,
            price DECIMAL(10,2) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
        )
        `
        console.log("Database initialized successfully")
    }catch(error){
        console.log("Error in initDB", error)
    }
}

initDB().then(() =>{
    app.listen(PORT, ()=>console.log(`server is active at ${PORT}`))
})