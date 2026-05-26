# API Design System & Padrões do Projeto

Este documento define os padrões de design, arquitetura e convenções para as APIs do projeto.

---

## 1. Estrutura de Respostas da API

Todas as respostas da API devem seguir um padrão previsível e consistente.

### 1.1. Sucesso (Success)
Para endpoints de dados ou operações bem-sucedidas:
```json
{
  "success": true,
  "data": {
    "exemplo": "valor"
  }
}
```

### 1.2. Erro (Error)
Para falhas na validação, erros internos ou requisições malformadas:
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Mensagem descritiva do erro",
    "details": {}
  }
}
```

### 1.3. Health / Status (Ping)
Para endpoints de monitoramento de integridade da API:
```json
{
  "status": "healthy",
  "timestamp": "2026-05-26T14:57:44-03:00",
  "uptime": 123.45,
  "environment": "development",
  "version": "1.0.0"
}
```

---

## 2. Regras de Código (TypeScript)

Para manter a consistência do código de backend, aplicamos as seguintes diretrizes:

1. **Sem ponto e vírgula**: Use `;` apenas quando estritamente necessário.
2. **Aspas Duplas**: Sempre utilize `"` para strings, e `'` apenas quando estritamente necessário.
3. **Tipagem com Types**: Sempre utilize `type` ao invés de `interface` para definição de tipos.
4. **Keyword `function` e sem `const`**: 
   - Use `const` **somente** em elementos JSX (não aplicável a este backend).
   - Use `let` para declaração de variáveis locais.
   - Use `function` para declarar funções de lógica sem retorno JSX.
5. **Organização de Imports**:
   Ordene os imports por categoria seguindo este padrão de cabeçalho comentado:
   ```typescript
   //Libs
   import { Elysia } from "elysia"

   //Imports
   import { pingRoutes } from "./routes/ping"

   //Types
   type AppResponse = { ... }

   //Main
   let app = new Elysia()
   ```

---

## 3. Arquitetura de Pastas (Adaptada)

Para mantermos correspondência e organização no backend, adaptamos a arquitetura do projeto seguindo os mesmos princípios:

- `src/App`: Controladores, rotas e lógica principal da aplicação.
- `src/Lib`: Funções utilitárias (`Utils`), bibliotecas internas e helpers.
- `src/Resources`: Arquivos de configuração estáticos, textos ou recursos.

---

## 4. Documentação com Swagger

O Swagger é utilizado para documentar automaticamente todas as rotas e tipos expostos pela API.

* **URL Padrão**: A interface do Swagger fica disponível por padrão na rota `/swagger`.
* **Configuração de Metadados**: Toda nova rota exposta deve ser devidamente registrada na instância principal, mantendo as especificações OpenAPI e descrições atualizadas.
* **Organização e Categorização**:
  - Toda nova rota ou sub-Elysia deve definir tags para organizar os endpoints na interface gráfica.
  - Para definir tags em nível de arquivo/módulo, passe `{ detail: { tags: ["NomeDaTag"] } }` no construtor do `Elysia`.
  - Adicione `summary` e `description` em nível de rota para prover explicações de uso detalhadas.
* **Documentação de Responses & Centralização**:
  - Para documentar e validar respostas/parâmetros da API, utilize o parâmetro de configuração da rota.
  - **Prática Recomendada**: Evite declarar configurações do Swagger inline para não poluir o código da rota. Centralize as configurações em um objeto específico do Swagger (como `let swaggerDetails = { ... }`) e passe-o como terceiro argumento da rota.
  - Importe `t` do `elysia` para declarar as estruturas.
  - Exemplo:
    ```typescript
    // Consts
    let swaggerDetails = {
      response: {
        200: t.Object({
          campo: t.String()
        })
      },
      detail: {
        summary: "Descrição curta",
        description: "Descrição detalhada"
      }
    }

    // Main
    let routes = new Elysia()
      .get("/url", function() { ... }, swaggerDetails)
    ```




