import { Navbar } from "@/components/navbar";
import { Link } from "react-router";

export default function Home() {
  return (
    <div>
      <Link to="/auth/login">Go To Login page</Link> <br />
      this is the home page
      <Navbar />
    </div>
  );
}
