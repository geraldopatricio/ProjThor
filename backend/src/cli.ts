import fs from 'fs';
import path from 'path';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

// Função para carregar JSON da hierarquia
const loadHierarchy = (filePath: string): any => {
    const rawData = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(rawData);
};

// Função para buscar categorias no JSON baseado em profundidade e texto
const analyzePhrase = (json: any, phrase: string, depth: number): { [key: string]: string } => {
    const categories: { [key: string]: number } = {};
    const messages: { [key: string]: string } = {}; // Para armazenar as mensagens dinâmicas

    const searchInHierarchy = (obj: any, currentDepth: number, parent: string | null) => {
        if (currentDepth > depth) return;

        for (const key in obj) {
            const currentKey = key.toLowerCase();
            // Verifica se a frase contém o nome da categoria
            if (phrase.toLowerCase().includes(currentKey)) {
                // Atualiza a contagem para a categoria pai
                if (parent) {
                    categories[parent] = (categories[parent] || 0) + 1; // Adiciona o pai
                    messages[parent] = `${parent} = ${categories[parent]} (${categories[parent] === 1 ? 'Um' : categories[parent]} ${parent.toLowerCase()} encontrado${categories[parent] === 1 ? '' : 's'})`;
                }

                // Atualiza a contagem para a subcategoria
                categories[key] = (categories[key] || 0) + 1;
                messages[key] = `${key} = ${categories[key]} (${categories[key] === 1 ? 'Um' : categories[key]} ${key.toLowerCase()} encontrado${categories[key] === 1 ? '' : 's'})`;
            }
            // Chama recursivamente para subcategorias
            searchInHierarchy(obj[key], currentDepth + 1, key); // Passa a categoria atual como pai
        }
    };

    searchInHierarchy(json, 1, null);
    return messages; // Retorna as mensagens dinâmicas
};


// Configuração de argumentos da linha de comando
const argv = yargs(hideBin(process.argv))
    .command('analyze', 'Analyze a phrase with the hierarchy JSON', {
        depth: {
            type: 'number',
            description: 'Depth of hierarchy to analyze',
            demandOption: true,
        },
        phrase: {
            type: 'string',
            description: 'Phrase to analyze',
            demandOption: true,
        },
        verbose: {
            type: 'boolean',
            description: 'Enable verbose output',
            default: false,
        },
    })
    .help()
    .alias('help', 'h')
    .parseSync(); // Adiciona o parseSync aqui para evitar o problema do Promise

// Caminho para o arquivo JSON
const filePath = path.join(__dirname, '..', 'dicts', 'tree.json');

// Executando análise
const startParamsLoad = Date.now();
const hierarchyData = loadHierarchy(filePath);
const loadParamsTime = Date.now() - startParamsLoad;

const startAnalysis = Date.now();
const result = analyzePhrase(hierarchyData, argv.phrase as string, argv.depth as number);
const analysisTime = Date.now() - startAnalysis;

// Exibindo resultados
if (Object.keys(result).length === 0) {
    console.log(`0`);
} else {
    for (const [category, count] of Object.entries(result)) {
        console.log(`${category} = ${count}`);
    }
}

if (argv.verbose) {
    console.log(`Tempo de carregamento dos parâmetros: ${loadParamsTime}ms`);
    console.log(`Tempo de verificação da frase: ${analysisTime}ms`);
}
