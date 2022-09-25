const {getAllPayment,agreePayment,rejectPayment,getOnePayment} = require('../../models/admin/payment.model');

module.exports.getAll =(req,res)=>{
   getAllPayment(req,res)
}

module.exports.agree =(req,res)=>{
agreePayment(req,res)
}

module.exports.reject =(req,res)=>{
   rejectPayment(req,res)
}

module.exports.getOne =(req,res)=>{
getOnePayment(req,res);
}