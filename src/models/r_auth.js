const supabase = require("../config/supabase");

module.exports = {
  logout: (token) =>
    new Promise((resolve, reject) => {
      supabase
        .from("token")
        .delete()
        .eq("token_login", token)
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
};
