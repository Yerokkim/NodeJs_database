// bodyparser module사용하기

var bodyParser=require("body-parser");
var urlencodeParser=bodyParser.urlencoded({extended:false});
var mysql=require ("mysql");

var conn_info={
		host:"localhost",
		port:3306,
		user:"root",
		password:"",
		database:"GuestBookDB"
};

module.exports=function(app){
	app.get("/",function(req,res){
		res.render("index.ejs");
	});
	
	app.post("/login",urlencodeParser,function(req,res){
		var user_name=req.body.user_name;
		//session에 데이터 저장
		req.session.user_name=user_name;
		//redirect 함수사용
		res.redirect("main");
		
	});
	
	app.get("/main",function(req,res){
		//데이터베이스 불러오기 (call the data from db)
		var conn=mysql.createConnection(conn_info);
		var sql = "select guestbook_name, guestbook_content " +
		"from GuestBookTable order by guestbook_idx desc";
		//query 실행
		
		conn.query(sql,function(error,rows){
			var render_data={
					"rows": rows
			};
			//main.ejs를 렌더링할때 render_data를 넘김
			res.render("main.ejs",render_data);
			
		});
	
		
	});
	//content 불러오기    
	app.post("/save_guestbook",urlencodeParser,function(req,res){
		//two information 저장함
		var user_name=req.session.user_name;
		var content=req.body.content;
		//sql 접속
		var conn=mysql.createConnection(conn_info);
		//query 작성
		var sql="insert into GuestBookTable(guestbook_name,guestbook_content) values(?,?)";
		//?,?에 들어갈 내용 세팅
		
		var input_data=[user_name,content];
		
		conn.query(sql,input_data,function(error){
			conn.end();
			res.redirect("main");
		});
			
	
		
	});
};