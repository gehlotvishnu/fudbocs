const connection = require("../lib/connection.js");
let Customer = function (params) {
  this.id = params.id,
    this.name = params.name,
    this.gender = params.gender,
    this.HouseNo = params.HouseNo,
    this.GaliSector = params.GaliSector,
    this.Area = params.Area,
    this.City = params.City,
    this.Landmark = params.Landmark,
    this.mobile = params.mobile,
    this.email = params.email,
    this.remark = params.remark,
    this.createdBy = params.createdBy,
    this.isActive = params.isActive
};

Customer.prototype.add = function () {
  const that = this;
  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }
      console.log(that)
      connection.query('INSERT INTO customer(_id,name,gender,HouseNo,GaliSector,Area,City,Landmark,mobile,email,remark,isActive,createdBy) VALUES (unhex(replace(uuid(),"-",""))' + ',"' + that.name + '","' + that.gender + '","' + that.HouseNo + '","' + that.GaliSector + '","' + that.Area + '","' + that.City + '","' + that.Landmark + '","' + that.mobile + '","' + that.email + '","' + that.remark + '","' + that.isActive + '","' + that.createdBy + '")', function (error, rows, fields) {
        if (!error) {
          resolve(rows);
        } else {
          console.log("Error...", error);
          reject(error);
        }

        connection.release();
        console.log('Process Complete %d', connection.threadId);
      });
    });
  });
};

Customer.prototype.all = function () {
  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }
      connection.query('select id, hex(_id) as _id, name,gender,HouseNo,GaliSector,Area,City,Landmark,mobile, email, remark, isActive, createdBy from customer', function (error, rows, fields) {

        if (!error) {
          resolve(rows);
        } else {
          console.log("Error...", error);
          reject(error);
        }

        connection.release();
        console.log('Process Complete %d', connection.threadId);
      });
    });
  });
};

Customer.prototype.getById = function (customerId) {
  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }
      connection.query('select id, hex(_id) as _id, name,gender,HouseNo,GaliSector,Area,City,Landmark,mobile, email, remark, isActive, dateTimeCreated,createdBy from customer where id=?', [customerId], function (error, rows, fields) {
        if (!error) {
          resolve(rows[0]);
        } else {
          console.log("Error...", error);
          reject(error);
        }

        connection.release();
        console.log('Process Complete %d', connection.threadId);
      });
    });
  });
};

Customer.prototype.filter = function (params) {
  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }

      const isActive = 1;

      connection.query('select c.id, hex(_id) as _id,name,gender,HouseNo,GaliSector,Area,City,Landmark,mobile, email, remark, c.isActive,c.dateTimeCreated from customer c inner join schedule s on c.id = s.customerId inner join tiffin_schedule ts on s.id = ts.scheduleId where c.isActive=? and s.year = ? and s.month = ? and ts.day = ? and ts.tiffinType in (?) and ts.isActive = 1', [isActive, params.date.getFullYear(), params.date.getMonth() + 1, params.date.getDate(), params.tiffinType], function (error, rows, fields) {

        if (!error) {
          resolve(rows);
        } else {
          console.log("Error...", error);
          reject(error);
        }

        connection.release();
        console.log('Process Complete %d', connection.threadId);
      });
    });
  });
};

Customer.prototype.update = function () {
  const that = this;
  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }
      connection.query('UPDATE customer SET name="' + that.name + '",gender="' + that.gender + '",HouseNo="' + that.HouseNo + '",GaliSector="' + that.GaliSector + '",Area="' + that.Area + '",City="' + that.City + '",Landmark="' + that.Landmark + '",mobile="' + that.mobile + '",email="' + that.email + '",remark="' + that.remark + '",isActive="' + that.isActive + '" where id=' + that.id, function (error, rows, fields) {
        if (!error) {
          resolve(rows);
        } else {
          console.log("Error...", error);
          reject(error);
        }

        connection.release();
        console.log('Process Complete %d', connection.threadId);
      });
    });
  });
};


module.exports = Customer;