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
  getCountData,
  searchData,
  getCountDataperDay,
  getCountDataperMonth,
  getAllNumbers,
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
    const { page, limit } = request.query;
    const pageInt = parseInt(page, 10) || 1;
    const limitInt = parseInt(limit, 10) || 10;
    const offset = (pageInt - 1) * limitInt;

    try {
      const data = await getAllDataModel(limitInt, offset);
      const count = await getCountData();
      const totalPages = Math.ceil(count / limitInt);

      return wrapper.response(response, 200, "Success Get Data!", {
        data,
        totalPages,
        currentPage: pageInt,
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
      // Panggil getAllNumbers untuk mendapatkan daftar nomor SIM Card
      const simCardNumbers = await getAllNumbers();

      // Mengubah nomor SIM Card yang dimulai dengan '8' atau '08' menjadi format '+62'
      const promises = simCardNumbers.map(async (entry) => {
        let simCardNo = entry["SIM Card No"];

        // Pastikan simCardNo memiliki nilai yang valid
        if (simCardNo) {
          // Menghilangkan karakter single quote (') atau backtick (`) jika ada
          simCardNo = simCardNo.replace(/['`]/g, "");

          // Menggunakan regex untuk memeriksa dan mengubah nomor menjadi format '+62'
          simCardNo = simCardNo.replace(/^0?8/, "+628");

          const { data: messages, error } = await supabase
            .from("inboxApi")
            .select("sms")
            .eq("msisdn", simCardNo);

          if (error) {
            console.error(
              `Error fetching messages for sender ${simCardNo}:`,
              error
            );
            return res.status(500).json({ error: "Error fetching messages" });
          }
          // Jika ada pesan yang ditemukan, tambahkan ke finalResults
          if (messages && messages.length > 0) {
            return {
              "SIM Card No": simCardNo,
              message: messages[0]?.sms, // Mengambil pesan pertama dari hasil query
            };
          }
          return {
            "SIM Card No": simCardNo,
            message: "Modem No Respon",
          };
        }
        // Jika simCardNo tidak valid, kembalikan entry asli
        return entry;
      });
      // Array untuk menyimpan hasil akhir yang akan dikirim sebagai respons
      const finalResults = await Promise.all(promises);

      // Mengirimkan respons JSON dengan data finalResults ke client
      return res.status(200).json(finalResults);
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
