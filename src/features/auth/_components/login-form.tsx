import { useState } from "react";
import { loginWithPassword } from "../_actions/login";

import { Link } from "react-router";
import { Loader2Icon, EyeIcon, EyeOffIcon } from "lucide-react";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldTitle,
  FieldDescription,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import type { SubmitEvent } from "react";

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    try {
      await loginWithPassword(email, password);
    } catch (err: any) {
      toast.add({ title: err.message });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <FieldSet>
        <FieldTitle>Login to Outstagram</FieldTitle>
        <FieldDescription>
          Already have an account? <Link to="/auth/signup">Signup</Link>
        </FieldDescription>

        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@email.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Field>

          <Field className="relative">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="password"
              placeholder={showPassword ? "strongpassword" : "••••••••"}
              required
              className="pr-8"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div
              className="!size-4 *:size-4 absolute top-1/2 translate-y-1/2 right-2"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <EyeIcon /> : <EyeOffIcon />}
            </div>
          </Field>

          <Button type="submit" disabled={isLoading} className="relative">
            Login
            {isLoading && (
              <Loader2Icon className="absolute top-1/2 -translate-y-1/2 right-2 animate-spin size-4" />
            )}
          </Button>
        </FieldGroup>
      </FieldSet>
    </form>
  );
};
