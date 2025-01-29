import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ThemeToggle } from "../theme-toggle"

export function Header() {
  return (
    <header className="flex items-center justify-between p-4 border-b border-white/10">
      <Link href="/" className="text-2xl font-bold">
        Bluiprint
      </Link>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <Button variant="default" className="text-white/70 hover:text-white">
          Sign In
        </Button>
      </div>
    </header>
  )
}