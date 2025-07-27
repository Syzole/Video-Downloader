import Link from "next/link";
import React from "react";

export default function App() {
	return (
		<div
			data-theme="dark"
			className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900"
		>
			{/* Header */ }
			<header className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 shadow-2xl">
				<div className="absolute inset-0 bg-black opacity-20"></div>
				<div className="relative z-10 container mx-auto px-6 py-12">
					<h1 className="text-center text-5xl md:text-6xl font-bold text-white drop-shadow-lg">
						🎵 Media Downloader
					</h1>
					<p className="text-center text-xl text-blue-100 mt-4 font-light">
						Your Self-hosted solution for downloading media content
					</p>
				</div>
				<div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500"></div>
			</header>

			{/* Main Content */ }
			<main className="container mx-auto px-6 py-16">
				<div className="text-center mb-16">
					<h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
						Choose Your Service
					</h2>
					<p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
						Select the platform you'd like to download content from. Each service is optimized for the best quality and experience.
					</p>
				</div>

				{/* Service Cards */ }
				<div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
					{/* YouTube to MP3 */ }
					<Link href="/ytToMp3" className="group">
						<div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl p-8 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-red-400/30">
							<div className="text-center">
								<div className="text-6xl mb-6">🎵</div>
								<h3 className="text-2xl font-bold text-white mb-4">YouTube to MP3</h3>
								<p className="text-red-100 mb-6">
									Convert YouTube videos to high-quality MP3 audio files with metadata and artwork.
								</p>
								<div className="bg-white/20 rounded-lg px-6 py-3 inline-block">
									<span className="text-white font-semibold">Audio Only</span>
								</div>
							</div>
						</div>
					</Link>

					{/* YouTube to MP4 */ }
					<Link href="/ytToMp4" className="group">
						<div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-8 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-blue-400/30">
							<div className="text-center">
								<div className="text-6xl mb-6">🎬</div>
								<h3 className="text-2xl font-bold text-white mb-4">YouTube to MP4</h3>
								<p className="text-blue-100 mb-6">
									Download YouTube videos in various quality options from 720p to 4K resolution.
								</p>
								<div className="bg-white/20 rounded-lg px-6 py-3 inline-block">
									<span className="text-white font-semibold">Video + Audio</span>
								</div>
							</div>
						</div>
					</Link>

					{/* Spotify */ }
					<Link href="/spotify" className="group">
						<div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-8 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-green-400/30">
							<div className="text-center">
								<div className="text-6xl mb-6">🎼</div>
								<h3 className="text-2xl font-bold text-white mb-4">Spotify</h3>
								<p className="text-green-100 mb-6">
									Access and download your favorite Spotify tracks and playlists.
								</p>
								<div className="bg-white/20 rounded-lg px-6 py-3 inline-block">
									<span className="text-white font-semibold">Premium Quality</span>
								</div>
							</div>
						</div>
					</Link>
				</div>
			</main>
		</div>
	);
}
