import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  const body = await req.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed')
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.subscription 
          ? (await stripe.subscriptions.retrieve(session.subscription as string)).metadata.supabase_user_id
          : null

        if (userId && session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(session.subscription as string)
          
          await supabaseAdmin
            .from('profiles')
            .update({
              plano: 'premium',
              status_assinatura: 'active',
              stripe_subscription_id: subscription.id,
              periodo: subscription.items.data[0].price.recurring?.interval === 'year' ? 'yearly' : 'monthly',
              data_renovacao: new Date(subscription.current_period_end * 1000).toISOString(),
            })
            .eq('id', userId)
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const userId = subscription.metadata.supabase_user_id

        if (userId) {
          await supabaseAdmin
            .from('profiles')
            .update({
              status_assinatura: subscription.status === 'active' ? 'active' : 'inactive',
              data_renovacao: new Date(subscription.current_period_end * 1000).toISOString(),
            })
            .eq('id', userId)
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const userId = subscription.metadata.supabase_user_id

        if (userId) {
          await supabaseAdmin
            .from('profiles')
            .update({
              plano: 'free',
              status_assinatura: 'canceled',
              stripe_subscription_id: null,
              periodo: null,
              data_renovacao: null,
            })
            .eq('id', userId)
        }
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        if (invoice.subscription) {
          const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string)
          const userId = subscription.metadata.supabase_user_id

          if (userId) {
            await supabaseAdmin
              .from('profiles')
              .update({
                status_assinatura: 'inactive',
              })
              .eq('id', userId)
          }
        }
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}
