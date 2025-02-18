import { defineStore } from 'pinia'
import * as sdk from 'matrix-js-sdk'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isLogged: false,
    client: null,
    rooms: [],
    errorMessage: '',
    isLoading: false,
  }),

  actions: {
    async loadRooms() {
      this.isLoading = true
      const client = this.getMatrixClient()

      if (!client) {
        this.errorMessage = 'Ошибка: нет активной сессии Matrix.'
        this.isLoading = false
        return
      }

      try {
        client.once('sync', (state) => {
          if (state === 'PREPARED') {
            this.rooms = client.getRooms().map((room) => {
              const lastEvent = room.timeline.length ? room.timeline[room.timeline.length - 1].event : null
              return {
                id: room.roomId,
                name: room.name || 'Без названия',
                lastEvent: lastEvent?.content?.body || 'Нет сообщений',
                lastEventTs: lastEvent?.origin_server_ts || 0,
                lastEventDate: lastEvent ? this._formatDate(lastEvent.origin_server_ts) : 'Нет данных',
                unreadCount: room.getUnreadNotificationCount(),
              }
            })
          }
        })

        await client.startClient()
        this.isLoading = false
      } catch (error) {
        this.isLoading = false
        this.errorMessage = 'Ошибка загрузки комнат: ' + error.message
        console.error(error)
      }
    },

    _formatDate(timestamp) {
      if (!timestamp) return 'Нет данных'
      const date = new Date(timestamp)
      return date.toLocaleString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    },

    getMatrixClient() {
      if (!this.client) {
        const accessToken = localStorage.getItem('matrix_access_token')
        const userId = localStorage.getItem('matrix_user_id')
        const homeServer = localStorage.getItem('matrix_home_server')

        if (!accessToken || !userId || !homeServer) return null

        this.client = sdk.createClient({
          baseUrl: homeServer,
          accessToken,
          userId,
        })
      }

      return this.client
    },

    isLoggedIn() {
      this.client = this.getMatrixClient()

      if (this.client) {
        this.isLogged = true
        return true
      }

      this.logout()
      return false
    },

    async login(homeServer, username, password) {
      try {
        this.client = sdk.createClient({ baseUrl: homeServer })

        const response = await this.client.login('m.login.password', {
          identifier: { type: 'm.id.user', user: username },
          password,
          initial_device_display_name: 'Vue.js App',
        })

        await this.loadRooms()

        localStorage.setItem('matrix_access_token', response.access_token)
        localStorage.setItem('matrix_user_id', response.user_id)
        localStorage.setItem('matrix_home_server', homeServer)

        this.isLogged = true
      } catch (error) {
        throw new Error('Ошибка входа: ' + error.message)
      }
    },

    logout() {
      if (this.client) {
        this.client.stopClient()
        this.client = null
      }

      this.isLogged = false

      localStorage.removeItem('matrix_access_token')
      localStorage.removeItem('matrix_user_id')
      localStorage.removeItem('matrix_home_server')
    },
  },
})