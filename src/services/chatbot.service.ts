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

  // Placeholder for actual API call - replace with your logic
  try {
    // Simulate API call for chat response
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Example: If no specific logic, echo or provide a canned response
    return `I've processed your query about "${title}". Based on the content, here's what I found... (This is a simulated response).`;
  } catch (error: any) {
    console.error('Error fetching chat response:', error);
    // Using only one argument for toast.error
    toast.error('Failed to get chat response. Please try again.'); 
    // Re-throw the error if you want to handle it further up the chain
    // or return a specific error message string
    throw new Error('Failed to get chat response: ' + (error.message || 'Unknown error'));
  }
};
