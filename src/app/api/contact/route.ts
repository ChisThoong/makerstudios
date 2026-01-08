export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";

const API_HOST = process.env.API_SERVER_URL || "";
const SECRET_KEY = process.env.API_SECRET_KEY || "";
const SLACK_CONTACT_WEBHOOK = process.env.SLACK_CONTACT_WEBHOOK || "";

export async function POST(req: NextRequest) {
  let body: any;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const { fullName, email, title, message } = body || {};

  if (!fullName || !email || !title || !message) {
    return NextResponse.json(
      { success: false, message: "Missing required fields" },
      { status: 400 }
    );
  }

     //SEND SLACK
   
  if (SLACK_CONTACT_WEBHOOK) {
    try {
      await fetch(SLACK_CONTACT_WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          blocks: [
            {
              type: "header",
              text: {
                type: "plain_text",
                text: "📩 New Contact Message",
                emoji: true,
              },
            },

            /** Site */
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: "🌐 *Site:* MakerStudios VN",
              },
            },

            /** User info */
            {
              type: "section",
              fields: [
                {
                  type: "mrkdwn",
                  text: `👤 Name: ${fullName}`,
                },
                {
                  type: "mrkdwn",
                  text: `📧 Email: ${email}`,
                },
              ],
            },

            /** Subject */
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: `📝 Subject: ${title}`,
              },
            },

            /** Message */
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: `💬 *Message:*\n>${message}`,
              },
            },

            /** Time */
            {
              type: "context",
              elements: [
                {
                  type: "mrkdwn",
                  text: `⏰ ${new Date().toLocaleString("en-US", {
                    timeZone: "Asia/Ho_Chi_Minh",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })} (GMT+7)`,
                },
              ],
            },

            { type: "divider" },
          ],
        }),
      });
    } catch (err) {
      console.error("[SLACK][CONTACT]", err);
    }
  }
  //SEND TO BACKEND
  let backendResult: any = null;

  try {
    const response = await fetch(`${API_HOST}/web/contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": SECRET_KEY,
      },
      body: JSON.stringify(body),
    });

    const text = await response.text();

    try {
      backendResult = JSON.parse(text);
    } catch {
      backendResult = { raw: text };
    }

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: backendResult?.message || "Backend error",
        },
        { status: response.status }
      );
    }
  } catch (err) {
    console.error("[BACKEND][CONTACT]", err);
  }
     //RESPONSE TO FE
  return NextResponse.json({
    success: true,
    data: backendResult,
  });
}
