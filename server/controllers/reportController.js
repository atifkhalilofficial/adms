const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');
const Order = require('../models/Order');

// Shared helper: fetch orders with optional date range filter
const fetchOrdersForReport = async (req) => {
  const filter = {};
  if (req.query.startDate || req.query.endDate) {
    filter.createdAt = {};
    if (req.query.startDate) filter.createdAt.$gte = new Date(req.query.startDate);
    if (req.query.endDate) filter.createdAt.$lte = new Date(req.query.endDate);
  }

  return Order.find(filter)
    .populate('dealer', 'name businessName')
    .populate('warehouse', 'name city')
    .populate('items.product', 'name sku')
    .sort({ createdAt: -1 });
};

// @route  GET /api/reports/orders/excel
const exportOrdersExcel = async (req, res) => {
  try {
    const orders = await fetchOrdersForReport(req);

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Orders');

    sheet.columns = [
      { header: 'Date', key: 'date', width: 15 },
      { header: 'Dealer', key: 'dealer', width: 25 },
      { header: 'Warehouse', key: 'warehouse', width: 20 },
      { header: 'Items', key: 'items', width: 40 },
      { header: 'Total (Rs.)', key: 'total', width: 15 },
      { header: 'Status', key: 'status', width: 15 },
    ];

    orders.forEach((order) => {
      sheet.addRow({
        date: new Date(order.createdAt).toLocaleDateString(),
        dealer: order.dealer?.name || '—',
        warehouse: order.warehouse?.name || '—',
        items: order.items
          .map((i) => `${i.product?.name || 'Unknown'} x${i.quantity}`)
          .join(', '),
        total: order.totalAmount,
        status: order.status,
      });
    });

    sheet.getRow(1).font = { bold: true };

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader('Content-Disposition', 'attachment; filename=orders-report.xlsx');

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error('Excel export error:', err);
    res.status(500).json({ message: err.message });
  }
};

// @route  GET /api/reports/orders/pdf
const exportOrdersPDF = async (req, res) => {
  try {
    console.log('PDF export requested with query:', req.query);

    const orders = await fetchOrdersForReport(req);
    console.log('Orders fetched for PDF:', orders.length);

    const doc = new PDFDocument({ margin: 40 });
    const buffers = [];

    doc.on('data', (chunk) => buffers.push(chunk));

    doc.on('end', () => {
      console.log('PDF document finished, sending response');
      const pdfBuffer = Buffer.concat(buffers);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=orders-report.pdf');
      res.setHeader('Content-Length', pdfBuffer.length);
      res.end(pdfBuffer);
    });

    doc.on('error', (err) => {
      console.error('PDFKit stream error:', err);
      if (!res.headersSent) {
        res.status(500).json({ message: err.message });
      }
    });

    doc.fontSize(18).text('ADMS Orders Report', { align: 'center' });
    doc.moveDown();
    doc.fontSize(10).text(`Generated: ${new Date().toLocaleString()}`, { align: 'center' });
    doc.moveDown(2);

    if (orders.length === 0) {
      doc.fontSize(12).text('No orders found for the selected date range.', { align: 'center' });
    }

    orders.forEach((order, index) => {
      doc
        .fontSize(11)
        .text(
`${index + 1}. ${order.dealer?.name || 'Unknown'} — Rs. ${order.totalAmount.toLocaleString()} — ${(order.status || 'unknown').toUpperCase()}`        );
      doc
        .fontSize(9)
        .fillColor('gray')
        .text(
          `   Date: ${new Date(order.createdAt).toLocaleDateString()} | Warehouse: ${order.warehouse?.name || '—'}`
        );

      order.items.forEach((item) => {
        const productName = item.product?.name || 'Unknown';
        doc.text(`   - ${productName} x${item.quantity} @ Rs. ${item.price}`);
      });

      doc.fillColor('black').moveDown();
    });

    doc.end();
    console.log('doc.end() called');
  } catch (err) {
    console.error('PDF export error (outer catch):', err);
    if (!res.headersSent) {
      res.status(500).json({ message: err.message });
    }
  }
};

module.exports = { exportOrdersExcel, exportOrdersPDF };