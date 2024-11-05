import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// Register a font for better aesthetics if needed
Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/helvetica/Helvetica-Regular.ttf' }, // Regular font
    { src: 'https://fonts.gstatic.com/s/helvetica/Helvetica-Bold.ttf', fontWeight: 'bold' }, // Bold font
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: '#ffffff', // White background
    color: '#000000', // Black text color
    fontFamily: 'Helvetica', // Clean font
  },
  section: { marginBottom: 10 },
  header: { fontSize: 18, marginBottom: 10, fontWeight: 'bold' },
  subheader: { fontSize: 12, marginBottom: 5, fontWeight: 'bold' },
  text: { fontSize: 10, marginBottom: 5 },
  bold: { fontWeight: 'bold' },
  rightAlign: { textAlign: 'right' },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  footer: { marginTop: 20, fontSize: 10, textAlign: 'center', color: '#555' },
});

const InvoicePDF = ({ tenant = {}, property = {}, invoiceID = 'N/A' }) => {
  const todayDate = new Date().toLocaleDateString();
  const dueDate = new Date(new Date().setDate(new Date().getDate() + 30)).toLocaleDateString();
  const rentAmount = property.rentAmount ? parseFloat(property.rentAmount).toFixed(2) : '0.00';

  return (
    <Document>
      <Page style={styles.page}>
        {/* Invoice Header */}
        <View style={styles.section}>
          <Text style={styles.header}>Invoice ID: {invoiceID}</Text>
          <Text>Property Management System</Text>
        </View>

        {/* Billing and Property Information */}
        <View style={styles.row}>
          <View>
            <Text style={styles.subheader}>Bill To:</Text>
            <Text style={styles.text}>{tenant.name || 'N/A'}</Text>
            <Text style={styles.text}>{tenant.email || ''}</Text>
            <Text style={styles.text}>{tenant.phoneNumber || ''}</Text>
          </View>
          <View>
            <Text style={styles.subheader}>Property:</Text>
            <Text style={styles.text}>{property.location || 'N/A'}</Text>
          </View>
        </View>

        {/* Invoice Dates */}
        <View style={styles.section}>
          <Text style={styles.subheader}>Invoice Date: {todayDate}</Text>
          <Text style={styles.subheader}>Due Date: {dueDate}</Text>
        </View>

        {/* Description and Amount */}
        <View style={styles.section}>
          <Text style={styles.bold}>Description</Text>
          <View style={styles.row}>
            <Text style={styles.text}>Monthly Rent</Text>
            <Text style={[styles.text, styles.rightAlign]}>${rentAmount}</Text>
          </View>
        </View>

        {/* Total Amount */}
        <View style={styles.section}>
          <Text style={[styles.bold, styles.rightAlign]}>Total: ${rentAmount}</Text>
        </View>

        {/* Footer Note */}
        <Text style={styles.footer}>Please make payment by the due date. Thank you for your rental!</Text>
      </Page>
    </Document>
  );
};

export default InvoicePDF;
