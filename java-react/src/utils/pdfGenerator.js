import jsPDF from 'jspdf';

export const generatePDF = (cartItems, totalSum, user, date) => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text('Invoice', 105, 20, { align: 'center' });
    doc.setFontSize(14);
    doc.text(`Date: ${new Date(date).toLocaleString()}`, 10, 30);
    doc.text(`User: ${user.username || 'N/A'} (${user.email || 'N/A'})`, 10, 40);
    doc.text('Ordered Items:', 10, 50);

    let y = 60;
    cartItems.forEach(item => {
        doc.text(`${item.productName} - $${item.price.toFixed(2)}`, 10, y);
        y += 10;
    });

    doc.text(`Total Sum: $${totalSum}`, 10, y + 10);

    doc.save('invoice.pdf');
};
