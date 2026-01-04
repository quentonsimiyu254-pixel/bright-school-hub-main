import jsPDF from "jspdf";

export const generateFeeReceipt = (transaction: any) => {
  const doc = new jsPDF({
    format: [100, 150], // Smaller "Receipt" size
    unit: "mm",
  });

  const schoolName = "EDUSPHERE ACADEMY";

  // --- Header ---
  doc.setFontSize(14);
  doc.text(schoolName, 50, 15, { align: "center" });
  doc.setFontSize(8);
  doc.text("Official Payment Receipt", 50, 20, { align: "center" });
  doc.line(10, 25, 90, 25);

  // --- Receipt Details ---
  doc.setFontSize(9);
  doc.text(`Receipt No: ${transaction.reference_code || 'N/A'}`, 10, 35);
  doc.text(`Date: ${new Date(transaction.created_at).toLocaleDateString()}`, 10, 42);
  doc.text(`Student: ${transaction.profiles?.full_name}`, 10, 49);
  
  doc.line(10, 55, 90, 55);

  // --- Amount Section ---
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(`AMOUNT PAID: KES ${transaction.amount.toLocaleString()}`, 10, 65);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(`Payment Method: ${transaction.method.toUpperCase()}`, 10, 72);

  // --- Balance Info ---
  doc.text(`Current Balance: KES ${transaction.profiles?.fee_balance || '0'}`, 10, 85);

  // --- Footer ---
  doc.line(10, 95, 90, 95);
  doc.setFontSize(7);
 // Set font style to italic
doc.setFont("helvetica", "italic"); 
doc.text("Thank you for your payment.", 50, 105, { align: "center" });

// Reset to normal for the next line if needed
doc.setFont("helvetica", "normal");
doc.text("This is a computer-generated receipt.", 50, 110, { align: "center" });

  // Save PDF
  doc.save(`Receipt_${transaction.reference_code}.pdf`);
};