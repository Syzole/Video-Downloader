import Link from "next/link";

export default function underConstruct() {
	return (
		<div>
			<img
				src="underConstruct.gif"
				alt="Please come back later still wroking on this"
				className="w-1/2 mx-auto"
			/>
			<h1 className="text-center">
				Currently Working on other stuff please come back later when this is
				ready
			</h1>
			<Link
				href={"/"}
				className="btn btn-accent flex justify-center"
			>
				{" "}
				Back to home
			</Link>
		</div>
	);
}
