import ClientLayout from "@/app/layout-client";
import MainPage from "./MainPage";
import { API_URL } from "@/config";

export default async function Home() {
  const response = await fetch(API_URL);
  const data = await response.json();
  return (
    <ClientLayout>
      <MainPage musicData={data} />
    </ClientLayout>
  );
}