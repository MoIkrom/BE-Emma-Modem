const supabase = require("../config/supabase");

module.exports = {
  getAllUser: (offset, limit) =>
    new Promise((resolve, reject) => {
      supabase
        .from("user")
        .select("id, email, username, created_at")
        .range(offset, offset + limit - 1)
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
};
