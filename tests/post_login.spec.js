// @ts-check
const { test, expect } = require('@playwright/test');

// Gunakan 'test.describe' untuk mengelompokkan tes
test.describe('API Testing - Reqres.in', () => {

  // Definisikan variabel untuk base URL dan API key
  const baseUrl = 'https://reqres.in/';
  const apiKey = 'reqres-free-v1';

  test('should successfully log in with valid credentials via POST request', async ({ request }) => {
    // Data payload untuk request POST Login
    const loginPayload = {
      email: 'eve.holt@reqres.in',
      password: 'cityslicka'
    };

    // Lakukan request POST ke endpoint login
    const response = await request.post(`${baseUrl}api/login`, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey
      },
      data: loginPayload
    });

    // Assertions untuk memverifikasi response
    // Memastikan status response adalah 200 (OK)
    expect(response.status()).toBe(200);

    // Dapatkan body respons sebagai JSON
    const body = await response.json();

    // Memastikan body respons memiliki properti 'token'
    expect(body).toHaveProperty('token');

    // Verifikasi bahwa nilai token adalah string dan tidak kosong
    expect(body.token).toBeDefined();
    expect(typeof body.token).toBe('string');
    expect(body.token.length).toBeGreaterThan(0);
  });

  // Contoh test case negatif (jika diperlukan)
  test('should fail login with invalid password', async ({ request }) => {
    const loginPayload = {
      email: 'eve.holt@reqres.in',
      password: 'wrong_password' // Password salah
    };

    const response = await request.post(`${baseUrl}api/login`, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey
      },
      data: loginPayload
    });

    // Memastikan status response adalah 400 (Bad Request)
    expect(response.status()).toBe(400);

    const body = await response.json();
    // Memastikan body response memiliki properti 'error' dengan pesan yang sesuai
    expect(body).toHaveProperty('error', 'user not found');
  });
});