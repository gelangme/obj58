import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import axios from "axios";
import { useTranslation } from "react-i18next";

const RegisterForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const onFinish = async (values: {
    name: string;
    email: string;
    password: string;
  }) => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:3001/register",
        values
      );
      message.success(response.data.message);
    } catch (error: any) {
      message.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form layout="vertical" onFinish={onFinish}>
      <Form.Item
        label={t("name")}
        name="name"
        rules={[{ required: true, message: "Please input your name!" }]}
      >
        <Input placeholder="John Doe" />
      </Form.Item>

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
            {t("sign-up")}
          </Button>
        </div>
        <div className="flex md:hidden">
          <Button block type="primary" htmlType="submit" loading={loading}>
            {t("sign-up")}
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
};

export default RegisterForm;
