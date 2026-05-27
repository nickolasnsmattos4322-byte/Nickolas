import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/app'
  const error = searchParams.get('error')
  const error_description = searchParams.get('error_description')

  // Handle OAuth errors
  if (error) {
    console.error('[v0] Auth callback error:', error, error_description)
    const errorUrl = new URL('/auth/error', origin)
    errorUrl.searchParams.set('error', error)
    if (error_description) {
      errorUrl.searchParams.set('message', error_description)
    }
    return NextResponse.redirect(errorUrl)
  }

  if (code) {
    const supabase = await createClient()
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!exchangeError) {
      // Determine final redirect URL
      const forwardedHost = request.headers.get('x-forwarded-host')
      const isLocalEnv = process.env.NODE_ENV === 'development'
      
      let redirectUrl: string
      if (isLocalEnv) {
        redirectUrl = `${origin}${next}`
      } else if (forwardedHost) {
        redirectUrl = `https://${forwardedHost}${next}`
      } else {
        redirectUrl = `${origin}${next}`
      }
      
      return NextResponse.redirect(redirectUrl)
    }
    
    console.error('[v0] Code exchange error:', exchangeError)
  }

  // Return to error page if code exchange fails or no code
  return NextResponse.redirect(`${origin}/auth/error`)
}
