'use client'

import { redirect, usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Dog, LayoutDashboard, Users, MessageSquare, Package, Menu, X, LogOut, ChevronRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const pathname = usePathname()
    const router = useRouter()

    useEffect(() => {
        const supabase = createClient()

        async function checkAccess() {
            // Check for hardcoded admin bypass first
            const isHardcodedAdmin = typeof window !== 'undefined' && localStorage.getItem('crescent_admin_logged_in') === 'true'

            if (isHardcodedAdmin) {
                setIsAdmin(true)
                return
            }

            const { data: { session } } = await supabase.auth.getSession()

            if (!session) {
                router.replace('/login')
                return
            }

            const { data: user, error } = await supabase
                .from('users')
                .select('role')
                .eq('id', session.user.id)
                .single()

            if (error || user?.role !== 'admin') {
                router.replace('/')
            } else {
                setIsAdmin(true)
            }
        }

        checkAccess()

        // Subscription for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            const isHardcodedAdmin = typeof window !== 'undefined' && localStorage.getItem('crescent_admin_logged_in') === 'true'
            if (!isHardcodedAdmin && (event === 'SIGNED_OUT' || !session)) {
                router.replace('/login')
            }
        })

        return () => subscription.unsubscribe()
    }, [router])

    if (isAdmin === null) return <div className="min-h-screen flex items-center justify-center bg-[#fdfbf7] text-gray-500 font-serif">Verifying access...</div>

    const navItems = [
        { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/admin/puppies', label: 'Inventory', icon: Package },
        { href: '/admin/requests', label: 'Adoption Requests', icon: Users },
        { href: '/admin/users', label: 'Users', icon: Users },
        { href: '/admin/chat', label: 'Messages', icon: MessageSquare },
    ]

    const sidebarContent = (
        <div className="flex flex-col h-full bg-primary-950 text-white shadow-2xl">
            <div className="p-6 border-b border-white/10 flex items-center gap-3">
                <Dog className="w-8 h-8 text-primary-300" />
                <h1 className="font-serif text-xl tracking-wide">Admin Portal</h1>
            </div>
            <nav className="flex-1 p-4 space-y-2 mt-4">
                {navItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all ${isActive
                                ? 'bg-primary-800 text-white shadow-inner border border-white/10'
                                : 'text-primary-100 hover:bg-white/5'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <item.icon className={`w-5 h-5 ${isActive ? 'text-primary-300' : 'opacity-60'}`} />
                                <span className="font-medium">{item.label}</span>
                            </div>
                            {isActive && <ChevronRight className="w-4 h-4 text-primary-400" />}
                        </Link>
                    )
                })}
            </nav>
            <div className="p-6 border-t border-white/10">
                <Link href="/" className="flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-sm text-primary-300 hover:text-white transition-all border border-white/5">
                    <LogOut className="w-4 h-4" />
                    Exit to Main Site
                </Link>
            </div>
        </div>
    )

    return (
        <div className="min-h-screen bg-[#fdfbf7] flex flex-col md:flex-row">
            {/* Desktop Sidebar */}
            <aside className="w-68 hidden md:block border-r border-gray-100 sticky top-0 h-screen overflow-hidden">
                {sidebarContent}
            </aside>

            {/* Mobile Header */}
            <header className="md:hidden bg-primary-950 text-white p-4 sticky top-0 z-50 flex justify-between items-center shadow-lg border-b border-white/10">
                <div className="flex items-center gap-2">
                    <div className="bg-primary-800 p-2 rounded-lg">
                        <Dog className="w-6 h-6 text-primary-300" />
                    </div>
                    <span className="font-serif text-lg tracking-wide">Crescent Moon Admin</span>
                </div>
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors border border-white/10"
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </header>

            {/* Mobile Navigation Drawer */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <div className="fixed inset-0 z-[60] md:hidden">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="absolute top-0 left-0 bottom-0 w-[280px] shadow-2xl"
                        >
                            {sidebarContent}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <main className="flex-1 flex flex-col w-full overflow-hidden">
                <div className="flex-1 overflow-y-auto p-5 md:p-10 lg:p-12">
                    {children}
                </div>
            </main>
        </div>
    )
}
