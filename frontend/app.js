const App = new Vue({
    el: "#app",
    data() {
        return {
            user: 'VueJS',
            text: '',
            messages: [],
            ws: null,
            connectionStatus: null
        }
    },
    created() {
        this.connect();
    },
    methods: {
        connect(onOpen) {
            this.ws = new WebSocket('ws://localhost:9000');

            this.ws.onopen = () => {
                this.connectionStatus = 'Connected';

                if (onOpen) {
                    onOpen();
                }
            }

            this.ws.onerror = () => {
                this.connectionStatus = 'Could not connect to the server';
                return;
            }

            console.log(this.ws)

            this.ws.onmessage = (message) => {
                this.addMessage(JSON.parse(message.data));
            }
        },
        addMessage(data) {
            this.messages.push(data);
            this.scrollDown();
        },
        sendMessage() {
            if (this.text.trim() === '' || !this.user) {
                return;
            }

            if (this.ws.readyState !== this.ws.OPEN) {
                this.connectionStatus = 'Try again later';
                return;
            }

            this.ws.send(
                JSON.stringify({
                    user: this.user,
                    text: this.text,
                })
            );

            this.text = '';
        },
        scrollDown() {
            const container = this.$el.querySelector('#conversation');
            container.scrollTop = container.scrollHeight;
        }
    }
})