import { readFileSync } from 'fs';
import { extractDocument } from './lib/ai/extract-document';
import { DocumentType } from './lib/ai/extract-document';
import { config } from 'dotenv';

config({ path: '.env.local' });

async function main() {
  console.log('Testing extraction with Claude...');
  
  // Find a sample PDF. The prompt says they are in:
  // D:\Projects\LoanLens\demo-data\sample_bank_statement.pdf
  const pdfPath = 'D:\\Projects\\LoanLens\\demo-data\\sample_bank_statement.pdf';
  
  try {
    const fileBuffer = readFileSync(pdfPath);
    const base64 = fileBuffer.toString('base64');
    
    console.log(`Loaded PDF: ${pdfPath}`);
    console.log(`Sending to Claude API (Model: claude-3-7-sonnet-20250219)...`);
    
    const startTime = Date.now();
    const result = await extractDocument(base64, 'bank_statement');
    const endTime = Date.now();
    
    console.log(`\n✅ Extraction Successful! (${((endTime - startTime) / 1000).toFixed(1)}s)`);
    console.log('Tokens used:', `Input: ${result.tokens_input}`, `Output: ${result.tokens_output}`);
    console.log('Cost:', `$${result.cost_usd.toFixed(4)}`);
    console.log('Confidence:', result.confidence);
    console.log('\nStructured Data Output:\n');
    console.log(JSON.stringify(result.structured_data, null, 2));
    
  } catch (err) {
    console.error('Extraction test failed:', err);
  }
}

main();
