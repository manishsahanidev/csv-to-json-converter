import fs from "fs";
import readline from "readline";

export async function parseCSV(filePath) {
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  const headers = [];
  const data = [];

  for await (const line of rl) {
    const values = line.split(",");
    if (!headers.length) {
      headers.push(...values.map((header) => header.trim()));
    } else {
      const obj = {};
      values.forEach((value, index) => {
        const header = headers[index];
        const keys = header.split(".");
        keys.reduce((acc, key, i) => {
          if (i === keys.length - 1) {
            acc[key] = value.trim();
          } else {
            acc[key] = acc[key] || {};
          }
          return acc[key];
        }, obj);
      });
      // Validate and add data
      if (obj.age) {
        data.push(obj);
      } else {
        console.warn("Skipping record with missing age:", obj);
      }
    }
  }
  return data;
}
