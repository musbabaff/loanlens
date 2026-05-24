import { PDFDocument } from 'pdf-lib';
import { extractDocument } from './lib/ai/extract-document';
import { config } from 'dotenv';
import { writeFileSync } from 'node:fs';

config({ path: '.env.local' });

async function createDummyBankStatement() {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 800]);
  
  page.drawText('BANK OF AZERBAIJAN - ACCOUNT STATEMENT', { x: 50, y: 750, size: 20 });
  page.drawText('Account Holder: Test User', { x: 50, y: 700, size: 12 });
  page.drawText('Account Number: ****1234', { x: 50, y: 680, size: 12 });
  page.drawText('Period: 2026-01-01 to 2026-01-31', { x: 50, y: 660, size: 12 });
  page.drawText('Opening Balance: 1000.00 AZN', { x: 50, y: 620, size: 12 });
  page.drawText('Closing Balance: 2500.00 AZN', { x: 50, y: 600, size: 12 });
  
  page.drawText('Transactions:', { x: 50, y: 560, size: 14 });
  page.drawText('2026-01-05   Salary Deposit        2000.00  (Credit)', { x: 50, y: 530, size: 10 });
  page.drawText('2026-01-10   Utility Bill           -100.00 (Debit)', { x: 50, y: 510, size: 10 });
  page.drawText('2026-01-15   ATM Withdrawal         -400.00 (Debit)', { x: 50, y: 490, size: 10 });
  
  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes).toString('base64');
}

async function main() {
  console.log('Generating dummy Bank Statement PDF...');
  const pdfBase64 = await createDummyBankStatement();
  
  console.log('Sending to Claude API...');
  const startTime = Date.now();
  
  try {
    const result = await extractDocument(pdfBase64, 'bank_statement');
    const endTime = Date.now();
    
    console.log(`\n✅ Extraction Successful! (${((endTime - startTime) / 1000).toFixed(1)}s)`);
    console.log('Tokens used:', `Input: ${result.tokens_input}`, `Output: ${result.tokens_output}`);
    console.log('Cost:', `$${result.cost_usd.toFixed(4)}`);
    console.log('Confidence:', result.confidence);
    console.log('\nStructured Data Output:\n');
    console.log(JSON.stringify(result.structured_data, null, 2));
    
    // Save output to file to prove it works
    writeFileSync('claude_extraction_result.json', JSON.stringify(result, null, 2));
    console.log('Saved result to claude_extraction_result.json');
  } catch (error) {
    console.error('Test failed:', error);
  }
}

main();
