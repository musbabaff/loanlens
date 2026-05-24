import { anthropic, CLAUDE_MODEL, calculateCost } from './anthropic';
import { 
  BankStatementSchema, TaxReturnSchema, BusinessPlanSchema, 
  IdDocumentSchema, GenericDocumentSchema 
} from './extractors/schemas';
import { 
  BANK_STATEMENT_SYSTEM, TAX_RETURN_SYSTEM, BUSINESS_PLAN_SYSTEM,
  ID_DOCUMENT_SYSTEM, GENERIC_SYSTEM 
} from './extractors/prompts';

const SCHEMAS_BY_TYPE = {
  bank_statement: BankStatementSchema,
  tax_return: TaxReturnSchema,
  business_plan: BusinessPlanSchema,
  id_document: IdDocumentSchema,
  other: GenericDocumentSchema,
};

const PROMPTS_BY_TYPE = {
  bank_statement: BANK_STATEMENT_SYSTEM,
  tax_return: TAX_RETURN_SYSTEM,
  business_plan: BUSINESS_PLAN_SYSTEM,
  id_document: ID_DOCUMENT_SYSTEM,
  other: GENERIC_SYSTEM,
};

export type DocumentType = keyof typeof SCHEMAS_BY_TYPE;

export interface ExtractionResult {
  structured_data: unknown;
  confidence: number;
  tokens_input: number;
  tokens_output: number;
  cost_usd: number;
  raw_response: string;
}

export async function extractDocument(
  pdfBase64: string,
  documentType: DocumentType
): Promise<ExtractionResult> {
  const systemPrompt = PROMPTS_BY_TYPE[documentType];
  const schema = SCHEMAS_BY_TYPE[documentType];

  // First attempt
  let response = await anthropic.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 8000,
    system: systemPrompt,
    messages: [{
      role: 'user',
      content: [
        {
          type: 'document',
          source: {
            type: 'base64',
            media_type: 'application/pdf',
            data: pdfBase64,
          },
        },
        {
          type: 'text',
          text: 'Extract all data per your instructions. Return ONLY valid JSON matching the schema. No prose, no markdown, no code blocks.',
        },
      ],
    }],
  });

  let text = response.content[0].type === 'text' ? response.content[0].text : '';
  let cleaned = text.replace(/```json|```/g, '').trim();
  
  let parsed: unknown;
  try {
    const json = JSON.parse(cleaned);
    parsed = schema.parse(json);
  } catch (firstError) {
    // Retry with corrective prompt
    console.warn('First parse failed, retrying with corrective prompt');
    
    const retryResponse = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 8000,
      system: systemPrompt + '\n\nIMPORTANT: Your previous response was not valid JSON. Output ONLY a valid JSON object. No markdown, no code fences, no prose.',
      messages: [{
        role: 'user',
        content: [
          {
            type: 'document',
            source: {
              type: 'base64',
              media_type: 'application/pdf',
              data: pdfBase64,
            },
          },
          {
            type: 'text',
            text: 'Extract data and return ONLY valid JSON.',
          },
        ],
      }],
    });
    
    text = retryResponse.content[0].type === 'text' ? retryResponse.content[0].text : '';
    cleaned = text.replace(/```json|```/g, '').trim();
    
    try {
      const json = JSON.parse(cleaned);
      parsed = schema.parse(json);
      response = retryResponse;
    } catch (secondError) {
      throw new Error(`Failed to parse extraction after retry: ${secondError instanceof Error ? secondError.message : 'unknown error'}`);
    }
  }

  const confidence = (parsed as { confidence?: number }).confidence ?? 0.5;
  const tokensInput = response.usage.input_tokens;
  const tokensOutput = response.usage.output_tokens;

  return {
    structured_data: parsed,
    confidence,
    tokens_input: tokensInput,
    tokens_output: tokensOutput,
    cost_usd: calculateCost(tokensInput, tokensOutput),
    raw_response: text,
  };
}
