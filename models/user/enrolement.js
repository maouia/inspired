const mysqlConnection = require('../database');





class Enrolement {
    constructor(id_enrolement,id_etudiant,id_formation) {
        
        this.id_enrolement = id_enrolement;
        this.id_etudiant = id_etudiant ;
        this.id_formation = id_formation;
        
    }

 async   addtoenrolement(req,res){
    mysqlConnection.query(
        "select * from user where id=?",
        [this.id_etudiant], async(err, rows, fields) => {
           if(!err){
            let prixformation=[];
            mysqlConnection.query(
                "select * from formation where id_form=?",[this.id_formation], (err, rows, fields) => {
                    console.log(rows)
                    prixformation[0] = rows[0].prix
                    console.log("prix formation "+prixformation[0])
                }
            );
            const sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));
        
            await sleep(50);
if(rows[0].solde<prixformation[0]){
    //res.redirect("/courses_single/"+this.id_formation+'?error=' + encodeURIComponent('solde insuffisant!!'))
    req.flash('message','solde insuffisant!!')
    return res.redirect("/courses_single/"+this.id_formation)
}else{
    
    console.log("prix formation 2"+prixformation[0])
    mysqlConnection.query(
        "UPDATE user SET solde =? WHERE user.id =?",
        [rows[0].solde-prixformation[0],rows[0].id], (err, rows, fields) => {
        }
    );
    mysqlConnection.query(
        "INSERT INTO enroulement (id_etudiant, id_formation,id_format) VALUES (?,?,?)",
        [this.id_etudiant,this.id_formation,2], (err, rows, fields) => {
          //  !err ? res.redirect("/mycourses/"+this.id_etudiant+'?success=' + encodeURIComponent('added succefully')) : console.log(err);
      if(!err){
        req.flash('message_success','added succefully')
        return res.redirect("/mycourses")
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

}





module.exports = Enrolement;