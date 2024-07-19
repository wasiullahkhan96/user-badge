import { zodResolver } from "@hookform/resolvers/zod";
import { passwordStrength } from "check-password-strength";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm, WatchObserver } from "react-hook-form";
import { z } from "zod";
import PasswordStrength from "./PasswordStrength";
import { registerUser } from "@/lib/actions/authActions";
import { toast } from "react-toastify";

const FormSchema = z
  .object({
    email: z.string().email("Please enter a valid email address").default(""),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(20, "Password must be less than 20 characters")
      .default(""),
    confirmPassword: z.string().default(""),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type InputType = z.infer<typeof FormSchema>;

export default function SignupForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<InputType>({
    resolver: zodResolver(FormSchema),
    mode: "onChange",
  });

  const saveUser: SubmitHandler<InputType> = async (data) => {
    const { confirmPassword, ...user } = data;
    try {
      const result = await registerUser(user);
      toast.success("User created successfully!");
    } catch (error) {
      toast.error("Whoops... an error has occurred");
    }
  };

  const [passStrength, setPassStrength] = useState(-1);

  useEffect(() => {
    setPassStrength(passwordStrength(watch().password).id);
    return () => {};
  }, [watch().password]);

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          {/* <img
                  alt="Your Company"
                  src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                  className="mx-auto h-10 w-auto"
                /> */}
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Create a new account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit(saveUser)} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  autoComplete="off"
                  {...register("email")}
                  id="email"
                  name="email"
                  type="text"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
              <div className="text-red-500 text-xs font-semibold h-1 mt-1 ml-1">
                {errors.email?.message}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  autoComplete="off"
                  {...register("password")}
                  id="password"
                  name="password"
                  type="password"
                  className="block w-full rounded-t-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
              <PasswordStrength passStrength={passStrength}></PasswordStrength>
              <div className="text-red-500 text-xs font-semibold h-1 mt-1 ml-1">
                {errors.password?.message}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Repeat Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  {...register("confirmPassword")}
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
              <div className="text-red-500 text-xs font-semibold h-1 mt-1 ml-1">
                {errors.confirmPassword?.message}
              </div>
            </div>
            <div className="pt-2">
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign up
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Already a user?{" "}
            <Link
              href="/login"
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >
              Login!
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
