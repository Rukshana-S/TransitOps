import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import pool from '../config/db.js';
import PDFDocument from 'pdfkit';
import ExcelJS from 'exceljs';
import { Parser } from 'json2csv';
import * as archiver from 'archiver';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOADS_DIR = path.resolve(__dirname, '../../uploads/reports');

// Ensure reports directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Fields mappings for clean reporting headers
const fieldConfigs = {
  Vehicle: [
    { key: 'reg_number', label: 'Registration Number' },
    { key: 'type', label: 'Type' },
    { key: 'manufacturer', label: 'Manufacturer' },
    { key: 'model', label: 'Model' },
    { key: 'manufacturing_year', label: 'Mfg Year' },
    { key: 'fuel_type', label: 'Fuel Type' },
    { key: 'mileage', label: 'Mileage (km)' },
    { key: 'fuel', label: 'Fuel Level (%)' },
    { key: 'capacity', label: 'Capacity' },
    { key: 'status', label: 'Status' },
    { key: 'current_location', label: 'Location' }
  ],
  Driver: [
    { key: 'employee_id', label: 'Employee ID' },
    { key: 'name', label: 'Name' },
    { key: 'license', label: 'License' },
    { key: 'license_expiry', label: 'License Expiry' },
    { key: 'phone', label: 'Phone' },
    { key: 'email', label: 'Email' },
    { key: 'joining_date', label: 'Joining Date' },
    { key: 'status', label: 'Status' },
    { key: 'safety_score', label: 'Safety Score' }
  ],
  Trips: [
    { key: 'id', label: 'Trip ID' },
    { key: 'driver', label: 'Driver' },
    { key: 'vehicle', label: 'Vehicle' },
    { key: 'cargo', label: 'Cargo' },
    { key: 'pickup', label: 'Pickup Point' },
    { key: 'destination', label: 'Destination' },
    { key: 'distance', label: 'Distance' },
    { key: 'status', label: 'Status' },
    { key: 'eta', label: 'ETA' }
  ],
  Maintenance: [
    { key: 'type', label: 'Service Type' },
    { key: 'asset', label: 'Asset Code' },
    { key: 'date', label: 'Schedule Date' },
    { key: 'cost', label: 'Cost (INR)' },
    { key: 'progress', label: 'Progress (%)' },
    { key: 'status', label: 'Status' }
  ],
  Fuel: [
    { key: 'asset', label: 'Asset Code' },
    { key: 'liters', label: 'Liters' },
    { key: 'cost', label: 'Cost (INR)' },
    { key: 'station', label: 'Refuel Station' },
    { key: 'status', label: 'Status' },
    { key: 'date', label: 'Date' }
  ],
  Expense: [
    { key: 'category', label: 'Category' },
    { key: 'vehicle', label: 'Vehicle Asset' },
    { key: 'description', label: 'Description' },
    { key: 'amount', label: 'Amount (INR)' },
    { key: 'status', label: 'Status' },
    { key: 'date', label: 'Date' }
  ]
};

// Fetch real data from PostgreSQL
const fetchCategoryData = async (category) => {
  let query = '';
  switch (category) {
    case 'Vehicle':
      query = 'SELECT * FROM vehicles ORDER BY id DESC';
      break;
    case 'Driver':
      query = 'SELECT * FROM drivers ORDER BY id DESC';
      break;
    case 'Trips':
      query = 'SELECT * FROM trips ORDER BY id DESC';
      break;
    case 'Maintenance':
      query = 'SELECT * FROM maintenance ORDER BY id DESC';
      break;
    case 'Fuel':
      query = 'SELECT * FROM fuel_logs ORDER BY id DESC';
      break;
    case 'Expense':
      query = 'SELECT * FROM expenses ORDER BY id DESC';
      break;
    default:
      throw new Error(`Unsupported category: ${category}`);
  }
  const res = await pool.query(query);
  return res.rows;
};

// Helper: Generate CSV file
export const generateCSV = async (category, data, filename) => {
  const fields = fieldConfigs[category] || [];
  const fieldKeys = fields.map(f => f.key);
  const parser = new Parser({ fields: fieldKeys });
  const csvContent = parser.parse(data);
  const filePath = path.join(UPLOADS_DIR, filename);
  fs.writeFileSync(filePath, csvContent);
  return filePath;
};

// Helper: Generate Excel file
export const generateExcel = async (category, data, filename) => {
  const fields = fieldConfigs[category] || [];
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(`${category} Ledger`);
  
  worksheet.columns = fields.map(f => ({ header: f.label, key: f.key, width: 22 }));
  worksheet.addRows(data);
  
  // Format headers
  worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFF' } };
  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'F66F14' }
  };

  const filePath = path.join(UPLOADS_DIR, filename);
  await workbook.xlsx.writeFile(filePath);
  return filePath;
};

export const generatePDF = async (category, data, filename) => {
  return new Promise((resolve, reject) => {
    const fields = fieldConfigs[category] || [];
    const doc = new PDFDocument({ margin: 40, size: 'A4', bufferPages: true });
    const filePath = path.join(UPLOADS_DIR, filename);
    const writeStream = fs.createWriteStream(filePath);
    
    doc.pipe(writeStream);

    // Branding Header
    doc.fillColor('#F66F14').fontSize(24).font('Helvetica-Bold').text('TransitOps', { align: 'center' });
    doc.fillColor('#4B5563').fontSize(12).font('Helvetica').text('Smart Transport Operations Platform', { align: 'center' });
    doc.moveDown(1);
    doc.fillColor('#111827').fontSize(18).font('Helvetica-Bold').text(`${category} Report`, { align: 'center' });
    
    doc.moveDown(0.5);
    const dateStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    doc.fillColor('#4B5563').fontSize(10).font('Helvetica').text(`Generated: ${dateStr}`, { align: 'center' });
    doc.text(`Generated By: TransitOps`, { align: 'center' });
    doc.moveDown(2);

    let currentY = doc.y;
    const itemX = 40;
    const usableWidth = doc.page.width - 80;
    const colWidth = usableWidth / fields.length;
    const rowHeight = 25;

    // Draw Header Row
    doc.rect(itemX, currentY, usableWidth, rowHeight).fill('#F66F14');
    doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(9);
    
    fields.forEach((field, i) => {
      doc.text(field.label, itemX + (i * colWidth) + 5, currentY + 8, { width: colWidth - 10, align: 'left', lineBreak: false, height: rowHeight - 8, ellipsis: true });
    });

    currentY += rowHeight;

    // Draw Data Rows
    doc.font('Helvetica').fontSize(9);
    data.forEach((row, rowIndex) => {
      // Page break check
      if (currentY + rowHeight > doc.page.height - 80) {
        doc.addPage();
        currentY = 40;
        
        // Redraw Header Row on new page
        doc.rect(itemX, currentY, usableWidth, rowHeight).fill('#F66F14');
        doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(9);
        fields.forEach((field, i) => {
          doc.text(field.label, itemX + (i * colWidth) + 5, currentY + 8, { width: colWidth - 10, align: 'left', lineBreak: false, height: rowHeight - 8, ellipsis: true });
        });
        currentY += rowHeight;
        doc.font('Helvetica').fontSize(9);
      }

      // Alternate row background
      if (rowIndex % 2 !== 0) {
        doc.rect(itemX, currentY, usableWidth, rowHeight).fill('#F9FAFB');
      } else {
        doc.rect(itemX, currentY, usableWidth, rowHeight).fill('#FFFFFF');
      }
      
      // Border
      doc.rect(itemX, currentY, usableWidth, rowHeight).strokeColor('#E5E7EB').lineWidth(1).stroke();

      doc.fillColor('#111827');
      fields.forEach((field, i) => {
        const val = row[field.key] !== null && row[field.key] !== undefined ? String(row[field.key]) : '-';
        doc.text(val, itemX + (i * colWidth) + 5, currentY + 8, { width: colWidth - 10, align: 'left', lineBreak: false, height: rowHeight - 8, ellipsis: true });
      });

      currentY += rowHeight;
    });

    // Add Footer to all pages
    const range = doc.bufferedPageRange();
    for (let i = range.start; i < range.start + range.count; i++) {
      doc.switchToPage(i);
      doc.rect(0, doc.page.height - 50, doc.page.width, 50).fill('#FFFFFF');
      doc.fillColor('#4B5563').fontSize(9).font('Helvetica');
      doc.text('TransitOps • Generated Automatically', 40, doc.page.height - 40, { align: 'left' });
      doc.text(`Page ${i + 1} of ${range.count}`, 40, doc.page.height - 40, { align: 'right' });
    }

    doc.end();

    writeStream.on('finish', () => resolve(filePath));
    writeStream.on('error', (err) => reject(err));
  });
};

// Helper: Generate ZIP containing PDF, Excel, and CSV files
export const generateZIP = async (category, data, filename) => {
  const csvFile = await generateCSV(category, data, `${filename.replace('.zip', '')}.csv`);
  const excelFile = await generateExcel(category, data, `${filename.replace('.zip', '')}.xlsx`);
  const pdfFile = await generatePDF(category, data, `${filename.replace('.zip', '')}.pdf`);

  return new Promise((resolve, reject) => {
    const zipPath = path.join(UPLOADS_DIR, filename);
    const output = fs.createWriteStream(zipPath);
    const archive = archiver.default('zip', { zlib: { level: 9 } });

    archive.pipe(output);
    archive.file(csvFile, { name: path.basename(csvFile) });
    archive.file(excelFile, { name: path.basename(excelFile) });
    archive.file(pdfFile, { name: path.basename(pdfFile) });

    archive.finalize();

    output.on('close', () => {
      // Clean up temporary individual files to avoid duplicate clutter
      try {
        fs.unlinkSync(csvFile);
        fs.unlinkSync(excelFile);
        fs.unlinkSync(pdfFile);
      } catch (err) {
        console.error('Error clearing zip artifacts:', err);
      }
      resolve(zipPath);
    });
    archive.on('error', (err) => reject(err));
  });
};

// Main entry point for Report Generation
export const compileReportFile = async (category, format) => {
  const data = await fetchCategoryData(category);
  const code = Math.floor(1000 + Math.random() * 9000);
  const timestamp = Date.now();
  
  let filename = `${category.toLowerCase()}_report_${code}_${timestamp}`;
  let pathResult = '';

  switch (format.toUpperCase()) {
    case 'CSV':
      filename += '.csv';
      pathResult = await generateCSV(category, data, filename);
      break;
    case 'EXCEL':
    case 'XLSX':
      filename += '.xlsx';
      pathResult = await generateExcel(category, data, filename);
      break;
    case 'PDF':
      filename += '.pdf';
      pathResult = await generatePDF(category, data, filename);
      break;
    case 'ZIP':
    case 'ALL':
      filename += '.zip';
      pathResult = await generateZIP(category, data, filename);
      break;
    default:
      throw new Error(`Unsupported format: ${format}`);
  }

  return {
    filename,
    filePath: pathResult,
    fileUrl: `http://localhost:5000/uploads/reports/${filename}`
  };
};
