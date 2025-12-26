"use client";

import { LoginRequest } from "@/api/types";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormInput, FormMessage } from "@/components/ui/form";
import { useLogin } from "@/hooks/use-auth";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import * as z from "zod";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ButtonGroup,
  ButtonGroupSeparator,
} from "@/components/ui/button-group";
import Link from "next/link";

export const ACCESS_TOKEN_QUERY_KEY: readonly [unknown] = ["accessToken"];

export default function LoginForm() {
  const loginMutation = useLogin();

  const formSchema = z.object({
    email: z.email({ error: "Некорректный email" }),
    password: z.string().nonempty({ error: "Пароль обязателен" }),
  });

  const methods = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit: SubmitHandler<LoginRequest> = async (data) => {
    loginMutation.mutate(data);
  };
  return (
    <div className="m-auto w-full max-w-8/12 lg:max-w-4/12 h-full">
      <Form {...methods}>
        <form onSubmit={methods.handleSubmit(handleSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle>Авторизация</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                name="email"
                render={(props) => <FormInput {...props} label="Email" />}
              />
              <FormField
                name="password"
                render={(props) => <FormInput {...props} label="Пароль" />}
              />
              {loginMutation.isError && (
                <FormMessage>{loginMutation.error.message}</FormMessage>
              )}
            </CardContent>
            <CardFooter>
              <ButtonGroup>
                <Button type="submit">Войти</Button>
                <ButtonGroupSeparator />
                <Button type="button" variant="outline">
                  <Link href="/auth/register">Регистрация</Link>
                </Button>
              </ButtonGroup>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}
