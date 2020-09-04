const App = new Vue({
    el: "#app",
    data() {
        return {
            user: 'Unknown',
            text: null,
            messages: [],
            ws: null,
        }
    },
    created() {
        this.connect()
    },
    methods: {
        connect(onOpen) {
            this.ws = new WebSocket('ws://localhost:9000');

            this.ws.onopen = function() {
                App.addSuccessNotification('Connected')

                if (onOpen) 
                    onOpen()
            }

            this.ws.onerror = function() {
                App.addErrorNotification('Could not connect to the server')
            }

            this.ws.onmessage = function(e) {
                App.addMessage(JSON.parse(e.data))
            }
        },
        addMessage(data) {
            this.messages.push(data)
            App.scrollDown()
        },
        addSuccessNotification(text) {
            App.addMessage({color: 'green', text: text})
        },
        addErrorNotification(text) {
            App.addMessage({color: 'red', text: text})
        },
        sendMessage() {

            if (!this.text || !this.user)
                return
            
            if (this.ws.readyState !== this.ws.OPEN) {
                App.addErrorNotification('Try again later');

                App.connect(() => {
                    this.sendMessage()
                })

                return
            }

            this.ws.send(JSON.stringify({
                user: this.user,
                text: this.text,
            }))

            this.text = null
        },
        scrollDown() {
            const container = this.$el.querySelector('#messages')
            container.scrollTop = container.scrollHeight
        },
    }
})