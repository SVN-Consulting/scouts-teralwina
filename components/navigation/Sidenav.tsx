import Image from 'next/image';
import NextLink from 'next/link';
import { ChevronDown } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import type { Link as linkType } from '@/types';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

type SidenavProps = {
  publicLinks: linkType[];
  protectedLinks: linkType[];
  isAuthenticated: boolean;
};

const Sidenav = ({
  publicLinks,
  protectedLinks,
  isAuthenticated,
}: SidenavProps) => {
  return (
    <Sidebar side='left' variant='sidebar'>
      <SidebarHeader className='flex flex-col items-center gap-3 border-b p-4'>
        <Image
          src='/images/scouts.png'
          alt='Logo Scouts Ter Alwina'
          width={40}
          height={40}
          priority
          className='rounded-md object-contain'
        />

        <span className='font-semibold'>Scouts Ter Alwina</span>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu className='w-full'>
          {publicLinks.map((link) => {
            if (!link.subLinks?.length) {
              return (
                <SidebarMenuItem key={link.href}>
                  <SidebarMenuButton
                    render={<NextLink href={link.href} />}
                    tooltip={link.name}>
                    <span>{link.name}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            }

            return (
              <Collapsible key={link.href} className='group/collapsible'>
                <SidebarMenuItem>
                  <CollapsibleTrigger
                    render={<SidebarMenuButton tooltip={link.name} />}>
                    <span>{link.name}</span>
                    <ChevronDown className='ml-auto size-4 transition-transform group-data-[state=open]/collapsible:rotate-180' />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {link.subLinks.map((subLink) => (
                        <SidebarMenuSubItem key={subLink.href}>
                          <SidebarMenuSubButton
                            render={<NextLink href={subLink.href} />}>
                            <span>{subLink.name}</span>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            );
          })}
          {isAuthenticated &&
            protectedLinks.map((link) => {
              if (!link.subLinks?.length) {
                return (
                  <SidebarMenuItem key={link.href}>
                    <SidebarMenuButton
                      render={<NextLink href={link.href} />}
                      tooltip={link.name}>
                      <span>{link.name}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              }

              return (
                <Collapsible key={link.href} className='group/collapsible'>
                  <SidebarMenuItem>
                    <CollapsibleTrigger
                      render={<SidebarMenuButton tooltip={link.name} />}>
                      <span>{link.name}</span>
                      <ChevronDown className='ml-auto size-4 transition-transform group-data-[state=open]/collapsible:rotate-180' />
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {link.subLinks.map((subLink) => (
                          <SidebarMenuSubItem key={subLink.href}>
                            <SidebarMenuSubButton
                              render={<NextLink href={subLink.href} />}>
                              <span>{subLink.name}</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              );
            })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className='border-t m-2'>
        {isAuthenticated ? (
          <Button
            variant='ghost'
            className='text-primary border-primary hover:bg-primary hover:text-white'>
            <Link href='/auth/logout'>Sign out</Link>
          </Button>
        ) : (
          <Button
            variant='outline'
            className='text-primary border-primary hover:bg-primary hover:text-white'>
            <Link href='/auth/login'>Account</Link>
          </Button>
        )}
      </SidebarFooter>
    </Sidebar>
  );
};

export default Sidenav;
