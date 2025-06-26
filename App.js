import React, { useState } from "react";
import "./App.css"; // Make sure this file exists

export default function InvoiceGenerator() {
  const [invoice, setInvoice] = useState({
    invoiceNo: "",
    invoiceDate: "",
    dueDate: "",
    businessName: "",
    businessDetails: "",
    clientName: "",
    clientDetails: "",
    items: [{ item: "", gst: "", quantity: "", rate: "" }],
    notes: "",
    tnc: "",
    discount: "",
    sgst: "",
    cgst: "",
  });

  const addItem = () => {
    setInvoice({
      ...invoice,
      items: [...invoice.items, { item: "", gst: "", quantity: "", rate: "" }],
    });
  };

  const handleChange = (e, index, field) => {
    if (index >= 0) {
      const newItems = [...invoice.items];
      newItems[index][field] = e.target.value;
      setInvoice({ ...invoice, items: newItems });
    } else {
      const { name, value } = e.target;
      setInvoice({ ...invoice, [name]: value });
    }
  };

  const calculateItemTotal = (item) => {
    const amount = parseFloat(item.quantity || 0) * parseFloat(item.rate || 0);
    return amount + (amount * parseFloat(item.gst || 0)) / 100;
  };

  const subtotal = invoice.items.reduce(
    (sum, item) => sum + calculateItemTotal(item),
    0
  );

  const total =
    subtotal +
    parseFloat(invoice.sgst || 0) +
    parseFloat(invoice.cgst || 0) -
    parseFloat(invoice.discount || 0);

  const printInvoice = () => window.print();

  return (
    <div className="invoice-container">
      <h1 className="title no-print">🧾 Invoice Generator</h1>

      {/* Input Form */}
      <div className="form-container no-print">
        <div className="section">
          <label>Business Name</label>
          <input name="businessName" value={invoice.businessName} onChange={handleChange} />
        </div>
        <div className="section">
          <label>Business Details</label>
          <textarea name="businessDetails" value={invoice.businessDetails} onChange={handleChange} />
        </div>

        <div className="section">
          <label>Client Name</label>
          <input name="clientName" value={invoice.clientName} onChange={handleChange} />
        </div>
        <div className="section">
          <label>Client Details</label>
          <textarea name="clientDetails" value={invoice.clientDetails} onChange={handleChange} />
        </div>

        <div className="grid-3">
          <input type="number" name="invoiceNo" placeholder="Invoice No" value={invoice.invoiceNo} onChange={handleChange} />
          <input type="date" name="invoiceDate" placeholder="Invoice Date" value={invoice.invoiceDate} onChange={handleChange} />
          <input type="date" name="dueDate" placeholder="Due Date" value={invoice.dueDate} onChange={handleChange} />
        </div>

        <h3>Items</h3>
        {invoice.items.map((item, index) => (
          <div className="item-row" key={index}>
            <input placeholder="Item" value={item.item} onChange={(e) => handleChange(e, index, "item")} />
            <input type="number" placeholder="Qty" value={item.quantity} onChange={(e) => handleChange(e, index, "quantity")} />
            <input type="number" placeholder="Rate" value={item.rate} onChange={(e) => handleChange(e, index, "rate")} />
            <input type="number" placeholder="GST%" value={item.gst} onChange={(e) => handleChange(e, index, "gst")} />
          </div>
        ))}
        <button className="add-btn" onClick={addItem}>+ Add Item</button>

        <div className="grid-3">
          <input name="sgst" placeholder="SGST" value={invoice.sgst} onChange={handleChange} />
          <input name="cgst" placeholder="CGST" value={invoice.cgst} onChange={handleChange} />
          <input name="discount" placeholder="Discount" value={invoice.discount} onChange={handleChange} />
        </div>

        <textarea name="notes" placeholder="Notes" value={invoice.notes} onChange={handleChange} />
        <button className="print-btn" onClick={printInvoice}>🖨️ Print Invoice</button>
      </div>

      {/* Print View */}
      <div className="invoice-preview print-only">
        <h2>Business Name :{invoice.businessName}</h2>
        <h2>Business Details :{invoice.businessDetails}</h2>
        <p><strong>Invoice No:</strong> {invoice.invoiceNo}</p>
        <p><strong>Invoice Date:</strong> {invoice.invoiceDate}</p>
        <p><strong>Due Date:</strong> {invoice.dueDate}</p>
        <p><strong>Client Name:</strong> {invoice.clientName}</p>
        <p><strong>Client Details:</strong>{invoice.clientDetails}</p>

        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Qty</th>
              <th>Rate</th>
              <th>GST%</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, i) => (
              <tr key={i}>
                <td>{item.item}</td>
                <td>{item.quantity}</td>
                <td>{item.rate}</td>
                <td>{item.gst}</td>
                <td>{calculateItemTotal(item).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="totals">
          <p><strong>Subtotal:</strong> ₹{subtotal.toFixed(2)}</p>
          <p><strong>SGST:</strong> ₹{parseFloat(invoice.sgst || 0).toFixed(2)}</p>
          <p><strong>CGST:</strong> ₹{parseFloat(invoice.cgst || 0).toFixed(2)}</p>
          <p><strong>Discount:</strong> ₹{parseFloat(invoice.discount || 0).toFixed(2)}</p>
          <p className="total"><strong>Total:</strong> ₹{total.toFixed(2)}</p>
        </div>

        {invoice.notes && <p><strong>Notes:</strong> {invoice.notes}</p>}
      </div>
    </div>
  );
}
