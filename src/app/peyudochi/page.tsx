import { Metadata } from "next";
import ClientLayout from "@/app/layout-client";
import Peyudochi from "./Peyudochi";

export const metadata: Metadata = {
  title: "ペユドチ生成機"
};

export default function Page() {
  return (
    <ClientLayout>
      <Peyudochi />
    </ClientLayout>
  );
}