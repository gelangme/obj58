"use client";
import { Button, Descriptions, DescriptionsProps } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(
    null
  );

  const [items, setItems] = useState<DescriptionsProps["items"] | undefined>();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("http://localhost:3001/me", {
          withCredentials: true,
        });
        const userInfo = response.data.user;
        const items: DescriptionsProps["items"] = [
          {
            key: "1",
            label: "Name",
            children: userInfo.name,
          },
          {
            key: "2",
            label: "Email",
            children: userInfo.email,
          },
        ];
        setUser(userInfo);
        setItems(items);
      } catch (error: any) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();
  }, []);

  if (!user) {
    return <p>No user info available. Please log in.</p>;
  }

  return (
    <>
      <Descriptions title="User Info" items={items} />
      <div className="flex md:hidden mt-4">
        <Button type="primary" block danger>
          Logout
        </Button>
      </div>
    </>
  );
}
