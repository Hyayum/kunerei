import ClientLayout from "@/app/layout-client";
import MainPage from "./MainPage";
import { API_URL } from "@/config";
import { Suspense } from "react";

export default async function Home() {
  const response = await fetch(API_URL);
  const data = await response.json();
  return (
    <ClientLayout>
      <Suspense>
        <MainPage musicData={data} />
      </Suspense>
    </ClientLayout>
  );
}