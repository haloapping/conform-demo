import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { Form, redirect } from "react-router";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import type { Route } from "./+types/login";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Conform Demo" },
    { name: "description", content: "Form Demo using Conform" },
  ];
}

const schema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(32, "Password must not exceed 32 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[@$!%*?&#]/,
      "Password must contain at least one special character",
    ),
});

export async function action({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema });

  if (submission.status !== "success") {
    return submission.reply();
  }

  console.log(formData);
  return redirect("/dashboard");
}

export default function Home({ actionData }: Route.ComponentProps) {
  const [form, fields] = useForm({
    lastResult: actionData,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  return (
    <div className="mb flex h-screen items-center justify-center">
      <Form method="POST" id={form.id} onSubmit={form.onSubmit}>
        <Card className="w-[450px]">
          <CardHeader>
            <CardTitle className="text-center">Login</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <label htmlFor="email">Email</label>
                <Input
                  key={fields.email.key}
                  name={fields.email.name}
                  id="email"
                  placeholder="Your Email"
                />
                <p className="text-sm text-red-500">{fields.email.errors}</p>
              </div>

              <div className="flex flex-col space-y-1.5">
                <label htmlFor="password">Password</label>
                <Input
                  key={fields.password.key}
                  name={fields.password.name}
                  id="password"
                  type="password"
                  placeholder="Your Password"
                />
                {fields.password.errors?.map((error, index) => (
                  <li key={index} className="text-sm text-red-500">
                    {error}
                  </li>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button>Login</Button>
          </CardFooter>
        </Card>
      </Form>
    </div>
  );
}
