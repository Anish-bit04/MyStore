import {neon} from "@neondatabase/serverless"
import dotenv from "dotenv"

dotenv.config()

const {PGUSER,PGPASSWORD,PGHOST,PGDATABASE} = process.env

export const sql = neon(
    `postgres://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?sslmode=require`
)