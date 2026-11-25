import { useState, type SubmitEvent } from "react";
import { signinWithPassword } from "../_actions";

import { Link } from "react-router";
import { Loader2Icon } from "lucide-react";
import {
  Field,
  FieldDescription,
  FieldTitle,
  FieldSet,
  FieldError,
} from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await signinWithPassword(email, password);
    } catch (error: any) {
      setError(typeof error.message == "string" ? error.message : null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <FieldSet>
        <Field>
          <FieldTitle>Login</FieldTitle>
          <FieldDescription>
            Don't have an account?{" "}
            <Link to="/auth/signup" className="text-foreground">
              Signup
            </Link>{" "}
          </FieldDescription>
        </Field>

        <Field>
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            id="email"
            placeholder="you@gmail.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field>

        <Field>
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            id="password"
            placeholder="●●●●●●"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <FieldDescription>Must be more than 8 char long</FieldDescription>
        </Field>

        <Button type="submit" disabled={isLoading} className="relative">
          Login
          {isLoading && (
            <Loader2Icon className="size-4 animate-spin absolute top-1/2 -translate-y-1/2 right-2" />
          )}
        </Button>

        {error && <FieldError>{error}</FieldError>}
      </FieldSet>
    </form>
  );
};
