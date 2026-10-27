import Link from "next/link";

export default function Unauthorized() {
  return (
    <div>
      <h2>Unauthorized</h2>
      <p>You need to be logged in to see this page.</p>
      <Link href="/login">Login</Link>
    </div>
  );
}
