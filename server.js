//express 가져오기
const express = require('express');
//cors 가져오기
const cors = require('cors');
//mysql 가져오기
const mysql = require('mysql');

//서버생성
const app =express();
//프로세서의 주소 포트번호 지정
const port = 8080;

app.use(cors())

app.use(express.json())

//mysql연결하기
const conn = mysql.createConnection({
    host: "hera-database.c6v9c00axeyk.ap-northeast-2.rds.amazonaws.com",
    user: "admin",
    password: "alstjq12$!!",
    port: "3306",
    database: "movies" 
})

//선연결
conn.connect();

//회원가입 요청
app.post("/join", async (req, res)=> {
    //let myPass = "";
    //console.log(res)
    const {id, nicname, password, year, month, day, email1, email2, gender} = req.body;
    //console.log(req.body)
    conn.query(`insert into members(id, nicname, password, year, month, day, email1, email2, gender) values('${id}','${nicname}','${password}','${year}','${month}','${day}','${email1}','${email2}','${gender}')`
    ,(err,result,fields)=>{
        console.log(result)
        if(result) {
            console.log("성공")
            res.send("등록되었습니다")
        }else{
            console.log("실패")
            console.log(err)
        }
    })
})

app.listen(port, ()=>{
    console.log("서버가 동작하고 있습니다.")
})