const PDFDocument = require('pdfkit');
const fs = require('fs');
const axios = require('axios');

/**
 * Generate a PDF file with chef details and profile picture from URL.
 * @param {Object} chef - Chef object
 * @param {String} profilePicUrl - Cloudinary image URL
 * @param {String} filePath - Local destination to save PDF
 */
const generateChefPDF = async (chef, profilePicUrl, filePath) => {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = new PDFDocument();
      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      // Try downloading the image from Cloudinary
      let imageBuffer = null;
      try {
        const response = await axios.get(profilePicUrl, { responseType: 'arraybuffer' });
        imageBuffer = response.data;
      } catch (err) {
        console.warn('⚠️ Failed to download image from Cloudinary:', err.message);
      }

      // Header
      doc.fontSize(20).text('Chef Registration Details', { underline: true });
      doc.moveDown();

      // Profile Picture
      if (imageBuffer) {
        doc.image(imageBuffer, {
          fit: [150, 150],
          align: 'center',
          valign: 'center',
        });
        doc.moveDown();
      }

      // Text Info
      doc.fontSize(14).text(`Name: ${chef.name}`);
      doc.text(`Email: ${chef.email}`);
      doc.text(`Mobile: ${chef.mobile}`);
      doc.text(`Experience: ${chef.experience} years`);
      doc.text(`Age: ${chef.age}`);
      doc.text(`City: ${chef.city}`);
      doc.text(`Specialty: ${chef.specialty}`);
      doc.text(`Charges per visit: ₹${chef.chargesPerVisit}`);

      if (chef.serviceTime?.from && chef.serviceTime?.to) {
        doc.text(`Service Time: ${chef.serviceTime.from} - ${chef.serviceTime.to}`);
      }

      doc.moveDown();
      doc.text('Dishes:');
      (Array.isArray(chef.dishes) ? chef.dishes : chef.dishes?.split(',') || []).forEach((dish, index) => {
        doc.text(`${index + 1}. ${dish.trim()}`);
      });

      doc.end();

      stream.on('finish', () => resolve(filePath));
      stream.on('error', (err) => reject(err));
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = generateChefPDF;
