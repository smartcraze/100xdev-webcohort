import express from "express";
import { Client } from "pg";

const pg = new Client("postgresql://neondb_owner:TYogic6XC1Sh@ep-square-lab-a59rjgv1.us-east-2.aws.neon.tech/neondb?sslmode=require");

pg.connect()
const app = express();

app.use(express.json());

app.post("/signup",function(req,res){
    const {id ,username ,email} = req.body;
    pg.query("INSERT INTO t1 (id,username,email) VALUES ($1, $2, $3)",[id,username,email])

    res.json({message:"signup successfully"});
})


app.listen(3000);