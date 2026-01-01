import { bgRgb24 } from "jsr:@std/fmt/colors";
const readFile = async () => await Deno.readFile("./imageset1/znonstop01.ppm");

const readHeader = (imageData, index) => {
  while (
    imageData[index[0]] === 0x20 ||
    imageData[index[0]] === 0x0A ||
    imageData[index[0]] === 0x0D ||
    imageData[index[0]] === 0x09
  ) {
    index[0]++;
  }

  if (imageData[index[0]] === 0x23) {
    while (imageData[index[0]] !== 0x0A) index[0]++;
    return readHeader(imageData, index);
  }

  let token = "";

  while (imageData[index[0]] > 0x20) {
    token += String.fromCharCode(imageData[index[0]]);
    index[0]++;
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

  return line;
};

const generatePixels = (height, width, imageData, index) => {
  const pixelCount = width * height;
  const pixels = new Uint8Array(pixelCount * 3);

  for (let p = 0; p < pixelCount * 3; p++) {
    pixels[p] = imageData[++index[0]];
  }

  return pixels;
};

const displayImage = (height, width, pixels) => {
  for (let x = 0; x < height; x++) {
    const imageStr = generateImageStr(x, width, pixels);
    console.log(imageStr);
  }
};

const main = async () => {
  const imageData = await readFile();
  const index = [0];

  const token = readHeader(imageData, index);
  if (token !== "P6") throw new Error("P6 allowed");

  const width = Number(readHeader(imageData, index));
  const height = Number(readHeader(imageData, index));
  const maxValue = Number(readHeader(imageData, index));

  const pixels = generatePixels(height, width, imageData, index);
  displayImage(height, width, pixels);
};

main();
