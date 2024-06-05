import Link from "next/link";

export default function UnderConstruct() {
	return (
		<div className="text-center">
			<img
				src="underConstruct.gif"
				alt="Please come back later, still working on this"
				className="mx-auto w-1/2 h-1/2"
			/>
			<h1>Currently working on other stuff. Please come back later when this is ready.</h1>
			<Link
				href={"/"}
				className="btn btn-accent flex justify-center"
			>
				Back to home
			</Link>
		</div>
	);
}
