import { generateId } from '../utils/generateId'

const USERS_KEY   = 'reorderly_users'
const SESSION_KEY = 'reorderly_session'

function readUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
  } catch {
    return []
  }
}

function writeUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export async function createUser({ firstName, lastName, email, username, passwordHash }) {
  const users = readUsers()
  if (users.find(u => u.username.toLowerCase() === username.toLowerCase())) {
    throw new Error('Username already taken')
  }
  if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
    throw new Error('Email already registered')
  }
  const user = {
    userId: generateId(),
    firstName,
    lastName,
    email,
    username,
    passwordHash,
    mailingAddress: null,
    billingAddress: null,
    createdAt: new Date().toISOString(),
  }
  writeUsers([...users, user])
  return user
}

export function getUserByUsername(username) {
  return readUsers().find(u => u.username.toLowerCase() === username.toLowerCase()) || null
}

export function getUserByEmail(email) {
  return readUsers().find(u => u.email.toLowerCase() === email.toLowerCase()) || null
}

export function getUserById(userId) {
  return readUsers().find(u => u.userId === userId) || null
}

export function updateUser(userId, updates) {
  const users = readUsers()
  const idx = users.findIndex(u => u.userId === userId)
  if (idx === -1) throw new Error('User not found')
  users[idx] = { ...users[idx], ...updates }
  writeUsers(users)
  return users[idx]
}

export function saveSession(userId) {
  localStorage.setItem(SESSION_KEY, userId)
}

export function getSession() {
  return localStorage.getItem(SESSION_KEY) || null
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY)
}
