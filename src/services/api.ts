import { SoTietKiem } from '@/types/SoTietKiem';

export const loginAPI = async (email: string, password: string) => {
  const response = await fetch('http://localhost:8080/api/auth/signin', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
  });

  const contentType = response.headers.get('Content-Type');
  let data;
  if (contentType && contentType.includes('application/json')) {
      data = await response.json();
  } else {
      data = { message: await response.text() };
  }

  if (!response.ok) {
      console.error('Login API error response:', data);
      throw new Error(data.message || 'Đăng nhập thất bại!');
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

  const contentType = response.headers.get('Content-Type');
  let data;
  if (contentType && contentType.includes('application/json')) {
      data = await response.json();
  } else {
      data = { message: await response.text() };
  }

  if (!response.ok) {
      console.error('Register API error response:', data);
      throw new Error(data.message || 'Đăng ký thất bại!');
  }

  return data;
};

export const sendPasscodeAPI = async (email: string) => {
  const response = await fetch('http://localhost:8080/api/auth/forgot-password', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
  });

  const contentType = response.headers.get('Content-Type');
  let data;
  if (contentType && contentType.includes('application/json')) {
      data = await response.json();
  } else {
      data = { message: await response.text() };
  }

  if (!response.ok) {
      console.error('Send passcode API error response:', data);
      throw new Error(data.message || 'Gửi passcode thất bại!');
  }

  return data;
};

export const verifyPasscodeAPI = async (email: string, passcode: string) => {
  const response = await fetch('http://localhost:8080/api/auth/verify-passcode', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, passcode }),
  });

  const contentType = response.headers.get('Content-Type');
  let data;
  if (contentType && contentType.includes('application/json')) {
      data = await response.json();
  } else {
      data = { message: await response.text() };
  }

  if (!response.ok) {
      console.error('Verify passcode API error response:', data);
      throw new Error(data.message || 'Xác minh passcode thất bại!');
  }

  return data;
};

export const resetPasswordAPI = async (email: string, newPassword: string, confirmPassword: string) => {
  const response = await fetch('http://localhost:8080/api/auth/reset-password', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, newPassword, confirmPassword }),
  });

  const contentType = response.headers.get('Content-Type');
  let data;
  if (contentType && contentType.includes('application/json')) {
      data = await response.json();
  } else {
      data = { message: await response.text() };
  }

  if (!response.ok) {
      console.error('Reset password API error response:', data);
      throw new Error(data.message || 'Đặt lại mật khẩu thất bại!');
  }

  return data;
};

const API_URL = 'http://localhost:8080/api/admin/sotietkiem';
const BASIC_AUTH = 'Basic aGF0aHVAZ21haWwuY29tOmhhdGh1QDEyMw==';

// Lấy danh sách sổ tiết kiệm
export const getSavingsAccounts = async () => {
  const response = await fetch(API_URL, {
      method: 'GET',
      headers: {
          Authorization: BASIC_AUTH,
          'Content-Type': 'application/json',
      },
  });

  const contentType = response.headers.get('Content-Type');
  let data;
  if (contentType && contentType.includes('application/json')) {
      data = await response.json();
  } else {
      data = { message: await response.text() };
  }

  if (!response.ok) {
      console.error('Get savings accounts API error response:', data);
      throw new Error(data.message || 'Lấy danh sách sổ tiết kiệm thất bại!');
  }

  return Array.isArray(data) ? data : [];
};

// Tạo sổ tiết kiệm mới
export const createSavingsAccount = async (data: Partial<SoTietKiem>) => {
  const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
          Authorization: BASIC_AUTH,
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
  });

  const contentType = response.headers.get('Content-Type');
  let dataResponse;
  if (contentType && contentType.includes('application/json')) {
      dataResponse = await response.json();
  } else {
      dataResponse = { message: await response.text() };
  }

  if (!response.ok) {
      console.error('Create savings account API error response:', dataResponse);
      throw new Error(dataResponse.message || 'Tạo sổ tiết kiệm thất bại!');
  }

  return dataResponse;
};

// Cập nhật sổ tiết kiệm
export const updateSavingsAccount = async (maSTK: number, data: Partial<SoTietKiem>) => {
  const response = await fetch(`${API_URL}/${maSTK}`, {
      method: 'PUT',
      headers: {
          Authorization: BASIC_AUTH,
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
  });

  const contentType = response.headers.get('Content-Type');
  let dataResponse;
  if (contentType && contentType.includes('application/json')) {
      dataResponse = await response.json();
  } else {
      dataResponse = { message: await response.text() };
  }

  if (!response.ok) {
      console.error('Update savings account API error response:', dataResponse);
      throw new Error(dataResponse.message || 'Cập nhật sổ tiết kiệm thất bại!');
  }

  return dataResponse;
};

// Xóa sổ tiết kiệm
export const deleteSavingsAccount = async (maSTK: number) => {
  const response = await fetch(`${API_URL}/${maSTK}`, {
      method: 'DELETE',
      headers: {
          Authorization: BASIC_AUTH,
          'Content-Type': 'application/json',
      },
  });

  const contentType = response.headers.get('Content-Type');
  let dataResponse;
  if (contentType && contentType.includes('application/json')) {
      dataResponse = await response.json();
  } else {
      dataResponse = { message: await response.text() };
  }

  if (!response.ok) {
      console.error('Delete savings account API error response:', dataResponse);
      throw new Error(dataResponse.message || 'Xóa sổ tiết kiệm thất bại!');
  }

  return dataResponse;
};