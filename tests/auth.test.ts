import { test, expect, describe, beforeAll } from '@jest/globals'
import request from 'supertest'
import randomstring from 'randomstring'

require('dotenv').config({ path: `.env.local`, override: true })
const endpoint = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'

describe('POST api/auth/signup', () => {
  const createdUserEmail = randomstring.generate(32) + '@random.org'
  let csrfToken = ''

  beforeAll(async () => {
    const res = await request(endpoint)
      .get('/api/auth/csrf')
      .expect(200)
      .expect('Content-Type', /json/)
    expect(res.body.csrfToken).toBeDefined()
    csrfToken = res.body.csrfToken
  })

  test('should create a new user', async () => {
    const res = await request(endpoint)
      .post('/api/auth/signup')
      .send({
        name: 'eetu',
        email: createdUserEmail,
        password: 'password',
        csrfToken: csrfToken,
      })
      .set('Accept', 'application/json')
      .expect(201)
    expect(res.body.success).toBe(true)
  })

  test('login with created user', async () => {
    const res = await request(endpoint)
      .post('/api/auth/signin')
      .send({
        email: createdUserEmail,
        password: 'password',
      })
      .set('Accept', 'application/json')
      .expect(302)
  })

  test('logout with created user', async () => {
    const res = await request(endpoint)
      .get('/api/auth/signout')
      .set('Accept', 'application/json')
      .expect(200)
  })
})
