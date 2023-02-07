//express 가져오기
const express = require('express');
//cors 가져오기
const cors = require('cors');
//mysql 가져오기
const mysql = require('mysql');
// mulrer 가져오기
const multer = require('multer');

//서버생성
const app = express();
//프로세서의 주소 포트번호 지정
const port = 8080;

app.use(cors());

app.use(express.json());

// upload 폴더를 클라이언트에서 접근 가능하도록 설정
app.use('/upload', express.static('upload'));

// storage 생성
const storage = multer.diskStorage({
    destination: (req, file, cd) => {
        cd(null, 'upload/poster/');
    },
    filename: (req, file, cd) => {
        const newFilename = file.originalname;
        cd(null, newFilename);
    }
});
// upload 객체 생성
const upload = multer({storage: storage});
// upload 경로로 post 요청 했을 시 응답 구현 
app.post('/upload', upload.single('file'), (req, res) => {
    res.send({
        imgUrl: req.file.filename
    });
});

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

// get 요청
app.get('/latest', (req, res) => {
    conn.query('select * from movie where mov_no < 16', 
    (err, result, fields) => {
        res.send(result);
    });
})
app.get('/latest/:no', (req, res) => {
    const {no} = req.params;
    conn.query(`select * from movie where mov_no=${no}`, 
    (err, result, fields) => {
        res.send(result);
    });
})

//회원가입 요청
app.post("/join", async (req, res)=> {
    //let myPass = "";
    //console.log(res)
    const {id, nicname, password, year, month, day, email1, email2, gender} = req.body;
    //console.log(req.body)
    conn.query(`insert into members(id, nicname, password, date, email1, gender) values('${id}','${nicname}','${password}','${year}${month}${day}','${email1}@${email2}','${gender}')`
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

//로그인 요청
app.post('/login', async (req, res)=>{
    console.log(req.body)
    const {id, password} = req.body;
    conn.query(`select * from members where id = '${id}'`,
    (err, result, fields)=> {
        if(result) {
            console.log("로그인 성공")
            res.send(result)
        }else {
            console.log("로그인 실패")
        }
    })
})

app.listen(port, ()=>{
    console.log("서버가 동작하고 있습니다.")
})