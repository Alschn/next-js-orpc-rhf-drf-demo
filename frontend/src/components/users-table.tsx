"use client";

import { User } from "@/api/users/schema";
import { useRouter } from "next/navigation";

export const UsersTable = ({ data }: { data: User[] }) => {
  const router = useRouter();

  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Username</th>
          <th>Email</th>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Is Active</th>
          <th>Is Staff</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.map((user) => (
          <tr key={user.id} onClick={() => {}}>
            <td>{user.id}</td>
            <td>{user.username}</td>
            <td>{user.email}</td>
            <td>{user.first_name}</td>
            <td>{user.last_name}</td>
            <td>{user.is_active ? "Yes" : "No"}</td>
            <td>{user.is_staff ? "Yes" : "No"}</td>
            <td>
              <button onClick={() => router.push(`/users/${user.id}`)}>
                Details
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
