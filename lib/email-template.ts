import numeral from "numeral";
import { format } from "date-fns";
import OrderEntity from "@database/entity/order";
import { GetLabelText, PRODUCT_ITEM_TYPES_LABEL } from "@common/constants";

export const GetOrderSubmittedEmail = (params: OrderEntity) => {
  // const { url, host, theme } = params;

  // const escapedHost = host.replace(/\./g, "&#8203;.");

  // const brandColor = theme?.brandColor || "#346df1";
  // const color = {
  //   background: "#f9f9f9",
  //   text: "#444",
  //   mainBackground: "#fff",
  //   buttonBackground: brandColor,
  //   buttonBorder: brandColor,
  //   buttonText: theme?.buttonText || "#fff",
  // };

  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
      <title>Gameshop247.com</title>
      <style>
        /* -------------------------------------
            GLOBAL RESETS
        ------------------------------------- */
  
        /*All the styling goes here*/
  
        img {
          border: none;
          -ms-interpolation-mode: bicubic;
          max-width: 100%;
        }
  
        body {
          background-color: #f6f6f6;
          font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
            Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
          -webkit-font-smoothing: antialiased;
          font-size: 14px;
          line-height: 1.4;
          margin: 0;
          padding: 0;
          -ms-text-size-adjust: 100%;
          -webkit-text-size-adjust: 100%;
        }
  
        table {
          border-collapse: separate;
          mso-table-lspace: 0pt;
          mso-table-rspace: 0pt;
          width: 100%;
        }
        table td {
          font-family: sans-serif;
          font-size: 14px;
          vertical-align: top;
        }
  
        /* -------------------------------------
            BODY & CONTAINER
        ------------------------------------- */
  
        .body {
          background-color: #f6f6f6;
          width: 100%;
        }
  
        /* Set a max-width, and make it display as block so it will automatically stretch to that width, but will also shrink down on a phone or something */
        .container {
          display: block;
          margin: 0 auto !important;
          /* makes it centered */
          max-width: 680px;
          padding: 10px;
          width: 680px;
        }
  
        /* This should also be a block element, so that it will fill 100% of the .container */
        .content {
          box-sizing: border-box;
          display: block;
          margin: 0 auto;
          max-width: 680px;
          padding: 10px;
        }
  
        /* -------------------------------------
            HEADER, FOOTER, MAIN
        ------------------------------------- */
        .main {
          background: #ffffff;
          border-radius: 3px;
          width: 100%;
        }
  
        .wrapper {
          box-sizing: border-box;
          padding: 20px;
        }
  
        .content-block {
          padding-bottom: 10px;
          padding-top: 10px;
        }
  
        .footer {
          clear: both;
          margin-top: 10px;
          text-align: center;
          width: 100%;
        }
        .footer td,
        .footer p,
        .footer span,
        .footer a {
          color: #999999;
          font-size: 12px;
          text-align: center;
        }
  
        /* -------------------------------------
            TYPOGRAPHY
        ------------------------------------- */
        h1,
        h2,
        h3,
        h4 {
          color: #000000;
          font-family: sans-serif;
          font-weight: 400;
          line-height: 1.4;
          margin: 0;
          margin-bottom: 30px;
        }
  
        h1 {
          font-size: 35px;
          font-weight: 300;
          text-align: center;
          text-transform: capitalize;
        }
  
        p,
        ul,
        ol {
          font-family: sans-serif;
          font-size: 14px;
          font-weight: normal;
          margin: 0;
          margin-bottom: 15px;
        }
        p li,
        ul li,
        ol li {
          list-style-position: inside;
          margin-left: 5px;
        }
  
        a {
          color: #3498db;
          text-decoration: underline;
        }
  
        /* -------------------------------------
            BUTTONS
        ------------------------------------- */
        .btn {
          box-sizing: border-box;
          width: 100%;
        }
        .btn > tbody > tr > td {
          padding-bottom: 15px;
        }
        .btn table {
          width: auto;
        }
        .btn table td {
          background-color: #ffffff;
          border-radius: 5px;
          text-align: center;
        }
        .btn a {
          background-color: #ffffff;
          border: solid 1px #3498db;
          border-radius: 5px;
          box-sizing: border-box;
          color: #3498db;
          cursor: pointer;
          display: inline-block;
          font-size: 14px;
          font-weight: bold;
          margin: 0;
          padding: 12px 25px;
          text-decoration: none;
          text-transform: capitalize;
        }
  
        .btn-primary table td {
          /* background-color: #3498db; */
        }
  
        .btn-primary a {
          background-color: #3498db;
          border-color: #3498db;
          color: #ffffff;
        }
  
        /* -------------------------------------
            OTHER STYLES THAT MIGHT BE USEFUL
        ------------------------------------- */
        .last {
          margin-bottom: 0;
        }
  
        .first {
          margin-top: 0;
        }
  
        .align-center {
          text-align: center;
        }
  
        .align-right {
          text-align: right;
        }
  
        .align-left {
          text-align: left;
        }
  
        .clear {
          clear: both;
        }
  
        .mt0 {
          margin-top: 0;
        }
  
        .mb0 {
          margin-bottom: 0;
        }
  
        .preheader {
          color: transparent;
          display: none;
          height: 0;
          max-height: 0;
          max-width: 0;
          opacity: 0;
          overflow: hidden;
          mso-hide: all;
          visibility: hidden;
          width: 0;
        }
  
        .powered-by a {
          text-decoration: none;
        }
  
        hr {
          border: 0;
          border-bottom: 1px solid #f6f6f6;
          margin: 20px 0;
        }
  
        .table-title {
          -webkit-text-size-adjust: 100%;
          -webkit-font-smoothing: antialiased;
          color: #121828;
          box-sizing: border-box;
          padding: 0;
          margin: 0;
          font-weight: 600;
          font-size: 1.3rem;
          line-height: 1.375;
          margin-bottom: 0.3em;
          margin-top: 0.5em;
        }
  
        .primary-text {
          -webkit-text-size-adjust: 100%;
          -webkit-font-smoothing: antialiased;
          box-sizing: border-box;
          padding: 0;
          margin: 0;
          font-size: 1rem;
          font-weight: 400;
          line-height: 1.5;
          color: #65748b;
        }
        /* -------------------------------------
            RESPONSIVE AND MOBILE FRIENDLY STYLES
        ------------------------------------- */
        @media only screen and (max-width: 620px) {
          table.body h1 {
            font-size: 28px !important;
            margin-bottom: 10px !important;
          }
          table.body p,
          table.body ul,
          table.body ol,
          table.body td,
          table.body span,
          table.body a {
            font-size: 16px !important;
          }
          table.body .wrapper,
          table.body .article {
            padding: 10px !important;
          }
          table.body .content {
            padding: 0 !important;
          }
          table.body .container {
            padding: 0 !important;
            width: 100% !important;
          }
          table.body .main {
            border-left-width: 0 !important;
            border-radius: 0 !important;
            border-right-width: 0 !important;
          }
          table.body .btn table {
            width: 100% !important;
          }
          table.body .btn a {
            width: 100% !important;
          }
          table.body .img-responsive {
            height: auto !important;
            max-width: 100% !important;
            width: auto !important;
          }
        }
  
        /* -------------------------------------
            PRESERVE THESE STYLES IN THE HEAD
        ------------------------------------- */
        @media all {
          .ExternalClass {
            width: 100%;
          }
          .ExternalClass,
          .ExternalClass p,
          .ExternalClass span,
          .ExternalClass font,
          .ExternalClass td,
          .ExternalClass div {
            line-height: 100%;
          }
          .apple-link a {
            color: inherit !important;
            font-family: inherit !important;
            font-size: inherit !important;
            font-weight: inherit !important;
            line-height: inherit !important;
            text-decoration: none !important;
          }
          #MessageViewBody a {
            color: inherit;
            text-decoration: none;
            font-size: inherit;
            font-family: inherit;
            font-weight: inherit;
            line-height: inherit;
          }
          .btn-primary table td:hover {
            background-color: #34495e !important;
          }
          .btn-primary a:hover {
            background-color: #34495e !important;
            border-color: #34495e !important;
          }
        }
      </style>
    </head>
    <body>
      <table
        role="presentation"
        border="0"
        cellpadding="0"
        cellspacing="0"
        class="body"
      >
        <tr>
          <td>&nbsp;</td>
          <td class="container">
            <div class="content">
              <!-- START CENTERED WHITE CONTAINER -->
              <table role="presentation" class="main">
                <!-- START MAIN CONTENT AREA -->
                <tr>
                  <td class="wrapper">
                    <table
                      role="presentation"
                      border="0"
                      cellpadding="0"
                      cellspacing="0"
                    >
                      <tr>
                        <td>
                          <p
                            class="primary-text"
                            style="font-weight: bold; color: black"
                          >
                            Xin chào ${params.contactName},
                          </p>
                          <p class="primary-text" style="color: black">
                            Gameshop247 vừa nhận đơn hàng của bạn. Chúng tôi sẽ
                            liên hệ xác nhận đơn sớm.
                          </p>
                          <table
                            role="presentation"
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                          >
                            <tbody>
                              <tr>
                                <td align="left">
                                  <div class="table-title">
                                    Thông tin liên hệ:
                                  </div>
                                  <p class="primary-text">Họ Tên: ${
                                    params.contactName
                                  }</p>
                                  <p class="primary-text">
                                    Số điện thoại: ${params.contactPhoneNumber}
                                  </p>
                                  <p class="primary-text">
                                    Email: ${params.contactEmail}
                                  </p>
                                </td>
                              </tr>
                            </tbody>
                          </table>
  
                          <table
                            role="presentation"
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                          >
                            <tbody>
                              <tr>
                                <td align="left">
                                  <div class="table-title">Đơn hàng:</div>
                                  <p
                                    class="primary-text"
                                    style="font-weight: bold"
                                  >
                                    Mã đơn: ${params.referenceNumber}
                                  </p>
                                  <p
                                    class="primary-text"
                                    style="font-weight: bold"
                                  >
                                    Tổng: ${numeral(params?.amount).format(
                                      "0,0"
                                    )}
                                  </p>
                                  <p class="primary-text">Loại: ${GetLabelText(
                                    PRODUCT_ITEM_TYPES_LABEL,
                                    params.productItem.type
                                  )}
                                  </p>
  
                                  <p class="primary-text">
                                    Tên sản phẩm: ${params.productItem.name}
                                  </p>
  
                                  <p class="primary-text">Đặc điểm: ${
                                    params.productItem.description
                                  }</p>
  
                                  <p class="primary-text">
                                    Ngày tạo: ${
                                      params
                                        ? format(
                                            new Date(params?.createdAt),
                                            "Pp"
                                          )
                                        : ""
                                    }
                                  </p>
  
                                  <p class="primary-text">Trạng thái: ${
                                    params.status
                                  }</p>
                                  <p class="primary-text">
                                    Kiểm tra đơn:
                                    <a
                                      target="_blank"
                                      href="${
                                        process.env.NEXT_PUBLIC_URL
                                      }/history-order?referenceNumber=${
    params.referenceNumber
  }"
                                      >Click vào đây</a
                                    >
                                  </p>
                                </td>
                              </tr>
                            </tbody>
                          </table>
  
                          <h6
                            style="
                              -webkit-text-size-adjust: 100%;
                              -webkit-font-smoothing: antialiased;
                              box-sizing: border-box;
                              padding: 0;
                              margin: 0;
                              font-weight: 600;
                              font-size: 1rem;
                              line-height: 1.375;
                              color: #2196f3;
                              font-style: italic;
                              margin-top: 32px;
                            "
                          >
                            Sau khi đặt hàng thành công, các bạn nên chuyển khoản
                            cho chủ shop càng sớm để giữ đơn. Nội chung chuyển
                            khoản bao gồm SĐT và mã hơn hàng ở trên.
                          </h6>
  
                          <h5
                            style="
                              -webkit-text-size-adjust: 100%;
                              -webkit-font-smoothing: antialiased;
                              box-sizing: border-box;
                              padding: 0;
                              margin: 0;
                              font-weight: 600;
                              font-size: 1rem;
                              line-height: 1.375;
                              margin-bottom: 0.35em;
                              color: #d14343;
                              font-style: italic;
                              margin-top: 32px;
                            "
                          >
                            Vui lòng liên hệ
                            <a
                              href="https://www.facebook.com/shopaccgi"
                              target="_blank"
                              >fanpage</a
                            >&nbsp;hoặc gọi
                            <a href="tel:0339839409">033 983 9409</a>
                            ngay sau khi chuyển khoản để giao nhận tài khoản. Xin
                            Cảm ơn!
                          </h5>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
  
                <!-- END MAIN CONTENT AREA -->
              </table>
              <!-- END CENTERED WHITE CONTAINER -->
  
              <!-- START FOOTER -->
              <div class="footer">
                <table
                  role="presentation"
                  border="0"
                  cellpadding="0"
                  cellspacing="0"
                >
                  <!-- <tr>
                    <td class="content-block">
                      <span class="apple-link"
                        >Company Inc, 3 Abbey Road, San Francisco CA 94102</span
                      >
                      <br />
                      Don't like these emails?
                      <a href="http://i.imgur.com/CScmqnj.gif">Unsubscribe</a>.
                    </td>
                  </tr> -->
                  <tr>
                    <td class="">
                      <a href="https://gameshop247.com" target="_blank"
                        >https://gameshop247.com/</a
                      >
                    </td>
                  </tr>
                  <tr>
                    <td class="">
                      <a href="https://www.facebook.com/shopaccgi" target="_blank"
                        >https://www.facebook.com/shopaccgi</a
                      >
                    </td>
                  </tr>
                </table>
              </div>
              <!-- END FOOTER -->
            </div>
          </td>
          <td>&nbsp;</td>
        </tr>
      </table>
    </body>
  </html>
`;
};

export const getMailOptionsOrderSubmitted = (params: OrderEntity) => {
  const htmlText = GetOrderSubmittedEmail(params);
  const mailOptions = {
    from: `Gameshop247 <${process.env.EMAIL_SENDER_ADDRESS}>`,
    to: params.contactEmail,
    cc: process.env.EMAIL_ADMIN_ADDRESS,
    subject: "Gameshop247 - Đặt hàng thành công",
    html: htmlText,
  };
  return mailOptions;
};
export default GetOrderSubmittedEmail;
