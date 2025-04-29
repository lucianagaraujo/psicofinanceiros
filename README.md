# PsicoFinanceiros

Uma aplicação web para acompanhamento financeiro e comportamental, desenvolvida com Next.js, TypeScript e Tailwind CSS.

## Funcionalidades

- **Eu Atual**: Registro do estado financeiro e comportamental atual
  - Dívidas e despesas
  - Receitas e ativos
  - Estado comportamental

- **Eu Ideal**: Definição dos objetivos financeiros e comportamentais
  - Metas financeiras
  - Estado comportamental desejado

- **Compromissos**: Acompanhamento de progresso
  - Registro de compromissos financeiros e comportamentais
  - Acompanhamento de progresso com escala de 0 a 10
  - Histórico de evolução

## Tecnologias Utilizadas

- Next.js 14
- TypeScript
- Tailwind CSS
- Prisma (ORM)
- SQLite (Banco de dados)

## Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/psicofinanceiros.git
cd psicofinanceiros
```

2. Instale as dependências:
```bash
npm install
```

3. Configure o banco de dados:
```bash
npx prisma generate
npx prisma db push
```

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

5. Acesse a aplicação em `http://localhost:3000`

## Estrutura do Projeto

```
src/
  ├── app/                    # Páginas da aplicação
  │   ├── eu-atual/          # Estado atual
  │   ├── eu-ideal/          # Estado ideal
  │   └── compromissos/      # Compromissos e progresso
  ├── components/            # Componentes reutilizáveis
  └── lib/                   # Utilitários e configurações
prisma/
  └── schema.prisma         # Schema do banco de dados
```

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
