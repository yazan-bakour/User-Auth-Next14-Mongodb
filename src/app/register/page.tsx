import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/authOptions";
import { redirect } from "next/navigation";
import RegisterForm from "./Form";

const Page = async () => {
  const session = await getServerSession(authOptions) ;

  if (session) {
    redirect("/");
  }
  return (
    <main>
      <RegisterForm />
    </main>
  );
};

export default Page;
