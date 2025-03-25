import * as cursor from 'cursor';
import { OpenAI } from 'openai';

let openai: OpenAI;

export function activate(context: cursor.ExtensionContext) {
    const config = cursor.workspace.getConfiguration('mcpSequential');
    
    if (config.get('enabled')) {
        initializeOpenAI();
    }

    let enableCommand = cursor.commands.registerCommand('cursor-mcp.enable', () => {
        config.update('enabled', true, true);
        initializeOpenAI();
        cursor.window.showInformationMessage('MCP Sequential Thinking ativado');
    });

    let disableCommand = cursor.commands.registerCommand('cursor-mcp.disable', () => {
        config.update('enabled', false, true);
        cursor.window.showInformationMessage('MCP Sequential Thinking desativado');
    });

    context.subscriptions.push(enableCommand, disableCommand);

    // Registra o provedor de completions
    const provider = cursor.languages.registerCompletionItemProvider(
        { scheme: 'file' },
        {
            async provideCompletionItems(document: cursor.TextDocument, position: cursor.Position) {
                if (!config.get('enabled')) {
                    return [];
                }

                const linePrefix = document.lineAt(position).text.substr(0, position.character);
                if (!linePrefix.endsWith('mcp.')) {
                    return [];
                }

                const text = document.getText();
                const steps = config.get('steps') as number;
                const model = config.get('model') as string;

                try {
                    const thoughts = await generateSequentialThoughts(text, steps, model);
                    return thoughts.map(thought => {
                        const item = new cursor.CompletionItem(thought, cursor.CompletionItemKind.Text);
                        item.detail = 'MCP Sequential Thinking';
                        return item;
                    });
                } catch (error) {
                    cursor.window.showErrorMessage('Erro ao gerar pensamentos sequenciais');
                    return [];
                }
            }
        }
    );

    context.subscriptions.push(provider);
}

function initializeOpenAI() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        cursor.window.showErrorMessage('OPENAI_API_KEY não encontrada no ambiente');
        return;
    }
    openai = new OpenAI({ apiKey });
}

async function generateSequentialThoughts(
    context: string,
    steps: number,
    model: string
): Promise<string[]> {
    const thoughts: string[] = [];
    let currentContext = context;

    for (let i = 0; i < steps; i++) {
        const response = await openai.chat.completions.create({
            model,
            messages: [
                {
                    role: "system",
                    content: "Você é um assistente especializado em pensamento sequencial. " +
                            "Analise o contexto atual e forneça o próximo passo lógico."
                },
                {
                    role: "user",
                    content: `Contexto atual: ${currentContext}\n\n` +
                            `Passo ${i + 1} de ${steps}: Qual é o próximo passo lógico?`
                }
            ],
            temperature: 0.7,
            max_tokens: 500
        });

        const thought = response.choices[0].message.content;
        thoughts.push(thought);
        currentContext = `${currentContext}\n\nPasso ${i + 1}: ${thought}`;
    }

    return thoughts;
}

export function deactivate() {}