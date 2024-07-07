/* eslint-disable consistent-return */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
const { createClient } = require("@supabase/supabase-js");
const dotenv = require("dotenv");

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);
const axios = require("axios");
const {
  getAllDataModel,
  getAllDataperDay,
  searchData,
  getCountDataperDay,
  getCountDataperMonth,
  StoreOPMStatus,
  getCountsuccessDaily,
  getCountsuccessMonthly,
} = require("../models/r_target");
const wrapper = require("../utils/wrapper");

module.exports = {
  importFile: async (req, res) => {
    try {
      const jsonData = req.body; // Assuming the data is sent as JSON
      for (const record of jsonData) {
        const { error } = await supabase.from("target").insert(record);
        if (error) {
          throw error;
        }
      }
      res.status(200).send("File imported successfully");
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error importing file:", error);
      res.status(500).send("Failed to import file");
    }
  },
  getAllData: async (request, response) => {
    try {
      const data = await getAllDataModel();

      return wrapper.response(response, 200, "Success Get Data!", {
        data,
      });
    } catch (error) {
      console.log(error);
      const {
        status = 500,
        statusText = "Internal Server Error",
        error: errorData = null,
      } = error;
      return wrapper.response(response, status, statusText, errorData);
    }
  },

  // eslint-disable-next-line consistent-return
  fetchMessages: async (req, res) => {
    try {
      // Lakukan request ke API untuk mendapatkan pesan
      const url = process.env.URL_API;
      const response = await axios.get(`${url}?sts=0&jml=50`);
      const messages = response.data;

      console.log(messages);
      // Array untuk menyimpan pesan yang berhasil di-insert
      const insertedMessages = [];

      // Iterasi dan insert ke Supabase
      const keys = Object.keys(messages);
      for (const key of keys) {
        const message = messages[key];
        const { waktu, msisdn, sms, modem } = message;

        const { data, error: selectError } = await supabase
          .from("inboxApi")
          .select("id")
          .eq("msisdn", msisdn)
          .eq("waktu", waktu)
          .maybeSingle();

        if (selectError) {
          console.error(
            `Error checking existing message ${key}:`,
            selectError.message
          );
        }

        // Jika data tidak ditemukan, lakukan insert
        if (!data) {
          const { error } = await supabase.from("inboxApi").insert([
            {
              waktu,
              msisdn,
              sms: decodeURIComponent(sms),
              modem,
            },
          ]);

          if (error) {
            console.error(`Error inserting message ${key}:`, error.message);
          } else {
            console.log(`Message ${key} inserted successfully.`);
            insertedMessages.push(message);
          }
        } else {
          console.log(`Message ${key} already exists and was not inserted.`);
        }
      }

      // Mengembalikan pesan dalam format {data: {}}
      return res
        .status(200)
        .json({ message: "Success Get Inbox", newInbox: insertedMessages });
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  },

  checkStatusModem: async (req, res) => {
    try {
      // Lakukan request ke API untuk mendapatkan pesan
      const url = process.env.URL_API;
      const response = await axios.get(`${url}?sts=0&jml=50`);
      const messagesDB = response.data;
      const insertedMessages = [];

      await StoreOPMStatus();
      // Iterasi setiap pesan dari messagesDB
      Object.keys(messagesDB).forEach(async (key) => {
        const message = messagesDB[key];
        const { msisdn, sms } = message;
        const simCardNo = msisdn.replace(/['`]/g, "").replace(/^\+628/, "08");
        // Tambahkan promise operasi update ke Supabase ke dalam array

        insertedMessages.push(
          supabase
            .from("target")
            .update({ Status: decodeURIComponent(sms) })
            .eq("SIM Card No", simCardNo)
        );
      });

      // Menunggu semua operasi update selesai menggunakan Promise.all()
      await Promise.all(insertedMessages);

      res.status(200).json({ message: "Success update Status" });
    } catch (error) {
      console.error("Error in checkStatusModem:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  dataToday: async (request, response) => {
    try {
      const data = await getAllDataperDay();
      return wrapper.response(response, 200, "Success Get Data!", {
        data,
      });
    } catch (error) {
      console.log(error);
    }
  },
  // searchData: async (response) => {
  //   try {
  //     const data = await searchData();
  //     console.log(data);

  //     return wrapper.response(response, 200, "Success Get Data!", {
  //       data,
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // },
  getCountDataperDay: async (req, response) => {
    try {
      // Assuming `term` is the query parameter for search term
      const data = await getCountDataperDay(); // Call the model function with the search term
      console.log(data);

      return wrapper.response(response, 200, "Success Get Data!", {
        data,
      });
    } catch (error) {
      console.error(error);
      // Handle error appropriately, e.g., return an error response
    }
  },
  getCountDataperMonth: async (req, response) => {
    try {
      // Assuming `term` is the query parameter for search term
      const data = await getCountDataperMonth(); // Call the model function with the search term
      console.log(data);

      return wrapper.response(response, 200, "Success Get Data!", {
        data,
      });
    } catch (error) {
      console.error(error);
      // Handle error appropriately, e.g., return an error response
    }
  },
  getCountsuccessDaily: async (req, response) => {
    try {
      // Assuming `term` is the query parameter for search term
      const data = await getCountsuccessDaily(); // Call the model function with the search term
      console.log(data);

      return wrapper.response(response, 200, "Success Get Data!", {
        data,
      });
    } catch (error) {
      console.error(error);
      // Handle error appropriately, e.g., return an error response
    }
  },
  getCountsuccessMonthly: async (req, response) => {
    try {
      // Assuming `term` is the query parameter for search term
      const data = await getCountsuccessMonthly(); // Call the model function with the search term
      console.log(data);

      return wrapper.response(response, 200, "Success Get Data!", {
        data,
      });
    } catch (error) {
      console.error(error);
      // Handle error appropriately, e.g., return an error response
    }
  },
  searchData: async (req, response) => {
    try {
      const searchTerm = req.query.data; // Assuming `term` is the query parameter for search term
      const data = await searchData(searchTerm); // Call the model function with the search term
      console.log(data);

      return wrapper.response(response, 200, "Success Get Data!", {
        data,
      });
    } catch (error) {
      console.error(error);
      // Handle error appropriately, e.g., return an error response
    }
  },
};
