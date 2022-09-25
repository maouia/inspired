const mysqlConnection = require('../database');





class Payement {
    constructor(id_payement,code_payement,somme,commentaire,photo_payement,etat,id_etudiant,date) {
        
        this.id_payement = id_payement;
        this.code_payement = code_payement;
        this.somme = somme;
        
        this.commentaire = commentaire;
        this.photo_payement = photo_payement;
        this.etat = etat;
        this.id_etudiant = id_etudiant;
        this.date = date;
    }

pay(req,res){
    mysqlConnection.query(
        "INSERT INTO payement (code_payement, somme, commentaire,photo_payement, id_etudiant, date,etat) VALUES (?,?,?,?,?,NOW(),?)",
        [this.code_payement,this.somme,this.commentaire,this.photo_payement,this.id_etudiant,this.etat], (err, rows, fields) => {
           // !err ? res.redirect("/payement/"+this.id_etudiant+'?success=' + encodeURIComponent('payement added succefully')) : console.log(err);
        if(!err){
            req.flash('message_success','payement added succefully')
            return res.redirect("/payement")
        }else{
            console.log(err)
        }
        
        }
    );


}

}





module.exports = Payement;