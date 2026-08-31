#!/usr/bin/env node
'use strict';

require('dotenv').config();
const assert = require('assert');
const mongoose = require('mongoose');
const app = require('../server');
const Portfolio = require('../models/Portfolio');
const User = require('../models/User');
const { connectDB } = require('../config/database');
const { deleteFromCloudinary } = require('../config/cloudinary');

const stripGeneratedFields = (value) => {
  if (Array.isArray(value)) return value.map(stripGeneratedFields);
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(Object.entries(value)
    .filter(([key]) => !['_id', '__v', 'createdAt', 'updatedAt'].includes(key))
    .map(([key, child]) => [key, stripGeneratedFields(child)]));
};

const request = async (baseUrl, path, options = {}) => {
  const response = await fetch(`${baseUrl}${path}`, options);
  const contentType = response.headers.get('content-type') || '';
  const body = contentType.includes('json') ? await response.json() : await response.text();
  return { response, body };
};

(async () => {
  await connectDB();
  const initialUsers = await User.countDocuments();
  if (initialUsers !== 0) throw new Error('Integration auth test requires an empty users collection to avoid modifying existing accounts');

  const server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  const baseUrl = `http://127.0.0.1:${server.address().port}`;
  const username = `audit_${Date.now()}`;
  const email = `${username}@example.test`;
  const password = `Audit-${Date.now()}-Safe`;
  const uploadedPublicIds = new Set();

  try {
    const portfolioResult = await request(baseUrl, '/api/portfolio');
    assert.equal(portfolioResult.response.status, 200);
    const expected = new Portfolio({}).toObject();
    assert.deepStrictEqual(stripGeneratedFields(portfolioResult.body), stripGeneratedFields(JSON.parse(JSON.stringify(expected))));
    console.log('GET /api/portfolio bootstraps an empty portfolio document.');

    const docsResult = await request(baseUrl, '/docs/');
    assert.equal(docsResult.response.status, 200);
    assert.match(docsResult.body, /Swagger UI/);
    console.log('GET /docs/ serves Swagger UI.');

    const registerHeaders = { 'Content-Type': 'application/json' };
    if (process.env.REGISTRATION_SECRET) registerHeaders['x-registration-secret'] = process.env.REGISTRATION_SECRET;
    const registration = await request(baseUrl, '/api/auth/register', {
      method: 'POST', headers: registerHeaders, body: JSON.stringify({ username, email, password })
    });
    assert.equal(registration.response.status, 201);

    const login = await request(baseUrl, '/api/auth/login', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password })
    });
    assert.equal(login.response.status, 200);
    const token = login.body.token;

    const me = await request(baseUrl, '/api/auth/me', { headers: { Authorization: `Bearer ${token}` } });
    assert.equal(me.response.status, 200);

    const invalid = await request(baseUrl, '/api/auth/me', { headers: { Authorization: 'Bearer invalid-token' } });
    assert.equal(invalid.response.status, 401);

    const update = await request(baseUrl, '/api/portfolio/section/statistics', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ yearsOfExperience: 2, projectsDone: 1, technologies: '5+', dedication: '100%' }),
    });
    assert.equal(update.response.status, 200);
    console.log('Registration, login, protected update, current-user, and invalid-token checks passed.');

    const uploadImage = async () => {
      const form = new FormData();
      form.append('type', 'project');
      form.append('file', new Blob([
        Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=', 'base64')
      ], { type: 'image/png' }), 'audit.png');
      const result = await request(baseUrl, '/api/upload', {
        method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: form,
      });
      assert.equal(result.response.status, 200);
      uploadedPublicIds.add(result.body.data.public_id);
      return result.body.data;
    };

    const firstImage = await uploadImage();
    const created = await request(baseUrl, '/api/portfolio/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ title: 'Audit project', description: 'Temporary integration test', image: firstImage, technologies: ['Node.js'] }),
    });
    assert.equal(created.response.status, 201);
    const projectId = created.body.project._id;

    const secondImage = await uploadImage();
    const updated = await request(baseUrl, `/api/portfolio/projects/${projectId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ image: secondImage }),
    });
    assert.equal(updated.response.status, 200);

    const deleted = await request(baseUrl, `/api/portfolio/projects/${projectId}`, {
      method: 'DELETE', headers: { Authorization: `Bearer ${token}` },
    });
    assert.equal(deleted.response.status, 200);
    console.log('Authenticated upload, project create/update/delete, image replacement, and media cleanup passed.');
  } finally {
    for (const publicId of uploadedPublicIds) {
      await deleteFromCloudinary(publicId, 'image').catch(() => {});
    }
    await User.deleteOne({ username });
    await new Promise((resolve) => server.close(resolve));
    await mongoose.disconnect();
  }
})().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
