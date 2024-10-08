"use client";

import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";

const formSchema = z
  .object({
    email: z
      .string()
      .min(1, {
        message: "This field has to be filled.",
      })
      .email("This is not a valid email")
      .max(300, {
        message: "Password can't be longer than 300 characters.",
      }),
    role: z.string().min(1, { message: "Select option" }),
    password: z
      .string()
      .min(6, { message: "Password has to be at least 6 characters long." }),
    confirmPassword: z.string().min(6, {
      message: "Confirm-Password has to be at least 6 characters long.",
    }),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords did not match",
        path: ["confirmPassword"],
      });
    }
  });

const RegisterForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });
  const router = useRouter();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const response = await fetch(`/api/auth/register`, {
      method: "POST",
      body: JSON.stringify(values),
    });

    const data = await response.json();

    if (!data?.error) {
      toast.success("Account created!");
      router.push("/");
    } else {
      toast.error("Email or password is invalid!");
    }
    console.log('data', data);  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 flex flex-col justify-center items-center w-[360px] m-auto p-2">
        <h1 className="text-2xl font-semibold">Registration</h1>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="example@email.com" {...field} />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full">
              <FormLabel>Choose your role</FormLabel>
              <FormControl>
                <select {...field} className="p-2 rounded-md">
                  <option value="admin">Role 1</option>
                  <option value="cleaner">Role 2</option>
                  <option value="manager">Role 3</option>
                </select>
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input className="w-full self-start" type="password" {...field} />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <Link className="block underline mt-0" href={"/login"}>
          Already have an account?
        </Link>
        <Button variant="outline" type="submit" className="bg-green-500/30">Submit</Button>
      </form>
    </Form>
  );
};

export default RegisterForm;