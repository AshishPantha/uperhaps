import Link from 'next/link'
import MaxWidthWrapper from './MaxWidthWrapper'
import NavItems from './NavItems'
import { buttonVariants } from './ui/button'
import Cart from './Cart'
import { cookies } from 'next/headers'
import { getServerSideUser } from '@/lib/payload-utils'
import UserAccountNav from './UserAccountNav'
import MobileNav from './MobileNav'

const Navbar = async () => {
  const nextCookies = cookies()
  const { user } = await getServerSideUser(nextCookies)

  return (
    <div className='sticky z-50 top-0 inset-x-0 h-16'>
      <header className='relative' style={{
        background: '#abbaab',
        // @ts-ignore
        background: '-webkit-linear-gradient(to right, #ffffff, #abbaab)',
        // @ts-ignore
        background: 'linear-gradient(to right, #ffffff, #abbaab)'
      }}>
        <MaxWidthWrapper>
          <div className='flex h-16 items-center justify-between'>
            <div className='flex items-center'>
              <MobileNav />
              <div className='ml-4 flex lg:ml-0 font-semibold'>
                <Link href='/'>
                  <p className='ml-4 flex lg:ml-0 text-gray-800'>
                    Unwhispered<span className="text-green-600">Perhaps..</span>
                  </p>
                </Link>
              </div>
            </div>

            <div className='hidden z-50 lg:ml-8 lg:block lg:self-stretch'>
              <NavItems />
            </div>

            <div className='flex items-center'>
              <div className='hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6'>
                {user ? (
                  <UserAccountNav user={user} />
                ) : (
                  <>
                    <Link
                      href='/sign-in'
                      className={buttonVariants({
                        variant: 'ghost',
                        className: 'text-gray-700 hover:text-gray-900',
                      })}>
                      Sign in
                    </Link>
                    <span
                      className='h-6 w-px bg-gray-300'
                      aria-hidden='true'
                    />
                    <Link
                      href='/sign-up'
                      className={buttonVariants({
                        variant: 'ghost',
                        className: 'text-gray-700 hover:text-gray-900',
                      })}>
                      Create account
                    </Link>
                    <span
                     className='h-6 w-px bg-gray-300 mr-2' // Added margin-right for spacing
                     aria-hidden='true'
                    />
                  </>
                )}
              </div>
              {/* Cart component moved outside of the hidden div */}
              <div className='ml-4 flow-root'>
                <Cart />
              </div>
            </div>
          </div>
        </MaxWidthWrapper>
      </header>
    </div>
  )
}

export default Navbar