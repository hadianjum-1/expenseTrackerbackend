export const otptemp = (otp) => {
  return `
  <!DOCTYPE html>
  <html>
  <body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;">
    
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding:40px 0;">
          
          <table width="500" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;">
            
            <tr>
              <td style="background:#2563eb;padding:20px;text-align:center;">
                <h1 style="color:white;margin:0;">Expense Tracker</h1>
              </td>
            </tr>

            <tr>
              <td style="padding:30px;text-align:center;">
                <h2 style="color:#333;">Verify Your Account</h2>

                <p style="color:#666;font-size:16px;">
                  Use the OTP below to complete your verification.
                </p>

                <div style="
                  margin:30px auto;
                  background:#f3f4f6;
                  padding:15px;
                  width:220px;
                  border-radius:10px;
                  font-size:34px;
                  font-weight:bold;
                  color:#2563eb;
                  letter-spacing:8px;
                ">
                  ${otp}
                </div>

                <p style="color:#777;">
                  This OTP is valid for 5 minutes.
                </p>

                <p style="color:#999;font-size:12px;">
                  If you did not request this code, please ignore this email.
                </p>
              </td>
            </tr>

            <tr>
              <td style="background:#f9fafb;padding:15px;text-align:center;color:#888;font-size:12px;">
                © 2026 Expense Tracker. All rights reserved.
              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>

  </body>
  </html>
  `;
};