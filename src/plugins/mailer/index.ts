import mailer from "nodemailer";
import config from "config";

export interface IMailer {
  activateAccount(email: string, username: string): void;
  updatePass(email: string, id: number): void;
  forgotPass(email: string, id: number): void;
}

export default class Mailer implements IMailer {
  transporter: mailer.Transporter;
  mail: string;
  callbackDomain: string;

  constructor() {
    this.transporter = mailer.createTransport({
      service: "gmail",
      auth: {
        user: "ubertutor.wus@gmail.com",
        pass: "hcmus227"
      }
    });
    this.callbackDomain = config.get("domain");
    this.mail = "ubertutor.wus@gmail.com";
  }

  activateAccount(email: string, username: string) {
    var url = `${this.callbackDomain}/user/activeaccount/${username}`;
    var template = `<div>Xác thực tài khoản ubertutor cho <a href="mailto:${email}" target="_blank">${email}</a><br>\n\n
        \t\t\t\t\t\t\t\t - Tài khoản của bạn là: <a href="mailto:${email}" target="_blank">${email}</a><br>\n
        \t\t\t\t\t\t\t\t - Bạn vui lòng nhấp vào <a href="${url}"> link sau </a> để kích hoạt cho tài khoản <a href="mailto:${email}" target="_blank">${email}</a>:<br>\n
        \t\t\t\t\t\t\t\t - Mail này sẽ hết hạn sau 15 phút không được xác nhận<br><br>
        \t\t\t\t\t\t\t\tLưu ý: nếu bạn không yêu cầu cấp tài khoản, vui lòng bỏ qua email này và bảo mật thông tin tài khoản của bạn<br>\n
        \t\t\t\t\t\t\t\t<br><br>\n
        \t\t\t\t\t\t\t\t\n
        \t\t\t\t\t\t\t\tVui lòng không trả lời email này.<br>\n\n
        \t\t\t\t\t\t\t\tUber Tutor WUS.<br>\n
        </div>`;

    var opts = {
      from: this.mail,
      to: email,
      subject: "Xác thự tài khoản",
      html: template
    };

    this.transporter.sendMail(opts, (err, info) => {
      if (err) {
        console.log(err);
      }
      console.log("Email sent: " + info);
    });
  }

  updatePass(email: string, id: number) {
    var url = `${this.callbackDomain}/user/confirmchange/${id}`;
    var template = `<div>Thay đổi mật khẩu ubertutor cho <a href="mailto:${email}" target="_blank">${email}</a><br>
        \t\t\t\t\t\t\t\t - Tài khoản của bạn là: <a href="mailto:${email}" target="_blank">${email}</a><br>\n
        \t\t\t\t\t\t\t\t - Bạn vui lòng nhấp vào <a href="${url}"> link sau </a> để  xác nhận thay đổi mật khẩu cho tài khoản <a href="mailto:${email}" target="_blank">${email}</a>:<br>\n
        \t\t\t\t\t\t\t\t - Mail này sẽ hết hạn sau 15 phút không được xác nhận<br><br>
        \t\t\t\t\t\t\t\tLưu ý: nếu bạn không gửi yêu cầu này, vui lòng bỏ qua email này và bảo mật thông tin tài khoản của bạn<br>\n
        \t\t\t\t\t\t\t\t<br><br>\n
        \t\t\t\t\t\t\t\t\n
        \t\t\t\t\t\t\t\tVui lòng không trả lời email này.<br>\n\n
        \t\t\t\t\t\t\t\tUber Tutor WUS.<br>\n
        </div>`;

    var opts = {
      from: this.mail,
      to: email,
      subject: "Cập nhật mật khẩu",
      html: template
    };

    this.transporter.sendMail(opts, (err, info) => {
      if (err) {
        console.log(err);
      }
      console.log("Email sent: " + info.response);
    });
  }

  forgotPass(email: string, id: number) {
    var url = `${this.callbackDomain}/user/confirmchange/${id}`;
    var template = `<div> Cập nhật mật khẩu ubertutor cho <a href="mailto:${email}" target="_blank">${email}</a><br>
        \t\t\t\t\t\t\t\t - Tài khoản của bạn là: <a href="mailto:${email}" target="_blank">${email}</a><br>\n
        \t\t\t\t\t\t\t\t - Mật khẩu mới của bạn là: 1234566 <br>\n
        \t\t\t\t\t\t\t\t - Bạn vui lòng nhấp vào <a href="${url}"> link sau </a> để  xác nhận <br>\n
        \t\t\t\t\t\t\t\t - Mail này sẽ hết hạn sau 15 phút không được xác nhận<br><br>
        \t\t\t\t\t\t\t\tLưu ý: nếu bạn không gửi yêu cầu này, vui lòng bỏ qua email này và bảo mật thông tin tài khoản của bạn<br>\n
        \t\t\t\t\t\t\t\t<br><br>\n
        \t\t\t\t\t\t\t\t\n
        \t\t\t\t\t\t\t\tVui lòng không trả lời email này.<br>\n\n
        \t\t\t\t\t\t\t\tUber Tutor WUS.<br>\n
        </div>`;

    var opts = {
      from: this.mail,
      to: email,
      subject: "Quên mật khẩu",
      html: template
    };

    this.transporter.sendMail(opts, (err, info) => {
      if (err) {
        console.log(err);
      }
      console.log("Email sent: " + info.response);
    });
  }
}
