#!/usr/bin/env node

/**
 * Health Check Script for News Scraper Frontend
 * This script checks the health of the API and deployment
 */

const https = require('https');
const http = require('http');

// Configuration
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://beackkayq.onrender.com';
const ENDPOINTS = [
    { path: '/', name: 'Main API' },
    { path: '/api/articles/', name: 'Articles API' },
    { path: '/api/keywords/', name: 'Keywords API' },
    { path: '/api/articles/1/', name: 'Individual Article API' }
];

// Colors for console output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function makeRequest(url) {
    return new Promise((resolve, reject) => {
        const client = url.startsWith('https') ? https : http;
        
        const req = client.get(url, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                resolve({
                    statusCode: res.statusCode,
                    headers: res.headers,
                    data: data
                });
            });
        });
        
        req.on('error', (error) => {
            reject(error);
        });
        
        req.setTimeout(10000, () => {
            req.destroy();
            reject(new Error('Request timeout'));
        });
    });
}

async function checkEndpoint(endpoint) {
    const url = `${API_URL}${endpoint.path}`;
    
    try {
        log(`🔍 Checking ${endpoint.name}...`, 'blue');
        
        const startTime = Date.now();
        const response = await makeRequest(url);
        const responseTime = Date.now() - startTime;
        
        if (response.statusCode >= 200 && response.statusCode < 300) {
            log(`✅ ${endpoint.name} is healthy (${response.statusCode}) - ${responseTime}ms`, 'green');
            
            // Try to parse JSON response
            try {
                const jsonData = JSON.parse(response.data);
                if (endpoint.path === '/api/articles/') {
                    const count = jsonData.count || jsonData.length || 0;
                    log(`   📊 Found ${count} articles`, 'cyan');
                } else if (endpoint.path === '/api/keywords/') {
                    const count = jsonData.length || 0;
                    log(`   🏷️  Found ${count} keywords`, 'cyan');
                }
            } catch (e) {
                log(`   ℹ️  Response is not JSON`, 'yellow');
            }
        } else {
            log(`⚠️  ${endpoint.name} returned status ${response.statusCode}`, 'yellow');
        }
        
        return { success: true, statusCode: response.statusCode, responseTime };
        
    } catch (error) {
        log(`❌ ${endpoint.name} failed: ${error.message}`, 'red');
        return { success: false, error: error.message };
    }
}

async function runHealthCheck() {
    log('🏥 Starting Health Check for News Scraper API', 'bright');
    log(`📍 API URL: ${API_URL}`, 'cyan');
    log('─'.repeat(60), 'blue');
    
    const results = [];
    let successCount = 0;
    let totalResponseTime = 0;
    
    for (const endpoint of ENDPOINTS) {
        const result = await checkEndpoint(endpoint);
        results.push(result);
        
        if (result.success) {
            successCount++;
            totalResponseTime += result.responseTime;
        }
        
        // Small delay between requests
        await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    log('─'.repeat(60), 'blue');
    
    // Summary
    const successRate = (successCount / ENDPOINTS.length) * 100;
    const avgResponseTime = successCount > 0 ? Math.round(totalResponseTime / successCount) : 0;
    
    log(`📊 Health Check Summary:`, 'bright');
    log(`   ✅ Success Rate: ${successRate.toFixed(1)}% (${successCount}/${ENDPOINTS.length})`, 'green');
    log(`   ⏱️  Average Response Time: ${avgResponseTime}ms`, 'cyan');
    
    if (successRate === 100) {
        log(`🎉 All endpoints are healthy!`, 'green');
    } else if (successRate >= 75) {
        log(`⚠️  Most endpoints are healthy, but some issues detected`, 'yellow');
    } else {
        log(`🚨 Multiple endpoints are failing!`, 'red');
    }
    
    // Recommendations
    log('\n💡 Recommendations:', 'bright');
    if (successRate < 100) {
        log('   • Check if the API server is running', 'yellow');
        log('   • Verify network connectivity', 'yellow');
        log('   • Check API server logs for errors', 'yellow');
    } else {
        log('   • API is healthy and ready for deployment', 'green');
        log('   • Consider monitoring response times', 'cyan');
    }
    
    return successRate === 100;
}

// Run the health check
if (require.main === module) {
    runHealthCheck()
        .then((isHealthy) => {
            process.exit(isHealthy ? 0 : 1);
        })
        .catch((error) => {
            log(`💥 Health check failed: ${error.message}`, 'red');
            process.exit(1);
        });
}

module.exports = { runHealthCheck, checkEndpoint }; 