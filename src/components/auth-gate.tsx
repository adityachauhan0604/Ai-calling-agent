"use client";
import { clientAuth, clientFirebaseConfigured } from "@/lib/firebase-client";
import { onAuthStateChanged, User } from "firebase/auth";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
export function AuthGate({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null | undefined>(() => clientFirebaseConfigured ? undefined : null);
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => { if (clientFirebaseConfigured) return onAuthStateChanged(clientAuth()!, setUser); }, []);
  useEffect(() => { if (clientFirebaseConfigured && user === null && pathname !== "/login") router.replace("/login"); if (user && pathname === "/login") router.replace("/"); }, [user, pathname, router]);
  if (!clientFirebaseConfigured) return children;
  if (user === undefined) return <div className="auth-loading"><span>Dialora</span><p>Securing your workspace…</p></div>;
  if (!user && pathname !== "/login") return null;
  return children;
}
