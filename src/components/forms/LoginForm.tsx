import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import axios from "axios";
import { useTranslation } from "react-i18next";

const LoginForm: React.FC = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:3001/login", values, {
        withCredentials: true,
      });

      message.success("Login successful");
      console.log("RESPONSE DATA: ", response.data);

      const fetchedUserData = await fetch("http://localhost:3001/me", {
        credentials: "include",
      });
      console.log("fetchedUserData: ", fetchedUserData);
    } catch (error: any) {
      message.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form layout="vertical" onFinish={onFinish}>
      <Form.Item
        label={t("email")}
        name="email"
        rules={[{ required: true, message: "Please input your email!" }]}
      >
        <Input type="email" placeholder="example@example.com" />
      </Form.Item>

      <Form.Item
        label={t("password")}
        name="password"
        rules={[{ required: true, message: "Please input your password!" }]}
      >
        <Input.Password placeholder="Enter your password" />
      </Form.Item>

      <Form.Item>
        <div className="hidden md:flex">
          <Button type="primary" htmlType="submit" loading={loading}>
            {t("log-in")}
          </Button>
        </div>
        <div className="flex md:hidden">
          <Button block type="primary" htmlType="submit" loading={loading}>
            {t("log-in")}
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
};

export default LoginForm;
