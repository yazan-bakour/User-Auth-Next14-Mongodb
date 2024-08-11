"use client";

import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { signOut, useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { reloadSession } from "@/lib/funcs";
import Link from "next/link";


const formSchema = z.object({
  email: z
    .string()
    .min(1, {
      message: "This field has to be filled.",
    })
    .email("This is not a valid email")
    .max(300, {
      message: "Password can't be longer than 300 characters.",
    }),
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

const DashboardForm = ({ email, password, confirmPassword }: { email: string, password: string, confirmPassword: string }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email,
      password,
      confirmPassword
    },
  });

  const { data: session, update } = useSession();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const response = await fetch(`/api/updateEmail`, {
      method: "POST",
      body: JSON.stringify(values),
    });

    const data = await response.json();

    if (data.error) {
      toast.error(data.error);
      return;
    }


    update({
        ...session,
        user: {
            ...session?.user,
            email: values.email,
            password: values.password,
            confirmPassword: values.confirmPassword
        }
    })

    reloadSession();

    toast.success("Email changed!");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <h1 className="text-xl font-semibold">Modify your email</h1>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="jojo@hatever.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="New password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm password</FormLabel>
              <FormControl>
                <Input placeholder="Confirm new password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button variant="outline" className="bg-green-500/30 mr-5" type="submit">Change</Button>
        <Link
          className="border py-2.5 px-5 rounded bg-green-500/30 mr-5" 
          href={"/"}>
            Profile
        </Link>
        <Button
          variant="outline"
          onClick={() => signOut()}
          className="bg-red-500/50"
        >
          Sign Out
        </Button>
      </form>
    </Form>
  );
};

export default DashboardForm;
