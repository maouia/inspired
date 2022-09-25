const mysqlConnection = require('../database');





class Employee {
    constructor(name,email,code,salary) {
        this.valid = false;
        this._name = name;
        this._email = email;
        this._code = code;
        this._salary = salary;
        
    }

//view data
fetch(req,res){
        
    mysqlConnection.query("SELECT * FROM employee", (err, rows, fields) => {
        !err ? res.render('view', { data: rows }) : console.log(err);
    });
}

insert (req, res) {
    mysqlConnection.query(
        "INSERT INTO employee (Name, EmpCode, Salary) VALUES (?,?,?)",
        [this._name, this._code, this._salary], (err, rows, fields) => {
            !err ? res.redirect("/view") : console.log(err);
        }
    );
}

update  (req, res)  {
    mysqlConnection.query(
        "UPDATE employee set Name = ?,EmpCode = ?, Salary = ? WHERE EMPID= ?",
        [this._name, this._code, this._salary, req.params.id], (err, rows, fields) => {
            !err ? res.redirect('/view?success=' + encodeURIComponent('employer updated successfully')) : console.log(err);
        }
    );
};


delete  (req, res)  {
    mysqlConnection.query(
        "DELETE FROM employee WHERE EmpID = ?", [req.params.id], (err, rows, fields) => {
            !err ? res.redirect('/view?success=' + encodeURIComponent('employer deleted successfully')) : console.log(err);
        }
    );
};
    
}

module.exports = Employee;