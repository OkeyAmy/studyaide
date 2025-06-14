
import { toast } from 'sonner';

export const fetchChatResponse = async (
  materialId: string,
  messages: { role: 'user' | 'assistant'; content: string }[],
  title: string,
  parsedContent?: any
): Promise<string> => {
  console.log(`Fetching chat response for material ${materialId} with title "${title}"`);
  console.log('Messages:', messages);
  console.log('Parsed content available:', !!parsedContent);

  try {
    await new Promise(resolve => setTimeout(resolve, 1500));
    return `I've processed your query about "${title}". Based on the content, here's what I found... (This is a simulated response).`;
  } catch (error: any) {
    console.error('Error fetching chat response:', error);
    toast.error('Failed to get chat response. Please try again.'); 
    throw new Error('Failed to get chat response: ' + (error.message || 'Unknown error'));
  }
};

export const generateChatbotResponse = fetchChatResponse;

// Export chatbotService object for compatibility
export const chatbotService = {
  fetchChatResponse,
  generateChatbotResponse: fetchChatResponse
};
