import { Metadata } from "next";
import { AccountClient } from "./AccountClient";

export const metadata: Metadata = {
  title: "Mon Compte | Nuage",
  description: "Gérez votre compte et consultez vos commandes",
};

export default function AccountPage() {
  return <AccountClient />;
}
