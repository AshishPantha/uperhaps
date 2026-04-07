import { User } from '../payload-types'
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies'
import { NextRequest } from 'next/server'

export const getServerSideUser = async (
  cookies: NextRequest['cookies'] | ReadonlyRequestCookies,
  serverURL?: string
) => {
  const token = cookies.get('payload-token')?.value
  if (!token) {
    return { user: null }
  }

  const resolvedServerURL = serverURL || process.env.NEXT_PUBLIC_SERVER_URL
  if (!resolvedServerURL) {
    return { user: null }
  }

  try {
    const meRes = await fetch(
      `${resolvedServerURL}/api/users/me`,
      {
        headers: {
          Authorization: `JWT ${token}`,
        },
        cache: 'no-store',
      }
    )

    if (!meRes.ok) {
      return { user: null }
    }

    const { user } = (await meRes.json()) as {
      user: User | null
    }

    return { user }
  } catch {
    return { user: null }
  }
}
