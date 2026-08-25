import Link from "next/link";
import { TokenUser } from "@/services/jwt";
import { LogoutButton } from "@/components/logout-button";
import { getUserFromCookies } from "@/lib/user";

export default async function Home() {
  const user = await getUserFromCookies();

  return (
    <div>
      <h1>ORPC Playground</h1>
      <Link href="/api">API Documentation</Link>
      <br />
      <Link href="/users">Users</Link>
      <br />
      {user ? (
        <div>
          <LogoutButton />
          <CurrentUserInfo user={user} />
        </div>
      ) : (
        <Link href="/login">Login</Link>
      )}
    </div>
  );
}

function CurrentUserInfo({ user }: { user: TokenUser }) {
  return (
    <div>
      <p>Welcome, {user.username}!</p>
      <p>Your email is {user.email}</p>
    </div>
  );
}
