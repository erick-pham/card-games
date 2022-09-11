import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

export default function Document() {
  return (
    <Html>
      <Head>
        <Script id="fb-div">
          {`
              var chatbox = document.getElementById('fb-customer-chat');
              chatbox.setAttribute("page_id", "1528767773852708");
              chatbox.setAttribute("attribution", "biz_inbox");
        
          `}
        </Script>
        <Script
          id="fb-tag-script"
          strategy="lazyOnload"
          crossOrigin="anonymous"
          defer
          async
        >
          {`
              window.fbAsyncInit = function() {
                FB.init({
                  xfbml            : true,
                  version          : 'v14.0'
                });
              };
        
              (function(d, s, id) {
                var js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) return;
                js = d.createElement(s); js.id = id;
                js.crossorigin = 'anonymous';
                js.src = 'https://connect.facebook.net/vi_VN/sdk/xfbml.customerchat.js';
                fjs.parentNode.insertBefore(js, fjs);
              }(document, 'script', 'facebook-jssdk'));
        
          `}
        </Script>
      </Head>
      <body>
        <div id="fb-root"></div>

        <div id="fb-customer-chat" className="fb-customerchat"></div>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
