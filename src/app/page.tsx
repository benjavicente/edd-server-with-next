import { run } from "@/app/T3-2023-2/[user]/runner";
import { redirect } from "next/navigation";

async function action(formData: FormData) {
  "use server";
  const user = formData.get("user") as string;
  redirect(`/T3-2023-2-${user}`);
}

export default async function Home() {
  return (
    <form action={action}>
      <h1>Usuario para probar magic de la T3</h1>
      <input type="text" name="user" />
      <button type="submit">Enviar</button>
    </form>
  );
}
