import cron from 'node-cron';
import nodemailer from 'nodemailer';
import Case from '../models/Case';
import User from '../models/User';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const getDayRange = (daysToAdd: number) => {
  const start = new Date();
  start.setDate(start.getDate() + daysToAdd);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  return { start, end };
};

export const initNotificationJob = () => {
  cron.schedule('0 8 * * *', async () => {
    console.log('Running daily deadline check (1 day & 7 days)...');

    try {
      const tomorrow = getDayRange(1);
      const nextWeek = getDayRange(7);

      const casesWithDeadlines = await Case.find({
        'deadlines.dueDate': {
          $or: [
            { $gte: tomorrow.start, $lt: tomorrow.end },
            { $gte: nextWeek.start, $lt: nextWeek.end }
          ]
        }
      }).populate('lawyer client');

      for (const legalCase of casesWithDeadlines) {
        for (const deadline of legalCase.deadlines) {
          const lawyer: any = legalCase.lawyer;
          const client: any = legalCase.client;

          let timeFrameLabel = '';

          if (deadline.dueDate >= tomorrow.start && deadline.dueDate < tomorrow.end) {
            timeFrameLabel = 'מחר';
          } else if (deadline.dueDate >= nextWeek.start && deadline.dueDate < nextWeek.end) {
            timeFrameLabel = 'בעוד שבוע';
          }

          if (!timeFrameLabel) continue;

          const mailOptions = {
            from: process.env.EMAIL_USER,
            to: [lawyer.email, client.email].join(','),
            subject: `תזכורת ${timeFrameLabel}: ${deadline.task}`,
            text: `
              שלום,
              זוהי תזכורת לגבי התיק: "${legalCase.title}".
              שימו לב כי ${timeFrameLabel}, בתאריך ${deadline.dueDate.toLocaleDateString('he-IL')}, יתקיים האירוע הבא:
              
              משימה/דיון: ${deadline.task}
              
              בברכה,
              מערכת ניהול תיקים משפטיים
            `
          };

          await transporter.sendMail(mailOptions);
        }
      }
      console.log('Notification job completed successfully.');
    } catch (error) {
      console.error('Error in notification job:', error);
    }
  });
};