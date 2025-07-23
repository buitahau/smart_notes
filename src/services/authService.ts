// Mock user data
const MOCK_USER = {
  id: 'user-123',
  email: 'user@example.com',
  name: 'Demo User',
};

export type User = typeof MOCK_USER;

// Simulate API call delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const login = async (email: string, password: string): Promise<User> => {
  await delay(500); // Simulate network delay
  
  // In a real app, this would be an actual API call
  if (email === 'demo@example.com' && password === 'password') {
    // Store user in chrome.storage
    await chrome.storage.local.set({ user: MOCK_USER });
    return MOCK_USER;
  }
  
  throw new Error('Invalid email or password');
};

export const logout = async (): Promise<void> => {
  await delay(300); // Simulate network delay
  await chrome.storage.local.remove('user');
};

export const getCurrentUser = async (): Promise<User | null> => {
  await delay(200); // Simulate network delay
  const result = await chrome.storage.local.get('user');
  return result.user || null;
};
