import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-10 bg-[#241b3d] px-5 py-8 text-white/80">
      <div className="mx-auto flex max-w-[1400px] flex-wrap items-start justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-yellow text-sm font-black text-brand-dark">
              SJ
            </span>
            <span className="font-heading text-lg font-extrabold text-white">
              SuperJogosClick
            </span>
          </div>
          <p className="mt-2 max-w-xs text-xs">
            Um lugar seguro e divertido para jogar online, com classificação
            indicativa em todos os jogos.
          </p>
        </div>
        <div className="flex gap-10 text-xs">
          <div className="flex flex-col gap-1.5">
            <span className="mb-1 font-bold text-white">Conta</span>
            <Link href="/login">Entrar</Link>
            <Link href="/cadastro">Criar conta</Link>
            <Link href="/perfil">Meu perfil</Link>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="mb-1 font-bold text-white">Explorar</span>
            <Link href="/favoritos">Favoritos</Link>
            <Link href="/historico">Histórico</Link>
            <Link href="/buscar">Buscar jogos</Link>
          </div>
        </div>
      </div>
      <p className="mx-auto mt-6 max-w-[1400px] text-[11px] text-white/50">
        © {new Date().getFullYear()} SuperJogosClick. Todos os jogos pertencem aos seus respectivos criadores.
      </p>
    </footer>
  );
}
