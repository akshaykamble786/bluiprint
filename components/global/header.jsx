import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ThemeToggle } from "../theme-toggle"
import { useContext } from "react"
import { UserDetailsContext } from "@/context/user-details-context"
import { LucideDownload, Rocket } from "lucide-react"
import { usePathname } from "next/navigation"
import Image from "next/image"

export function Header() {
  const { userDetails, setUserDetails } = useContext(UserDetailsContext);
  const path = usePathname();

  return (
    <header className="flex items-center justify-between p-4 border-b border-white/10">
      <Link href="/" className="text-xl font-semibold">
        <span className="opacity-60 mr-2">⚡</span>
        Bluiprint
      </Link>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        {!userDetails?.name ? <div className="flex gap-5">
          <Button variant="ghost">Sign in</Button>
          <Button className="text-white">Get Started</Button>
        </div> :
          <div className="flex gap-2 items-center">
            {path?.includes('workspace') && <div>
              <Button variant="ghost"> <LucideDownload />Export</Button>
              <Button className="text-white bg-blue-500 hover:bg-blue-600"><Rocket />Deploy</Button>
            </div>}

            <Image src={userDetails?.picture} alt='user' width={30} height={30} className='rounded-full w-[30px]' />
          </div>
        }

      </div>
    </header>
  )
}