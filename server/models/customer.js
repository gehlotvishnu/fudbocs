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
    this.isActive = params.isActive,
    this.breakfast = params.breakfast,
    this.breakfast_qty = params.breakfast,
    this.breakfast_amount = params.breakfast_amount,
    this.lunch = params.lunch,
    this.lunch_qty = params.lunch_qty,
    this.lunch_amount = params.lunch_amount,
    this.dinner = params.dinner,
    this.dinner_qty = params.dinner_qty,
    this.dinner_amount = params.dinner_amount,
    this.exclude_MON = params.exclude_MON,
    this.exclude_TUE = params.exclude_TUE,
    this.exclude_WED = params.exclude_WED,
    this.exclude_THU = params.exclude_THU,
    this.exclude_FRI = params.exclude_FRI,
    this.exclude_SAT = params.exclude_SAT,
    this.exclude_SUN = params.exclude_SUN
};

Customer.prototype.add = function () {
  const that = this;
  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }
      console.log(that)
      connection.query('INSERT INTO customer(_id,name,gender,HouseNo,GaliSector,Area,City,Landmark,mobile,email,remark,isActive,createdBy,breakfast, breakfast_qty, breakfast_amount, lunch, lunch_qty, lunch_amount, dinner, dinner_qty, dinner_amount, exclude_MON, exclude_TUE, exclude_WED, exclude_THU, exclude_FRI, exclude_SAT, exclude_SUN) VALUES (unhex(replace(uuid(),"-",""))' + ',"' + that.name + '","' + that.gender + '","' + that.HouseNo + '","' + that.GaliSector + '","' + that.Area + '","' + that.City + '","' + that.Landmark + '","' + that.mobile + '","' + that.email + '","' + that.remark + '","' + that.isActive + '","' + that.createdBy + '",' + that.breakfast + ',' + that.breakfast_qty + ',' + that.breakfast_amount + ',' + that.lunch + ',' + that.lunch_qty + ',' + that.lunch_amount + ',' + that.dinner + ',' + that.dinner_qty + ',' + that.dinner_amount + ',' + that.exclude_MON + ',' + that.exclude_TUE + ',' + that.exclude_WED + ',' + that.exclude_THU + ',' + that.exclude_FRI + ',' + that.exclude_SAT + ',' + that.exclude_SUN + ')', function (error, rows, fields) {
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
      connection.query('select id, hex(_id) as _id, name,gender,HouseNo,GaliSector,Area,City,Landmark,mobile, email, remark, isActive, createdBy,breakfast, breakfast_qty, breakfast_amount, lunch, lunch_qty, lunch_amount, dinner, dinner_qty, dinner_amount, exclude_MON, exclude_TUE, exclude_WED, exclude_THU, exclude_FRI, exclude_SAT, exclude_SUN from customer', function (error, rows, fields) {

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
      var query = connection.query('select id, hex(_id) as _id, name,gender,HouseNo,GaliSector,Area,City,Landmark,mobile, email, remark, isActive, dateTimeCreated,createdBy,breakfast, breakfast_qty, breakfast_amount, lunch, lunch_qty, lunch_amount, dinner, dinner_qty, dinner_amount, exclude_MON, exclude_TUE, exclude_WED, exclude_THU, exclude_FRI, exclude_SAT, exclude_SUN from customer where id=?', [customerId], function (error, rows, fields) {
        if (!error) {
          resolve(rows[0]);
        } else {
          console.log("Error...", error);
          reject(error);
        }
        connection.release();
        console.log('Get Customer ById  Complete %d', connection.threadId);
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

      var query = connection.query('select c.id, hex(_id) as _id,name,gender,HouseNo,GaliSector,Area,City,Landmark,mobile, email, remark, c.isActive,c.dateTimeCreated from customer c inner join schedule s on c.id = s.customerId inner join tiffin_schedule ts on s.id = ts.scheduleId where c.isActive=? and s.year = ? and s.month = ? and ts.day = ? and ts.tiffinType in (?) and ts.isActive = 1', [isActive, params.date.getFullYear(), params.date.getMonth() + 1, params.date.getDate(), params.tiffinType], function (error, rows, fields) {
        //console.log(query.sql)
        if (!error) {
          resolve(rows);
        } else {
          console.log("Error...", error);
          reject(error);
        }

        connection.release();
        console.log('Customer Filter Process Complete %d', connection.threadId);
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
      connection.query('UPDATE customer SET name="' + that.name + '",gender="' + that.gender + '",HouseNo="' + that.HouseNo + '",GaliSector="' + that.GaliSector + '",Area="' + that.Area + '",City="' + that.City + '",Landmark="' + that.Landmark + '",mobile="' + that.mobile + '",email="' + that.email + '",remark="' + that.remark + '",isActive="' + that.isActive + '",breakfast="' + that.breakfast + '",breakfast_qty="' + that.breakfast_qty + '",breakfast_amount="' + that.breakfast_amount + '",lunch="' + that.lunch + '",lunch_qty="' + that.lunch_qty + '",lunch_amount="' + that.lunch_amount + '",dinner="' + that.dinner + '",dinner_qty="' + that.dinner_qty + '",dinner_amount="' + that.dinner_amount + '",exclude_MON="' + that.exclude_MON + '",exclude_TUE="' + that.exclude_TUE + '",exclude_WED="' + that.exclude_WED + '",exclude_THU="' + that.exclude_THU + '",exclude_FRI="' + that.exclude_FRI + '",exclude_SAT="' + that.exclude_SAT + '",exclude_SUN="' + that.exclude_SUN + '" where id=' + that.id, function (error, rows, fields) {
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

Customer.prototype.set_isActive = function (customerId, isActive) {
  const that = this;
  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }
      connection.query('UPDATE customer SET isActive="' + isActive + '" where id=' + customerId, function (error, rows, fields) {
        if (!error) {
          resolve(rows);
        } else {
          console.log("Error...", error);
          reject(error);
        }

        connection.release();
        console.log('set_isActive Process Complete %d', connection.threadId);
      });
    });
  });
};


module.exports = Customer;