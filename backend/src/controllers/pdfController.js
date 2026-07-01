const PDFDocument = require('pdfkit');
const Quote = require('../models/Quote');
const { AppError } = require('../middleware/errorHandler');

exports.generateQuotePDF = (req, res, next) => {
  try {
    const db = req.app.locals.db;
    const quoteModel = new Quote(db);
    const quoteId = parseInt(req.params.id);
    const quote = quoteModel.findById(quoteId);

    if (!quote) {
      throw new AppError('Devis non trouvé', 404);
    }

    const doc = new PDFDocument({
      size: 'A4',
      margin: 50,
      info: {
        Title: `Devis ${quote.title}`,
        Author: 'Portail & Inspections',
        Subject: 'Devis',
      },
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=devis_${quoteId}.pdf`);
    doc.pipe(res);

    const fontRegular = 'Helvetica';
    const fontBold = 'Helvetica-Bold';
    const primaryColor = '#1a56db';
    const grayColor = '#6b7280';
    const lightGray = '#f3f4f6';

    doc.rect(0, 0, doc.page.width, 120).fill(primaryColor);

    doc.fill('#ffffff')
       .fontSize(28)
       .font(fontBold)
       .text('DEVIS', 50, 45);

    doc.fontSize(12)
       .font(fontRegular)
       .text('Portail & Inspections', 50, 80);

    doc.fill('#000000');

    doc.fontSize(10)
       .font(fontRegular)
       .fillColor(grayColor)
       .text(`N° Devis: DEV-${String(quote.id).padStart(4, '0')}`, 400, 45, { align: 'right' })
       .text(`Date: ${new Date(quote.created_at).toLocaleDateString('fr-FR')}`, 400, 62, { align: 'right' })
       .text(`Statut: ${quote.status}`, 400, 79, { align: 'right' });

    if (quote.valid_until) {
      doc.fillColor(grayColor)
         .fontSize(10)
         .font(fontRegular)
         .text(`Valable jusqu'au: ${new Date(quote.valid_until).toLocaleDateString('fr-FR')}`, 400, 96, { align: 'right' });
    }

    doc.fillColor('#000000');

    const infoY = 145;
    doc.rect(50, infoY, 245, 85).fill(lightGray);
    doc.fillColor('#000000')
       .fontSize(11)
       .font(fontBold)
       .text('CLIENT', 65, infoY + 10);

    doc.fontSize(10)
       .font(fontRegular)
       .fillColor('#000000')
       .text(quote.company_name, 65, infoY + 30)
       .text(`Contact: ${quote.contact_name}`, 65, infoY + 47)
       .text(`Email: ${quote.email}`, 65, infoY + 64);

    if (quote.phone) {
      doc.text(`Tél: ${quote.phone}`, 65, infoY + 81);
    }

    doc.rect(345, infoY, 205, 40).fill(lightGray);
    doc.fillColor('#000000')
       .fontSize(11)
       .font(fontBold)
       .text('DESCRIPTION', 360, infoY + 10);

    doc.fontSize(10)
       .font(fontRegular)
       .text(quote.description || 'Aucune description', 360, infoY + 30);

    const tableTop = 270;
    doc.fontSize(11)
       .font(fontBold)
       .fillColor('#ffffff');

    doc.rect(50, tableTop, 295, 25).fill(primaryColor);
    doc.rect(345, tableTop, 70, 25).fill(primaryColor);
    doc.rect(415, tableTop, 70, 25).fill(primaryColor);
    doc.rect(485, tableTop, 65, 25).fill(primaryColor);

    doc.text('Description', 60, tableTop + 7, { width: 285 });
    doc.text('Quantité', 355, tableTop + 7, { width: 60, align: 'center' });
    doc.text('Prix unitaire', 420, tableTop + 7, { width: 65, align: 'center' });
    doc.text('Total', 490, tableTop + 7, { width: 55, align: 'right' });

    doc.fillColor('#000000');
    let y = tableTop + 35;

    const items = quote.items || [];
    items.forEach((item, i) => {
      if (i % 2 === 0) {
        doc.rect(50, y - 5, 500, 22).fill('#f9fafb');
      }

      doc.fontSize(9)
         .font(fontRegular)
         .fillColor('#000000')
         .text(item.description, 60, y, { width: 285 })
         .text(String(item.quantity), 355, y, { width: 60, align: 'center' })
         .text(`${parseFloat(item.unit_price).toFixed(2)} €`, 420, y, { width: 65, align: 'center' })
         .text(`${parseFloat(item.total_price).toFixed(2)} €`, 490, y, { width: 55, align: 'right' });

      y += 22;
    });

    const totalY = Math.max(y + 10, tableTop + 150);
    doc.rect(385, totalY, 165, 30).fill(primaryColor);
    doc.fillColor('#ffffff')
       .fontSize(14)
       .font(fontBold)
       .text('TOTAL:', 395, totalY + 8, { width: 70 });
    doc.text(`${parseFloat(quote.total_amount).toFixed(2)} €`, 465, totalY + 8, { width: 80, align: 'right' });

    doc.fillColor(grayColor)
       .fontSize(9)
       .font(fontRegular);

    const footerY = doc.page.height - 80;
    doc.text('Portail & Inspections - RIF', 50, footerY, { align: 'center' })
       .text('MEI - 2 B Rue Alfred Nobel, 77420 Champs-sur-Marne', 50, footerY + 14, { align: 'center' })
       .text('Email: contact@grouperif.com - Site: www.grouperif.com', 50, footerY + 28, { align: 'center' });

    doc.rect(50, footerY - 5, 500, 1).fill(lightGray);

    doc.end();
  } catch (err) {
    next(err);
  }
};
