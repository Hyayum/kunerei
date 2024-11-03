import ClientLayout from "@/app/layout-client";
import MainPage from "./MainPage";
import { API_URL } from "@/config";
import { Suspense } from "react";

const fetchData = async () => {
  try {
    const response = await fetch(API_URL, { cache: "no-cache" });
    const data = await response.json();
    return data;
  } catch {
    return [];
  }
};

export default async function Home() {
  const data = await fetchData();
  return (
    <ClientLayout>
      <Suspense>
        <MainPage musicData={data} />
      </Suspense>
    </ClientLayout>
  );
}