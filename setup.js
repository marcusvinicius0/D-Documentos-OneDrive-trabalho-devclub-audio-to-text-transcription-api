import inquirer from 'inquirer';
import fs from 'node:fs';
import dotenv from 'dotenv';

dotenv.config();

const mainQuestion = [
  {
    type: 'list',
    name: 'AI_SELECTED',
    message: 'Escolha a IA que deseja usar:',
    choices: ['GEMINI'],
  },
];

const geminiQuestion = [
  {
    type: 'input',
    name: 'GEMINI_KEY',
    message:
      'Informe a sua GEMINI_KEY (https://aistudio.google.com/app/apikey):',
    validate: (input) =>
      !!input ||
      'A GEMINI_KEY não pode ser vazia. Por favor, informe um valor válido.',
  },
  {
    type: 'input',
    name: 'GEMINI_PROMPT',
    message: 'Informe o prompt para o Gemini:',
    validate: (input) =>
    !!input ||
    'A GEMINI_PROMPT não pode ser vazia. Por favor, informe um valor válido.',
  },
];

inquirer.prompt(mainQuestion).then((answers) => {
  let envConfig = `AI_SELECTED=${answers.AI_SELECTED}\n`;

  if (answers.AI_SELECTED === 'GEMINI') {
    inquirer.prompt(geminiQuestion).then((geminiAnswer) => {
      envConfig += `GEMINI_KEY=${geminiAnswer.GEMINI_KEY}\nGEMINI_PROMPT=${geminiAnswer.GEMINI_PROMPT}\n`;
      fs.writeFileSync('.env', envConfig, { encoding: 'utf8' });
      console.log('Configuração para GEMINI salva com sucesso! 🎉');
    });
  }
});
