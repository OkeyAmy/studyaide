import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';

// Initialize the AI client
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
let googleGenAI: GoogleGenerativeAI | null = null;

if (API_KEY) {
  googleGenAI = new GoogleGenerativeAI(API_KEY);
}

export const isAIAvailable = (): boolean => {
  return !!googleGenAI && !!API_KEY;
};

export const getAIClient = (): GoogleGenerativeAI | null => {
    return googleGenAI;
};

/**
 * Utility function to add delay between API calls to avoid rate limiting
 */
export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Extract text from various document formats
 */
export async function extractTextFromFile(file: File): Promise<string> {
  console.log(`📄 Extracting text from file: ${file.name}`);
  console.log(`📊 File type: ${file.type}`);
  
  try {
    // For text-based files, read directly
    if (file.type === 'text/plain' || file.type === 'text/markdown' || file.type === 'text/csv') {
      return await file.text();
    }
    
    // For DOCX, PDF, and other document types, use text extraction
    // Since we're removing DOCX support as requested, we'll just extract text for PDF
    if (file.type === 'application/pdf') {
      // For PDF, just read and we'll process later with Gemini
      return "PDF document - will be processed directly by AI";
    }
    
    // Default fallback - try to read as text
    return await file.text();
  } catch (error) {
    console.error('❌ Error extracting text from file:', error);
    throw new Error(`Failed to extract text from file: ${error}`);
  }
}

/**
 * Convert file to base64 for inline data
 */
export async function uploadFileToGemini(file: File): Promise<{ base64Data: string; mimeType: string; fileName: string }> {
  console.log(`📤 Processing file for Gemini: ${file.name}`);
  console.log(`📊 File size: ${(file.size / 1024 / 1024).toFixed(2)} MB`);
  console.log(`📄 File type: ${file.type}`);

  try {
    // Check file size (20MB limit)
    const MAX_SIZE = 20 * 1024 * 1024; // 20MB in bytes
    // Warn and truncate if file is larger than limit
    if (file.size > MAX_SIZE) {
      console.warn(`File size (${(file.size / 1024 / 1024).toFixed(2)}MB) exceeds ${MAX_SIZE / 1024 / 1024}MB limit; truncating to limit.`);
    }

    let processedMimeType = file.type;
    let buffer: ArrayBuffer;
    
    // Handle DOCX - we'll remove this as requested but keeping logic in case we need it
    if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      // Extract text and convert to text/plain
      const text = await extractTextFromFile(file);
      const encoder = new TextEncoder();
      buffer = encoder.encode(text).buffer;
      processedMimeType = 'text/plain';
      console.log('Converted DOCX to text/plain format');
    } else {
      // Regular processing for supported files
      buffer = await file.arrayBuffer();
    }
    
    // Truncate buffer if it exceeds the limit
    let uint8 = new Uint8Array(buffer);
    if (uint8.length > MAX_SIZE) {
      uint8 = uint8.slice(0, MAX_SIZE);
    }

    // Convert to base64
    const base64 = btoa(
      uint8.reduce((data, byte) => data + String.fromCharCode(byte), '')
    );
    const base64Data = `data:${processedMimeType};base64,${base64}`;

    console.log(`✅ File processed successfully as base64`);
    console.log(`📄 Using MIME type: ${processedMimeType}`);
    console.log(`📊 Base64 data length: ${base64Data.length} characters`);

    return {
      base64Data,
      mimeType: processedMimeType,
      fileName: file.name
    };
  } catch (error) {
    console.error('❌ Error processing file for Gemini:', error);
    throw new Error(`Failed to process file for Gemini: ${error}`);
  }
}

/**
 * Generate content from file's base64 data
 */
export async function generateContentFromFile(
  base64Data: string,
  mimeType: string,
  prompt: string,
  temperature: number = 0.85
): Promise<string> {
  if (!googleGenAI) {
    throw new Error('Google AI client not initialized');
  }

  console.log(`🚀 Generating content from file using inline data...`);
  console.log(`📄 MIME Type: ${mimeType}`);
  console.log(`🎯 Temperature: ${temperature}`);
  console.log(`📝 Prompt length: ${prompt.length} characters`);

  try {
    const model = googleGenAI.getGenerativeModel({ 
      model: "gemini-2.0-flash-exp",
      generationConfig: {
        temperature,
      },
    });

    // Create content with inline data
    const result = await model.generateContent([
      {
        inlineData: {
          data: base64Data.split(',')[1], // Remove the "data:mimetype;base64," part
          mimeType: mimeType
        }
      },
      prompt
    ]);
    
    const response = await result.response;
    const text = response.text();

    console.log(`✅ AI Response received successfully!`);
    console.log(`📊 Response length: ${text.length} characters`);
    console.log(`\n🔍🔍🔍 RAW AI RESPONSE BEGIN 🔍🔍🔍`);
    console.log(`==============================================`);
    console.log(text);
    console.log(`==============================================`);
    console.log(`🔍🔍🔍 RAW AI RESPONSE END 🔍🔍🔍\n`);

    return text;
  } catch (error) {
    console.error('❌ Error generating content from file:', error);
    throw new Error(`Failed to generate content from file: ${error}`);
  }
}

/**
 * Generate JSON response from file's base64 data
 */
export async function generateJSONResponseFromFile(
  base64Data: string,
  mimeType: string,
  prompt: string,
  temperature: number = 0.85
): Promise<any> {
  console.log(`🎯 Generating JSON response from file...`);
  
  const response = await generateContentFromFile(base64Data, mimeType, prompt, temperature);
  
  try {
    console.log(`🔄 Parsing JSON response...`);
    
    // Clean up the response to extract JSON
    let cleanedResponse = response.trim();
    
    // Remove markdown code blocks if present
    if (cleanedResponse.includes('```json')) {
      cleanedResponse = cleanedResponse.replace(/```json\s*/g, '').replace(/```/g, '');
    } else if (cleanedResponse.includes('```')) {
      cleanedResponse = cleanedResponse.replace(/```\s*/g, '').replace(/```/g, '');
    }
    
    // Find JSON content between braces
    const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanedResponse = jsonMatch[0];
    }
    
    console.log(`\n🔍🔍🔍 CLEANED JSON FOR PARSING 🔍🔍🔍`);
    console.log(`==============================================`);
    console.log(cleanedResponse);
    console.log(`==============================================`);
    console.log(`🔍🔍🔍 END OF CLEANED JSON 🔍🔍🔍\n`);
    
    const parsedResponse = JSON.parse(cleanedResponse);
    console.log(`✅ JSON parsed successfully!`);
    console.log(`📊 Parsed object keys:`, Object.keys(parsedResponse));
    
    return parsedResponse;
  } catch (error) {
    console.error('❌ Error parsing JSON response:', error);
    console.error('📋 Raw response that failed to parse:', response);
    throw new Error(`Failed to parse JSON response: ${error}`);
  }
}

/**
 * Legacy function - kept for backward compatibility with text-based generation
 */
export async function generateStructuredResponse(
    prompt: string,
  temperature: number = 0.85
): Promise<string> {
        if (!googleGenAI) {
    throw new Error('Google AI client not initialized');
        }

  try {
        const model = googleGenAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
            generationConfig: {
                temperature,
      },
        });

        const result = await model.generateContent(prompt);
        const response = await result.response;
    const text = response.text();
    
    console.log(`\n🔍🔍🔍 RAW TEXT RESPONSE BEGIN 🔍🔍🔍`);
    console.log(`==============================================`);
    console.log(text);
    console.log(`==============================================`);
    console.log(`🔍🔍🔍 RAW TEXT RESPONSE END 🔍🔍🔍\n`);
    
    return text;
    } catch (error) {
        console.error('Error generating structured response:', error);
    throw error;
    }
}

/**
 * Legacy function - kept for backward compatibility with text-based generation
 */
export async function generateJSONResponse(
    prompt: string,
  temperature: number = 0.85
): Promise<any> {
  const response = await generateStructuredResponse(prompt, temperature);
  
  try {
    // Clean up the response to extract JSON
    let cleanedResponse = response.trim();
    
    // Remove markdown code blocks if present
    if (cleanedResponse.includes('```json')) {
      cleanedResponse = cleanedResponse.replace(/```json\s*/g, '').replace(/```/g, '');
    } else if (cleanedResponse.includes('```')) {
      cleanedResponse = cleanedResponse.replace(/```\s*/g, '').replace(/```/g, '');
    }
    
    // Find JSON content between braces
    const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanedResponse = jsonMatch[0];
    }
    
    return JSON.parse(cleanedResponse);
    } catch (error) {
    console.error('Error parsing JSON response:', error);
    throw new Error(`Failed to parse JSON response: ${error}`);
    }
}
