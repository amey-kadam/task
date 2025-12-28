
const http = require('http');

function testRequest(path, method, headers, body) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: path,
            method: method,
            headers: headers || {}
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                resolve({ statusCode: res.statusCode, data: data });
            });
        });

        req.on('error', (e) => reject(e));
        if (body) req.write(body);
        req.end();
    });
}

async function runTests() {
    console.log('--- Starting Auth Verification ---');

    // Test 1: GET /api/cart without token
    try {
        const res1 = await testRequest('/api/cart', 'GET');
        console.log(`Test 1 (No Token): Status ${res1.statusCode} (Expected 401)`);
        if (res1.statusCode !== 401) console.error('FAIL: Test 1');
    } catch (e) { console.error('Test 1 Error:', e.message); }

    // Test 2: GET /api/cart with invalid token
    try {
        const res2 = await testRequest('/api/cart', 'GET', { 'Authorization': 'Bearer invalid' });
        console.log(`Test 2 (Invalid Token): Status ${res2.statusCode} (Expected 401)`);
        if (res2.statusCode !== 401) console.error('FAIL: Test 2');
    } catch (e) { console.error('Test 2 Error:', e.message); }

    // Test 3: POST /api/cart/remove without token
    try {
        const res3 = await testRequest('/api/cart/remove', 'POST', { 'Content-Type': 'application/json' }, JSON.stringify({ item_id: 1 }));
        console.log(`Test 3 (POST No Token): Status ${res3.statusCode} (Expected 401)`);
        if (res3.statusCode !== 401) console.error('FAIL: Test 3');
    } catch (e) { console.error('Test 3 Error:', e.message); }

    console.log('--- Verification Complete ---');
}

runTests();
