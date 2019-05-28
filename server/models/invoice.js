const connection = require("../lib/connection.js");

let Invoice = function (params) {
  this.invoiceNo = params.invoiceno,
    this.invoiceDate = params.invoicedate,
    this.customerId = params.customerId,
    this.year = params.year,
    this.month = params.month,
    this.amount = params.amount,
    this.generated_on = params.generated_on,
    this.generated_by = params.generated_by
};

Invoice.prototype.generate = function () {
  const that = this;
  return new Promise(function (resolve, reject) {
    //get mysql connection
    connection.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }
      console.log(that)
      //get customer Ids where invoice to be created
      connection.query("SELECT S.customerId,sum(qty* amount) as tot_amount " +
        "FROM customer C INNER JOIN schedule S ON C.id=S.customerId INNER JOIN tiffin_schedule T ON S.id = T.scheduleId " +
        "WHERE  S.month=? and S.year =? group by S.customerId having sum(qty*amount) >0 order by S.customerId", [that.month, that.year], function (error, results, fields) {
          if (!error) {
            if (results.length != 0) {
              results.map((invoice) => {
                var query = connection.query('INSERT INTO invoice(invoiceDate,customerId,year,month,amount,generated_by) VALUES (STR_TO_DATE("01,' + (that.month + 1) + ',' + that.year + '","%d,%m,%Y")' + ',"' + invoice.customerId + '","' + that.year + '","' + that.month + '","' + invoice.tot_amount + '","' + that.generated_byBy + '")', function (error, rows, fields) {
                  //console.log(query.sql)
                  if (!error) {
                    //get invoice details and insert into invoice_detail table
                    connection.query("SELECT S.customerId,tiffintype,sum(qty) as tot_qty,sum(qty*amount) as tot_amount,Group_concat(case when (qty=0 or qty is null) then null when qty=1 then CONCAT(day) else CONCAT(day,'-Q',qty) end  order by day) as month_details, case when tiffinType=1 then lunch_amount/lunch_qty when tiffinType=2 then dinner_amount/dinner_qty when tiffinType=4 then 	breakfast_amount/breakfast_qty  end as rate " +
                      "FROM customer C INNER JOIN schedule S ON C.id=S.customerId INNER JOIN tiffin_schedule T ON S.id = T.scheduleId " +
                      "WHERE  S.month=? and S.year =? and S.customerId=? group by S.customerId,tiffintype having sum(qty*amount) >0 order by S.customerId,tiffintype", [that.month, that.year, invoice.customerId], function (error, results, fields) {
                        if (!error) {
                          if (results.length != 0) {
                            results.map((invoice_details) => {
                              var query = connection.query('INSERT INTO invoice_detail(invoiceNo,tiffintype,totQty,totAmount,tiffinDayDetails,rate) VALUES ("' + rows.insertId + '","' + invoice_details.tiffintype + '","' + invoice_details.tot_qty + '","' + invoice_details.tot_amount + '","' + invoice_details.month_details + '","' + invoice_details.rate + '")', function (error, rows, fields) {
                                if (!error) {
                                  resolve(rows);
                                } else {
                                  console.log("Error...", error);
                                  reject(error);
                                }
                              });
                            });
                          }
                        }
                      });
                  }
                });
              });
            }
          }
        });

      connection.release();
      console.log('Generate Invoice Process Complete %d', connection.threadId);
    });
  });
}

Invoice.prototype.getall = function (month, year) {
  const that = this;
  return new Promise(function (resolve, reject) {
    //get mysql connection
    connection.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }
      //get customer Ids where invoice to be created
      var query = connection.query("select A.*,DATE_FORMAT(invoiceDate,'%d-%m-%Y') as invoiceDate_ddmmyyyy from invoice A where month=?and year =? order by customerId", [month, year], function (error, rows, fields) {
        if (!error) {
          resolve(rows);
        } else {
          console.log("Error...", error);
          reject(error);
        }
        connection.release();
        console.log('Get all Invoices Process Complete %d', connection.threadId);
      });
    });

  });
}

Invoice.prototype.getInvoiceDetails = function (invoiceNo) {
  const that = this;
  return new Promise(function (resolve, reject) {
    //get mysql connection
    connection.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }
      //get customer Ids where invoice to be created
      var query = connection.query("select * from invoice_detail where invoiceNo=?", [invoiceNo], function (error, rows, fields) {
        if (!error) {
          resolve(rows);
        } else {
          console.log("Error...", error);
          reject(error);
        }
        connection.release();
        console.log('Get Invoice Details Process Complete %d', connection.threadId);
      });
    });

  });
}

Invoice.prototype.invoiceExistformonth = function (month, year) {
  const that = this;
  return new Promise(function (resolve, reject) {
    //get mysql connection
    connection.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }
      var query = connection.query("select count(*) as invoice_exist from invoice where month=? and year=?", [month, year], function (error, rows, fields) {
        if (!error) {
          resolve(rows[0]);
        } else {
          console.log("Error...", error);
          reject(error);
        }
        connection.release();
        console.log('invoiceExistformonth Process Complete %d', connection.threadId);
      });
    });

  });
}



module.exports = Invoice;