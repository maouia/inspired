
const Employee =require("../../../project/project/models/emplyee");

exports.fetch = (req,res,next)=>{

    var employee = new Employee(req.body.Name,req.body.Email,req.body.EmpCode,req.body.Salary);
    employee.fetch(req,res);
    }

    exports.insert = (req,res,next)=>{
        var employee = new Employee(req.body.Name,req.body.Email,req.body.EmpCode,req.body.Salary);
        employee.insert(req,res);
        }

        exports.update = (req,res,next)=>{
            var employee = new Employee(req.body.Name,req.body.Email,req.body.EmpCode,req.body.Salary);
            employee.update(req,res);
            }
            exports.delete = (req,res,next)=>{
                var employee = new Employee(req.body.Name,req.body.Email,req.body.EmpCode,req.body.Salary);
                employee.delete(req,res);
                }