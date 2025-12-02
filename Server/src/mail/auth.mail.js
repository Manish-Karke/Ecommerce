const { appConfig } = require("../config/config");
const EmailServer = require("../ServiceBack/email.service");

class AuthNotificationEmailService extends EmailServer {
  sendUserActivationNotification = async (data) => {
    try {
      return await this.sendEmail({
        to: data.email,
        subject: "Activate Your Account",
        message: `
                    <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #f6f8fa; padding: 40px 0;">
                        <div style="max-width: 480px; margin: auto; background: #fff; border-radius: 10px; box-shadow: 0 4px 24px rgba(0,0,0,0.07); padding: 32px;">
                            <div style="text-align: center; margin-bottom: 24px;">
                                <img src="https://img.icons8.com/color/96/000000/secured-letter.png" alt="Activation" style="width: 64px; height: 64px;"/>
                            </div>
                            <h2 style="color: #222; text-align: center; margin-bottom: 8px;">Welcome, ${
                              data.username
                            }!</h2>
                            <p style="color: #555; font-size: 16px; text-align: center; margin-bottom: 24px;">
                                Thank you for registering with us.<br>
                                Please activate your account to get started.
                            </p>
                            <div style="text-align: center; margin-bottom: 24px;">
                                <a href="${appConfig.frontendUrl}activate/${
          data.activationToken
        }" 
                                   style="display: inline-block; padding: 14px 32px; background: linear-gradient(90deg, #007bff 0%, #0056b3 100%); color: #fff; font-weight: 600; font-size: 16px; border-radius: 6px; text-decoration: none; box-shadow: 0 2px 8px rgba(0,123,255,0.15); transition: background 0.3s;">
                                    Activate Account
                                </a>
                            </div>
                            <p style="color: #888; font-size: 14px; text-align: center; margin-bottom: 16px;">
                                If the button above does not work, copy and paste this link into your browser:
                            </p>
                            <div style="background: #f1f3f6; color: #007bff; font-size: 13px; word-break: break-all; padding: 10px 12px; border-radius: 4px; text-align: center; margin-bottom: 24px;">
                                ${appConfig.frontendUrl}activate/${
          data.activationToken
        }
                            </div>
                            <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">
                            <p style="color: #aaa; font-size: 12px; text-align: center;">
                                This is an automated message. Please do not reply.<br>
                                &copy; ${new Date().getFullYear()} Your Company Name. All rights reserved.
                            </p>
                        </div>
                    </div>
                `,
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  sendUserWelcomeNotification = async (data) => {
    try {
      return await this.sendEmail({
        to: data.email,
        subject: "Welcome! Your Account is Activated",
        message: `
                    <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #f6f8fa; padding: 40px 0;">
                        <div style="max-width: 480px; margin: auto; background: #fff; border-radius: 10px; box-shadow: 0 4px 24px rgba(0,0,0,0.07); padding: 32px;">
                            <div style="text-align: center; margin-bottom: 24px;">
                                <img src="https://img.icons8.com/color/96/000000/secured-letter.png" alt="Welcome" style="width: 64px; height: 64px;"/>
                            </div>
                            <h2 style="color: #222; text-align: center; margin-bottom: 8px;">Hello, ${
                              data.username
                            }!</h2>
                            <p style="color: #555; font-size: 16px; text-align: center; margin-bottom: 24px;">
                                Your account has been successfully activated.<br>
                                You can now log in and start using our services.
                            </p>
                            <div style="text-align: center; margin-bottom: 24px;">
                                <a href="${appConfig.frontendUrl}login" 
                                   style="display: inline-block; padding: 14px 32px; background: linear-gradient(90deg, #28a745 0%, #218838 100%); color: #fff; font-weight: 600; font-size: 16px; border-radius: 6px; text-decoration: none; box-shadow: 0 2px 8px rgba(40,167,69,0.15); transition: background 0.3s;">
                                    Go to Login
                                </a>
                            </div>
                            <p style="color: #888; font-size: 14px; text-align: center; margin-bottom: 16px;">
                                If the button above does not work, copy and paste this link into your browser:
                            </p>
                            <div style="background: #f1f3f6; color: #28a745; font-size: 13px; word-break: break-all; padding: 10px 12px; border-radius: 4px; text-align: center; margin-bottom: 24px;">
                                ${appConfig.frontendUrl}login
                            </div>
                            <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">
                            <p style="color: #aaa; font-size: 12px; text-align: center;">
                                This is an automated message. Please do not reply.<br>
                                &copy; ${new Date().getFullYear()} Your Company Name. All rights reserved.
                            </p>
                        </div>
                    </div>
                `,
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
}

const authNotificationEmailSvc = new AuthNotificationEmailService();

module.exports = authNotificationEmailSvc;
