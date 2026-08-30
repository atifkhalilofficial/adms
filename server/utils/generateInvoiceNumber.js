const Invoice = require('../models/Invoice');

const generateInvoiceNumber = async () => {
  const year = new Date().getFullYear();
  const count = await Invoice.countDocuments({
    invoiceNumber: { $regex: `^INV-${year}-` },
  });
  const nextNumber = String(count + 1).padStart(4, '0');
  return `INV-${year}-${nextNumber}`;
};

module.exports = generateInvoiceNumber;