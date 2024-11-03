import ClientLayout from "@/app/layout-client";
import MainPage from "./MainPage";
import { Suspense } from "react";

export default async function Home() {
  return (
    <ClientLayout>
      <Suspense>
        <MainPage/>
      </Suspense>
    </ClientLayout>
  );
}