import Link from "next/link";

export default function Page() {
	return (
		<div>
			<img
				src="underConstruct.gif"
				alt="Please come back later still wroking on this"
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
