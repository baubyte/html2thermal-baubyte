const fs = require('fs');
const temp = require('temp');
const axios = require('axios'); 
const { Jimp } = require("jimp");

// TODO add cache for input path - output path

const getImage = (attrs) => new Promise((resolve, reject) => {
  const src = attrs.src.toString();
  if (/^data:image\/.+;base64,/.test(src)) {
    // TODO unify temp dir creation
    temp.open('printerimg', (err, info) => {
      if (err) {
        resolve(context);
      } else {
        const base64Image = src.split(';base64,').pop();
        const path = info.path;
        fs.writeFile(path, base64Image, {encoding: 'base64'}, (err) => {
          if (err) {
            reject();
          } else {
            resolve(path);
          }
        });
      }
    });
  } else if (/^https?:\/\/.+/.test(src)) {
    temp.open('printerimg', async(err, info) => {
      if (err) {
        reject();
      } else {
        const path = info.path;
        let data = null;

        try {
          const response = await axios({
            url: src,
            method: 'GET',
            responseType: 'arraybuffer' // Necesitamos el archivo como un buffer de bytes
          });
          data = await response.data;
        } catch (e) {
          reject();
        }

        fs.writeFile(path, data, (err) => {
          if (err) {
            reject();
          } else {
            resolve(path);
          }
        });
      }
    });
  } else {
    temp.open('printerimg', (err, info) => {
      if (err) {
        resolve(context);
      } else {
        fs.copyFile(/^file:\/\/.+/.test(src) ? src.slice(7) : src, info.path, (err) => {
          if(err) {
            reject();
          } else {
            resolve(info.path);
          }
        });
      }
    });
  }
});

module.exports = {
  isWithoutClosingTag: true,
  checkIsAllowed: (context, {tag}) => tag === 'img',
  after: async(context, {attrs}) => {
    temp.track();
    return new Promise(async(resolve) => {
      try {
        const imagePath = await getImage(attrs);
        let size = null;

        if (attrs.width || attrs.height) {
          size = {};
          if (attrs.width) {
            size.width = attrs.width;
          }
          if (attrs.height) {
            size.height = attrs.height;
          }
        }
        temp.open('printerimg', async(err, info) => {
          if (err) {
            resolve(context);
          } else {
            const path = `${info.path}.png`;
            try {
              const image = await Jimp.read(imagePath);
              if (size) {
                const width = size?.width ? parseInt(size.width, 10) || Jimp.AUTO : Jimp.AUTO;
                const height = size?.height ? parseInt(size.height, 10) || Jimp.AUTO : Jimp.AUTO;
                image.resize({w:width, h:height});
              }
              await image.write(path);
              context.commands.push({ name: 'printImage', data: path, isAwait: true });
            } catch (e) {
              console.error("Error al procesar la imagen:", e);
            }
            resolve(context);
          }
        });
      } catch (e) {
        resolve(context);
      }
    });
  },
  sanitizeHtml: {
    allowedTags: ['img'],
    allowedAttributes: {
      img: ['src', 'width', 'height'],
    },
    allowedSchemes: ['data', 'http', 'https', 'file'],
  },
};