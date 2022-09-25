
const mysqlConnection = require('../../database/config');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {registerValidation, loginValidation, changePassword} = require('../../validation');
const { search } = require('../Routes/auth');





class User {
    constructor(id,name,fname,lname,email,phone,gender,photo,niveau,password) {
        this.valid = false;
        this._id = id;
        this._name = name;
        this._fname = fname;
        this._lname = lname;
        this._email = email;
        this._phone = phone;
        this._gender = gender;
        this._photo = photo
        this._niveau = niveau;
        this._password = password;
        
    }
async gethome(req,res){
    let arr=[];
    let arr1=[];
    mysqlConnection.query("select * from formation order by date_creation DESC ",async (err,rows)=>{
              
        if(!err){       
           for(let i=0;i<rows.length;i++){
               arr.push(rows[i]);
           }    
//begin
function  getformateur(arr,arr1){
    for(let i=0;i<arr.length;i++)
    {
      console.log("l formation "+ arr[i])
       mysqlConnection.query("select * from formateur where id_formateur=?",[arr[i].id_formateur], (err,rows)=>{
          
             if(!err){             
                       arr1.push(rows[0]);
             }
          
          
      })
     
  };
}
const sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));

await sleep(50);
getformateur(arr,arr1);
await sleep(50);

    if (!req.cookies['auth-token']) return res.render('user/home', { data: arr, data1:arr1 })
    const decoded = jwt.verify(req.cookies['auth-token'], process.env.TOKEN_SECRET);    
    if (decoded.role === 'student') return res.redirect('/dashboard');
//end
              }else{
            console.log(err)
        }
     
 })


}




 async register (req, res) {
    let emailExist = false;

    const {error} = registerValidation(req.body);
    console.log(req.body.Name)
    if(error) {//return res.redirect('/signup?error=' + encodeURIComponent(error.details[0].message));
    req.flash('message',error.details[0].message)
    return res.redirect("/signup")
}

    mysqlConnection.query(
        "SELECT * FROM user WHERE email = ?",
        [this._email], (err, rows, fields) => {
            
            (rows.length > 0) ? emailExist=true : emailExist=false;
        }
        
    );
    //salting
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this._password, salt);

    if(!emailExist){
        mysqlConnection.query(
            "INSERT INTO user (email, password, userName,firstName, lastName, phone, gender, levelOfStudy,avatar, role) VALUES (?,?,?,?,?,?,?,?,?,?)",
            [this._email, hashedPassword,this._name,this._fname,this._lname,this._phone, this._gender,this._niveau,"default.jpg", "student"], (err, rows, fields) => {
                if(!err){
                    let sql = `SELECT * FROM user WHERE id = '${rows.insertId}'`
                    mysqlConnection.query(sql, (err, result) => {
                        if (err) throw err;

                        const token = jwt.sign({ id: result[0].id, role: result[0].role }, process.env.TOKEN_SECRET, {
                            expiresIn: process.env.JWT_EXPIRES
                        });
        
                        const cookieOptions = {
                            expiresIn: new Date(Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
                            httpOnly: true
                        };
        
                        res.cookie('auth-token', token, cookieOptions);

                        return res.redirect('/dashboard');
                    })
    
                }else{
                    throw err;
                }
            }
        );    
    }else{
      //  return res.redirect('/signup?error=' + encodeURIComponent('Email already exists!'));
        req.flash('message','Email already exists!')
        return res.redirect("/signup")
    }
}
    
async login (req, res)  {

        let user={};
    
        const {error} = loginValidation(req.body);
    //    console.log(this._email)
        if(error) {//return res.redirect('/login?error=' + encodeURIComponent(error.details[0].message));
        req.flash('message',(error.details[0].message))
        return res.redirect("/login")}
        mysqlConnection.query(
            "SELECT * FROM user WHERE email = ?",
            [this._email], (err, rows, fields) => {
                rows.length ? user=rows[0] : user={};
            }
            
        );
        
        const sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));
        await sleep(1000);
    
        if(!user.email){
          //  return res.redirect('/login?error=' + encodeURIComponent('Email doesnot exists'));
            req.flash('message',('Email doesnot exists'))
        return res.redirect("/login")
        } 
    
        const validPass = await bcrypt.compare(this._password, user.password);
        if(!validPass){
            req.flash('message','Invalid Password')
        return res.redirect("/login")
        } 
    
        const token = jwt.sign({ id: user.id, role: user.role}, process.env.TOKEN_SECRET, {
            expiresIn: process.env.JWT_EXPIRES
        });
    
        const cookieOptions = {
            expiresIn: new Date(Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
            httpOnly: true
        };

        res.cookie('auth-token', token, cookieOptions);
    
        res.redirect('/dashboard');
        
    }

    getprofile(req,res){
        //console.log('haw l email '+this._email);

        mysqlConnection.query("SELECT * FROM user where id=?",[this._id], (err, rows, fields) => {
            !err ? res.render('user/profile', {user_photo:rows[0].avatar, message_error: req.flash("message"),message_success: req.flash("message_success"),  theid:this._id,data: rows }) : console.log(err);
        });
    } 

    getdashboard(req,res){
        let arr= [];
        let arr1= [];
        let arr3= [];
        mysqlConnection.query("SELECT *,COUNT(*) as nbcourses FROM user,enroulement where user.id=? and enroulement.id_etudiant=?",[this._id,this._id],async (err, rows, fields) => {
           

if(!err){

    function  getformation(arr){
        
         
           mysqlConnection.query("select * from formation order by date_creation DESC ", (err,rows)=>{
              
                 if(!err){       
                    for(let i=0;i<rows.length;i++){
                        arr.push(rows[i]);
                    }      
                           
                 }
              
          })
         
      
      
    }
    function  getformateur(arr,arr1){
        for(let i=0;i<arr.length;i++)
        {
          console.log("l formation "+ arr[i])
           mysqlConnection.query("select * from formateur where id_formateur=?",[arr[i].id_formateur], (err,rows)=>{
              
                 if(!err){             
                           arr1.push(rows[0]);
                 }
              
              
          })
         
      };
    }
    function getcategories(arr3){
        mysqlConnection.query("select * from categories", (err,rows)=>{
              
            if(!err){       
               for(let i=0;i<rows.length;i++){
                   arr3.push(rows[i]);
               }      
                      
            }
         
     }) 
    }
    const sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));
    getformation(arr);
    getcategories(arr3)
    await sleep(50);
    getformateur(arr,arr1);
    
    await sleep(50);

    res.render('user/dashboard', {user_photo:rows[0].avatar, theid:this._id,data: arr, data1:rows , data2:arr1 ,Categories:arr3})

}else{
    console.log(err);
}

        });

      
    } 

    getmycourses(req,res){
        console.log('haw l id '+this._id);
        let arr= [];
        let arr1= [];
        let arr3= [];
        mysqlConnection.query("SELECT * FROM enroulement where id_etudiant=?",[this._id],async (err, rows, fields) => {

            if(!err){
 
 function  getformation(arr){
    for(let i=0;i<rows.length;i++)
    {
      console.log(rows[i])
       mysqlConnection.query("select * from formation where id_form=?",[rows[i].id_formation], (err,rows)=>{
          
             if(!err){             
                       arr.push(rows[0]);
             }
          
          
      })
     
  };
}
function  getformateur(arr,arr1){
    for(let i=0;i<arr.length;i++)
    {
      console.log(arr[i])
       mysqlConnection.query("select * from formateur where id_formateur=?",[arr[i].id_formateur], (err,rows)=>{
          
             if(!err){             
                       arr1.push(rows[0]);
             }
          
          
      })
     
  };
}
function  getuser(arr3,id){
    //    console.log("id ="+this._id)
         
           mysqlConnection.query("select * from user where id=?",[id], (err,rows)=>{
              
                 if(!err){             
                           arr3.push(rows[0]);
                 }    
          })
         
     
    }
const sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));
getformation(arr);
await sleep(50);
getformateur(arr,arr1);
getuser(arr3,this._id)
await sleep(50);
let theid=[this._id]

res.render('user/mycourses', {user_photo:arr3[0].avatar, message_error: req.flash("message"),message_success: req.flash("message_success"),theid:this._id, data: arr, data1:rows , data2:arr1 , id: theid})
console.log(theid[0])
}else{
    console.log(err);
}



            
        });

      
    } 
    

    getbookmarks(req,res){
        console.log('haw l id '+this._id);
        let arr= [];
        let arr1= [];
        let arr3= [];
        mysqlConnection.query("SELECT * FROM bookmarks where id_etudiant=?",[this._id],async (err, rows, fields) => {

            if(!err){
 
 function  getformation(arr){
    for(let i=0;i<rows.length;i++)
    {
      console.log(rows[i])
       mysqlConnection.query("select * from formation where id_form=?",[rows[i].id_formation], (err,rows)=>{
          
             if(!err){             
                       arr.push(rows[0]);
             }
          
          
      })
     
  };
}
function  getuser(arr3,id){
//    console.log("id ="+this._id)
     
       mysqlConnection.query("select * from user where id=?",[id], (err,rows)=>{
          
             if(!err){             
                       arr3.push(rows[0]);
             }    
      })
     
 
}
function  getformateur(arr,arr1){
    for(let i=0;i<arr.length;i++)
    {
      console.log(arr[i])
       mysqlConnection.query("select * from formateur where id_formateur=?",[arr[i].id_formateur], (err,rows)=>{
          
             if(!err){             
                       arr1.push(rows[0]);
             }
          
          
      })
     
  };
}
const sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));
getformation(arr);
await sleep(50);
getformateur(arr,arr1);
getuser(arr3,this._id)
await sleep(50);
let theid=[this._id]

res.render('user/bookmarks', { user_photo:arr3[0].avatar, message_error: req.flash("message"),message_success: req.flash("message_success"), theid:this._id,data: arr, data1:rows , data2:arr1 , id: theid})
}else{
    console.log(err);
}



            
        });

      
    } 
    getmessages(req,res){
        let arr=[];
        mysqlConnection.query("select * from message where id_etudiant=? group by id_formateur;",[this._id],async (err, rows, fields) => {

            if(!err){
                function  getformateur(arr){
                    for(let i=0;i<rows.length;i++)
                    {
                       mysqlConnection.query("select * from formateur where id_formateur=?",[rows[i].id_formateur], (err,rows)=>{
                          
                             if(!err){             
                                       arr.push(rows[0]);
                             }
                          
                          
                      })
                     
                  };
                }
                let arr3=[]
                function  getuser(arr3,id){
                    //    console.log("id ="+this._id)
                         
                           mysqlConnection.query("select * from user where id=?",[id], (err,rows)=>{
                              
                                 if(!err){             
                                           arr3.push(rows[0]);
                                 }    
                          })
                         
                     
                    }
                    
                const sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));
                
                await sleep(50);
                getuser(arr3,this._id)
                getformateur(arr);
                await sleep(50);
                let theid=[this._id];
                res.render('user/messages', {user_photo:arr3[0].avatar,  theid:this._id,data: arr, data1:rows ,id: theid})
            }
        else{
            console.log(err)
        }
        })


    } 

    getpayement(req,res){
        mysqlConnection.query("select * from payement where id_etudiant=?",[this._id],async (err, rows, fields) => {

            if(!err){
                let arr3=[]
                function  getuser(arr3,id){
                    //    console.log("id ="+this._id)
                         
                           mysqlConnection.query("select * from user where id=?",[id], (err,rows)=>{
                              
                                 if(!err){             
                                           arr3.push(rows[0]);
                                 }    
                          })
                         
                     
                    }
                    const sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));
                    getuser(arr3,this._id)
                    await sleep(50);
                let theid=[this._id];
                res.render('user/payement' ,{user_photo:arr3[0].avatar, message_error: req.flash("message"),message_success: req.flash("message_success"), theid:this._id,data:rows ,id:theid});
            }else{
                console.log(err);
            }
        })


        
    } 
    updateProfile  (req, res)  {
    
    mysqlConnection.query(
        "UPDATE user set avatar= ? WHERE id= ?",
        [this._photo ,this._id], (err, rows, fields) => {
       if(!err){
        
        req.flash('message_success','user updated successfully!!')
        return res.redirect("/profile")
       }else{
        console.log(err)
       }
       
        }
    );
};



async getcoursessingle(req,res){
    let arr=[];
    let arr1=[];
    let arr5=[];
    mysqlConnection.query("select * from formation where id_form=?",[req.params.id],async (err,rows)=>{
              
        if(!err){       
        /*    let i=0;
            let test=false
            while(i<rows.length&&test==false){
            if(rows[i].id_form==req.params.id){
                test=true;
            }
                i++
            } */  
            if(rows.length > 0){
console.log("mrigl l formation mawjouda")
            }else{
                console.log("mouch mrigl l formation much mawjouda")

             return   res.redirect('/not_found')
            }         


//begin
function  getformateur(arr,arr1){
    


       mysqlConnection.query("select * from formateur where id_formateur=?",[arr[0].id_formateur], (err,rows)=>{
          
             if(!err){             
                       arr1.push(rows[0]);
             }
          
          
      })

}
let yesorno=[];
function  in_enrolement_or_no(yesorno,id_etudiant){
    
    mysqlConnection.query("select * from enroulement where id_formation=? and id_etudiant=?",[req.params.id,id_etudiant], (err,rows)=>{
       
          if(!err){            
            if(rows.length>0){
                yesorno[0]='yes';
            } 
            console.log(yesorno)
          }
       
       
   })

}
function get_videos(arr5,id_formation){
    mysqlConnection.query("select * from videos where id_formation=?",[id_formation], (err,rows)=>{
       
        if(!err){            
          for(let i=0;i<rows.length;i++){
            arr5.push(rows[i]);
          }
        }
     
     
    })
}

const sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));
get_videos(arr5,req.params.id)
await sleep(50);
getformateur(rows,arr1);
let token= req.cookies['auth-token']
let theid=0;
let tologin=0;
if(token){
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET)
       
     theid = decoded.id;
}else{
    tologin=1;
}
       
in_enrolement_or_no(yesorno,theid)
await sleep(50);
console.log(rows)
console.log("yesorno "+yesorno)
res.render('user/courses_single', {videos:arr5 ,message_error: req.flash("message"),message_success: req.flash("message_success"),  theid:this._id,data: rows, data1:arr1 ,yesorno:yesorno[0],tologin:tologin })
//end
           



           
                  
        }else{
            console.log(err)
        }
     
 })






}


async getlessonsingle(req,res){

let id_formation=req.params.id;
console.log("id formation = "+id_formation)
let id_video=req.params.idvid;
let arr=[];
let arr1=[];
let arr2=[];
mysqlConnection.query("select * from formation where id_form=?",[id_formation], (err,rows)=>{
       
    if(!err){            
      arr=rows;
    }
 
 
})
const sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));
await sleep(50);

    mysqlConnection.query("select * from videos where course_id=?",[id_formation], (err,rows)=>{
       
        if(!err){            
          arr1=rows;
        }
     
     
    })
    await sleep(50);
    
let i=0;
let test=false
while(i<arr1.length&&test==false){
if(arr1[i].videoRank==id_video){
    test=true;
}
    i++
}



    mysqlConnection.query("select * from videos where course_id=? and videoRank=?",[id_formation,id_video], (err,rows)=>{
       
        if(!err){            
          arr2=rows;
        }
     
     
    })
   
    token= req.cookies['auth-token']
          const decoded = jwt.verify(token, process.env.TOKEN_SECRET)
         
         let theid = decoded.id;
    await sleep(50);
    mysqlConnection.query("select * from enroulement where id_formation=? and id_etudiant=?",[id_formation,theid], (err,rows)=>{
       
        if(!err){  
            if(rows.length==0){
             //   res.redirect('/courses_single/'+id_formation+'?error=' + encodeURIComponent('You have to buy this course!!'))
                req.flash('message','You have to buy this course!!')
                return res.redirect('/courses_single/'+id_formation)
            
            }   else{
                if(test){
                    res.render("user/lesson_single",{data : arr,data1:arr1,data2:arr2,id:theid});
                                }else{
                    res.redirect('/not_found')
                }
                
            }       
    
        }else{
            console.log(err)
        }
     
     
    })

}


async getcourseslist(req,res){
console.log(req.url)
if(req.url=="/courses_list"){
    console.log("mrigl")
}else{
    console.log("mouch mrigl")
}
let category=req.query.category;
let price=req.query.price;
let duration=req.query.duration;
let the_search=req.query.search;
let sql ="select * from formation where id_form like'%' "
if(the_search){
    sql+="and (nom_form like'%"+the_search+"%') ";
}



let arr_category=[];
let arr_sql_category= [];
let sql_category= sql;
mysqlConnection.query("select * from categories", (err,rows)=>{
       
    if(!err){ 
for(let i=0;i<rows.length;i++){
    arr_category[i]=rows[i];
    arr_sql_category[i]=" and ( category='"+rows[i].category_name+"' ) "
  //  sql_category+= " and ( category="+rows[i].category_name+" ) "

   
    console.log("arr sql category =="+arr_sql_category[i]);
   // console.log(" sql category =="+sql_category);
}
    }else{
        console.log(err)
    }
 
 
})




if(category){
    sql+="and ("
    if(typeof(category)=="string"){
        
        sql+="category='"+category+"'";
        }else{
           
            for(let i=0;i<category.length;i++){

                if(i==category.length-1){
                    sql+=" category='"+category[i]+"'";

                }else{
                    sql+=" category='"+category[i]+"' or";

                }
               }
        }
        sql+=")"
}
if(duration){
sql+="and ("
sql_category+="and ("
if(typeof(duration)=="string"){
    switch(duration) {
        case 'lthan3':
            sql+=" duree like '1h%' or duree like '2h%' or duree like '3h%' "
            sql_category+=" duree like '1h%' or duree like '2h%' or duree like '3h%' "
          break;
        case '4to7':
            sql+=" duree like '4h%' or duree like '5h%' or duree like '6h%' or duree like '7h%'"
            sql_category+=" duree like '4h%' or duree like '5h%' or duree like '6h%' or duree like '7h%'"
          break;
          case '8to20':
            for(let j=8;j<20;j++){
                sql+=" duree like '"+j+"h%' or"
                sql_category+=" duree like '"+j+"h%' or"
            }
            sql+=" duree like '20h%' "
            sql_category+=" duree like '20h%' "
            
          break;
          case 'plus20':
            for(let j=1;j<20;j++){
                sql+=" duree  not like'"+j+"h%' and"
                sql_category+=" duree  not like'"+j+"h%' and"
            }
            sql+=" duree not like '20h%' "
            sql_category+=" duree not like '20h%' "
          break;
        default:
         sql=sql;
      }
}else{
    for(let i=0;i<duration.length;i++){
        if(i==duration.length-1){
              sql+="("
              sql_category+="("
              if(duration[i]=='lthan3'){
               
                sql+=" duree like '1h%' or duree like '2h%' or duree like '3h%' "
                sql_category+=" duree like '1h%' or duree like '2h%' or duree like '3h%' "
            }
            if(duration[i]=='4to7'){
                sql+=" duree like '4h%' or duree like '5h%' or duree like '6h%' or duree like '7h%' "
                sql_category+=" duree like '4h%' or duree like '5h%' or duree like '6h%' or duree like '7h%' "
            }
            if(duration[i]=='8to20'){
                for(let j=8;j<20;j++){
                    sql+=" duree like '"+j+"h%' or"
                    sql_category+=" duree like '"+j+"h%' or"
                }
                sql+=" duree like '20h%' "
                sql_category+=" duree like '20h%' "

            }
            if(duration[i]=='plus20'){
                for(let j=1;j<20;j++){
                    sql+=" duree  not like'"+j+"h%' and"
                    sql_category+=" duree  not like'"+j+"h%' and"
                }
                sql+=" duree not like '20h%'  "
                sql_category+=" duree not like '20h%'  "
            }
            sql+=")"
            sql_category+=")"
        }else{
            
            if(duration[i]=='lthan3'){
                sql+="( duree like '1h%' or duree like '2h%' or duree like '3h%' )or "
                sql_category+="( duree like '1h%' or duree like '2h%' or duree like '3h%' )or "
            }
            if(duration[i]=='4to7'){
                sql+=" (duree like '4h%' or duree like '5h%' or duree like '6h%' or duree like '7h%' )or "
                sql_category+=" (duree like '4h%' or duree like '5h%' or duree like '6h%' or duree like '7h%' )or "
            }
            if(duration[i]=='8to20'){
                for(let j=8;j<20;j++){
                    sql+=" (duree like '"+j+"h%') or"
                    sql_category+=" (duree like '"+j+"h%') or"
                }
                sql+=" (duree like '20h%' )or "
                sql_category+=" (duree like '20h%' )or "

            }
            if(duration[i]=='plus20'){
                for(let j=1;j<20;j++){
                    sql+=" (duree  not like'"+j+"h%' and"
                    sql_category+=" (duree  not like'"+j+"h%' and"

                }
                sql+=" duree not like '20h%' ) or "
                sql_category+=" duree not like '20h%' ) or "
            }
        
        }
    }
}

sql+=")"
sql_category+=")"
}

if(price){
  if(price=="free"){
    sql+="and prix=0";
    sql_category+="and prix=0";
  }    
}






console.log("sort by "+req.query.sortby);
if(req.query.sortby=="recent"){
    sql+=" order by date_creation desc"
   // sql_category+=" order by date_creation desc"
}
console.log("haw l category "+req.query.category);
console.log("haw e req "+ sql)
console.log("haw e req  category"+ sql_category)
let sleep1 = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));
await sleep1(50);

let arr_nb_category=[];
for(let i=0;i<arr_sql_category.length;i++){
console.log("e requette "+sql_category+arr_sql_category[i])
    mysqlConnection.query(sql_category+arr_sql_category[i],(err,rows)=>{
        if(!err){
            arr_nb_category[i]=rows;
        }
    })


}
await sleep1(50);
for(let i=0;i<arr_nb_category.length;i++){
    console.log("nb category"+arr_nb_category[i].length)
}


let sortby=req.query.sortby;

let link="/courses_list?page=1"






let arr=[];
let arr2=[];
if(category){
    if(typeof(category)=="string"){
        arr[0]="&category="+category;
        }else{
            for(let i=0;i<category.length;i++){
                arr.push("&category="+category[i]);
               }
        }
}
if(price){
    console.log("price   === "+price)
            arr2[0]="&price="+price;
    }

let arr3= arr.concat(arr2)

let str= arr3.join('');

console.log("str jdida = "+str);
link+=str
if(the_search){
link+="&search="+the_search;
}
let link1;
if(sortby){
    link1=link+"&sortby="+sortby;
}

if(the_search){
    link1=link
}



let arr_duration=["lthan3","4to7","8to20","plus20"];
let arr_duration1=["Less than 3 hours","4 - 7 hours","8 -20 hours","+ 20  Hours"];

const sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));
await sleep(50);

if(!category){
   category="NULL";
}
if(!price){
    price="NULL";
 }
 if(!duration){
    duration="NULL";
 }
let arr_price=["all","free","paid"]


let type_of_cat=typeof(category)
let type_of_dur=typeof(duration)

console.log("hey l cat == "+category)
let url = req.url



if(req.query.page<10){
    url= url.slice(20)
}else if(req.query.page<100){
    url= url.slice(21)
}else if(req.query.page<1000){
    url= url.slice(22)
}


console.log("haw e lien " + url)
    mysqlConnection.query(sql,async (err,rows)=>{
       
        if(!err){   
            let page=  req.query.page;
            let nb_pages=Math.ceil((rows.length)/3);
            let end=page*3-1;
            let start= end-2;
            
console.log("nb page start end   ==== "+nb_pages+" "+ start +" "+ end)
           let arr_formateur=[]; 
         for(let i=0;i<rows.length;i++){
            mysqlConnection.query("select * from formateur where id_formateur=?",[rows[i].id_formateur],(err,rows)=>{
                if(!err){
                    arr_formateur[i]=rows[0];
                }
            })
         }   
         const sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));
         await sleep(50);      
          res.render("user/courses_list",{url,page,start,end,nb_pages,arr_nb_category,arr_formateur,arr_duration1,type_of_dur,type_of_cat,data:rows,link: link,link1:link1,sortby:req.query.sortby,category:req.query.category, arr_category:arr_category,arr_price,price,arr_duration,duration})
        }else{
            console.log(err)
        }
     
     
    })


}
async gotofiltredlist(req,res){
    console.log(req.url)
    if(req.url=="/courses_list"){
        console.log("mrigl")
    }else{
        console.log("mouch mrigl")
    }
    console.log("sort by "+req.query.sortby);
   console.log("selected "+req.body.category)
   
   let category=req.body.category
   let duration=req.body.duration
   let sortby=req.query.sortby

   console.log("sort ==="+sortby)
   console.log("link ==== "+ req.body.the_link)
   let price=req.body.price
//   console.log("category "+category.length)
  
let arr=[];

let arr2=[];
let arr4=[];
if(category){
    if(typeof(category)=="string"){
        arr[0]="&category="+category;
        }else{
            for(let i=0;i<category.length;i++){
                arr.push("&category="+category[i]);
               }
        }
}
if(duration){
    if(typeof(duration)=="string"){
        arr4[0]="&duration="+duration;
        }else{
            for(let i=0;i<duration.length;i++){
                arr4.push("&duration="+duration[i]);
               }
        }
}

if(price){
    console.log("price   === "+price)
            arr2[0]="&price="+price;
    }

let arr3= arr.concat(arr4).concat(arr2)

let str= arr3.join('');

console.log("haw lien "+req.url.category)


let the_search= req.body.search;
let the_search1=req.query.search;
if(the_search){
    console.log("hawahi the search "+the_search)
    str="&search="+the_search;
}
/*
if(the_search1){
    console.log("hawahi the search 1 "+the_search1)
    str="search="+the_search1+str;
}*/


let link="";

if(req.body.the_link){
    link= req.body.the_link;
    console.log("haw link "+ link)
}

let position1 = link.search("search");
let newsearch='';
if(position1>-1){
     newsearch=link.slice(position1+7);
    console.log("the new search ==="+newsearch);
    str+="&search="+newsearch;
}
console.log("hey l str = "+str);


console.log("nlawej 3a search "+link.search("sortby"));
let position = link.search("sortby");
let newsortby='';
if(position>-1){
     newsortby=link.slice(position+7);
    console.log("the new sort by ==="+newsortby);
    str+="&sortby="+newsortby;
}
console.log("hey l str 1= "+str);








if(req.url=="/courses_list?sortby=recent")   {
    console.log("d5alt lenna "+req.url);
    res.redirect(req.url+str)
}else{
    console.log("d5alt lenna1 "+req.url);
    res.redirect("/courses_list?page=1"+str)
}

    
    }

    editProfile  (req, res)  {
        console.log(this._phone)
    mysqlConnection.query(
        "UPDATE user set userName = ?,email = ?,firstName=? ,lastName=?, phone = ? , gender= ?, levelOfStudy= ? WHERE id= ?",
        [this._fname+" "+this._lname, this._email,this._fname,this._lname, this._phone,this._gender,this._niveau ,this._id], (err, rows, fields) => {
if(!err){
    req.flash('message_success','user updated successfully!!')
    return res.redirect("/profile")
}else{
    console.log(err);
}

        }
    );
};

async editPassword  (req, res)  {
    
    const {error} = changePassword(req.body);
    if(error){
        req.flash('message',(error.details[0].message))
        return res.redirect("/profile")
    }// return res.redirect('/profile/?error=' + encodeURIComponent(error.details[0].message)); 
    
    let  user={};
    console.log("l id "+this._id)
    mysqlConnection.query(
        "SELECT * FROM user WHERE id= ?",
        [this._id], (err, rows, fields) => {
            rows.length ? user=rows[0] : user={};
        }
        
    );
    const sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));
    await sleep(1000);

    console.log("l password: "+user.password);
    const validPass = await bcrypt.compare(req.body.Password,user.password);
    if(!validPass){
        req.flash('message','Invalid Password')
        return res.redirect("/profile")
    } //return res.redirect('/profile/?error=' + encodeURIComponent('Invalid Password'));

//salting
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(this._password, salt);

mysqlConnection.query(
    "UPDATE user set password= ? WHERE id= ?",
    [hashedPassword ,this._id], (err, rows, fields) => {
     //   !err ? res.redirect('/profile/?success=' + encodeURIComponent('user updated successfully!!')) : console.log(err);
        if(!err){
            req.flash('message_success','password updated successfully!!')
            return res.redirect("/profile")
        }else{
            console.log(err)
        }
    }
);
};


}






module.exports = User;