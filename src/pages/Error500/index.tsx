import { Link } from "react-router-dom";
import { AlertTriangle, Home } from "lucide-react";

export function Error500() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-6">
      <div className="flex flex-col items-center text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
          <AlertTriangle className="h-8 w-8" aria-hidden />
        </div>
        <h1 className="text-4xl font-bold text-gray-900">Erro 500</h1>
        <p className="mt-2 max-w-md text-lg text-gray-600">
          Ocorreu um erro interno no servidor. Nossa equipe já foi notificada e
          estamos trabalhando para resolver.
        </p>
        <p className="mt-1 text-sm text-gray-500">
          Tente novamente em alguns instantes ou volte à página inicial.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[#1cb454] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#169c44]"
        >
          <Home className="h-4 w-4" />
          Voltar ao início
        </Link>
      </div>
    </div>
  );
}
