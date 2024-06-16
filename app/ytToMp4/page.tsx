"use client";

import underConstruct from "@/public/underConstruct";

export default function Page() {
	return (
		<div className="flex flex-col justify-center p-8">
			<div className="navbar bg-base-100">
				<a
					className="btn btn-info text-xl"
					href="/"
				>
					Home
				</a>
			</div>
			<h1 className="font-sans self-center p-8 text-xl">
				Below in the text box, add a{" "}
				<a
					href="https://www.youtube.com/"
					className="text-blue-600"
					onClickCapture={(e) => e.preventDefault()}
					onClick={(e) => window.open(e.currentTarget.href, "_blank")}
				>
					{" "}
					Youtube
				</a>{" "}
			
				URL and it will be converted to an MP4 file ready to downloaded
			</h1>
			<input
				type="text"
				id="ytUrl"
				placeholder="Youtube URL"
				className="input input-md input-primary mb-5"
			/>
			<button
				className="btn btn-accent justify-center mb-4"
				id="downloadButton"
			>
				{" "}
				Download
			</button>
			<br />
			<h1 className="font-sans font-bold underline justify-start text-xl"> Files that have been converted to MP4</h1>
			<br />
			<label className="input input-bordered flex items-center gap-2">
				<input
					type="text"
					className="grow"
					placeholder="Search"
					id="searchBar"
					onChange={(e) => {
						e.preventDefault();
					}}
				/>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="currentColor"
					className="w-4 h-4 opacity-70"
				>
					<path
						fillRule="evenodd"
						d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
						clipRule="evenodd"
					/>
				</svg>
			</label>
			<br />
			<div className="flex flex-col">{}</div>
		</div>
	);
}
