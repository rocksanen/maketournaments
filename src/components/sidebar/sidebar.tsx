import { Avatar, Tooltip } from '@nextui-org/react'
import { useRouter } from 'next/router'
import { AccountsIcon } from '../icons/sidebar/accounts-icon'
import { ChangeLogIcon } from '../icons/sidebar/changelog-icon'
import { CustomersIcon } from '../icons/sidebar/customers-icon'
import { DevIcon } from '../icons/sidebar/dev-icon'
import { FilterIcon } from '../icons/sidebar/filter-icon'
import { HomeIcon } from '../icons/sidebar/home-icon'
import { PaymentsIcon } from '../icons/sidebar/payments-icon'
import { ReportsIcon } from '../icons/sidebar/reports-icon'
import { SettingsIcon } from '../icons/sidebar/settings-icon'
import { ViewIcon } from '../icons/sidebar/view-icon'
import { useSidebarContext } from '../layout/layout-context'
import { CompaniesDropdown } from './companies-dropdown'
import { SidebarItem } from './sidebar-item'
import { SidebarMenu } from './sidebar-menu'
import { Sidebar } from './sidebar.styles'

export const SidebarWrapper = () => {
  const router = useRouter()
  const { collapsed, setCollapsed } = useSidebarContext()

  return (
    <aside className="h-screen z-[50] sticky top-0">
      {collapsed ? <div className={Sidebar.Overlay()} onClick={setCollapsed} /> : null}
      <div
        className={Sidebar({
          collapsed: collapsed,
        })}
      >
        <div className={Sidebar.Header()}>
          <CompaniesDropdown />
        </div>
        <div className="flex flex-col justify-between h-full">
          <div className={Sidebar.Body()}>
            <SidebarItem
              title="Home"
              icon={<HomeIcon />}
              isActive={router.pathname === '/'}
              href="/"
            />
            <SidebarMenu title="Main Menu">
              <SidebarItem
                isActive={router.pathname === '/accounts'}
                title="Your Tournaments"
                icon={<AccountsIcon />}
                href="/accounts"
              />
              <SidebarItem
                isActive={router.pathname === '/series/all'}
                title="Your Series"
                icon={<PaymentsIcon />}
                href="/series/all"
              />
              <SidebarItem
                isActive={router.pathname === '/tourneys/new'}
                title="Create Tournament"
                icon={<CustomersIcon />}
                href="/tourneys/new"
              />
              <SidebarItem
                isActive={router.pathname === '/series/new'}
                title="Create Series"
                icon={<ReportsIcon />}
                href="/series/new"
              />
              <Tooltip content="Under construction">
                <SidebarItem
                  isActive={router.pathname === '/reports'}
                  title="Personal Stats"
                  icon={<ReportsIcon />}
                />
              </Tooltip>
            </SidebarMenu>

            <SidebarMenu title="General">
              <SidebarItem
                isActive={router.pathname === '/developers'}
                title="Invitations"
                icon={<DevIcon />}
                href="/tourneys/invitations"
              />
              <SidebarItem
                isActive={router.pathname === '/view'}
                title="View Test Data"
                icon={<ViewIcon />}
              />
              <SidebarItem
                isActive={router.pathname === '/settings'}
                title="Settings"
                icon={<SettingsIcon />}
              />
            </SidebarMenu>

            <SidebarMenu title="Updates">
              <SidebarItem
                isActive={router.pathname === '/changelog'}
                title="Changelog"
                icon={<ChangeLogIcon />}
              />
            </SidebarMenu>
          </div>
          <div className={Sidebar.Footer()}>
            <Tooltip content={'Settings'} color="primary">
              <div className="max-w-fit">
                <SettingsIcon />
              </div>
            </Tooltip>
            <Tooltip content={'Adjustments'} color="primary">
              <div className="max-w-fit">
                <FilterIcon />
              </div>
            </Tooltip>
            <Tooltip content={'Profile'} color="primary">
              <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026704d" size="sm" />
            </Tooltip>
          </div>
        </div>
      </div>
    </aside>
  )
}
