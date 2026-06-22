import nodemailer from "nodemailer";

export const Sendemail = async (Email, subjects, Message) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const options = {
        from : process.env.EMAIL,
        to : Email,
        subject : subjects,
        html : Message
    }
    await transporter.sendMail(options)
    return true;
  } 
  catch (err) {
    return false;
  }
};
