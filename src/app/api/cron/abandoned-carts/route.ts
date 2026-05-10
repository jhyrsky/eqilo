import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { Resend } from 'resend';
import { getAbandonedCartEmailHtml } from '@/lib/emails';
import { fetchStoreSettingsInternal } from '@/lib/actions/admin';

const resendApiKey = process.env.RESEND_API_KEY;

export async function GET(request: Request) {
  try {
    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY is not defined in the environment.");
    }
    const resend = new Resend(resendApiKey);
    // 1. Verify authorization header to prevent public triggering
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    console.log('[cron] secret set:', !!cronSecret, '| header match:', authHeader === `Bearer ${cronSecret}`);
    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // 2. Calculate the threshold: 24 hours ago
    const yesterday = new Date();
    yesterday.setHours(yesterday.getHours() - 24);

    // 3. Find abandoned carts
    const cartsRef = adminDb.collection('carts');
    const abandonedCartsQuery = await cartsRef
      .where('updated_at', '<', yesterday)
      .where('abandoned_recovery_sent', '==', false)
      .where('is_public_link', '==', false)
      .get();

    const [biz] = await Promise.all([fetchStoreSettingsInternal()]);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://eqilo.fi';
    let emailsSent = 0;

    for (const doc of abandonedCartsQuery.docs) {
      const cart = doc.data();

      if (!cart.items || cart.items.length === 0 || !cart.user_id) continue;

      const userDoc = await adminDb.collection('customers').doc(cart.user_id).get();
      if (!userDoc.exists) continue;

      const user = userDoc.data();
      if (!user?.email) continue;

      const lang = (user.lang || 'FI') as 'FI' | 'EN' | 'SE';
      const { subject, html } = getAbandonedCartEmailHtml(lang, baseUrl, biz);

      await resend.emails.send({
        from: 'Eqilo.fi <orders@eqilo.fi>',
        to: [user.email],
        subject,
        html,
      });

      // Mark as sent so we don't spam them
      await doc.ref.update({ abandoned_recovery_sent: true });
      emailsSent++;
    }

    return NextResponse.json({ success: true, emailsSent });

  } catch (error: unknown) {
    console.error('Abandoned cart recovery failed:', error);
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
