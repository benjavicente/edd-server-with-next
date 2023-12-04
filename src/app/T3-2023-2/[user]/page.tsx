import { run } from "@/app/T3-2023-2/[user]/runner";
import { Suspense } from "react";

async function Results({ user }: { user: string }) {
  const { expected, returned, time } = await run(`https://github.com/IIC2133-PUC/T3-2023-2-${user}`);

  return (
    <div>
      <h1>Test de ejecución de código ({time} segundos)</h1>
      <h2>Resultado</h2>
      <pre>{returned}</pre>
      <h2>Esperado</h2>
      <pre>{expected}</pre>
    </div>
  );
}

export default async function T3_2023({ params }: { params: { user: string } }) {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <Results user={params.user} />
    </Suspense>
  );
}
