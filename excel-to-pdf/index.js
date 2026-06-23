const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const ChartDataLabels = require('chartjs-plugin-datalabels');
const PDFDocument = require('pdfkit');
const nodemailer = require('nodemailer');
require('dotenv').config();
const { generateCardContent } = require('./cardContent');
const combiningStyles = require('./combiningStyles');

const app = express();
const port = 3000;

const chartJSNodeCanvas = new ChartJSNodeCanvas({ width: 500, height: 500 });

const transporter = nodemailer.createTransport({
  service: 'gmail', // if any other mail id services change here
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

//api name here
app.get('/generate-reports', async (req, res) => {
  const users = [];

  // Code to read and parse CSV
  fs.createReadStream('data.csv') // CSV file in folder named data.csv
    .pipe(csv())
    .on('data', (row) => {
      users.push(row);
    })
    .on('end', async () => {
      for (const user of users) {
        await generateReport(user);
      }
      res.send('Reports generated and sent successfully.');
    });
});

const capitalizeFirstLetter = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Function to send the PDF report via email
const sendReportByEmail = async (name, email, pdfBuffer, fileName) => {
  const mailOptions = {
    from: process.env.EMAIL_USER, // fetched from env file
    to: email,
    subject: `${name}, here's your Behavioral Compass Report`,
    text: 'Please find attached your behavioral compass report.',
    attachments: [
      {
        filename: fileName,
        content: pdfBuffer
      }
    ]
  };
  await transporter.sendMail(mailOptions);
};

// Function to generate PDF report
const generateReport = async (user) => {
  const { Name, Email, Visionary, Reasoning, Leverage, Bargaining, Friendly_Persuasion, Assertiveness } = user;

  const capitalizedFirstName = capitalizeFirstLetter(Name);

  // Prepare chart data
  const scores = {
    Visionary: parseInt(Visionary),
    Reasoning: parseInt(Reasoning),
    Leverage: parseInt(Leverage),
    Bargaining: parseInt(Bargaining),
    'Friendly Persuasion': parseInt(Friendly_Persuasion),
    Assertiveness: parseInt(Assertiveness)
  };

  // Sort scores object in descending order based on values
  const sortedScores = Object.fromEntries(
    Object.entries(scores).sort(([, a], [, b]) => b - a)
  );

  const chartData = {
    labels: Object.keys(sortedScores),
    datasets: [{
      data: Object.values(sortedScores),
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40']
    }]
  };

  const chartConfig = {
    type: 'pie',
    data: chartData,
    options: {
      plugins: {
        legend: {
          display: true,
          position: 'bottom'
        },
        tooltip: {
          callbacks: {
            label: function (tooltipItem) {
              let dataset = tooltipItem.dataset;
              let total = dataset.data.reduce((previousValue, currentValue) => previousValue + currentValue, 0);
              let currentValue = dataset.data[tooltipItem.dataIndex];
              let percentage = Math.floor(((currentValue / total) * 100) + 0.5);
              return `${tooltipItem.label}: ${currentValue} (${percentage}%)`;
            }
          }
        },
        datalabels: {
          color: '#000000',
          formatter: (value, context) => {
            let total = context.dataset.data.reduce((previousValue, currentValue) => previousValue + currentValue, 0);
            let percentage = ((value / total) * 100).toFixed(1);
            return `${context.chart.data.labels[context.dataIndex]}: ${percentage}%`;
          }
        }
      },
      elements: {
        arc: {
          borderWidth: 0,
          shadowOffsetX: 2,
          shadowOffsetY: 2,
          shadowBlur: 5,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
          radius: '60%' 
        }
      },
      animation: {
        animateScale: true,
        animateRotate: true
      }
    },
    plugins: [ChartDataLabels]
  };

  //Generate chart image
  const image = await chartJSNodeCanvas.renderToBuffer(chartConfig);

  //Create PDF document
  const doc = new PDFDocument();
  const fileName = `${Name}_report.pdf`;
  
  //Pipe the PDF document to a buffer
  const buffers = [];
  doc.on('data', buffers.push.bind(buffers));
  doc.on('end', async () => {
    const pdfBuffer = Buffer.concat(buffers);
    await sendReportByEmail(capitalizedFirstName, Email, pdfBuffer, fileName);
  });
  
  const addFooter = (doc, text) => {
    const footerY = doc.page.height - 100;
    const footerMargin = 30;
  
    doc.fontSize(10)
      .font('Helvetica')
      .fillColor('gray')
      .text(text, footerMargin, footerY, {
        align: 'center',
        width: doc.page.width - footerMargin * 2,
        continued: false
      });
  };
  
  // Add content to the first page
  doc.fontSize(24).font('Times-Bold').text('Behaviour Compass. Find Your True North', { align: 'center' });
  doc.moveDown(1);
  
  doc.fontSize(16).font('Times-Roman').text('Dear ', { continued: true });
  doc.font('Times-Bold').text(`${capitalizedFirstName},`, { align: 'left' });
  doc.moveDown(0.5);
  
  doc.fontSize(14).font('Times-Roman').text(
    `Congratulations on completing your self-discovery journey! Now, embark on a transformative adventure.`,
    { align: 'justify' }
  );
  doc.moveDown();
  
  doc.text(
    `Just like a compass unwavering in its direction, the Behavioural Compass is your guide to identifying your own unwavering principles and uncovering your own true north. These are the values, beliefs, and motivations that define who you are at your core.`,
    { align: 'justify' }
  );
  doc.moveDown();
  
  doc.text(
    `The Behavioural Compass is more than just self-discovery – it's a transformative journey that impacts every aspect of your life. In the workplace, you'll develop a deep sense of purpose, leading with authenticity and inspiring trust in your colleagues. Imagine making decisions with unwavering confidence, knowing that they're aligned with your core compass.`,
    { align: 'justify' }
  );
  doc.moveDown();
  
  doc.text(
    `Personally, this discovery equips you to face challenges with a newfound strength. You'll build stronger, more meaningful relationships and experience a profound sense of satisfaction as you navigate life's journey with clear direction.`,
    { align: 'justify' }
  );
  doc.moveDown();
  
  doc.text(
    `The Behavioural Compass isn't about temporary fixes or fleeting trends. It's about uncovering the very essence of who you are. It's the map to a life lived with purpose, where your inner compass guides you towards fulfilment and genuine success, both professionally and personally.`,
    { align: 'justify' }
  );
  doc.moveDown();
  
  doc.text(
    `So, get ready to chart your course.`,
    { align: 'justify' }
  );
  
  addFooter(doc, 'Crux Management Services Pvt.Ltd');
  
  doc.addPage();
  
  //Add content to the second page
  doc.fontSize(16).font('Times-Roman').text('Behavioural Compass Report', { align: 'center' });
  doc.moveDown();
  doc.fontSize(18).font('Times-Bold').text('Scores:', { align: 'center' });
  doc.moveDown(0.5);
  doc.fontSize(14).font('Times-Roman');
  Object.keys(sortedScores).forEach(key => {
    const displayKey = key.replace(/_/g, ' '); //Replacing underscores with spaces
    doc.text(`${displayKey}: ${sortedScores[key]}`, { align: 'center' });
  });
  doc.moveDown(2);
  
  const imageWidth = 400; 
  const pageWidth = doc.page.width;
  const marginLeft = doc.page.margins.left;
  const marginRight = doc.page.margins.right;
  
  const availableWidth = pageWidth - marginLeft - marginRight;
  const horizontalOffset = (availableWidth - imageWidth) / 2;
  
  doc.image(image, {
    width: imageWidth,
    height: 400,
    align: 'center',
    x: marginLeft + horizontalOffset,
  });
  
  addFooter(doc, 'Crux Management Services Pvt.Ltd');
  
  doc.addPage();
  
  //Add content to the third page
  Object.keys(sortedScores).forEach(key => {
    const { title, content } = generateCardContent(key, sortedScores[key]);
  
    doc.fontSize(14).font('Times-Bold').text(title, { align: 'left' });
  
    doc.fontSize(12).font('Times-Roman').text(content, {
      align: 'justify',
    });

    doc.moveDown(1.5);
  });
  
  addFooter(doc, 'Crux Management Services Pvt.Ltd');
  
  doc.addPage();

  const highestTrait = Object.keys(sortedScores)[0];
  const { title, content } = combiningStyles[highestTrait];

  doc.fontSize(14).font('Times-Bold').text(`${title}`, { align: 'left' });
  doc.moveDown(0.25);

  const contentSegments = content.split('*');
  doc.fontSize(12).font('Times-Roman');

  contentSegments.forEach((segment, index) => {
    if (index % 2 === 0) {
      doc.font('Times-Roman').text(segment, {
        continued: true,
        align: 'justify'
      });
    } else {
      doc.font('Times-Bold').text(segment, {
        continued: true,
        align: 'justify'
      });
    }
  });

  doc.text('', { continued: false });

  addFooter(doc, 'Crux Management Services Pvt.Ltd');

  doc.end();  
};

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});