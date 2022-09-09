const App = new Vue({
    el: "#app",
    data() {
        return {
            user: 'VueJS',
            text: null,
            messages: [],
            ws: null
        }
    },
    created() {
        this.connect();
    },
    methods: {
        connect(onOpen) {
            this.ws = new WebSocket('ws://localhost:9000');

            this.ws.onopen = () => {
                this.addSuccessNotification('Connected');

                if (onOpen) {
                    onOpen();
                }
            }

            this.ws.onerror = () => {
                this.addErrorNotification('Could not connect to the server');
            }

            this.ws.onmessage = (message) => {
                this.addMessage(JSON.parse(message.data));
            }
        },
        addMessage(data) {
            this.messages.push(data);
            this.scrollDown();
        },
        addSuccessNotification(text) {
            this.addMessage({color: 'green', text: text});
        },
        addErrorNotification(text) {
            this.addMessage({color: 'red', text: text});
        },
        sendMessage() {
            if (this.text.trim() === '' || !this.user) {
                return;
            }

            if (this.ws.readyState !== this.ws.OPEN) {
                this.addErrorNotification('Try again later');

                this.connect(() => {
                    this.sendMessage();
                });

                return;
            }

            this.ws.send(
                JSON.stringify({
                    user: this.user,
                    text: this.text,
                })
            );

            this.text = null;
        },
        scrollDown() {
            const container = this.$el.querySelector('#messages');
            container.scrollTop = container.scrollHeight;
        }
    }
})