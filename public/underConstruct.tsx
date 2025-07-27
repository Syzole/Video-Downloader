import Link from "next/link";

export default function UnderConstruct() {
	return (
		<div 
			data-theme="dark"
			className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 flex items-center justify-center"
		>
			<div className="container mx-auto px-6 py-16">
				{/* Main Content Card */}
				<div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
					
					{/* Header Section */}
					<div className="bg-gradient-to-r from-amber-500 to-orange-600 p-8 text-center relative overflow-hidden">
						<div className="absolute inset-0 bg-black/20"></div>
						<div className="relative z-10">
							<div className="text-6xl mb-4">🚧</div>
							<h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
								Under Construction
							</h1>
							<p className="text-xl text-orange-100">
								We're building something amazing for you!
							</p>
						</div>
						{/* Animated dots */}
						<div className="absolute top-4 right-4 flex space-x-1">
							<div className="w-3 h-3 bg-white/50 rounded-full animate-pulse"></div>
							<div className="w-3 h-3 bg-white/50 rounded-full animate-pulse delay-100"></div>
							<div className="w-3 h-3 bg-white/50 rounded-full animate-pulse delay-200"></div>
						</div>
					</div>

					{/* Content Section */}
					<div className="p-12 text-center">
						{/* Construction GIF with enhanced styling */}
						<div className="mb-12 relative">
							<div className="relative inline-block">
								<img
									src="UnderConstruct.gif"
									alt="Please come back later, still working on this"
									className="mx-auto max-w-md w-full h-auto rounded-2xl shadow-xl border-4 border-white/20"
								/>
								<div className="absolute -inset-2 bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl opacity-20 blur-xl"></div>
							</div>
						</div>

						{/* Message */}
						<div className="mb-12">
							<h2 className="text-3xl font-bold text-white mb-6">
								🛠️ Currently in Development
							</h2>
							<p className="text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto mb-8">
								We're working hard to bring you an incredible experience. This feature is being crafted with attention to detail and will be ready soon!
							</p>
							
							{/* Status indicators */}
							<div className="grid md:grid-cols-3 gap-6 mb-8">
								<div className="bg-gradient-to-br from-green-500/20 to-emerald-600/20 rounded-xl p-4 border border-green-400/30">
									<div className="text-2xl mb-2">✅</div>
									<h3 className="text-green-400 font-semibold">Planning</h3>
									<p className="text-green-200 text-sm">Complete</p>
								</div>
								<div className="bg-gradient-to-br from-yellow-500/20 to-amber-600/20 rounded-xl p-4 border border-yellow-400/30">
									<div className="text-2xl mb-2">⚡</div>
									<h3 className="text-yellow-400 font-semibold">Development</h3>
									<p className="text-yellow-200 text-sm">In Progress</p>
								</div>
								<div className="bg-gradient-to-br from-gray-500/20 to-slate-600/20 rounded-xl p-4 border border-gray-400/30">
									<div className="text-2xl mb-2">🚀</div>
									<h3 className="text-gray-400 font-semibold">Launch</h3>
									<p className="text-gray-300 text-sm">Coming Soon</p>
								</div>
							</div>
						</div>

						{/* Navigation */}
						<div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
							<Link
								href="/"
								className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg transform hover:-translate-y-1 transition-all duration-300 flex items-center space-x-2"
							>
								<span>🏠</span>
								<span>Back to Home</span>
							</Link>
							
							<div className="text-gray-400 text-sm">
								<p>💡 Check back soon for updates!</p>
							</div>
						</div>

						{/* Fun loading animation */}
						<div className="mt-12 flex justify-center">
							<div className="flex space-x-2">
								<div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-bounce"></div>
								<div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-bounce delay-100"></div>
								<div className="w-3 h-3 bg-gradient-to-r from-pink-500 to-red-500 rounded-full animate-bounce delay-200"></div>
							</div>
						</div>
					</div>
				</div>

				{/* Background decoration */}
				<div className="absolute top-10 left-10 w-20 h-20 bg-blue-500/10 rounded-full blur-xl"></div>
				<div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-500/10 rounded-full blur-xl"></div>
				<div className="absolute top-1/2 left-1/4 w-16 h-16 bg-pink-500/10 rounded-full blur-xl"></div>
			</div>
		</div>
	);
}
