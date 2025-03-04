"use client"

import { navItems } from '@/constants'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

interface Props {
  fullName: string;
  email: string;
  avatar: string;
}

const Sidebar = ({fullName, email, avatar}: Props) => {

  const pathname = usePathname();

  return (
    <aside className='sidebar'>
       <Link href="/">
       <div className="hidden gap-2 lg:flex items-center">

        <Image
          src="/favicon.ico"
          alt="logo"
          width={90}
          height={90}
          className="h-auto rounded-xl"
        />
        <h1 className="text-3xl whitespace-nowrap text-slate-900 font-bold">Sky Store</h1>  
       </div>

        <Image
          src="/favicon.ico"
          alt="logo"
          width={52}
          height={52}
          className="lg:hidden rounded-xl"
        />
      </Link>

      <nav className="sidebar-nav">
        <ul className="flex flex-1 flex-col gap-6">
          {navItems.map(({ url, name, icon }) => (
            <Link key={name} href={url} className="lg:w-full">
              <li
                className={cn(
                  "sidebar-nav-item",
                  pathname === url && "shad-active",
                )}
              >
                <Image
                  src={icon}
                  alt={name}
                  width={24}
                  height={24}
                  className={cn(
                    "nav-icon",
                    pathname === url && "nav-icon-active",
                  )}
                />
                <p className="hidden lg:block">{name}</p>
              </li>
            </Link>
          ))}
        </ul>
      </nav>

      <Image
        src="/assets/images/files-2.png"
        alt="logo"
        width={506}
        height={418}
        className="w-full"
      />

      <div className="sidebar-user-info">
        <Image
          src={avatar}
          alt="Avatar"
          width={44}
          height={44}
          className="sidebar-user-avatar"
        />
        <div className="hidden lg:block">
          <p className="subtitle-2 capitalize">{fullName}</p>
          <p className="caption">{email}</p>
        </div>
      </div>
 
    </aside>
  )
}

export default Sidebar