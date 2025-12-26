"use client";

import { LoginRequest, RegisterRequest } from "@/api/types";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormInput, FormMessage } from "@/components/ui/form";
import { useLogin, useRegister } from "@/hooks/use-auth";
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

export default function RegisterForm() {
  const registerMutation = useRegister();

  const formSchema = z
    .object({
      name: z.string().nonempty({ error: "Введите логин" }),
      email: z.email({ error: "Некорректный email" }),
      password: z.string().nonempty({ error: "Пароль обязателен" }).min(6),
      password_second: z
        .string()
        .nonempty({ error: "Пароль обязателен" })
        .min(6),
    })
    .refine((data) => data.password === data.password_second, {
      path: ["password_second"],
      error: "Введенные пароли не совпадают",
    });

  const methods = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      password_second: "",
    },
  });

  const handleSubmit: SubmitHandler<RegisterRequest> = async (data) => {
    registerMutation.mutate(data);
  };
  return (
    <div className="m-auto w-full max-w-8/12 lg:max-w-4/12 h-full">
      <Form {...methods}>
        <form onSubmit={methods.handleSubmit(handleSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle>Регистрация</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                name="name"
                render={(props) => <FormInput {...props} label="Логин" />}
              />
              <FormField
                name="email"
                render={(props) => <FormInput {...props} label="Email" />}
              />
              <FormField
                name="password"
                render={(props) => (
                  <FormInput
                    inputProps={{ type: "password" }}
                    {...props}
                    label="Пароль"
                  />
                )}
              />
              <FormField
                name="password_second"
                render={(props) => (
                  <FormInput
                    inputProps={{ type: "password" }}
                    {...props}
                    label="Пароль"
                  />
                )}
              />
              {registerMutation.isError && (
                <FormMessage>{registerMutation.error.message}</FormMessage>
              )}
            </CardContent>
            <CardFooter>
              <ButtonGroup>
                <Button type="submit">Зарегистрироваться</Button>
                <ButtonGroupSeparator />
                <Button type="button" variant="outline">
                  <Link href="/auth/login">Есть аккаунт? Войти</Link>
                </Button>
              </ButtonGroup>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}
