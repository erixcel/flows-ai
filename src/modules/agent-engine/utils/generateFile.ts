import { promises as fs } from 'fs';
import * as path from 'path';
export async function generateMermaid(
  pathFromRoot: string,
  content: string
): Promise<void> {
  try {

    const projectRoot = process.cwd();
    let finalAbsolutePath = path.resolve(projectRoot, pathFromRoot);

    if (path.extname(finalAbsolutePath).toLowerCase() !== '.mmd') {
      finalAbsolutePath += '.mmd';
    }

    const dirName = path.dirname(finalAbsolutePath);
    await fs.mkdir(dirName, { recursive: true });
    await fs.writeFile(finalAbsolutePath, content, 'utf-8');

    console.log(`✅ Diagrama Mermaid generado exitosamente en: ${finalAbsolutePath}`);

  } catch (error) {
    console.error('❌ Error al generar el archivo Mermaid:', error);
  }
}