import { db } from "@/server/db";
import { user } from "@/server/db/schema";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { eq } from "drizzle-orm";
import type { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { type, data } = await verifyWebhook(req);

    switch (type) {
      case "user.created": {
        await db.insert(user).values({
          clerkId: data.id,
          imageUrl: data.image_url,
          firstName: data.first_name,
          lastName: data.last_name,
        });

        return new Response("Webhook received: user created", { status: 200 });
      }
      case "user.deleted": {
        if (!data.id) {
          return new Response("Webhook received: missing user id", {
            status: 400,
          });
        }

        await db.delete(user).where(eq(user.clerkId, data.id));

        return new Response("Webhook received: user deleted", { status: 200 });
      }
      case "user.updated": {
        await db
          .update(user)
          .set({
            imageUrl: data.image_url,
            firstName: data.first_name,
            lastName: data.last_name,
          })
          .where(eq(user.clerkId, data.id));

        return new Response("Webhook received: user updated", { status: 200 });
      }
      default: {
        return new Response("Webhook received: unknown event type", {
          status: 400,
        });
      }
    }
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error verifying webhook", { status: 400 });
  }
}
