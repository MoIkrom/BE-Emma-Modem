/* eslint-disable no-throw-literal */
/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable import/no-extraneous-dependencies */
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");

const xlsx = require("xlsx");
const supabase = require("../config/supabase");
// Load the UTC plugin
dayjs.extend(utc);
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
          console.log(error);
          throw error;
        }
      }
    } catch (err) {
      console.error("Error inserting records:", err);
      throw err;
    }
  },
  getAllDataModel: () =>
    new Promise((resolve, reject) => {
      supabase
        .from("target")
        .select(
          `"Status",
          "Location Name",
          "SIM Card No",
          "Site Code",
          "Site Name",
          "Location Code",
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
        .order("created_at", { ascending: false })
        .then((result) => {
          if (!result.error) {
            resolve(result.data);
          } else {
            console.log(result.error);
            reject(result);
          }
        });
    }),

  StoreOPMStatus: () =>
    new Promise((resolve, reject) => {
      supabase
        .from("target")
        .select("id, Status")
        .eq("SIM Card No", "0859199038816")
        .then((response) => {
          if (response.error) {
            console.error("Error fetching data:", response.error);
            reject(response.error);
          }
          const targetData = response.data[0];

          if (targetData && targetData.Status === null) {
            // Lakukan update jika Status sebelumnya null
            supabase
              .from("target")
              .update({ Status: "+RESET:OK" })
              .eq("id", targetData.id)
              .then((updateResponse) => {
                if (updateResponse.error) {
                  console.error("Error updating data:", updateResponse.error);
                  reject(updateResponse.error);
                } else {
                  console.log("Data updated successfully");
                  resolve(updateResponse.data);
                }
              });
          } else {
            console.log(
              "No data found for SIM Card No 0859199038816 or Status is already set"
            );
            resolve(targetData); // Mengembalikan data yang ditemukan (mungkin null)
          }
        })
        .catch((error) => {
          console.error("Error fetching or updating data:", error);
          reject(error);
        });
    }),

  getAllDataperDay: () =>
    new Promise((resolve, reject) => {
      const todayUTCStart = dayjs().utc().startOf("day").format();
      const todayUTCEnd = dayjs().utc().endOf("day").format();
      supabase
        .from("target")
        .select(
          `"Status",
            "Location Name",
            "SIM Card No",
            "Site Code",
            "Site Name",
            "Location Code",
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
        // .eq("created_at", today)
        .gte("created_at", todayUTCStart) // Greater than or equal to start of the day UTC
        .lte("created_at", todayUTCEnd)
        .then((result) => {
          if (!result.error) {
            resolve(result.data);
          } else {
            console.log(result.error);
            reject(result);
          }
        });
    }),
  getCountDataperDay: () =>
    new Promise((resolve, reject) => {
      const todayUTCStart = dayjs().utc().startOf("day").format();
      const todayUTCEnd = dayjs().utc().endOf("day").format();

      supabase
        .from("target")
        .select("*", { count: "exact", head: true }) // Efficiently get data and count
        .gte("created_at", todayUTCStart)
        .lte("created_at", todayUTCEnd)
        .then((result) => {
          if (!result.error) {
            // const { data } = result; // Access both data and count
            const { count } = result;
            resolve({ count }); // Return both data and count
          } else {
            console.log(result.error);
            reject(result);
          }
        });
    }),
  getCountsuccessDaily: () =>
    new Promise((resolve, reject) => {
      const todayUTCStart = dayjs().utc().startOf("day").format();
      const todayUTCEnd = dayjs().utc().endOf("day").format();

      supabase
        .from("target")
        .select("created_at", { count: "exact", head: true })
        .filter("Status", "eq", "+RESET:OK")
        .gte("created_at", todayUTCStart)
        .lte("created_at", todayUTCEnd)
        .then((result) => {
          if (!result.error) {
            // const { data } = result; // Access both data and count
            const { count } = result;
            resolve({ count }); // Return both data and count
          } else {
            console.log(result.error);
            reject(result);
          }
        });
    }),
  getCountDataperMonth: () =>
    new Promise((resolve, reject) => {
      const today = dayjs().utc(); // Get current date in UTC
      const monthStart = today.startOf("month").format(); // Format month start in UTC
      const monthEnd = today.endOf("month").format(); // Format month end in UTC

      supabase
        .from("target")
        .select(
          "created_at                                                                                     ",
          { count: "exact", head: true }
        ) // Efficiently get data and count
        .gte("created_at", monthStart)
        .lte("created_at", monthEnd)
        .then((result) => {
          if (!result.error) {
            // const { data } = result; // Access both data and count
            const { count } = result;
            resolve({ count }); // Return both data and count
          } else {
            console.log(result.error);
            reject(result);
          }
        });
    }),
  getCountsuccessMonthly: () =>
    new Promise((resolve, reject) => {
      const today = dayjs().utc(); // Get current date in UTC
      const monthStart = today.startOf("month").format(); // Format month start in UTC
      const monthEnd = today.endOf("month").format(); // Format month end in UTC

      supabase
        .from("inboxApi")
        .select("created_at", { count: "exact", head: true })
        .filter("sms", "eq", "+RESET:OK")
        .gte("created_at", monthStart)
        .lte("created_at", monthEnd)
        .then((result) => {
          if (!result.error) {
            // const { data } = result; // Access both data and count
            const { count } = result;
            resolve({ count }); // Return both data and count
          } else {
            console.log(result.error);
            reject(result);
          }
        });
    }),
  searchData: (data) =>
    new Promise((resolve, reject) => {
      supabase
        .from("target")
        .select(
          `"Status",
            "Location Name",
            "SIM Card No",
            "Site Code",
            "Site Name",
            "Location Code",
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
        .ilike("SIM Card No", `%${data}%`)
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
