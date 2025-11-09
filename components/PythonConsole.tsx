import React, { useState, useEffect } from 'react';
import { explainCode } from '../services/geminiService';

interface PythonConsoleProps {
  initialCode: string;
}

const PythonConsole: React.FC<PythonConsoleProps> = ({ initialCode }) => {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState<string>('');
  const [explanation, setExplanation] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExplaining, setIsExplaining] = useState(false);
  const [hasUserEdited, setHasUserEdited] = useState(false);

  const handleRunCode = () => {
    setIsLoading(true);
    // Simulación de ejecución de Python
    setTimeout(() => {
      try {
        let newOutput = '';
        const variables: { [key: string]: any } = {};
        
        // Primero, ejecutar todas las asignaciones de variables
        const lines = code.split('\n');
        
        for (const line of lines) {
          const trimmedLine = line.trim();
          
          // Ignorar comentarios y líneas vacías
          if (trimmedLine.startsWith('#') || trimmedLine === '') {
            continue;
          }
          
          // Detectar asignación de variables
          const varMatch = trimmedLine.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*(.+)$/);
          if (varMatch) {
            const varName = varMatch[1];
            const varValue = varMatch[2].trim();
            
            // Evaluar el valor (números, strings, operaciones simples)
            try {
              if (varValue.match(/^['"`].*['"`]$/)) {
                // Es un string
                variables[varName] = varValue.slice(1, -1);
              } else if (varValue.match(/^\d+$/)) {
                // Es un número entero
                variables[varName] = parseInt(varValue);
              } else if (varValue.match(/^\d+\.\d+$/)) {
                // Es un número decimal
                variables[varName] = parseFloat(varValue);
              } else if (varValue.match(/^[\d+\-*/\s()]+$/)) {
                // Es una expresión matemática
                variables[varName] = eval(varValue);
              } else if (variables[varValue]) {
                // Es otra variable
                variables[varName] = variables[varValue];
              } else {
                variables[varName] = varValue;
              }
            } catch (e) {
              variables[varName] = varValue;
            }
          }
          
          // Detectar declaraciones print
          const printMatch = trimmedLine.match(/print\s*\(\s*(.+?)\s*\)$/);
          if (printMatch) {
            const printArg = printMatch[1].trim();
            
            // String literal
            if (printArg.match(/^['"`].*['"`]$/)) {
              newOutput += printArg.slice(1, -1) + '\n';
            }
            // Variable
            else if (variables.hasOwnProperty(printArg)) {
              newOutput += variables[printArg] + '\n';
            }
            // Expresión matemática
            else if (printArg.match(/^[\d+\-*/\s()]+$/)) {
              try {
                const result = eval(printArg);
                newOutput += result + '\n';
              } catch (e) {
                newOutput += `Error evaluando: ${printArg}\n`;
              }
            }
            // F-string o concatenación simple
            else if (printArg.includes('+')) {
              let result = printArg;
              // Reemplazar variables conocidas
              for (const [varName, varValue] of Object.entries(variables)) {
                result = result.replace(new RegExp(`\\b${varName}\\b`, 'g'), String(varValue));
              }
              try {
                result = eval(result);
                newOutput += result + '\n';
              } catch (e) {
                newOutput += `Error: No se pudo evaluar la expresión\n`;
              }
            }
            // Variable desconocida
            else {
              newOutput += `Error: variable '${printArg}' no definida\n`;
            }
          }
        }
        
        // Verificar si hay definiciones sin output
        const hasDefinitions = Object.keys(variables).length > 0 || code.includes('def ');
        
        if (newOutput) {
          setOutput(newOutput.trim());
        } else if (hasDefinitions) {
          setOutput('✓ Código ejecutado correctamente (sin salida visible).\nTip: Usa print() para ver resultados.');
        } else {
          setOutput('⚠️ No se detectó ninguna salida.\nAsegúrate de usar print() para mostrar resultados.');
        }
      } catch (error) {
        setOutput('❌ Error durante la ejecución del código.');
        console.error(error);
      }
      setIsLoading(false);
    }, 500);
  };

  const handleExplainCode = async () => {
    setIsExplaining(true);
    setExplanation('');
    const result = await explainCode(code);
    setExplanation(result);
    setIsExplaining(false);
  };

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    setHasUserEdited(true);
  };

  const handleResetCode = () => {
    setCode(initialCode);
    setOutput('');
    setExplanation('');
    setHasUserEdited(false);
  };

  // Solo actualizar cuando cambia initialCode Y el usuario no ha editado
  useEffect(() => {
    if (!hasUserEdited) {
      setCode(initialCode);
      setOutput('');
      setExplanation('');
    }
  }, [initialCode, hasUserEdited]);

  return (
    <div className="h-full flex flex-col bg-gray-800 dark:bg-gray-900 text-gray-900 dark:text-white p-4 transition-colors duration-300">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold">🐍 Consola Python</h3>
        {hasUserEdited && (
          <button
            onClick={handleResetCode}
            className="px-3 py-1 text-sm bg-gray-600 hover:bg-gray-700 rounded-md transition-colors text-white"
            title="Restaurar código inicial"
          >
            🔄 Reiniciar
          </button>
        )}
      </div>
      <div className="flex-1 mb-2">
        <textarea
          value={code}
          onChange={(e) => handleCodeChange(e.target.value)}
          className="w-full h-full p-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-md resize-none font-mono text-sm outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300 dark:border-gray-700 transition-colors duration-300"
          spellCheck="false"
          placeholder="Escribe tu código Python aquí..."
        />
      </div>
      <div className="flex space-x-2 mb-2">
        <button
          onClick={handleRunCode}
          disabled={isLoading}
          className="px-4 py-2 bg-green-600 rounded-md hover:bg-green-700 disabled:bg-gray-500 transition-colors font-semibold text-white"
        >
          {isLoading ? '⏳ Ejecutando...' : '▶️ Ejecutar Código'}
        </button>
        <button
          onClick={handleExplainCode}
          disabled={isExplaining}
          className="px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-500 transition-colors font-semibold text-white"
        >
          {isExplaining ? '🤔 Explicando...' : '💡 Explicar Código'}
        </button>
      </div>
      <div className="flex-1 flex flex-col space-y-2 overflow-hidden">
        <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md flex-1 overflow-y-auto border border-gray-300 dark:border-gray-700 transition-colors duration-300">
          <h4 className="text-sm font-semibold mb-2 text-green-600 dark:text-green-400">📤 Salida:</h4>
          <pre className="text-sm whitespace-pre-wrap text-gray-800 dark:text-gray-300">{output || 'Ejecuta el código para ver la salida...'}</pre>
        </div>
        <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md flex-1 overflow-y-auto border border-gray-300 dark:border-gray-700 transition-colors duration-300">
          <h4 className="text-sm font-semibold mb-2 text-blue-600 dark:text-blue-400">💬 Explicación:</h4>
          {isExplaining && <p className="text-sm text-gray-600 dark:text-gray-400">🤖 Generando explicación con IA...</p>}
          <p className="text-sm whitespace-pre-wrap text-gray-800 dark:text-gray-300">{explanation || 'Haz clic en "Explicar Código" para que la IA te ayude...'}</p>
        </div>
      </div>
    </div>
  );
};

export default PythonConsole;
