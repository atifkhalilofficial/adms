const PDFDocument = require('pdfkit');
const Invoice = require('../models/Invoice');
const Payment = require('../models/Payment');

// @route  GET /api/invoices
const getInvoices = async (req, res) => {
  try {
    const filter = {};
    if (req.query.dealer) filter.dealer = req.query.dealer;

    const invoices = await Invoice.find(filter)
      .populate('dealer', 'name businessName outstandingBalance')
      .populate('order', 'status')
      .sort({ createdAt: -1 });

    res.json(invoices);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route  GET /api/invoices/:id
const getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate('dealer', 'name businessName phone address')
      .populate('order', 'status');
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    res.json(invoice);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route  GET /api/invoices/:id/pdf
const downloadInvoicePDF = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id).populate(
      'dealer',
      'name businessName phone address'
    );
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    const doc = new PDFDocument({ margin: 50 });
    const buffers = [];

    doc.on('data', (chunk) => buffers.push(chunk));
    doc.on('end', () => {
      const pdfBuffer = Buffer.concat(buffers);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=${invoice.invoiceNumber}.pdf`
      );
      res.setHeader('Content-Length', pdfBuffer.length);
      res.end(pdfBuffer);
    });

    doc.on('error', (err) => {
      console.error('Invoice PDF error:', err);
      if (!res.headersSent) {
        res.status(500).json({ message: err.message });
      }
    });

    // Header
    doc.fontSize(20).text('ADMS', { align: 'left' });
    doc.fontSize(10).fillColor('gray').text('Agricultural Dealer Management System');
    doc.moveDown(1.5);

    doc.fillColor('black').fontSize(16).text(`Invoice ${invoice.invoiceNumber}`, { align: 'right' });
    doc.fontSize(10).text(`Issued: ${new Date(invoice.issueDate).toLocaleDateString()}`, { align: 'right' });
    if (invoice.dueDate) {
      doc.text(`Due: ${new Date(invoice.dueDate).toLocaleDateString()}`, { align: 'right' });
    }
    doc.moveDown(1.5);

    // Bill to
    doc.fontSize(11).text('Bill To:', { underline: true });
    doc.fontSize(11).text(invoice.dealer?.name || 'Unknown Dealer');
    if (invoice.dealer?.businessName) doc.text(invoice.dealer.businessName);
    if (invoice.dealer?.phone) doc.text(invoice.dealer.phone);
    if (invoice.dealer?.address) doc.text(invoice.dealer.address);
    doc.moveDown(1.5);

    // Table header
    const tableTop = doc.y;
    doc.fontSize(10).fillColor('black');
    doc.text('Item', 50, tableTop, { width: 180 });
    doc.text('SKU', 230, tableTop, { width: 80 });
    doc.text('Qty', 310, tableTop, { width: 50, align: 'right' });
    doc.text('Price', 360, tableTop, { width: 80, align: 'right' });
    doc.text('Total', 440, tableTop, { width: 80, align: 'right' });

    doc.moveTo(50, tableTop + 15).lineTo(520, tableTop + 15).stroke();

    let y = tableTop + 25;
    invoice.items.forEach((item) => {
      doc.text(item.productName, 50, y, { width: 180 });
      doc.text(item.sku, 230, y, { width: 80 });
      doc.text(String(item.quantity), 310, y, { width: 50, align: 'right' });
      doc.text(item.price.toLocaleString(), 360, y, { width: 80, align: 'right' });
      doc.text(item.lineTotal.toLocaleString(), 440, y, { width: 80, align: 'right' });
      y += 20;
    });

    doc.moveTo(50, y + 5).lineTo(520, y + 5).stroke();

    doc.fontSize(12).text(
      `Total: Rs. ${invoice.totalAmount.toLocaleString()}`,
      440,
      y + 20,
      { width: 80, align: 'right' }
    );

    doc.moveDown(3);
    doc.fontSize(9).fillColor('gray').text(
      'Thank you for your business.',
      { align: 'center' }
    );

    doc.end();
  } catch (err) {
    console.error('Invoice PDF error (outer):', err);
    if (!res.headersSent) {
      res.status(500).json({ message: err.message });
    }
  }
};

module.exports = { getInvoices, getInvoiceById, downloadInvoicePDF };