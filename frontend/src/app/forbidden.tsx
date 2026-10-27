import Link from "next/link";

export default function Forbidden() {
  return (
    <div>
      <h2>Forbidden</h2>
      <p>You are not allowed to see this page.</p>
      <Link href="/">Home</Link>
    </div>
  );
}
