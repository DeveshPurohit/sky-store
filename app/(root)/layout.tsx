import Header from '@/components/Header'
import MobileNavigation from '@/components/MobileNavigation'
import Sidebar from '@/components/Sidebar'
import { getCurrentUser } from '@/lib/actions/user-action'
import { redirect } from 'next/navigation'
import { Toaster } from "@/components/ui/toaster"

export const dynamic = "force-dynamic";

const Layout = async ({ children }: { children: React.ReactNode}) => {

  const currentUser = await getCurrentUser();

  if(!currentUser) return redirect("/sign-in");
  
  return (
    <div className='flex h-screen'>
        <Sidebar {...currentUser}/>
        <section className='flex flex-1 h-full flex-col'>
            <MobileNavigation {...currentUser}/> <Header userId={currentUser.$id} accountId={currentUser.accountId}/>
            <div className="main-content">
                {children}
            </div>
        </section>
        <Toaster />
    </div>
  )
}

export default Layout