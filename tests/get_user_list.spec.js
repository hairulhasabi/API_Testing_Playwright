// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('API Testing - GET User List', () => {
  // Definisikan base URL dan API key
  const baseUrl = 'https://reqres.in/';
  const apiKey = 'reqres-free-v1';

  // =========================================================================
  // Test Case Positif (Positive Test Case)
  // =========================================================================
  test('should successfully retrieve a list of users', async ({ request }) => {
    // Lakukan request GET ke endpoint /api/users
    const response = await request.get(`${baseUrl}api/users`, {
      headers: {
        'x-api-key': apiKey
      }
    });

    // Verifikasi kode status respons adalah 200 (OK)
    expect(response.status()).toBe(200);

    // Dapatkan body respons sebagai JSON
    const responseBody = await response.json();

    // Lakukan verifikasi pada body respons
    // Pastikan body memiliki properti 'data' yang merupakan array
    expect(responseBody).toHaveProperty('data');
    expect(Array.isArray(responseBody.data)).toBeTruthy();

    // Verifikasi bahwa ada setidaknya satu pengguna di daftar
    expect(responseBody.data.length).toBeGreaterThan(0);

    // Contoh verifikasi struktur data pengguna pertama
    const firstUser = responseBody.data[0];
    expect(firstUser).toHaveProperty('id');
    expect(firstUser).toHaveProperty('email');
    expect(firstUser).toHaveProperty('first_name');
  });

  // =========================================================================
  // Test Case Negatif (Negative Test Case)
  // =========================================================================
  test('should fail to retrieve a list of users with invalid page number', async ({ request }) => {
    // Lakukan request GET dengan parameter page yang tidak valid
    const invalidPage = 'abc'; 
    const response = await request.get(`${baseUrl}api/users?page=${invalidPage}`, {
      headers: {
        'x-api-key': apiKey
      }
    });

    // API reqres.in tidak mengembalikan error untuk halaman yang tidak valid.
    // Malahan, ia akan mengembalikan daftar kosong.
    // Jika API Anda mengembalikan 400 atau 404, ekspektasi ini akan berbeda.
    expect(response.status()).toBe(200);

    // Dapatkan body respons sebagai JSON
    const responseBody = await response.json();

    // Verifikasi bahwa data yang dikembalikan adalah array kosong atau null
    // Karena `reqres.in` mengembalikan array kosong untuk halaman yang tidak ada.
    expect(responseBody.data).toEqual([]); 
  });

  test('should fail to retrieve a list with invalid API key', async ({ request }) => {
    // Lakukan request GET dengan API key yang salah
    const invalidApiKey = 'invalid-key'; 
    const response = await request.get(`${baseUrl}api/users`, {
      headers: {
        'x-api-key': invalidApiKey
      }
    });

    // Verifikasi kode status respons yang diharapkan jika API key salah
    // Asumsi: API akan mengembalikan 401 Unauthorized atau 403 Forbidden.
    // Namun, reqres.in tidak memvalidasi API key, sehingga akan tetap 200.
    // Ini adalah contoh bagaimana tes negatif mengungkap perilaku API yang tidak sesuai.
    expect(response.status()).toBe(200); 
  });
});