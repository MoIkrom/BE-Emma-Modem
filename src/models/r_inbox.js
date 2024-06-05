const supabase = require("../config/supabase");

module.exports = {
  storeInbox: (data) =>
    new Promise((resolve, reject) => {
      supabase
        .from("inbox")
        .insert([data])
        .select("msg, originator, receive_date, id_number, gateway_number")
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
};
