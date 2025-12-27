import * as React from 'react'
import {
  IconBuilding,
  IconChecklist,
  IconCreditCard,
  IconDashboard,
  IconHelp,
  IconInnerShadowTop,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
  IconUsersGroup,
} from '@tabler/icons-react'
import type { Icon } from '@tabler/icons-react'

import type { UserType } from '@/lib/casl'
import type { SessionUserData } from '@/routes/__root'
import { NavDocuments } from '@/components/nav-documents'
import { NavMain } from '@/components/nav-main'
import { NavSecondary } from '@/components/nav-secondary'
import { NavUser } from '@/components/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

type NavItem = {
  title: string
  url: string
  icon: Icon
}

function getNavMainItems(userType: UserType): Array<NavItem> {
  const baseItems: Array<NavItem> = [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: IconDashboard,
    },
    {
      title: 'Team',
      url: '#',
      icon: IconUsers,
    },
  ]

  switch (userType) {
    case 'Employee':
      return baseItems

    case 'Employer':
      return [
        ...baseItems,
        {
          title: 'Employees',
          url: '/employees',
          icon: IconUsersGroup,
        },
        {
          title: 'Approvals',
          url: '#',
          icon: IconChecklist,
        },
        {
          title: 'Payroll',
          url: '#',
          icon: IconCreditCard,
        },
      ]

    case 'Agency':
      return [
        ...baseItems,
        {
          title: 'Employees',
          url: '/employees',
          icon: IconUsersGroup,
        },
        {
          title: 'Employers',
          url: '#',
          icon: IconBuilding,
        },
        {
          title: 'Approvals',
          url: '#',
          icon: IconChecklist,
        },
      ]

    default:
      return baseItems
  }
}

const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  navSecondary: [
    {
      title: 'Settings',
      url: '#',
      icon: IconSettings,
    },
    {
      title: 'Get Help',
      url: '#',
      icon: IconHelp,
    },
    {
      title: 'Search',
      url: '#',
      icon: IconSearch,
    },
  ],
  documents: [
    {
      name: 'Reports',
      url: '#',
      icon: IconReport,
    },
  ],
}

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  sessionUser: SessionUserData
}

export function AppSidebar({ sessionUser, ...props }: AppSidebarProps) {
  const rawUserType = sessionUser.userType as UserType | undefined
  const userType = rawUserType || 'Employee'
  const navMainItems = getNavMainItems(userType)

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <a href="#">
                <IconInnerShadowTop className="size-5!" />
                <span className="text-base font-semibold">My Home Support</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMainItems} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: sessionUser?.name ?? 'Guest',
            email: sessionUser?.email ?? '',
            avatar: sessionUser?.image ?? '/avatars/default.jpg',
          }}
        />
      </SidebarFooter>
    </Sidebar>
  )
}
