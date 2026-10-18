import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuLink,
  NavigationMenuContent,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { publicLinks, protectedLinks } from '@/lib/links';
import { SidebarTrigger } from '../ui/sidebar';
import Sidenav from './Sidenav';
import { getSession } from '@/lib/auth0';
import { LogOut } from 'lucide-react';

const Navbar = async () => {
  const session = await getSession();
  return (
    <header className='sticky top-0 z-50 flex h-20 w-full items-center justify-between bg-base-100 px-4 py-2 backdrop-saturate-180 backdrop-blur-xl border-b'>
      <Link href='/'>
        <Image
          src='/images/scouts.png'
          alt='Logo scouts teralwina'
          width={70}
          height={70}
          loading='eager'
        />
      </Link>
      <NavigationMenu className='mx-0 md:flex h-full max-w-none flex-1 flex-col items-center hidden'>
        <NavigationMenuList className='flex h-full items-center justify-start gap-5'>
          {publicLinks.map((link) => (
            <NavigationMenuItem key={link.href}>
              {link.subLinks?.length ? (
                <>
                  <NavigationMenuTrigger className='gap-2 py-2'>
                    {link.name}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className='grid w-56 gap-1 p-2'>
                      {link.subLinks.map((subLink) => (
                        <li key={subLink.href}>
                          <NavigationMenuLink
                            render={<Link href={subLink.href} />}
                            className='block rounded-md px-3 py-2'>
                            {subLink.name}
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </>
              ) : (
                <NavigationMenuLink
                  render={<Link href={link.href} />}
                  className={`${navigationMenuTriggerStyle()} gap-2`}>
                  {link.name}
                </NavigationMenuLink>
              )}
            </NavigationMenuItem>
          ))}
          <>
            {session &&
              protectedLinks.map((link) => (
                <NavigationMenuItem key={link.href}>
                  {link.subLinks?.length ? (
                    <>
                      <NavigationMenuTrigger className='gap-2 py-2'>
                        {link.name}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className='grid w-56 gap-1 p-2'>
                          {link.subLinks.map((subLink) => (
                            <li key={subLink.href}>
                              <NavigationMenuLink
                                render={<Link href={subLink.href} />}
                                className='block rounded-md px-3 py-2'>
                                {subLink.name}
                              </NavigationMenuLink>
                            </li>
                          ))}
                        </ul>
                      </NavigationMenuContent>
                    </>
                  ) : (
                    <NavigationMenuLink
                      render={<Link href={link.href} />}
                      className={`${navigationMenuTriggerStyle()} gap-2`}>
                      {link.name}
                    </NavigationMenuLink>
                  )}
                </NavigationMenuItem>
              ))}
          </>
        </NavigationMenuList>
      </NavigationMenu>
      <>
        {session ? (
          <Button
            variant='ghost'
            className='text-primary border-primary hover:bg-primary hover:text-white hidden md:block'>
            <Link href='/auth/logout'>
              <LogOut />
            </Link>
          </Button>
        ) : (
          <Button
            variant='outline'
            className='text-primary border-primary hover:bg-primary hover:text-white hidden md:block'>
            <Link href='/auth/login'>Account</Link>
          </Button>
        )}
      </>
      <div className='block md:hidden'>
        <SidebarTrigger className='block md:hidden' />
        <Sidenav
          {...{
            publicLinks,
            protectedLinks,
            isAuthenticated: Boolean(session),
          }}
        />
      </div>
    </header>
  );
};

export default Navbar;
