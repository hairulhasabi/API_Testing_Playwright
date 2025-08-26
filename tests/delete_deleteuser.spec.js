// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('API Testing - DELETE Delete User', () => {

  // Definisikan base URL dan API key
  const baseUrl = 'https://reqres.in/';
  const apiKey = 'reqres-free-v1';

  // =========================================================================
  // Test Case Positif (Positive Test Case)
  // =========================================================================
  test('should successfully delete an existing user', async ({ request }) => {
    // ID pengguna yang akan dihapus
    const userId = 2;

    // Lakukan request DELETE ke endpoint /api/users/{userId}
    const response = await request.delete(`${baseUrl}api/users/${userId}`, {
      headers: {
        'x-api-key': apiKey
      }
    });

    // Verifikasi kode status respons adalah 204 (No Content)
    // Kode 204 menandakan bahwa permintaan berhasil, tetapi tidak ada konten yang dikembalikan.
    expect(response.status()).toBe(204);

    // Verifikasi bahwa body respons kosong
    const responseBody = await response.text();
    expect(responseBody).toBe('');
  });

  // =========================================================================
  // Test Case Negatif (Negative Test Case)
  // =========================================================================
  test('should fail to delete a user that does not exist', async ({ request }) => {
    // ID pengguna yang tidak ada
    const nonExistentUserId = 999;

    // Lakukan request DELETE ke endpoint dengan ID yang tidak ada
    const response = await request.delete(`${baseUrl}api/users/${nonExistentUserId}`, {
      headers: {
        'x-api-key': apiKey
      }
    });

    // Verifikasi kode status respons adalah 404 (Not Found)
    expect(response.status()).toBe(404);

    // Verifikasi body respons untuk pesan error (jika ada)
    // Meskipun API reqres.in mengembalikan 404 tanpa body,
    // praktik yang baik adalah memeriksa pesan error jika ada.
    const responseBody = await response.text();
    expect(responseBody).toBe('{}'); // Di reqres.in, body-nya kosong
  });

  test('should fail with invalid user ID format', async ({ request }) => {
    // ID pengguna dengan format yang tidak valid
    const invalidUserId = 'abc';

    // Lakukan request DELETE dengan ID yang tidak valid
    const response = await request.delete(`${baseUrl}api/users/${invalidUserId}`, {
      headers: {
        'x-api-key': apiKey
      }
    });

    // Tergantung pada implementasi API, status bisa 400 (Bad Request) atau 404 (Not Found).
    // Kita akan asumsikan 404 karena endpoint tidak ditemukan.
    expect(response.status()).toBe(404);
  });
});