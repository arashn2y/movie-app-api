"use client";

import dynamic from "next/dynamic";

const RedocStandalone = dynamic(
	() => import("redoc").then((mod) => mod.RedocStandalone),
	{ ssr: false },
);

const RedocPage = () => {
	return (
		<RedocStandalone
			specUrl="/api/docs"
			options={{
				theme: { colors: { primary: { main: "#6EC5AB" } } },
				expandResponses: "200",
			}}
		/>
	);
};

export default RedocPage;
