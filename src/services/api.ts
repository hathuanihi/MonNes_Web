export const loginAPI = async (email: string, password: string) => {
  const response = await fetch('http://localhost:8080/api/auth/signin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data || 'Sign in falied!');
  }

  return data;
};

export const registerUser = async (user: { email: string; phoneNumber: string; password: string }) => {
  const response = await fetch('http://localhost:8080/api/auth/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: user.email,
      phoneNumber: user.phoneNumber,
      password: user.password,
      confirmPassword: user.password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data || 'Sign up failed!');
  }

  return data;
};