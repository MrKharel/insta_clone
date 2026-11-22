import { Button } from "@/components/ui/button";
import { signout } from "@/features/auth";
import { Link } from "react-router";

export default function Home() {
  return (
    <div>
      <Link to="/auth/login">Go To Login page</Link> <br />
      <Button onClick={() => signout()}>Signout</Button>
      this is the home page
    </div>
  );
}
