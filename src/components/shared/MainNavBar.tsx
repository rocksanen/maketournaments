import UserNav from '@/components/shared/UserSessionNavbar'

async function MainNavBar() {
  return (
    <header className="z-10 top-0 border-b border-gray-200 dark:bg-gray-700">
      <UserNav />
    </header>
  )
}

export default MainNavBar
