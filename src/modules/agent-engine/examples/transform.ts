import * as fs from 'fs';
import * as path from 'path';

import { santos_cachorros } from './santos-cachorros';

interface ExportedObject {
  [key: string]: any;
}

function createJsonFiles() {
  const jsonDir = path.join(__dirname, 'json');
  if (!fs.existsSync(jsonDir)) {
    fs.mkdirSync(jsonDir);
  }

  const exports: { [filename: string]: ExportedObject } = {
    'santos-cachorros': santos_cachorros,
  };

  console.log('Procesando archivos TypeScript...');

  Object.entries(exports).forEach(([filename, exportedObject]) => {
    try {
      console.log(`\nProcesando: ${filename}.ts`);
      
      const jsonContent = JSON.stringify(exportedObject, null, 2);
      
      const jsonFilePath = path.join(jsonDir, `${filename}.json`);
      fs.writeFileSync(jsonFilePath, jsonContent, 'utf-8');
      
      console.log(`✓ Creado: ${jsonFilePath}`);
    } catch (error) {
      console.error(`Error al procesar ${filename}:`, error);
    }
  });

  console.log(`\n¡Proceso completado! Los archivos JSON se guardaron en: ${jsonDir}`);
}

if (require.main === module) {
  createJsonFiles();
}

export { createJsonFiles };