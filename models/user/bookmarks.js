const mysqlConnection = require('../database');





class Bookmarks {
    constructor(id_bookmarks,id_etudiant,id_formation) {
        
        this.id_bookmarks = id_bookmarks;
        this.id_etudiant = id_etudiant ;
        this.id_formation = id_formation;
        
    }

addtobookmarks(req,res){
    mysqlConnection.query(
        "select * from bookmarks where id_formation=? and id_etudiant=?",
        [this.id_formation,this.id_etudiant], (err, rows, fields) => {
           if(!err){
if(rows.length>0){
  //  res.redirect("/bookmarks/"+this.id_etudiant+'?success=' + encodeURIComponent('formation already in bookmarks!!!'))
    req.flash('message_success','course already in bookmarks!!!')
                return res.redirect("/bookmarks")
}else{
    mysqlConnection.query(
        "INSERT INTO bookmarks (id_etudiant, id_formation) VALUES (?,?)",
        [this.id_etudiant,this.id_formation], (err, rows, fields) => {
            //!err ? res.redirect("/bookmarks/"+this.id_etudiant+'?success=' + encodeURIComponent('added succefully')) : console.log(err);
            if(!err){
                req.flash('message_success','added succefully')
                return res.redirect("/bookmarks")
              }else{
                console.log(err)
              }
        }
    );

}
           }else {
            console.log(err);
           }
        }
    );

    


}
deletefrombookmarks(req,res){
    console.log("id bookmarks" + this.id_bookmarks)
    mysqlConnection.query(
        "delete from bookmarks where id_bookmarks=?",
        [this.id_bookmarks], (err, rows, fields) => {
if(!err){
    req.flash('message','deleted successfully')
    return res.redirect("/bookmarks")
}else{
    console.log(err)
}
        })
}
}





module.exports = Bookmarks;