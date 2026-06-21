import { generateId } from '../utils/generateId'
import { addDays, frequencyToDays } from '../utils/formatDate'

const ORDERS_KEY    = 'reorderly_orders'
const DRAFT_PREFIX  = 'reorderly_draft_'

function readOrders() {
  try {
    return JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]')
  } catch {
    return []
  }
}

function writeOrders(orders) {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders))
}

function computeExpectedDelivery(dateOrdered, orderType, deliveryFrequency, customDays) {
  if (!dateOrdered || orderType === 'one-time') return null
  const days = frequencyToDays(deliveryFrequency, customDays)
  return days ? addDays(dateOrdered, days) : null
}

export function createOrder(orderData) {
  const orders = readOrders()
  const now = new Date().toISOString()
  const order = {
    orderId: generateId(),
    userId: orderData.userId,
    orderNickname: orderData.orderNickname ||
      `${orderData.productName} from ${orderData.storeName}`,
    productType:          orderData.productType        || '',
    productName:          orderData.productName        || '',
    productQuantity:      orderData.productQuantity    || 1,
    storeName:            orderData.storeName          || '',
    storeAddress:         orderData.storeAddress       || '',
    itemDescription:      orderData.itemDescription    || '',
    orderType:            orderData.orderType          || 'one-time',
    deliveryFrequency:    orderData.deliveryFrequency  || null,
    customFrequencyDays:  orderData.customFrequencyDays || null,
    numberOfDeliveries:   orderData.orderType === 'one-time' ? 1 : (orderData.numberOfDeliveries || 1),
    status:               orderData.status || 'active',
    dateCreated:          now,
    dateOrdered:          orderData.status === 'draft' ? null : now,
    expectedDeliveryDate: orderData.status === 'draft' ? null : computeExpectedDelivery(
      now,
      orderData.orderType,
      orderData.deliveryFrequency,
      orderData.customFrequencyDays
    ),
    lastDeliveryDate:     null,
    deliveriesCompleted:  0,
  }
  writeOrders([order, ...orders])
  return order
}

export function getOrdersByUser(userId) {
  return readOrders()
    .filter(o => o.userId === userId)
    .sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated))
}

export function getOrderById(orderId) {
  return readOrders().find(o => o.orderId === orderId) || null
}

export function updateOrder(orderId, updates) {
  const orders = readOrders()
  const idx = orders.findIndex(o => o.orderId === orderId)
  if (idx === -1) throw new Error('Order not found')
  orders[idx] = { ...orders[idx], ...updates }
  writeOrders(orders)
  return orders[idx]
}

export function deleteOrder(orderId) {
  writeOrders(readOrders().filter(o => o.orderId !== orderId))
}

export function saveDraft(userId, draftData) {
  const key = `${DRAFT_PREFIX}${userId}`
  const existing = getDraft(userId)
  const draft = {
    ...existing,
    ...draftData,
    userId,
    status: 'draft',
    dateCreated: existing?.dateCreated || new Date().toISOString(),
    _draftId: existing?._draftId || generateId(),
  }
  localStorage.setItem(key, JSON.stringify(draft))
  return draft
}

export function getDraft(userId) {
  try {
    const raw = localStorage.getItem(`${DRAFT_PREFIX}${userId}`)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function clearDraft(userId) {
  localStorage.removeItem(`${DRAFT_PREFIX}${userId}`)
}
