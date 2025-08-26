// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('API Testing - POST Create User', () => {

  // Definisikan base URL dan API key
  const baseUrl = 'https://reqres.in/';
  const apiKey = 'reqres-free-v1';

  // =========================================================================
  // Test Case Positif (Positive Test Case)
  // =========================================================================
  test('should successfully create a new user with valid data', async ({ request }) => {
    // Data payload untuk request POST Create User
    const userData = {
      name: 'John Doe',
      job: 'Developer'
    };

    // Lakukan request POST ke endpoint /api/users
    const response = await request.post(`${baseUrl}api/users`, {
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json'
        // Catatan: Header 'Authorization' di curl Anda menunjukkan token.
        // Di sini, kita asumsikan untuk API ini, token tidak wajib atau tes ini
        // akan dijalankan setelah tes login untuk mendapatkan token.
      },
      data: userData
    });

    // Verifikasi kode status respons adalah 201 (Created)
    expect(response.status()).toBe(201); 

    // Dapatkan body respons sebagai JSON
    const responseBody = await response.json();

    // Lakukan verifikasi pada body respons
    // Pastikan properti 'name' dan 'job' dikembalikan dengan nilai yang benar
    expect(responseBody).toHaveProperty('name', 'John Doe');
    expect(responseBody).toHaveProperty('job', 'Developer');
    // Pastikan properti 'id' ada dan tidak kosong
    expect(responseBody).toHaveProperty('id');
    expect(responseBody.id).not.toBeNull();
  });

  // =========================================================================
  // Test Case Negatif (Negative Test Case)
  // =========================================================================
  test('should fail to create a user with missing required fields', async ({ request }) => {
    // Data payload dengan field 'name' yang hilang
    const invalidUserData = {
      job: 'Designer'
    };

    // Lakukan request POST ke endpoint dengan data yang tidak valid
    const response = await request.post(`${baseUrl}api/users`, {
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json'
      },
      data: invalidUserData
    });

    // Verifikasi kode status respons adalah 400 (Bad Request)
    expect(response.status()).toBe(400);

    // Verifikasi body respons untuk pesan error
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('error', 'name is required');
  });
});