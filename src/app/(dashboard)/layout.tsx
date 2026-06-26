import Sidebar from "@/components/layout/sidebar"

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<div className="flex min-h-screen bg-c1">
			<Sidebar />
			<main className="flex-1 px-8 py-14 md:p-8">
				{children}
			</main>
		</div>
	)
}