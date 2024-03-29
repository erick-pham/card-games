import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
// import EmailProvider from "next-auth/providers/email";
import {
  TypeORMLegacyAdapter,
  Entities,
} from "@next-auth/typeorm-legacy-adapter";
import * as entities from "database/entity/entities";

import { dbConfigs } from "database/unit-of-work";

// import { createTransport } from "nodemailer";

// import { themeLight as theme } from "theme";

declare module "next-auth" {
  interface Session {
    // what ever properties added, add type here
    userRole: unknown | string | null | undefined;
    userId: string | null | undefined;
    accessToken: unknown;
    userPhoneNumber: unknown | string | null | undefined;
    expires: string;
    user: {
      email: string | null | undefined;
      id: string;
      name: string | null | undefined;
      role: string | null | undefined;
      image: string | null | undefined;
    };
  }
  interface User {
    role: string | null | undefined;
    phoneNumber: string | null | undefined;
  }
}

/**
 * Email HTML body
 * Insert invisible space into domains from being turned into a hyperlink by email
 * clients like Outlook and Apple mail, as this is confusing because it seems
 * like they are supposed to click on it to sign in.
 *
 * @note We don't add the email address to avoid needing to escape it, if you do, remember to sanitize it!
 */
function html(params: { url: string; host: string; theme: any }) {
  const { url, host, theme } = params;

  const escapedHost = host.replace(/\./g, "&#8203;.");

  const brandColor = theme?.brandColor || "#346df1";
  const color = {
    background: "#f9f9f9",
    text: "#444",
    mainBackground: "#fff",
    buttonBackground: brandColor,
    buttonBorder: brandColor,
    buttonText: theme?.buttonText || "#fff",
  };

  return `
<body style="background: ${color.background};">
  <table width="100%" border="0" cellspacing="20" cellpadding="0"
    style="background: ${color.mainBackground}; max-width: 600px; margin: auto; border-radius: 10px;">
    <tr>
      <td align="center"
        style="padding: 10px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
        Sign in to <strong>${escapedHost}</strong>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center" style="border-radius: 5px;" bgcolor="${color.buttonBackground}"><a href="${url}"
                target="_blank"
                style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${color.buttonText}; text-decoration: none; border-radius: 5px; padding: 10px 20px; border: 1px solid ${color.buttonBorder}; display: inline-block; font-weight: bold;">Sign
                in</a></td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td align="center"
        style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
        If you did not request this email you can safely ignore it.
      </td>
    </tr>
  </table>
</body>
`;
}

/** Email Text body (fallback for email clients that don't render HTML, e.g. feature phones) */
function text({ url, host }: { url: string; host: string }) {
  return `Sign in to ${host}\n${url}\n\n`;
}

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET as string,
  // https://next-auth.js.org/configuration/providers/oauth
  adapter: TypeORMLegacyAdapter(dbConfigs(), {
    entities: entities as Entities,
  }),
  providers: [
    // EmailProvider({
    //   server: process.env.EMAIL_SERVER as string,
    //   from: process.env.EMAIL_FROM as string,
    //   async sendVerificationRequest({
    //     identifier: email,
    //     url,
    //     provider: { server, from },
    //   }) {
    //     // const { identifier, url, provider, theme } = params;
    //     const { host } = new URL(url);
    //     // NOTE: You are not required to use `nodemailer`, use whatever you want.
    //     const transport = createTransport(server);
    //     const result = await transport.sendMail({
    //       to: email,
    //       from: from,
    //       subject: `Sign in to ${host}`,
    //       text: text({ url, host }),
    //       html: html({ url, host, theme }),
    //     });
    //     const failed = result.rejected.concat(result.pending).filter(Boolean);
    //     if (failed.length) {
    //       throw new Error(`Email(s) (${failed.join(", ")}) could not be sent`);
    //     }
    //   },
    // }),
    /* 
    // Temporarily removing the Apple provider from the demo site as the
    // callback URL for it needs updating due to Vercel changing domains

    Providers.Apple({
      clientId: process.env.APPLE_ID,
      clientSecret: {
        appleId: process.env.APPLE_ID,
        teamId: process.env.APPLE_TEAM_ID,
        privateKey: process.env.APPLE_PRIVATE_KEY,
        keyId: process.env.APPLE_KEY_ID,
      },
    }),
    */
    FacebookProvider({
      clientId: process.env.FACEBOOK_ID as string,
      clientSecret: process.env.FACEBOOK_SECRET as string,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  theme: {
    colorScheme: "light",
  },
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signin",
  },
  callbacks: {
    async jwt({ token, account, user }) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
      }
      if (user) {
        token.userRole = user.role;
        token.userPhoneNumber = user.phoneNumber;
      }
      return token;
    },

    async session({ session, token, user }) {
      // Send properties to the client, like an access_token from a provider.
      if (token) {
        session.accessToken = token.accessToken;
        session.userRole = token.userRole;
        session.userId = token.sub;
        session.userPhoneNumber = token.userPhoneNumber;
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);
