# Extensão MCP Sequential Thinking para Cursor

Esta extensão adiciona suporte ao MCP Sequential Thinking diretamente no Cursor IDE.

## Instalação

1. Clone este repositório:
```bash
git clone https://github.com/waltagan/cursor-mcp-extension.git
```

2. Entre no diretório do projeto:
```bash
cd cursor-mcp-extension
```

3. Instale as dependências:
```bash
npm install
```

4. Compile a extensão:
```bash
npm run build
```

5. Copie a pasta compilada para o diretório de extensões do Cursor:
```bash
# No macOS
cp -r . ~/.cursor/extensions/cursor-mcp-extension
```

6. Reinicie o Cursor

## Configuração

1. Abra as configurações do Cursor (Cmd+,)
2. Procure por "MCP Sequential Thinking"
3. Configure as opções disponíveis:
   - Habilitar/Desabilitar MCP
   - Número de passos de pensamento
   - Modelo GPT a ser usado

## Uso

1. Em qualquer arquivo, digite `mcp.` para ativar as sugestões do MCP Sequential Thinking
2. Selecione uma das sugestões geradas
3. O MCP analisará o contexto e fornecerá pensamentos sequenciais

## Configurações Disponíveis

- `mcpSequential.enabled`: Habilitar/Desabilitar MCP Sequential Thinking
- `mcpSequential.steps`: Número de passos para o pensamento sequencial (padrão: 3)
- `mcpSequential.model`: Modelo GPT a ser usado (gpt-4 ou gpt-3.5-turbo)

## Requisitos

- Cursor IDE
- Node.js 14+
- Chave API do OpenAI (defina como variável de ambiente OPENAI_API_KEY)

## Licença

MIT