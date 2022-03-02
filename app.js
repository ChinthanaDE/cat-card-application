const { writeFile } = require("fs");
const { join } = require("path");
const blend = require("@mapbox/blend");
const argv = require("minimist")(process.argv.slice(2));
const axios = require("axios").default;

const {
  greeting = "Hello",
  who = "You",
  width = 400,
  height = 500,
  color = "Pink",
  size = 100,
} = argv;

const getImages = async (text, width, height, color, size) => {
  const API_URL = `https://cataas.com/cat/says/${text}?width=${width}&height=${height}&c=${color}&s=${size}`;
  try {
    const res = await axios.get(
      API_URL,
      { responseType: "arraybuffer" },
      {
        headers: {
          "Content-type": "image/png",
        },
      }
    );
    return { isException: false, response: res };
  } catch (err) {
    return { isException: true, error: err };
  }
};

const leftImage = getImages(greeting, width, height, color, size);
const rightImage = getImages(who, width, height, color, size);
const ImageArray = [leftImage, rightImage];

axios
  .all(ImageArray)
  .then((res) => {
    console.log(res);
    blend(
      [
        { buffer: new Buffer.from(res[0].response.data, "binary"), x: 0, y: 0 },
        {buffer: new Buffer.from(res[1].response.data, "binary"),x: width, y: 0},
      ],
      {
        width: width * 2,
        height: height,
        format: "jpeg",
      },
      (err, data) => {
        if (err) {
          console.log(err);
          return;
        }
        const fileOut = join(process.cwd(), `/cat-card.jpg`);
        writeFile(fileOut, data, "binary", (err) => {
          if (err) {
            console.log(err);
            return;
          }
          console.log("The file was saved!");
        });
      }
    );
  })
  .catch((error) => {
    console.error(error);
    return error;
  });
