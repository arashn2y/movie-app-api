"use client";

import dynamic from "next/dynamic";

const RedocStandalone = dynamic(() => import("redoc").then(mod => mod.RedocStandalone), { ssr: false });

const RedocPage = () => {
  return (
    <main className="flex flex-col items-center justify-center">
      <RedocStandalone
        specUrl="/api/docs"
        options={{
          theme: { colors: { primary: { main: "#6EC5AB" } } },
          expandResponses: "200"
        }}
      />
    </main>
  );
};

export default RedocPage;
