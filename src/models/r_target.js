/* eslint-disable no-throw-literal */
/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable import/no-extraneous-dependencies */
const xlsx = require("xlsx");
const supabase = require("../config/supabase");

module.exports = {
  store: async (filePath) => {
    try {
      const workbook = xlsx.readFile(filePath);
      const sheetNameList = workbook.SheetNames;
      const jsonData = xlsx.utils.sheet_to_json(
        workbook.Sheets[sheetNameList[0]]
      );

      for (const record of jsonData) {
        const { error } = await supabase.from("target").insert(record);
        if (error) {
          throw error;
        }
      }
    } catch (err) {
      console.error("Error inserting records:", err);
      throw err;
    }
  },
  getAllDataModel: (limit, offset) =>
    new Promise((resolve, reject) => {
      supabase
        .from("target")
        .select(
          `
          "Location Name",
          "SIM Card No",
          "Site Code",
          "Site Name",
          "Location Code",
          "Read Date",
          "Message Offline",
          "Meter No",
          "Meter Brand - Type",
          "Comm Device No",
          "Comm Device Brand - Type",
          "Comm Type",
          "Comm Port",
          "SIM Card Provider",
          "IP"
          `
        )
        .range(offset, offset + limit - 1)
        // .order("created_at", { ascending: false })
        .then((result) => {
          if (!result.error) {
            resolve(result.data);
          } else {
            console.log(result.error);
            reject(result);
          }
        });
    }),

  getCountData: () =>
    new Promise((resolve, reject) => {
      supabase
        .from("target")
        .select("*", { count: "exact" })
        .then((result) => {
          if (!result.error) {
            resolve(result.count);
          } else {
            console.log(result.error);
            reject(result);
          }
        });
    }),

  getAllNumbers: () =>
    new Promise((resolve, reject) => {
      supabase
        .from("target")
        .select(`"SIM Card No"`)
        .then(({ data, error }) => {
          if (error) {
            console.error("Error fetching SIM Card numbers:", error);
            reject(error);
          } else {
            resolve(data);
          }
        })
        .catch((error) => {
          console.error("Error in getAllNumbers:", error.message);
          reject(error);
        });
    }),

  getStatusModem: () =>
    new Promise((resolve, reject) => {
      supabase
        .from("inboxApi")
        .select("id, sms", { count: "exact" })
        .then((result) => {
          if (!result.error) {
            resolve(result.count);
          } else {
            console.log(result.error);
            reject(result);
          }
        });
    }),
};
