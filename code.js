const readFile = async () => await Deno.readFile("./imageset1/stop03.ppm");
import { bgRgb24 } from "jsr:@std/fmt/colors";

let index = 0;

const readHeader = (imageData) => {
  while (
    imageData[index] === 0x20 || imageData[index] === 0x0A ||
    imageData[index] === 0x0D ||
    imageData[index] === 0x09
  ) {
    index++;
  }

  if (imageData[index] === 0x23) {
    while (imageData[index] !== 0x0A) index++;
    return readHeader(imageData);
  }

  let token = "";

  while (imageData[index] > 0x20) {
    token += String.fromCharCode(imageData[index]);
    index++;
  }

  return token;
};

const getPixel = (x, y, width, pixels) => {
  const i = (y * width + x) * 3;
  return { r: pixels[i], g: pixels[i + 1], b: pixels[i + 2] };
};

const generateImageStr = (x, width, pixels) => {
  let line = "";

  for (let y = 0; y < width; y++) {
    const { r, g, b } = getPixel(y, x, width, pixels);

    line += bgRgb24(" ", { r, g, b });
  }

  console.log(line);
};

const main = async () => {
  const imageData = await readFile();
  const token = readHeader(imageData);
  if (token !== "P6") throw new Error("P6 allowed");
  const width = Number(readHeader(imageData));
  const height = Number(readHeader(imageData));
  const maxValue = Number(readHeader(imageData));

  const pixelCount = width * height;
  const pixels = new Uint8Array(pixelCount * 3);

  for (let p = 0; p < pixelCount * 3; p++) {
    pixels[p] = imageData[index++];
  }

  for (let x = 0; x < height; x++) {
    const imageStr = generateImageStr(x, width, pixels);
    console.log(imageStr);
  }
};

main();
